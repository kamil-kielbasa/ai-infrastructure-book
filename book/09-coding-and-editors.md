# 9. Coding and editors

Code is the most common reason engineers want a local model, and the area where
expectations most often exceed reality. This chapter covers how to wire a local model
into an editor, and where the limits are.

## What makes a coding model

Coding models are not general models that happened to see more code. They are trained
on *agentic software work*: reading a repository, editing several files coherently,
running tests, interpreting failures, and trying again.

A general model can write a function when asked. A coding model can work through a
task.

You cannot prompt a general model into becoming a coding model. Choose the right one —
`qwen3-coder`, `devstral`, `north-mini-code`, `laguna`, and the coder variants of the
major families.

Below roughly 7B, neither category performs well at agentic work. Small coding models
are useful for completion and boilerplate, not autonomy.

## VS Code

Install the official **Ollama extension** (published by Ollama on the Marketplace).
Then open the Command Palette and run `Chat: Manage Language Models` to select your
model.

::: info If you configured this before
VS Code previously had a *built-in* Ollama provider, separate from the extension. It
has been deprecated. If you set it up, remove that configuration after installing the
extension — the extension replaces it and is updated faster.
:::

What a local model gives you, and what it does not:

| Capability | Local model |
| --- | --- |
| Chat, agent mode, multi-file edits | **Yes.** Fully offline; no account or subscription required. |
| Inline completions (grey ghost text) | **No.** Depends on the hosted service. |
| Semantic search across the workspace | **No.** Depends on hosted embeddings. |
| Chat titles, commit messages | Yes, if you set `chat.utilityModel` and `chat.utilitySmallModel` to a local model |

Only models tagged `tools` ([Chapter 7](/book/07-reading-model-names)) appear in the picker
for agent mode.

## Cursor

**Cursor is not a route to running models locally.**

Its architecture routes work through Cursor's own backend. Every model in its catalogue
is hosted by the provider, by a partner, or by Cursor, and features such as tab
completion and codebase indexing are server-side by design. Bring-your-own-key exists,
but it points Cursor's servers at your endpoint — which would mean exposing a local
model to the public internet through a tunnel, adding complexity and surrendering most
of the privacy that motivated running locally.

If offline or on-premises operation is the goal, use one of the other options here. If
you like Cursor, use it for what it does well — hosted frontier models — and keep the
local setup separate. These are not competing choices.

## Other editors

| Tool | Notes |
| --- | --- |
| **Continue.dev** | VS Code and JetBrains. Local chat **and** local inline completions — it fills the gap the hosted services leave. |
| **Cline** | VS Code, agentic. Points at any OpenAI-compatible endpoint. |
| **Zed** | Built-in Ollama support. Very fast editor. |
| **Aider** | Terminal-based, git-aware. Works well with local models and commits its own changes. |

For inline completions specifically, Continue.dev with a small fast model — 1B to 3B —
is the standard arrangement. Completion is latency-sensitive and does not need a large
model; it needs a fast one.

## A realistic division of labour

The productive pattern is not "replace the hosted assistant" but "route each task to
the cheapest thing that can do it".

| Task | Model size | Hardware tier | Why |
| --- | --- | --- | --- |
| Inline completion | 1–3B | 0 | Latency dominates. Bigger models are worse here. |
| Explaining unfamiliar code | 8–30B | 1 | Needs comprehension, not autonomy |
| Well-specified single-file edits | 8–30B | 1 | Achievable locally |
| Multi-file refactoring across a repository | 100B+ | 2 | Needs sustained planning |
| Long-horizon agentic work | Frontier | 3–4 | Currently the honest answer |

Tiers refer to [Chapter 8](/book/08-the-model-landscape).

## What agentic coding really demands

Coding agents are the most demanding thing in this book, and for a reason worth spelling
out: they are heavy on **both** halves of the hardware problem.

**They read enormous prompts.** Every step re-sends the task, the files in play, and the
history of what has happened so far. Prompts of 20,000–50,000 tokens are routine. That
is prefill, and prefill is compute ([Chapter 4](/book/04-the-gpu)).

**They generate text nobody reads.** Plans, tool calls, diffs, retries. A single task can
produce tens of thousands of tokens. That is decode, and decode is bandwidth.

So the speed table from [Chapter 2](/book/02-size-and-memory) applies with force:

| Generation speed | A 20-step coding task takes |
| --- | --- |
| 5 tokens/s | around half an hour |
| 20 tokens/s | around eight minutes |
| 60 tokens/s | around three minutes |

Nothing about the model changes between those rows. Only the hardware does. A setup that
feels fine for conversation can make the same model useless for agentic work, and this is
the single most common disappointment people report.

## Expectations, stated plainly

**Small models (1–4B).** Boilerplate, explaining code you did not write, small
well-specified edits, commit messages. Not agentic work on a real codebase, at any speed.

**Mid-range models (8–30B).** Genuinely useful for single-file work and comprehension.
Capable of short agentic sequences. The capability is real; whether it is *pleasant*
depends entirely on how fast your hardware runs them.

**Large models (100B+).** Competitive with hosted services for a lot of real work — and
they need Tier 2 hardware or better before the agentic loop finishes in a reasonable
time.

Running coding models locally is a privacy and cost decision first, and a capability
decision second. When the work is sensitive, or the volume is high and steady, it wins.
When you need the best available answer to a hard problem, it does not.
