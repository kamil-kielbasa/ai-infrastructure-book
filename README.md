# Running Models Yourself

A field guide to running large language models on hardware you control — what the
numbers mean, what the hardware does, and what it actually costs, from a single laptop
to a shared cluster.

---

> ## ⚠️ Read this before anything else
>
> **This book was drafted by a large language model and reviewed by a human.**
>
> It is not a human-written work that used AI for polish. The prose, the structure and
> the explanations were machine-generated, then read, corrected and directed by a
> person. Every chapter has been through human review; none of it has been through
> professional editing or technical peer review.
>
> Some people consider AI-generated material unacceptable on principle, and some
> organisations forbid relying on it. **That is a legitimate position.** If it is yours,
> stop here — nothing below is worth your time, and we would rather you knew now than
> three chapters in.
>
> If you do read on, know the specific failure mode you are guarding against: models
> produce confident, well-formatted, plausible detail that is occasionally just wrong.
> The reasoning in this book has been checked and the arithmetic holds. The **numbers**
> — bandwidth figures, prices, model sizes, product names — are the fragile part.
>
> **Verify anything you are about to spend money on.** The formulas will tell you how to
> think; a vendor datasheet will tell you the truth.

---

## What this book is about

Most material about local AI is either a shallow install guide or a research paper.
This sits in between: enough theory to make good decisions, and no more than that.

It builds one idea at a time, from the bottom:

- **A model is a file of numbers.** How many numbers ("4B", "671B"), and what that
  implies for memory.
- **Precision is negotiable.** What quantization is, what `Q4_K_M` means, and why nearly
  everyone uses it.
- **Generation is memory movement, not arithmetic.** This single fact predicts
  performance and explains almost all hardware advice you will encounter.
- **Graphics cards are memory, first.** VRAM, bandwidth, and why reading a prompt and
  writing an answer have opposite hardware requirements.
- **Then the practice.** Getting a model running, giving it tools, reading model names,
  wiring it into an editor.
- **Then the scale.** Why serving ten people is a different problem from serving
  yourself, and three reference architectures — one person, one team, several teams —
  with wiring diagrams, costs, and the models each can actually run.

The recurring theme is that **"you cannot run that locally" is almost never true**. It is
a question of how much memory you are willing to buy, and the book gives you the
arithmetic to work out the answer for any model and any machine.

## Contents

| # | Chapter | What it answers |
| --- | --- | --- |
| | **Part I — Foundations** | |
| 1 | What a model actually is | Parameters, tokens, context windows. What "4B" means. |
| 2 | Size, precision and memory | Quantization, `Q4_K_M`, and the memory budget |
| 3 | Dense models and sparse ones | Mixture of Experts, and why "30B-A3B" has two numbers |
| 4 | The graphics card | VRAM, bandwidth, tensor cores, prefill against decode |
| | **Part II — Getting hands on** | |
| 5 | The reference machine | Applying the arithmetic to an ordinary laptop |
| 6 | The first run | Ollama, a chat interface, web search, a working agent |
| 7 | Reading a model name | Decoding `qwen3.5:4b-instruct-q4_K_M`, and licensing |
| | **Part III — The landscape** | |
| 8 | Every model, and what it costs to run | The full range, hardware tiers, and how open weights compare to frontier models |
| 9 | Coding and editors | VS Code, Cursor, and where local models genuinely fall short |
| | **Part IV — Building infrastructure** | |
| 10 | From one user to many | Batching, scheduling, and why serving needs different software |
| 11 | Reference architectures | Three builds with diagrams, interconnects and costs |
| | **Part V — Onward** | |
| 12 | What to learn next | RAG, fine-tuning, evaluation, prompt injection, orchestration |

## Who it is for

Engineers who are technically capable but new to this particular field. If you can read a
datasheet and drive a terminal, you have the background. No machine learning knowledge is
assumed.

## What it is not

Not a research survey, not a benchmark leaderboard, and not a guide to training models.
It is about *running* them: what fits, how fast, on what, at what price.

It also does not sell anything. Where local hardware loses to a hosted service, the book
says so.

## Running it locally

Built with [VitePress](https://vitepress.dev). Published to GitHub Pages on every push to
`main`.

```bash
npm install
npm run docs:dev      # http://localhost:5173
```

## Contributing

Corrections are especially welcome. Model names, prices and product specifications date
quickly, and given how this book was written, a second pair of eyes on any number is
worth having.

See [contributing.md](contributing.md) for the house style and how to add a chapter.

## License

MIT. See [LICENSE](LICENSE).
