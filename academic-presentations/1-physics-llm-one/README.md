# Physics of Language Models: Part 1

**Paper**: [Physics of Language Models: Part 1, Learning Hierarchical Language Structures](https://arxiv.org/abs/2305.13673)
**Authors**: Zeyuan Allen-Zhu, Yuanzhi Li
**Venue**: ICML 2024

## Planning DAG

Astro decomposed this academic presentation project into 12 tasks organized as a DAG:

```
#1 Bootstrap ArXiv LaTeX Workspace
 -> #2 Paper Structure and Contribution Extraction
     -> #3 Figure Inventory and Visual Asset Plan
         -> #4 Narrative Blueprint and 40-Slide Storyboard
             |-> #5  Slides 01-12 (Hook + Background)    --|
             |-> #6  Slides 13-28 (Method + Evidence)     --|--> #8 Assemble Dual-Theme PDFs --|
             |-> #7  Slides 29-40 (Extensions + Discussion)-|                                  |
             |-> #9  Blog Post                            ---------------------------------->  |
             |-> #10 Conference Poster                    ---------------------------------->  |
                                                                                               |
                                                                     #11 QA & Consistency Gate <-
                                                                      -> #12 Pack Complete
```

Tasks #5-#7 (slide batches), #9 (blog), and #10 (poster) run in parallel after the storyboard is finalized.

## Deliverables

| Format | Location | Description |
|--------|----------|-------------|
| Slides | `deliverables/slides/` | 40 individual HTML slides + combined light/dark PDFs |
| Blog Post | `deliverables/blog/post.md` | Detailed summary (~4000 words) with 13 figures |
| Poster | `deliverables/poster/` | A0 portrait poster (HTML + PDF) with 4 key figures |

All deliverables are self-contained -- figures are copied locally, no external path dependencies.

## Plan Export

`plan/plan.astro.json` contains the full Astro project export including all 12 nodes, 15 edges, task descriptions, and project metadata.
