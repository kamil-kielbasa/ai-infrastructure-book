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

::: warning One exception, coming in Chapter 3
The denominator is the part of the model actually read for each token. For ordinary
models that is the whole thing, and the formula works as written. A second kind of model
reads only a fraction of itself per token, and the arithmetic changes completely.
[Chapter 3](/book/03-dense-and-sparse) deals with it.
:::

Hold on to this. It is the reason the next chapter is about memory rather than compute,
and the reason [Chapter 11](/book/11-reference-architectures) recommends the hardware it
does.

## How fast is fast enough?

"Tokens per second" means nothing until you have something to compare it against. Here
are the anchors.

A person reads at roughly 250 words a minute. In English that is about **5 tokens per
second**. Speech is slower still, around 3. So a model producing 5 tokens per second is
filling the screen exactly as fast as you can take it in.

| Tokens/second | How it feels |
| --- | --- |
| Under 3 | Painful. Slower than someone talking. |
| 5 | Keeps pace with reading. Fine for chat, tiring for anything else. |
| 10–20 | Comfortable. Text arrives faster than you consume it. |
| 30–60 | Roughly how a hosted assistant tends to feel, though providers publish no figures. |
| 100+ | Beyond perception for reading. Only matters for the case below. |

Above about 20 tokens per second, a human cannot tell the difference. So why chase more?

**Because agents do not read.** When a model uses tools
([Chapter 6](/book/06-the-first-run)), it generates text no one ever looks at: plans,
tool calls, summaries of what came back. A task involving twenty tool calls might
produce 10,000 tokens in total.

| Speed | Time for a 20-step agent task |
| --- | --- |
| 5 tokens/s | ~33 minutes |
| 20 tokens/s | ~8 minutes |
| 60 tokens/s | ~3 minutes |

The same hardware that feels perfectly adequate for conversation can make agentic work
unusable. When you judge a setup, decide first which of the two you are buying.

### The other number: waiting for the first word

Speed has a second half. **Time to first token** is the pause between pressing Enter and
the first word appearing, and it depends on prompt length rather than answer length.

A short question gives a near-instant start. Paste in a long document and the delay can
stretch to seconds or minutes, because the model must read all of it before writing
anything. [Chapter 4](/book/04-the-gpu) explains why this half of the problem depends on
entirely different hardware.

## From parameters to gigabytes

Training produces parameters as 16-bit floating-point numbers — **FP16** — two bytes
each. So a model's natural size is:

$$\text{size} = \text{parameters} \times 2 \text{ bytes}$$

A 4B model is 8 GB. A 70B model is 140 GB. A 671B model is 1.3 TB.

Those numbers are why nobody runs models at full precision on their own hardware.

## Quantization

**Quantization** stores the same parameters using fewer bits. It is lossy compression,
in the same sense that an MP3 is a lossy version of a WAV: you accept a small
degradation you will usually not notice, in exchange for a much smaller file.

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

## What context costs

Alongside the weights sits the **KV cache** — the model's working notes on the
conversation so far. It saves the model from re-reading everything it has already seen.

The cache is not a detail. It grows in a straight line with context length, and on long
contexts it can dwarf the weights themselves. This is the cost that almost every
discussion of local models leaves out, and it is the reason a setup that works on Monday
fails on Friday when someone pastes in a bigger document.

### The numbers

Cost per token depends on the model's internal shape:

$$\text{bytes per token} = 2 \times \text{layers} \times \text{KV heads} \times \text{head size} \times \text{bytes per value}$$

Every term is a number from the model's configuration file:

| Term | What it is | Typical value |
| --- | --- | --- |
| **2** | There are two things to store per position, a *key* and a *value* — hence "KV cache" | always 2 |
| **layers** | A model is a stack of identical blocks. Each keeps its own notes. | 32 for an 8B model, 80 for a 70B one |
| **KV heads** | Inside each layer, attention is split into parallel "heads". Modern models let several heads share one set of notes, which is why this number is small. | 8 is common |
| **head size** | How many numbers each head stores per position | 128 is common |
| **bytes per value** | The precision the cache is stored at — the same choice as quantization, applied to the notes rather than the weights | 1 at 8-bit, 2 at 16-bit |

So for a typical 8B model: $2 \times 32 \times 8 \times 128 \times 1 = 65{,}536$ bytes, or
64 KB for every token in the conversation.

You rarely need to compute this. These are the figures for typical modern models, storing
the cache at 8-bit:

| Model size | Cache per 1,000 tokens | 256K context | 1M context |
| --- | --- | --- | --- |
| 8B | ~64 MB | 17 GB | 64 GB |
| 32B | ~128 MB | 34 GB | 128 GB |
| 70B | ~160 MB | 42 GB | 164 GB |
| 120B | ~220 MB | 58 GB | 220 GB |

