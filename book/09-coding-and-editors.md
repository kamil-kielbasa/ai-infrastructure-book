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

| Task | Model size | Why |
| --- | --- | --- |
| Inline completion | 1–3B | Latency dominates. Larger models are worse here. |
| Explaining unfamiliar code | 8–30B | Needs comprehension, not autonomy |
| Well-specified single-file edits | 8–30B | Achievable locally |
| Multi-file refactoring across a repository | 100B+ | Needs sustained planning |
| Long-horizon agentic work | Frontier | Currently the honest answer |

## Expectations, stated plainly

A 4B model on a laptop is useful for boilerplate, explaining code you did not write,
small well-specified edits, and commit messages. It is not close to a hosted frontier
model for agentic work on a real codebase.

The 30B sparse coding models are genuinely capable — but at single-digit tokens per
second, an agentic loop making twenty tool calls takes a long time. On Tier 1 hardware
([Chapter 8](/book/08-the-model-landscape)) the same model runs ten times faster and the
calculation changes completely.

Running coding models locally is a privacy and cost decision first, and a capability
decision second. When the work is sensitive, or the volume is high and steady, it wins.
When you need the best available answer to a hard problem, it does not.
