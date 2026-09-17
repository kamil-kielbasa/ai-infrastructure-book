# 14. Hardware beyond this book

This book has been deliberately narrow: NVIDIA cards, one or two servers, text models.
That covers most situations, but it is not the whole field. This chapter sketches what
lies outside it, so you know what you are choosing not to do.

## Other accelerators

NVIDIA dominates because of software, not silicon. CUDA has had fifteen years of
libraries built on it, and every inference engine targets it first. The alternatives are
real but each comes with a caveat.

| Vendor | Hardware | Where it stands |
| --- | --- | --- |
| **AMD** | Instinct MI300X and later, Radeon PRO | Excellent memory capacity per euro. ROCm has become genuinely usable and major engines support it, but you will hit rough edges NVIDIA users do not. |
| **Intel** | Gaudi accelerators, Arc GPUs | Competitive pricing, smaller software ecosystem. Worth a look if your vendor relationship points that way. |
| **Apple** | M-series unified memory | Unmatched memory per euro for one user. Weak prompt processing ([Chapter 4](/book/04-the-gpu)), and not a serving platform. |
| **Cloud TPUs, Trainium, and similar** | Provider-specific | Cheap at scale, but you are renting, and portability is limited. |

The honest summary: if someone else is paying for your time, use NVIDIA. If hardware
budget is what limits you and you have patience, AMD offers more memory for the
money.

## Other ways to arrange the hardware

[Chapter 11](/book/11-reference-architectures) covered tensor, pipeline and data
parallelism. Two further ideas are becoming standard in larger deployments.

**Disaggregated prefill and decode.** The two phases of a request want opposite hardware
([Chapter 4](/book/04-the-gpu)). Large deployments increasingly run them on separate
machines — compute-heavy hardware reading prompts, bandwidth-heavy hardware generating
answers — and pass the cache between them. It raises utilisation noticeably and adds a
great deal of complexity.

**Prefix caching.** When many requests share an opening — the same system prompt, the
same document — the cache for that shared part can be computed once and reused. For an
assistant with a long standing instruction, or a codebase everyone asks about, this cuts
prefill dramatically. Most serving stacks now support it and it is usually the cheapest
performance win available.

## Making generation faster

**Speculative decoding.** A small fast model drafts several tokens; the large model
checks them all in a single pass and keeps the ones it agrees with. When the draft is
usually right, this multiplies speed at no cost to quality. Supported by most serving
stacks and worth enabling.

**Newer numeric formats.** FP8 and FP4 are supported natively by recent hardware and cut
memory and bandwidth further than the Q4 of [Chapter 2](/book/02-size-and-memory), with
better quality at the same size. Expect them to become the default as older cards age
out.

**Quantizing models yourself.** AWQ, GPTQ and GGUF conversion, done by hand. Worth
learning only when a model you need is not published in the format you need.

## Other kinds of model

Text generation is one workload among several, and the others often deliver value sooner.

| Kind | What it does | Why it is often first |
| --- | --- | --- |
| **Speech to text** | Transcription, from the Whisper family and its successors | Meeting notes and call transcripts are immediately useful and run on modest hardware |
| **Text to speech** | Spoken output | Accessibility, voice interfaces |
| **Document OCR** | Turning scans and PDFs into structured text | Usually the real bottleneck in a document pipeline |
| **Vision-language** | Reading images, screenshots and diagrams | Inspection, documentation, accessibility |
| **Embedding models** | Turning text into vectors | The foundation of retrieval — see [Chapter 12](/book/12-your-own-data) |

These generally need far less memory than chat models. An organisation with one
mid-range card can often serve transcription and OCR for everybody.

## Operations

**Orchestration.** Kubernetes runs containers across many machines automatically:
scheduling work, restarting what fails, scaling with demand. For inference it adds
GPU-aware scheduling, model loading and rolling updates. It becomes genuinely necessary
once you run more than one GPU server with uptime expectations — and it is pure overhead
for a single box. Do not start here.

**Observability.** Logging prompts, responses, latency, token counts and error rates, and
tracing multi-step agent runs from start to finish. The moment more than one person uses
the system you will be asked what it costs and why it produced a particular answer.
Retrofitting this is painful.

**Model versioning.** Treat model weights as a deployed artefact: pin versions, keep the
previous one, and be able to roll back. A model upgrade can change behaviour as much as a
code change, and it will do so silently.

## What to read next

Nothing in this chapter is where to start. If you have not yet made a model useful with
your own material ([Chapter 12](/book/12-your-own-data)) or thought about what happens
when an agent reads something hostile ([Chapter 13](/book/13-security-and-evaluation)),
both will pay off sooner than any hardware on this page.

[Chapter 15](/book/15-closing) is a page of what to remember from all of it.
