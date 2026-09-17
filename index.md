---
layout: home

hero:
  name: Running Models Yourself
  text: Language models on your own hardware
  tagline: What the numbers mean, what the hardware does, and what it costs — from one laptop to a shared cluster.
  actions:
    - theme: brand
      text: Start reading
      link: /book/01-what-a-model-is
    - theme: alt
      text: Skip to the setup
      link: /book/06-the-first-run

features:
  - title: Part I — Foundations
    details: What a model is. Why its size decides everything. What VRAM, bandwidth and tensor cores actually do.
    link: /book/01-what-a-model-is
    linkText: 4 chapters
  - title: Part II — Getting hands on
    details: Size up a machine, get a model running, give it tools, and learn to read a model name.
    link: /book/05-the-reference-machine
    linkText: 3 chapters
  - title: Part III — The landscape
    details: Every model from 1B to 1T, the hardware each one needs, and how open models compare to hosted ones.
    link: /book/08-the-model-landscape
    linkText: 2 chapters
  - title: Part IV — Building infrastructure
    details: Serving a whole team. Three builds with diagrams, costs, and the speed and context you can expect.
    link: /book/10-from-one-user-to-many
    linkText: 2 chapters
  - title: Part V — Going further
    details: Teaching a model your own documents, the security problems that follow, and where the hardware goes next.
    link: /book/12-your-own-data
    linkText: 4 chapters
---

## The short version

A model is a file of numbers. Running it is mostly a matter of moving those numbers out
of memory fast enough. Almost everything else — which card to buy, how many people it can
serve, what it costs — follows from that one idea.

This book works through it from the bottom up. You need no background in machine
learning. If you can read a datasheet and use a terminal, that is enough.

You will often hear that the good models cannot be run outside a datacenter. That is
almost never true. It is a question of how much memory you are willing to buy, and the
chapters ahead give you the arithmetic to work out the answer for any model and any
machine.

