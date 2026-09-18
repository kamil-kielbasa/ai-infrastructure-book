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

## What this book left out

Two things are worth knowing by name, because you will meet them in any serious
deployment and they are cheap wins.

**Prefix caching.** When many requests begin the same way — the same standing
instruction, the same document — the cache for that shared opening is computed once and
reused. Most serving stacks support it, and for an assistant everybody asks about the
same codebase it removes most of the prompt-reading cost.

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
