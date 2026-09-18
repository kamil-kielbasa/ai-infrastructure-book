# 12. Teaching a model your own data

A model knows what was in its training data and nothing else. It has never seen your
documentation, your codebase, your tickets or your contracts. Closing that gap is the
most common reason organisations start this work at all, and the most common place they
waste months going about it the wrong way.

## The wrong instinct first

Almost everyone's first idea is to train the model on their documents. It sounds right
and it is usually wrong.

Training — fine-tuning — is good at teaching a model **how to behave**: a house style, an
output format, a domain vocabulary, a tone. It is bad at teaching a model **facts**. Facts
learned this way cannot be updated without training again, cannot be cited, and blur
together with everything else the model absorbed.

For facts, put the material in the prompt instead. That is what the rest of this chapter
is about.

::: tip The rule
Fine-tune for behaviour. Retrieve for knowledge.
:::

## Retrieval-augmented generation

**RAG** means: before answering, find the parts of your material that relate to the
question, and paste them into the prompt.

```mermaid
flowchart LR
    Q[Question] --> S[Search your<br/>documents]
    S --> C[Top few<br/>passages]
    C --> P[Prompt:<br/>passages plus<br/>the question]
    P --> M[Model]
    M --> A[Answer<br/>with sources]
```

That is the whole idea. The model does not learn anything; it is handed the relevant
pages and asked to read them. This gives you three things training cannot: the answer
cites its source, updating a document updates the answer immediately, and access control
stays in the search layer where it belongs.

Open WebUI includes a basic version. Drop a file into a chat and ask about it, and you
have run the entire loop.

## The parts

### Embedding models

An embedding model turns a passage of text into a list of numbers — a **vector** —
positioned so that texts with similar meanings land near each other. "How do I reset my
password" and "forgot my login" end up close together despite sharing no words.

This is what makes search by *meaning* possible rather than search by keyword. Embedding
models are small: a few hundred megabytes, running comfortably on hardware that could
never host a chat model.

### Vector databases

A store for those vectors that can find the nearest ones to a query quickly, across
millions of entries. Common choices are Qdrant, Weaviate, Milvus, and `pgvector` if you
already run PostgreSQL and would rather not add a component.

For a first system, the last option is usually right. A separate vector database is
something to adopt when you have outgrown the simple thing.

### Chunking

Documents must be cut into passages before embedding, because you retrieve whole chunks
and the prompt has limited room.

This sounds trivial and is the part that most often decides whether the system works.
Chunks that are too small lose the context that made them meaningful; too large and they
crowd out everything else. Splitting mid-table or mid-function produces passages that
retrieve well and read as nonsense.

Start with structure — headings, sections, functions — rather than a fixed character
count.

## Why the simple version disappoints

A first RAG system is easy to build and frequently underwhelms. The usual causes, in
rough order of how often they are the culprit:

| Symptom | Likely cause |
| --- | --- |
| Retrieves the wrong passage | Chunking split the meaning apart |
| Retrieves nothing useful for specific terms | Pure vector search misses exact identifiers, error codes, part numbers |
| Right passage retrieved, wrong answer | Too many chunks in the prompt; the model lost the thread |
| Good on single facts, bad on "compare X and Y" | One search cannot answer a question needing two sources |

The fixes, in the order worth trying:

**Hybrid search.** Combine vector similarity with old-fashioned keyword search. Meaning
handles paraphrase; keywords handle `ERR_4021`. Almost every serious system uses both,
and this single change fixes more problems than anything else on this list.

**Reranking.** Retrieve twenty candidates cheaply, then use a small model to score which
ones actually answer the question, and keep the best three. Cheap, and a large quality
gain.

**Query rewriting.** Have the model rephrase a vague question into a better search query
before searching. "What about the other one?" retrieves nothing useful on its own.

## Alternatives worth knowing

RAG is the default, not the only option.

| Approach | What it is | When it beats RAG |
| --- | --- | --- |
| **Long context** | Skip retrieval; put the whole document in the prompt | The corpus is small. Simpler and more accurate — but see the memory cost in [Chapter 2](/book/02-size-and-memory) |
| **Agentic search** | Let the model search repeatedly, refining as it goes | Questions needing several lookups. Slower, much better on hard queries |
| **Graph retrieval** | Build a graph of entities and relations, traverse it | Questions about how things connect, rather than what a document says |
| **Fine-tuning** | Train on your material | Behaviour and format — not facts |

Agentic search is increasingly the answer for genuinely hard questions. It is also where
the speed numbers from [Chapter 2](/book/02-size-and-memory) bite: several rounds of
search and reasoning add up quickly on slow hardware.

## A local stack

Everything here runs on your own machines. Nothing needs to leave the building.

| Part | Local option | Resource cost |
| --- | --- | --- |
| Embedding model | `embeddinggemma`, `nomic-embed-text` | Small; a few hundred MB |
| Vector store | `pgvector`, or Qdrant | CPU and disk, not GPU |
| Reranker | A small cross-encoder | Small |
| Chat model | Whatever your tier allows ([Chapter 8](/book/08-the-model-landscape)) | The bulk of it |
| Assembly | Open WebUI for a simple system; a framework if you outgrow it | — |

The retrieval components are cheap. Practically all of your GPU budget goes to the model
that writes the answer, which means retrieval can usually be added to an existing
deployment without buying anything.

## Where to start

1. Put ten documents into Open WebUI and ask questions about them. Notice what it gets
   wrong.
2. Build a test set: the questions your colleagues actually ask, with the answers you
   would accept.
3. Build the simplest thing that could work, then measure it against that set.
4. Add hybrid search. Measure again.
5. Only then consider anything more elaborate.

Step 2 is the one people skip, and skipping it is why so many retrieval projects cannot
tell whether they are improving.
