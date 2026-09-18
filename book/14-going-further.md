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
| **AMD** | Radeon AI PRO R9700, Instinct MI210 and later | The best memory per euro in this book — about a quarter of NVIDIA's price per gigabyte ([Chapter 11](/book/11-reference-architectures)). ROCm is genuinely usable and the major engines support it, but you will hit rough edges NVIDIA users do not. Instinct parts above the MI210 are quote-only rather than retail. |
| **Intel** | Gaudi accelerators, Arc GPUs | Competitive pricing, smaller software ecosystem, and little memory per card at the consumer end. Worth a look if your vendor relationship points that way. |
| **Apple** | M-series unified memory | Very strong memory per euro for one user, and now strong bandwidth too. Weak prompt processing ([Chapter 4](/book/04-the-gpu)), and not a serving platform. |
| **Cloud TPUs, Trainium, and similar** | Provider-specific | Cheap at scale, but you are renting, and portability is limited. |

The honest summary: if someone else is paying for your time, use NVIDIA. If hardware
budget is what limits you and you have patience, AMD offers more memory for the
money.

## What this book left out

Two things are worth knowing by name, because you will meet them in any serious
deployment and they are cheap wins.

**Prefix caching and cache offloading.** When many requests begin the same way, the
cache for that shared opening is computed once and reused — and it can be kept in system
RAM or on disk rather than GPU memory. [Chapter 2](/book/02-size-and-memory) covers what
this does and, more importantly, what it does not.

**Speculative decoding.** A small fast model drafts several tokens; the large model
checks them in one pass and keeps what it agrees with. Faster output, same quality.

Beyond those, larger deployments split prompt-reading and answer-writing across different
machines, run orchestration across many nodes, and treat model versions as deployed
artefacts to be pinned and rolled back. All of it is real, none of it belongs in a first
build.

## What to read next

Nothing on this page is where to start. If you have not yet made a model useful with your
own material ([Chapter 12](/book/12-your-own-data)), or thought about what happens when an
agent reads something hostile ([Chapter 13](/book/13-security)), both will pay off sooner
than any hardware here.

[Chapter 15](/book/15-closing) is one page on what to remember from all of it.
