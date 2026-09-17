# 12. What to learn next

This book covered one path: understanding the hardware, running a model, and sizing
infrastructure. Everything below sits just outside that path. Each entry says what the
topic is, why it might matter to you, and when to reach for it.

They are ordered roughly by how often they turn out to be what someone actually needed.

## Working with your own data

### Retrieval-Augmented Generation (RAG)
Finding the documents relevant to a question and placing them in the prompt, so the
model can answer about material it never saw in training.

**Why it matters:** this is almost always the real answer to "make it know our
documentation / our codebase / our ticket history". People reach for fine-tuning
instead and lose months. Open WebUI includes a basic version — drop a file into a chat
and ask about it.

### Embeddings and vector databases
An embedding model converts text into a list of numbers positioned so that similar
meanings land near each other. A vector database stores millions of these and finds the
nearest ones quickly.

**Why it matters:** this is the machinery underneath RAG, and it enables search by
meaning rather than by keyword. Look at `embeddinggemma`, `nomic-embed-text`, Qdrant,
pgvector.

### Chunking and context engineering
How documents are split before embedding, and what gets selected into a limited context
window.

**Why it matters:** it is the difference between a retrieval system that works and one
that confidently returns the wrong passage. More craft than science, and the part
tutorials skip.

## Changing model behaviour

### Fine-tuning and LoRA
Continuing to train a model on your own data. LoRA is the affordable version: rather
than retraining billions of parameters, you train a small adapter and attach it.

**Why it matters:** the right tool for teaching *style, format or tone* — a house
documentation voice, a specific output schema, a domain vocabulary. It is the **wrong**
tool for teaching facts; use RAG. Note also that fine-tuning needs considerably more
memory than inference, so the hardware tier you can train on is lower than the one you
can serve on.

### Evaluation
Building a repeatable test set for *your* task and scoring candidates against it.

**Why it matters:** public benchmarks leak into training data and are optimised for. A
model can top a leaderboard and disappoint on your work. Ten to twenty representative
prompts, scored consistently, will tell you more than any published comparison — and
will keep telling you, every time you consider a change. This is the most underrated
item on this list.

## Agents

### Agentic loops
The pattern where a model calls a tool, reads the result, decides what to do next, and
repeats until finished.

**Why it matters:** understanding the loop explains why models need the `tools` tag, why
agents consume tokens so quickly, and why they fail in characteristic ways — looping,
abandoning the task early, or fabricating tool output.

### MCP (Model Context Protocol)
An open standard for connecting models to tools and data sources, so a capability
written once works across different clients.

**Why it matters:** it is becoming the common interface between models and everything
else. If you build an internal tool intended for model use, this is probably how to
expose it.

## Security

### Prompt injection
Any text a model reads — a web page, an email, a source file, a code comment — can
contain instructions, and models frequently follow them. Whoever controls what your
agent reads can influence what it does.

**Why it matters:** this is the defining security problem of the field and it is not
solved. It deserves attention *before* an agent touches a repository, a credential or a
production system. Start with the OWASP Top 10 for LLM Applications.

### Guardrails and safety classifiers
Small models that inspect inputs and outputs and flag policy violations —
`llama-guard`, `granite-guardian`, `shieldgemma`.

**Why it matters:** necessary as soon as a model is exposed to anyone outside the team
that built the system.

### Data governance
What gets logged, how long prompts are retained, who can read them, and what crosses a
network boundary.

**Why it matters:** running locally solves the external-transmission problem and creates
an internal-retention one. Chat logs are now your responsibility.

## Performance

### Speculative decoding
A small fast model drafts several tokens; the large model verifies them in a single
pass and keeps the ones it agrees with.

**Why it matters:** a genuine speed-up for large models at no quality cost. Increasingly
available in serving stacks and worth enabling.

### Batching, paged attention, tensor parallelism
The internals that make production servers fast, introduced in
[Chapter 10](/book/10-from-one-user-to-many) and [Chapter 11](/book/11-reference-architectures).

**Why it matters:** this is the vocabulary for the conversation when someone proposes
buying serving hardware.

### Quantizing models yourself
Converting weights to GGUF, or applying AWQ or GPTQ.

**Why it matters:** only when a model you need is not published in the format you need.
Otherwise use what others have already quantized.

## Operations

### Kubernetes and multi-node orchestration
Kubernetes runs containers across a fleet of machines automatically — scheduling work,
restarting what fails, scaling with demand. Applied to inference it means GPU-aware
scheduling, model loading, and rolling updates across several servers.

**Why it matters:** genuinely necessary once you run more than one GPU server with
uptime expectations. It is substantial operational overhead and pure overhead for a
single box. Do not start here.

### Observability and cost accounting
Logging prompts, responses, latency, token counts and error rates; tracing multi-step
agent runs end to end.

**Why it matters:** the moment more than one person uses the system, you will be asked
what it costs and why it produced a particular answer. Retrofitting this is painful.

## Beyond text

### Multimodal models
Speech-to-text (the Whisper family), text-to-speech, document OCR (`deepseek-ocr`,
`glm-ocr`), and vision-language models for images and diagrams.

**Why it matters:** document processing and meeting transcription are frequently the
highest-value first deployment in an organisation, and they run on more modest hardware
than chat models.

## A suggested order

1. Work through [Chapter 6](/book/06-the-first-run) end to end, including the model
   comparison in Step 5.
2. Drop a document into a chat and ask about it. That is RAG in its simplest form.
3. Connect a model to your editor ([Chapter 9](/book/09-coding-and-editors)) and try real
   work. Note precisely where it falls short.
4. Read about prompt injection before giving any agent access to anything that matters.
5. Write down ten prompts representative of your actual work and use them to compare
   models. That is your first evaluation set, and it will outlast every model named in
   this book.
