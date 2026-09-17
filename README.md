# Running Models Yourself

A field guide to running large language models on your own hardware — from a single
laptop to a shared cluster.

**[Read the book →](https://kamil-kielbasa.github.io/ai-infrastructure-book/)**

---

> ### ⚠️ This book is AI-generated
>
> Drafted by a large language model, reviewed by a human. Not a human-written book that
> used AI for polish — the other way round.
>
> Some people and organisations reject AI-generated material on principle. **That is a
> legitimate position.** If it is yours, stop here.
>
> The reasoning has been checked and the arithmetic holds. The **numbers** — bandwidth
> figures, prices, model sizes — are the fragile part. Verify anything you are about to
> spend money on.

---

## Contents

| # | Chapter |
| --- | --- |
| 1 | What a model actually is |
| 2 | Size, precision and memory |
| 3 | Dense models and sparse ones |
| 4 | The graphics card |
| 5 | The reference machine |
| 6 | The first run |
| 7 | Reading a model name |
| 8 | Every model, and what it costs to run |
| 9 | Coding and editors |
| 10 | From one user to many |
| 11 | Reference architectures |
| 12 | What to learn next |

It builds from the bottom up: a model is a file of numbers, generation is memory
movement, and everything else follows from those two facts. No machine learning
knowledge assumed.

The recurring theme is that *"you cannot run that locally"* is almost never true — it is
a question of how much memory you are willing to buy, and the book gives you the
arithmetic.

## Development

```bash
npm install
npm run docs:dev      # http://localhost:5173
```

See [contributing.md](contributing.md).

## License

MIT
