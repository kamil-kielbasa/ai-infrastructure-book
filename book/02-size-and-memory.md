# 2. Size, precision and memory

## Every parameter, every token

One fact explains almost all practical advice about running models locally:

::: tip The central constraint
To produce **one** token, a model must read **every one of its parameters** from
memory.
:::

Not operate on them cleverly — *read* them. All of them. Once per token.

Generating text is therefore mostly an exercise in moving bytes. The arithmetic
performed on those bytes is cheap by comparison. This makes generation
**memory-bandwidth bound**, and it yields a formula that predicts real performance
surprisingly well:

$$\text{tokens per second} \approx \frac{\text{memory bandwidth in GB/s}}{\text{model size in GB}}$$

That is a ceiling. In practice expect 50–70% of it. But the formula immediately tells
you two things:

- **A smaller model is a faster model**, in direct proportion.
- **The speed of your memory matters more than the speed of your processor.**

Hold on to this. It is the reason the next chapter is about memory rather than compute,
and the reason [Chapter 11](/book/11-reference-architectures) recommends the hardware it
does.

## From parameters to gigabytes

Training produces parameters as 16-bit floating-point numbers — **FP16** — two bytes
each. So a model's natural size is:

$$\text{size} = \text{parameters} \times 2 \text{ bytes}$$

A 4B model is 8 GB. A 70B model is 140 GB. A 671B model is 1.3 TB.

Those numbers are why nobody runs models at full precision on their own hardware.

## Quantization

**Quantization** stores the same parameters using fewer bits. It is lossy compression,
in the same sense that an MP3 is a lossy version of a WAV: you accept a small
degradation, mostly imperceptible, in exchange for a much smaller file.

Instead of two bytes per parameter, you use roughly half a byte.

By the formula above this buys two things at once. The model *fits*, and it runs about
four times faster.

### Reading the names

Quantization formats look cryptic. They are mechanical:

```
Q4_K_M
│ │ │
│ │ └── M = Medium variant (S = Small, L = Large): how much precision
│ │         is spent on the layers that matter most
│ └──── K = "K-quant", a scheme that varies precision across the model
│           rather than treating every layer identically
└────── 4 = approximately 4 bits per parameter
```

Older formats use `_0` or `_1` in place of `_K_x` — `Q4_0`, `Q8_0`. Those are earlier,
simpler schemes. Prefer `_K_` where both exist.

| Format | Bits per parameter | GB per 1B parameters | When to use it |
| --- | --- | --- | --- |
| FP16 / BF16 | 16 | 2.0 | Training; accuracy-critical evaluation |
| Q8_0 | 8 | 1.0 | Memory to spare, want maximum fidelity |
| **Q4_K_M** | ~4.5 | **~0.55** | **The default. The knee of the curve.** |
| Q3_K_M | ~3.5 | ~0.45 | Squeezing. Quality degradation becomes visible. |
| Q2_K | ~2.5 | ~0.35 | Last resort. Frequently incoherent. |

### The rule that matters

Quality degrades gently from 16 bits down to about 4, then falls off a cliff.

::: warning
A smaller model at Q4 beats a larger model crushed to Q2. Almost always.
:::

If a model does not fit at Q4, the answer is a different model, not a more aggressive
quantization. Practically everyone runs Q4_K_M practically all the time, and most
tooling defaults to it.

## Context costs memory too

Alongside the weights sits the **KV cache** — the model's working notes on the
conversation so far. Think of it as scratch space that saves the model from
recomputing everything it has already read.

It grows linearly with context length, and it can become large. On a small model with
a long context, the cache can rival the weights in size.

Two practical consequences:

- **The same compression trick applies.** Storing the cache at 8-bit instead of 16-bit
  roughly halves it, with no quality cost you will notice.
- **Raising the context length can break a working setup.** A model that loaded
  perfectly at 4,000 tokens may fail at 32,000. The weights did not change; the cache
  did.

## The memory budget

Putting it together, the memory a running model needs is:

$$\text{total} = \underbrace{\text{parameters} \times \text{bytes per parameter}}_{\text{fixed}} + \underbrace{\text{KV cache}}_{\text{grows with context}} + \underbrace{\text{overhead}}_{\text{small}}$$

A worked example. A 7B model at Q4_K_M with an 8,000-token context:

| Component | Size |
| --- | --- |
| Weights (7 × 0.55) | ~3.9 GB |
| KV cache at 8-bit, 8K context | ~0.5 GB |
| Runtime overhead | ~0.3 GB |
| **Total** | **~4.7 GB** |

Which is why a 7B model does not fit on a card with 4 GB, even though 7 × 0.55 = 3.9
suggests it should. The margin matters.

## What this means going forward

- Model size in GB ≈ parameters × bytes per parameter, and Q4_K_M means ~0.55 GB per
  billion.
- Generation speed ≈ memory bandwidth ÷ model size.
- Context is a second, variable memory cost, and it is the usual reason a
  previously-working setup stops fitting.

The next chapter asks where those bytes should live.
