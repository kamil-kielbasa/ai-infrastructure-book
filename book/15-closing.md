# 15. Closing

Fourteen chapters, and most of it follows from three ideas. If you remember nothing else,
remember these.

## A model is a file of numbers

Everything a model appears to know is encoded in a fixed set of parameters. It is not
looking anything up. That is why it can be fluent and wrong at the same time, and why
teaching it your material means putting that material in front of it
([Chapter 12](/book/12-your-own-data)) rather than trying to push it into the weights.

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
| To make it useful at work | Retrieval, not fine-tuning ([Chapter 12](/book/12-your-own-data)) |
| To share it with a team | Different software, not just a bigger card ([Chapter 10](/book/10-from-one-user-to-many)) |
| To know whether any of it works | Twenty test cases of your own ([Chapter 13](/book/13-security-and-evaluation)) |
| To scale beyond one machine | One large GPU before several small ones ([Chapter 11](/book/11-reference-architectures)) |

## The claim this book started with

That "you cannot run that locally" is almost never true.

It holds up. The largest open model in existence fits in one desktop machine you can buy
today. What is true instead is narrower and more useful: *not at that speed, not for that
many people, not at that price.* Those are answerable questions, and you now have the
arithmetic to answer them.

## And the honest limit

Local models are not a replacement for hosted frontier services, and this book has said
so in every chapter where it came up. They are a different trade: you give up some
capability and take back control, predictable cost, and data that stays where it is.

Whether that trade is worth making depends on work only you can see. The point of
learning the numbers is to make that judgement yourself, instead of taking someone else's.
