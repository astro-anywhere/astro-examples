# Astro Examples -- Utils

Tools for visualizing and inspecting Astro planning DAGs exported as `.astro.json` files.

## Planned Tools

- **`dag-viewer.html`** -- Browser-based DAG visualization (renders nodes, edges, status, and dependencies)
- **`print-plan.js`** -- CLI tool to pretty-print task titles, descriptions, and prompts from a plan JSON

## Usage

```bash
# View a plan DAG in the browser
open utils/dag-viewer.html

# Pretty-print plan tasks
node utils/print-plan.js ../academic-presentations/1-physics-llm-one/plan/plan.astro.json
```

> Under development -- check back soon.
