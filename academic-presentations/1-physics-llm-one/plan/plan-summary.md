## Planning DAG

**12 tasks** &bull; **15 dependencies**

![Planning DAG](plan/dag.svg)

| # | Task | Depends on |
|:---:|------|------------|
| 1 | Bootstrap ArXiv LaTeX Workspace | -- |
| 2 | Paper Structure and Contribution Extraction | #1 |
| 3 | Figure Inventory and Visual Asset Plan | #2 |
| 4 | Narrative Blueprint and 40-Slide Storyboard | #3 |
| 5 | Generate Slides 01-12 (Hook + Background) | #4 |
| 6 | Generate Slides 13-28 (Method + Core Evidence) | #4 |
| 7 | Generate Slides 29-40 (Extensions + Discussion) | #4 |
| 8 | Assemble and Render Dual-Theme Slide PDFs | #5, #6, #7 |
| 9 | Generate Detailed Blog Post | #4 |
| 10 | Generate Portrait Poster and A0 PDF | #4 |
| 11 | Cross-Deliverable QA and Consistency Gate | #8, #9, #10 |
| 12 | ◆ **Presentation Pack Complete** | #11 |

> ◆ = milestone
>
> **[View full task descriptions and prompts →](plan/plan-detail.md)**
