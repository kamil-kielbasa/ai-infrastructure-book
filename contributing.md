# Contributing

Corrections welcome, especially to numbers — prices and specifications date fast.

## Run it

```bash
npm install
npm run docs:dev        # http://localhost:5173
npm run docs:build      # what CI runs; fails on dead links
```

Push to `main` deploys automatically.

## Add a chapter

1. Create `book/NN-slug.md`.
2. Add it to `sidebar` in `.vitepress/config.mts`.
3. Start with one `#` heading matching the sidebar entry.

Inserting mid-book means renumbering everything after it. Prefer appending, or splitting
an existing chapter.

## Style

- Explain a term before using it. Link to it rather than repeating it.
- Numbers, not adjectives: "1,790 GB/s", not "very fast".
- Mark estimates as estimates. Never launder a guess into a fact.
- Say where local hardware loses. The book does not sell anything.
- Tables for comparisons, prose for reasoning.

## Diagrams

Mermaid in fenced blocks. A diagram that restates a sentence is noise — use them for how
components connect and where data moves.

## Keep the AI disclosure

The book is AI-drafted and human-reviewed, disclosed in the README and on the landing
page. Leave that in. If you extend it the same way, verify every number against a
primary source first.

## Review

One approval is enough. Check the claim, not the comma.
