# 13. Closing

Twelve chapters, and most of it follows from three ideas. If you remember nothing else,
remember these.

## A model is a file of numbers

Everything a model appears to know is encoded in a fixed set of parameters. It is not
looking anything up. That is why it can be fluent and wrong at the same time.

## Running one is a memory problem

Producing a single token means reading the model out of memory. So:

- **Capacity decides what you can run.** A model fits in GPU memory or it does not.
- **Bandwidth decides how fast it writes.** Tokens per second ≈ bandwidth ÷ the part of
  the model read per token.
- **Compute decides how fast it reads.** Long prompts are an arithmetic problem, not a
  memory one.

Almost every hardware argument you will hear is one of these three being mistaken for
another. CPU cores and system RAM barely enter into it.

## Context and users are the same budget

Whatever memory is left after the weights is shared between the length of conversations
and the number of people having them. You can serve many people with short contexts, or
few with long ones. A team asking for both is asking for two machines.

This is the calculation most discussions skip, and the one that decides what you actually
need to buy.

---

## What follows from those

| If you want | Then |
| --- | --- |
| To learn what these models can do | One consumer GPU and an afternoon ([Chapter 6](/book/06-the-first-run)) |
| To share it with a team | Different software, not just a bigger card ([Chapter 10](/book/10-from-one-user-to-many)) |
| To know whether any of it works | Running candidates on tasks you actually do, and reading the answers |
| To scale beyond one machine | One large GPU before several small ones ([Chapter 11](/book/11-reference-architectures)) |

## Two things this book left out

**Structured outputs.** The server constrains generation to a JSON schema or grammar,
so a tool call or an extraction cannot come back malformed. One request flag in most
serving stacks, and the difference between parsing model output and trusting it.

**Fine-tuning and retrieval.** Adapting a model to your own data — training a small
adapter on it, or fetching your documents into the context as it works. Each is a book
of its own, and neither changes the hardware arithmetic here.

Beyond those, larger deployments split prompt-reading and answer-writing across
separate machine pools — **disaggregated serving**, prefill being compute and decode
being bandwidth — and treat model versions as deployed artefacts to be pinned and
rolled back. All of it is real. None of it belongs in a first build.

## The claim this book started with

That "you cannot run that locally" is almost never true.

It mostly holds up. Models of several hundred billion parameters run on a single
desktop machine you can order today, and 400B-class models on two small boxes and a
fast cable rather than a server room. The trillion-parameter tier is the honest
exception — that still wants a rack, and now you can price the rack instead of taking
anyone's word for it. What is true instead is narrower and more useful: *not at that
speed, not for that many people, not at that price.* Those are answerable questions,
and you now have the arithmetic to answer them.

## And the honest limit

Local models are not a replacement for hosted frontier services, and this book has said
so in every chapter where it came up. They are a different trade: you give up some
capability and take back control, predictable cost, and data that stays where it is.

Whether that trade is worth making depends on work only you can see. The point of
learning the numbers is to make that judgement yourself, instead of taking someone else's.

## Where to go from here

1. Work through [Chapter 6](/book/06-the-first-run), including the model comparison at
   the end.
2. Connect a model to your editor ([Chapter 9](/book/09-coding-and-editors)) and try real
   work. Note where it falls short.
3. Reread [prompt injection](/book/12-security#prompt-injection) before giving any agent
   access to anything that matters.
