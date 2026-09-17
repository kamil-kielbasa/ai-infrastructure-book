# 7. Reading a model name

A model name carries five separate pieces of information. Once you can decode it, most
of the confusion around choosing a model disappears.

```
qwen3.5 : 4b - instruct - q4_K_M
   │       │      │          │
   │       │      │          └── quantization (Chapter 2)
   │       │      └───────────── what it was trained to do
   │       └──────────────────── parameter count (Chapter 1)
   └──────────────────────────── family and generation
```

## Family

The family tells you who built the model and what lineage it belongs to.

| Family | Built by | Tends to be good at |
| --- | --- | --- |
| `qwen` | Alibaba | Tool use, multilingual, wide size range |
| `llama`, `muse` | Meta | General purpose, large ecosystem |
| `gemma` | Google | Efficiency at small sizes, multilingual |
| `granite` | IBM | Structured output, enterprise tasks, Apache 2.0 |
| `mistral`, `devstral`, `ministral` | Mistral | Efficiency; built in Europe |
| `nemotron` | NVIDIA | Agentic use, tuned for their own hardware |
| `deepseek` | DeepSeek | Reasoning and code at very large scale |
| `gpt-oss` | OpenAI | Open-weight reasoning models |
| `glm` | Z.ai | Coding and agentic work |
| `olmo` | Allen Institute | Fully open — training data and code published too |

Families have consistent personalities across generations. It is worth finding one or
two that suit your work rather than chasing every release.

## Generation

The version number. It moves quickly, and a generation step often matters more than a
size step: a new 4B model will frequently beat the previous generation's 8B.

## Variant — what it was trained to do

The part that is easiest to overlook and most expensive to get wrong.

| Variant | What it is | Use it for |
| --- | --- | --- |
| `base` | Raw output of pre-training. Continues text; does not follow instructions or converse. | A starting point for fine-tuning. **Not a chat model.** |
| `instruct`, `chat` | Base plus training to follow instructions and hold a conversation. | Everything ordinary. This is the default. |
| `thinking`, `reasoning` | Emits a chain of internal reasoning before answering. | Hard problems. Costs many extra tokens and noticeable latency. |
| `coder` | Specialised on code and on agentic software work. | Code. See [Chapter 9](/book/09-coding-and-editors). |
| `vision`, `VL` | Accepts images alongside text. | Screenshots, diagrams, scanned documents. |
| `embedding` | Outputs vectors rather than text. Not conversational at all. | Search and retrieval. See [Chapter 12](/book/12-your-own-data). |
| `guard`, `guardian` | Classifiers that judge whether content is acceptable. | Filtering inputs and outputs in production. |
| `distill` | A small model trained to imitate a larger one. | Punching above its weight on specific tasks. |

A `base` model will appear broken if you try to chat with it. It is not broken; it is
doing exactly what it was trained to do, which is continue text.

## Size, and the sparse notation

Plain `4b` means four billion parameters, all of them dense.

`30b-a3b` — or "30B-A3B" — means thirty billion total, three billion active per token.
See [Chapter 3](/book/03-dense-and-sparse). Memory follows the first number, speed follows
the second.

Some names hide this. A model advertised as "30B" may be sparse; check the model card
if the distinction matters, and it usually does.

## Quantization

Covered in [Chapter 2](/book/02-size-and-memory). If the name carries no quantization
suffix, tooling generally defaults to Q4_K_M.

## Capability tags

Model registries mark models with tags that determine what they can participate in.

| Tag | Meaning |
| --- | --- |
| `tools` | Supports function calling. **Required for agents.** Without it the model cannot search, run commands, or use any tool. |
| `thinking` | Has a reasoning mode that can be enabled. |
| `vision` | Accepts image input. |
| `embedding` | Vector model, not conversational. |
| `cloud` | Runs on the provider's servers, not yours. Not local. |

::: warning
If you take one thing from this chapter: **an agent requires the `tools` tag.**

A model without it will not refuse the task. It will claim to have searched the web and
invent the results, because inventing plausible text is precisely what it was trained
to do.
:::

## Licensing

"Open weights" is not the same as "open source", and the difference has teeth.

| License | What it permits |
| --- | --- |
| Apache 2.0, MIT | Genuinely permissive. Commercial use, modification, redistribution. |
| Llama Community License | Commercial use with conditions, including a user-count threshold and naming requirements. |
| Research-only / non-commercial | Exactly what it says. |
| Custom vendor licenses | Read them. Terms vary and change between releases. |

Check the license before a model reaches anything that ships. Several strong
families — Granite, Qwen, OLMo, and parts of the Mistral range — are Apache 2.0, which
is a genuine practical advantage over an equally capable model with restrictive terms.
