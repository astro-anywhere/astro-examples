# Astro Examples

Example projects built with [Astro](https://github.com/astro-anywhere) -- a planning-first platform for builders and scientists.

Each example includes the planning DAG (exported as `.astro.json`) and the final deliverables produced by Astro's AI-assisted execution pipeline.

## Examples

### Academic Presentations

| # | Paper | Deliverables | Plan |
|---|-------|-------------|------|
| 1 | [Physics of Language Models: Part 1](https://arxiv.org/abs/2305.13673) -- Allen-Zhu & Li, ICML 2024 | Slides (40 HTML + PDF), Blog Post (Markdown), Conference Poster (A0 PDF) | 12-node DAG |

## Structure

```
academic-presentations/
  1-physics-llm-one/
    plan/              # Astro planning DAG (.astro.json)
    deliverables/      # Final outputs
      slides/          # Individual HTML slides + combined PDF
      blog/            # Markdown post + figures/
      poster/          # HTML + A0 PDF + figures/
utils/                 # Tools for visualizing plans and deliverables
```

## Utils

The `utils/` directory contains tools for inspecting and visualizing Astro planning DAGs:

- **Plan DAG viewer** -- Render the planning graph as a visual DAG
- **Prompt printer** -- Pretty-print task descriptions and prompts from the plan

> These tools are under development. See `utils/README.md` for usage.

## About Astro

Astro provides an AI-assisted planning layer that sits above execution tools (coding agents, analysis tools) to help users decompose complex goals, manage dependencies across environments, and focus human attention on strategic decisions.

- [Astro Platform](https://github.com/astro-anywhere)
- [Astro Agent](https://github.com/astro-anywhere/astro-agent)
- [Astro CLI](https://github.com/astro-anywhere/cli)
