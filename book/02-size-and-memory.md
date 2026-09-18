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
and the reason every hardware recommendation later in this book starts with the same
question: how fast can this machine move bytes?

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

A 4B model is 8 GB. A 70B model is 140 GB. A 763B model is 1.5 TB.

Those numbers are why nobody runs models at full precision on their own hardware.

## Quantization

**Quantization** stores the same parameters using fewer bits. It is lossy compression,
in the same sense that an MP3 is a lossy version of a WAV: you accept a small
degradation you will usually not notice, in exchange for a much smaller file.

Instead of two bytes per parameter, you use roughly half a byte.

By the formula above this buys two things at once. The model *fits*, and it runs about
four times faster.

### What each format costs

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

Every term comes from the model's configuration file. For a typical 8B model this gives
$2 \times 32 \times 8 \times 128 \times 1 = 65{,}536$ bytes — 64 KB for every token in
the conversation.

You rarely need to compute it. For typical models, storing the cache at 8-bit:

| Model size | Cache per 1,000 tokens | 256K context | 1M context |
| --- | --- | --- | --- |
| 8B | ~64 MB | 17 GB | 64 GB |
| 32B | ~128 MB | 34 GB | 128 GB |
| 70B | ~160 MB | 42 GB | 164 GB |
| 120B | ~220 MB | 58 GB | 220 GB |

Read the last column carefully. A 70B model's weights come to about 39 GB at Q4, so a
**one-million-token context costs four times more memory than the model itself.**

### Why that table is an upper bound

It assumes every layer keeps a full set of keys and values for every token. That was
universally true until recently and still describes most models you will download. The
rest attack the cost directly, and the methods are worth recognising by name:

| Method | What it does |
| --- | --- |
| **Grouped-query attention** | Several heads share one set of notes. Near-universal now, and already assumed in the table above. |
| **Sliding-window attention** | Only recent tokens stay at full resolution; older ones are summarised or dropped. |
| **Latent or compressed attention** | Stores a smaller projection of the keys and values instead of the full pair. |
| **Linear or hybrid attention** | Replaces most of the growing cache with a fixed-size running state, closer to an RNN than to classical attention. |
| **Cache quantization** | Stores the cache itself at 8, 4 or fewer bits. |

Real models combine several of these. The saving runs from roughly **four times** at the
conservative end to around **a hundred times** for the most aggressive designs.

::: warning Do not assume either extreme
That range is far too wide to guess at. A model designed for long context makes a
million-token window nearly free; a conventional one makes it cost more than the weights.
Both are on offer today, and the difference decides what you have to buy.

The table above is the safe upper bound. The model card is the real answer.
:::

### What to do about it

- **Store the cache at 8-bit.** It halves the cost against the 16-bit default, with no
  quality loss you will notice. One setting in most runtimes.
- **Ask for the context you actually use.** Reserving a large window "just in case"
  spends memory every second the model is loaded.
- **Check the model's real limit.** An advertised window is an upper bound, not a
  promise of quality; many models degrade well before it.
- **If you need long context, choose the architecture for it.** This saves more than
  everything else on this list combined.

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
