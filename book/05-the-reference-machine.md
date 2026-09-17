# 5. The reference machine

The rest of this book needs something concrete to reason about. Rather than speak in
generalities, we assume a specific machine — an ordinary engineering laptop of the
kind many people already own.

## The specification

| Component | Assumed | Relevant figure |
| --- | --- | --- |
| CPU | 8-core / 16-thread mobile x86 | Largely irrelevant to inference |
| System RAM | 32 GB DDR4-3200 | ~50 GB/s bandwidth |
| GPU | NVIDIA RTX A2000 Mobile (Ampere) | **4 GB GDDR6, ~190 GB/s, compute capability 8.6** |
| Storage | NVMe SSD | Affects load time only, not speed ([Chapter 11](/book/11-reference-architectures#how-long-it-takes-to-start)) |
| OS | Ubuntu 24.04 LTS | |

This is deliberately unremarkable: a mid-range mobile workstation GPU, a normal amount
of RAM, a mainstream Linux distribution. If your machine differs, the reasoning is
unchanged — substitute your own figures into the same arithmetic.

::: info Adapting this to your machine
The only two numbers that matter are **VRAM capacity** and **VRAM bandwidth**. Find the
first with `nvidia-smi --query-gpu=name,memory.total --format=csv`. The second is not
reported by any tool — look it up on the card's specification page, and check it, because
the same card name often covers variants with different memory and clocks. The ~190 GB/s
used below is a typical figure for this class of card, not a measured one.

Everything in this chapter follows from those two values.
:::

## What fits

From [Chapter 2](/book/02-size-and-memory): Q4_K_M costs roughly 0.55 GB per billion
parameters, plus KV cache, plus overhead.

Start from 4 GB and subtract what you do not get to use:

| | |
| --- | --- |
| Card total | 4.0 GB |
| Driver and desktop | −0.4 GB |
| Runtime overhead | −0.3 GB |
| KV cache, 8K context at 8-bit | −0.3 GB |
| **Left for weights** | **~3.0 GB** |

At 0.55 GB per billion, that is about 5.5B parameters. But models do not come in
arbitrary sizes — the choices near that line are **4B** or **7–8B**, and 8B needs about
4.4 GB of weights alone. So the ceiling in practice is **a 4B model with an 8,000-token
context**, with room to spare.

This rounding-down is the normal experience. You almost never use all of a card; you use
the largest model that fits under it.

## How fast

From the same chapter: tokens per second ≈ bandwidth ÷ model size.

$$\frac{190\ \text{GB/s}}{2.4\ \text{GB}} \approx 79\ \text{tokens/s}$$

At the realistic 50–70% of theory, expect **40–60 tokens per second** — comfortably
faster than anyone reads.

## What the system RAM buys

The 32 GB of system RAM cannot make the GPU bigger. What it can do is hold a model the
GPU cannot, and run it on the CPU at roughly 50 GB/s — about a quarter of the card's
speed, with much weaker compute.

For a dense model this is close to useless. For a **sparse model**
([Chapter 3](/book/03-dense-and-sparse)) it is genuinely worthwhile: a 30B-A3B model
occupies around 17 GB of RAM but only touches a few gigabytes per token.

The result is single-digit tokens per second. Slow — roughly reading speed — but a
30B-class model is a categorically different tool from a 4B one. It chains tool calls,
sustains a plan across steps, and recovers from its own errors.

## The summary

| Capability | On this machine |
| --- | --- |
| 4B models, fully in VRAM | 40–60 tok/s. Comfortable all-day use. |
| 20–30B sparse models, from system RAM | 3–10 tok/s. Slow but genuinely capable. |
| Dense models above ~7B | Not practical. |
| Anything above ~35B total | Will not load. |

## What the CPU does not do

The 16 threads barely participate. Inference on a GPU uses the CPU only to schedule
work and move data; inference on the CPU is limited by memory bandwidth long before it
is limited by cores.

This is the most common and most expensive misconception when people first specify
hardware for AI. A machine with many cores, a lot of system RAM and a weak GPU is not
an inference machine, regardless of what it cost. [Chapter 11](/book/11-reference-architectures)
returns to this with numbers.

## Honest expectations

This machine is enough to learn every concept in this book, run a real agent, and form
your own judgement about what these models can do. It is a development and learning
machine.

It is not enough to replace a hosted frontier model for demanding work, and the book
does not pretend otherwise. [Chapter 8](/book/08-the-model-landscape) sets out exactly
where the line falls and what hardware moves it.

The next chapter gets something running.
