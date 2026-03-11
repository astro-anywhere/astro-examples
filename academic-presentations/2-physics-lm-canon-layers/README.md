# Physics of Language Models: Parts 4.1 & 4.2 — Canon Layers

**Paper**: Physics of Language Models: Part 4.1 (Canonical Forms of Transformer/Linear Layers) & Part 4.2 (Scaling to Production)
**Authors**: Zeyuan Allen-Zhu, Yuanzhi Li
**Topics**: Canonical layer forms, parameter redundancy removal, linear attention models, scaling laws

## Planning DAG

**10 tasks** &bull; **18 dependencies**

![Planning DAG](plan/dag.svg)

| # | Task | Depends on |
|:---:|------|------------|
| 1 | Paper Analysis & Narrative Outline | -- |
| 2 | Slides 1-11: Title, Motivation, Background, Synthetic Playground | #1, #7 |
| 3 | Slides 12-22: Canon Layers + Part 4.1 Results | #1, #7 |
| 4 | Slides 23-33: Part 4.2 Scale Results, Error Analysis, Conclusion | #1, #7 |
| 5 | Blog Post Generation | #1, #7 |
| 6 | Poster Generation | #1, #7 |
| 7 | Figure Extraction and Preparation | #1 |
| 8 | PDF Assembly and Quality Check | #2, #3, #4, #5, #6 |
| 9 | Content Review and Narrative Polish | #8 |
| 10 | ◆ **All Deliverables Complete** | #9 |

> ◆ = milestone
>
> **[View full task descriptions and prompts →](plan/plan-detail.md)**

## Deliverables

| Format | Location | Description |
|--------|----------|-------------|
| Slides | `deliverables/slides/` | 33 individual HTML slides (light + dark) + combined PDFs |
| Blog Post | `deliverables/blog/post.md` | Detailed summary (~3500 words) with 12 figures |
| Poster | `deliverables/poster/` | A0 portrait poster (HTML + PDF) with preview PNG |

All deliverables are self-contained -- figures are copied locally, no external path dependencies.
