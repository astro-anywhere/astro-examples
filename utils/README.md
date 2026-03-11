# Utils

Tools for visualizing and inspecting Astro planning DAGs exported as `.astro.json` files.

## render-plan.js

Generate a visual DAG diagram (SVG) and detailed plan documentation from any Astro export.

### Usage

```bash
node utils/render-plan.js <plan.astro.json> <output-dir>
```

### Outputs

| File | Description |
|------|-------------|
| `dag.svg` | Visual DAG diagram with task nodes, dependency edges, and milestone markers |
| `plan-detail.md` | Full documentation: per-task description, metadata, dependencies, and prompts |
| `plan-summary.md` | Compact summary table suitable for embedding in a README |

### Design

- **Consistent palette** across all projects (Palatino font, warm off-white background, muted blue/sand/green accents)
- **Topological layout** -- nodes arranged by dependency rank, parallel tasks side-by-side
- **Edge types** -- solid lines for dependencies, dashed lines for branches (parallel fan-out)
- **Milestone markers** -- dashed border for milestone/gate nodes
- **Estimate badges** -- XS/S/M/L/XL shown on each task node

### Examples

```bash
# Academic presentation plan
node utils/render-plan.js academic-presentations/1-physics-llm-one/plan/plan.astro.json \
  academic-presentations/1-physics-llm-one/plan/

# Paper review plan
node utils/render-plan.js paper-reviews/1-gba-sparse-autoencoder/plan/plan.astro.json \
  paper-reviews/1-gba-sparse-autoencoder/plan/
```
