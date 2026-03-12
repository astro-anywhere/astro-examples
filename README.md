# Astro Examples

Example projects built with [Astro](https://github.com/astro-anywhere) -- a planning-first platform for builders and scientists.

Each example includes the **planning DAG** (exported as `.astro.json`), a **visual DAG diagram**, **detailed task descriptions with prompts**, and the **final deliverables** produced by Astro's AI-assisted execution pipeline.

## Examples

### Academic Presentations

| # | Paper | Deliverables | DAG |
|---|-------|-------------|-----|
| [1](academic-presentations/1-physics-llm-one/) | [Physics of Language Models: Part 1](https://arxiv.org/abs/2305.13673) -- Allen-Zhu & Li, ICML 2024 | 40-slide deck (light+dark PDF), blog post, A0 poster | 12 tasks, 15 edges |
| [2](academic-presentations/2-physics-lm-canon-layers/) | Physics of Language Models: Parts 4.1 & 4.2 -- Canon Layers & Scaling | 33-slide deck (light+dark PDF), blog post, A0 poster | 10 tasks, 18 edges |

### Moat Analysis

| # | Company | Deliverables | DAG |
|---|---------|-------------|-----|
| [1](moat-analysis/1-crwv-moat-fragility/) | [CRWV](https://finance.yahoo.com/quote/CRWV/) -- CuriosityStream Moat & Fragility | HTML+PDF report, CA radar, moat heatmap, ROIC vs WACC, scenario chart (5 SVGs) | 13 tasks, 18 edges |

### Paper Reviews

| # | Paper | Deliverables | DAG |
|---|-------|-------------|-----|
| [1](paper-reviews/1-gba-sparse-autoencoder/) | Geometry-Based Activation for Sparse Autoencoders | LaTeX review report with scoring dashboard + PDF | 11 tasks, 16 edges |

## Structure

```
academic-presentations/
  1-physics-llm-one/
    plan/                  # DAG visualization + detailed task docs
      dag.svg              # Visual DAG diagram
      plan-detail.md       # Full task descriptions and prompts
      plan.astro.json      # Raw Astro export
    deliverables/          # Final outputs (self-contained)
      slides/              # 40 HTML slides + combined PDFs
      blog/                # Markdown post + figures/
      poster/              # HTML + A0 PDF + figures/

moat-analysis/
  1-crwv-moat-fragility/
    plan/                  # DAG visualization + detailed task docs
    deliverables/          # HTML + PDF report with SVG charts
      assets/              # CA radar, moat heatmap, ROIC, revenue, scenario SVGs

paper-reviews/
  1-gba-sparse-autoencoder/
    plan/                  # DAG visualization + detailed task docs
    deliverables/          # Review report (LaTeX + PDF)

utils/                     # Tools for generating visualizations from .astro.json
  render-plan.js           # DAG SVG + plan documentation generator
```

## Utils

Generate plan visualizations from any `.astro.json` export:

```bash
node utils/render-plan.js path/to/plan.astro.json path/to/output-dir/
```

Produces:
- `dag.svg` -- Visual DAG diagram (consistent style across all projects)
- `plan-detail.md` -- Per-task descriptions, dependencies, and prompts
- `plan-summary.md` -- Compact table for README embedding

## About Astro

Astro provides an AI-assisted planning layer that sits above execution tools (coding agents, analysis tools) to help users decompose complex goals, manage dependencies across environments, and focus human attention on strategic decisions.

- [Astro Platform](https://github.com/astro-anywhere)
- [Astro Agent](https://github.com/astro-anywhere/astro-agent)
- [Astro CLI](https://github.com/astro-anywhere/cli)
