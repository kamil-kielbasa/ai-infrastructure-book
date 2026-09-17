---
layout: home

hero:
  name: Running Models Yourself
  text: A field guide to language models on your own hardware
  tagline: What the numbers mean, what the hardware does, and what it actually costs — from one laptop to a shared cluster.
  actions:
    - theme: brand
      text: Start reading
      link: /book/01-what-a-model-is
    - theme: alt
      text: Jump to the setup
      link: /book/06-the-first-run
    - theme: alt
      text: Contribute
      link: /contributing
---

::: danger Read this before anything else
**This book was drafted by a large language model and reviewed by a human.**

It is not a human-written work that used AI for polish. The prose, the structure and the
explanations were machine-generated, then read, corrected and directed by a person. Every
chapter has been through human review; none of it has been through professional editing
or technical peer review.

Some people consider AI-generated material unacceptable on principle, and some
organisations forbid relying on it. **That is a legitimate position.** If it is yours,
stop here — nothing below is worth your time, and we would rather you knew now than three
chapters in.

If you do read on, know the specific failure mode you are guarding against: models
produce confident, well-formatted, plausible detail that is occasionally just wrong. The
reasoning here has been checked and the arithmetic holds. The **numbers** — bandwidth
figures, prices, model sizes, product names — are the fragile part.

**Verify anything you are about to spend money on.** The formulas will tell you how to
think; a vendor datasheet will tell you the truth.
:::

## What this book is

A practical introduction to running language models on hardware you control. It
starts with what a model *is* — a file of numbers — and builds up, one concept at a
time, until you can read a GPU spec sheet, size a server, and tell which models will
run on it.

It is written to be read in order. Each chapter assumes the one before it and nothing
else.

Three things set it apart from most material on the subject:

**Built from first principles.** Every term is explained before it is used. No assumed
familiarity with machine learning, GPUs, or model naming conventions.

**Numbers you can check.** Memory arithmetic, bandwidth figures and price bands are given
explicitly, so you can redo the calculation for hardware we never mention.

**From a laptop to a cluster.** The same reasoning scales. Three reference architectures
— one person, one team, many teams — with diagrams, costs and the models each can
actually run.

## Who it is for

Engineers who are technically competent but new to this particular field. If you can
read a datasheet and drive a terminal, you have the background required. You do not
need to know anything about machine learning.

## What it is not

Not a research survey, not a benchmark leaderboard, and not a tutorial for training
models. It is about *running* them: what fits, how fast, on what, at what price.

It also does not sell anything. Where local hardware loses to a hosted service, the book
says so.

## How it is maintained

This is a living document. Model names, prices and tooling move quickly; the physics
does not. Chapters are structured so the durable reasoning sits apart from the
perishable specifics, which makes updates cheap.

Corrections, additions and disagreements are welcome — see [Contributing](/contributing).