Approximate, and — as the next section explains — increasingly pessimistic.
Architectures differ, and a model card gives you the exact shape.

Read the last column carefully. A 70B model's weights come to about 39 GB at Q4. On this
arithmetic, giving it a **one-million-token context costs four times more memory than
the model itself.**

### That arithmetic is the classical case

Every figure in the table assumes each layer keeps a full set of keys and values for
every token. This was universally true until recently, and it remains true of most
models you will download today.

The newest models do something different, and the difference is not incremental.
DeepSeek-V4.1-Flash stores its global KV cache in **890 bytes per token**.

Set that against the table above, where a 70B model spends roughly 160,000 bytes per
token, and run both out to a million-token context:

| Model | Cache per token | Cache at 1M tokens |
| --- | --- | --- |
| Classical 70B | ~160 KB | **164 GB** |
| DeepSeek-V4.1-Flash | 890 B | **0.89 GB** |

A million tokens of context, in under a gigabyte. DeepSeek reports this as about a
four-fold improvement on its own previous generation, and a **437-fold** improvement on
DeepSeek-V1.

Several techniques stacked together get you there. The names are worth recognising even
if the details are not: a **causal encoder-decoder** split, where the decoder projects
one global cache from the encoder's final state instead of every layer keeping its own;
**compressed sparse attention**, where layers share indices rather than each computing
its own; and storing the cache itself at **FP4**.

::: warning This is the fastest-moving number in the book
An order of magnitude is not a tuning detail — it decides which machine you buy. A
purchase justified by "we need a million tokens of context" may not survive contact with
a model released next quarter.

Treat the table above as an **upper bound**, then read the model card.

- Ordinary attention — the table is accurate.
- Compressed, latent, or sparse attention — the real figure can be a hundred times
  lower.
:::

### Spilling the cache to RAM and disk

There is a second escape route, and it is production software rather than a research
curiosity. A runtime can hold the KV cache in tiers: GPU memory first, then CPU RAM,
then a local SSD, then shared storage across the network. **LMCache** does exactly this,
and vLLM ships connectors for it.

It is genuinely useful and very commonly misunderstood, so be precise about what it buys:

| | |
| --- | --- |
| **What it does** | Keeps caches from *earlier* requests, so a repeated prefix is never processed twice. A long system prompt, a codebase, a document the whole team asks about — processed once, reused many times. |
| **What it improves** | Time to first token, dramatically, whenever a prefix repeats. |
| **What it does not do** | Extend the context of the conversation you are having right now. The active request's cache still has to sit in GPU memory. |

The reason is the same arithmetic as everywhere else in this chapter. An SSD delivers a
few gigabytes per second; GPU memory delivers hundreds. Nothing the model consults on
*every* token can live on a disk. Offloading works precisely because the data it moves is
cold — needed once at the start of a request, not continuously throughout it.

So it is a strong answer to "fifty people share one long system prompt", and no answer
at all to "I want a million-token conversation on a small card".

::: warning Long context is still a hardware purchase
Hosted services advertise windows of 200K or a million tokens. Those numbers are real,
and someone is paying for the memory that holds them — multiplied by every user served
at the same time ([Chapter 10](/book/10-from-one-user-to-many)).

Compression and offloading have moved that price a long way down. Neither has made it
zero.
:::

### What to do about it

- **Store the cache at 8-bit.** It halves the cost against the 16-bit default, with no
  quality loss you will notice. Most runtimes support this with one setting.
- **Ask for the context you actually use.** Most work fits in 8K–32K. Reserving 128K
  "just in case" spends memory every second the model is loaded.
- **Check the model's real limit.** A model advertised with a 128K window is often
  trained well for far less, and quality degrades in the upper range.
- **If you need long context, choose the architecture for it.** Picking a model with
  compressed attention saves more memory than every other item on this list combined.
- **Turn on prefix caching when prompts repeat.** It costs nothing and removes the
  dominant share of the waiting in most team deployments.

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

Note the gap between 3.9 and 4.7. Sizing a machine from the weights alone understates the
requirement by around a fifth, and that margin is what turns a model that looked like it
would fit into one that does not load.

## What this means going forward

- Model size in GB ≈ parameters × bytes per parameter, and Q4_K_M means ~0.55 GB per
  billion.
- Generation speed ≈ memory bandwidth ÷ model size. Above 20 tokens per second a reader
  cannot tell the difference; an agent can.
- Context is a second memory cost that grows with use, and on long contexts it can
  exceed the weights.

The next chapter asks where those bytes should live.
