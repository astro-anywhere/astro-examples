<div align="center">

# CRWV Moat Fragility Pipeline

**13 tasks** &bull; **18 dependencies** &bull; Exported March 11, 2026

</div>

## DAG Overview

![Planning DAG](dag.svg)

### At a Glance

| Metric | Value |
|---|---|
| Tasks | 10 |
| Milestones | 3 |
| Dependencies | 13 |
| Parallel branches | 5 |

### Execution Flow

```
● #1 Initialize Analysis Workspace
  ◆ #2 Confirm Peer Scope And Supplementary Docs
    ┬─ ● #3 Retrieve SEC, Proxy, IR, And Earnings Sources
    └─ ● #4 Pull Yahoo Finance And Industry Market Data
        ● #5 Normalize Five-Year Financial Fact Base
          ┬─ ● #6 Compute CA Score And Quant Narrative
          ├─ ● #7 Run 7 Powers Moat Assessment
          └─ ● #8 Execute Anti-Fragility Core Tests
                ┬─ ● #9 Scenario Model And Thesis Synthesis
                └─ ● #10 Create Required Charts And Figure Set
                    ● #11 Assemble Professional Report And Render PDF
                      ◆ #12 Human Quality Review And Sign-Off
                        ◆ #13 Competitive Advantage Analysis Complete
```

---

## Task Details

### ● Task #1: Initialize Analysis Workspace

`Planned` &nbsp; `high`

| | |
|---|---|
| **Unlocks** | → #2 *Confirm Peer Scope And Supplementary Docs* |
| **Schedule** | 2026-03-11 → 2026-03-11 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Create the project skeleton for a reproducible moat analysis pipeline: `data/raw/{sec,ir,earnings,yahoo,industry}`, `data/processed`, `analysis`, `charts`, `output/report`, and a source registry file `data/processed/source-register.csv` with columns for metric, value, date, source URL, source type, and confidence (confirmed/estimated). Define a metric dictionary for the 5-year horizon and peer-ready schema so CRWV and optional comparison tickers share identical fields.

</details>

---

### ◆ Task #2: Confirm Peer Scope And Supplementary Docs

`Planned` &nbsp; `Milestone`

| | |
|---|---|
| **Depends on** | ← #1 *Initialize Analysis Workspace* |
| **Unlocks** | ⇢ #3 *Retrieve SEC, Proxy, IR, And Earnings Sources*<br>⇢ #4 *Pull Yahoo Finance And Industry Market Data* |
| **Schedule** | 2026-03-11 → 2026-03-11 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Human decision: finalize whether the run is CRWV-only or comparative, and provide concrete comparison tickers and supplementary document paths (if any). This decision controls whether comparative tables/charts are mandatory and which document ingestion sub-steps execute.

</details>

---

### ● Task #3: Retrieve SEC, Proxy, IR, And Earnings Sources

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ⇠ #2 *Confirm Peer Scope And Supplementary Docs* |
| **Unlocks** | → #5 *Normalize Five-Year Financial Fact Base* |
| **Schedule** | 2026-03-11 → 2026-03-11 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Collect official company materials for CRWV (and each approved peer): SEC EDGAR 10-K/10-Q for 5 years, DEF 14A for insider ownership/governance, relevant Form 4 summaries, investor relations annual reports and earnings presentations, and latest earnings release/transcript references. Store raw files and link metadata in `data/processed/source-register.csv` with retrieval date and coverage period.

</details>

---

### ● Task #4: Pull Yahoo Finance And Industry Market Data

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ⇠ #2 *Confirm Peer Scope And Supplementary Docs* |
| **Unlocks** | → #5 *Normalize Five-Year Financial Fact Base* |
| **Schedule** | 2026-03-11 → 2026-03-11 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Use `curl`-based Yahoo Finance retrieval for historical prices, key statistics, and financial statement endpoints (TTM + annual history) for CRWV and approved peers. Collect external market sizing and share context from trustworthy industry sources (Gartner/IDC/Statista/public equivalents) and record exact publication dates. Store outputs in `data/raw/yahoo` and `data/raw/industry` with citations.

</details>

---

### ● Task #5: Normalize Five-Year Financial Fact Base

`Planned` &nbsp; `urgent`

| | |
|---|---|
| **Depends on** | ← #3 *Retrieve SEC, Proxy, IR, And Earnings Sources*<br>← #4 *Pull Yahoo Finance And Industry Market Data* |
| **Unlocks** | ⇢ #6 *Compute CA Score And Quant Narrative*<br>⇢ #7 *Run 7 Powers Moat Assessment*<br>⇢ #8 *Execute Anti-Fragility Core Tests* |
| **Schedule** | 2026-03-11 → ? |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Build `data/processed/fact-base.csv` and `data/processed/fact-base.md` with 5-year normalized metrics: revenue, margins, market share/TAM proxies, ARPU/pricing trend, ROIC and WACC inputs, debt/equity, current ratio, cash, FCF, insider ownership. Enforce data rules: cross-reference key metrics with at least two sources, flag estimated vs confirmed, isolate one-time items, and standardize date ranges and units.

</details>

---

### ● Task #6: Compute CA Score And Quant Narrative

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ⇠ #5 *Normalize Five-Year Financial Fact Base* |
| **Unlocks** | → #9 *Scenario Model And Thesis Synthesis*<br>→ #10 *Create Required Charts And Figure Set* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Score the four CA pillars (Market Position, Position Trend, Pricing Power, Future ROIC) on 1-5 using the moat-fragility methodology from the provided vision doc, each weighted 25%. Produce `analysis/ca-score.md` with scoring table, evidence per pillar, and a ~300-word quantitative synthesis narrative. Output machine-readable scores to `data/processed/ca-pillars.csv` and calculate total CA Score as arithmetic average.

</details>

---

### ● Task #7: Run 7 Powers Moat Assessment

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ⇠ #5 *Normalize Five-Year Financial Fact Base* |
| **Unlocks** | → #9 *Scenario Model And Thesis Synthesis*<br>→ #10 *Create Required Charts And Figure Set* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Evaluate all 7 Powers for CRWV (and peers if enabled): current strength, trajectory, durability horizon, 2-3 concrete examples per power, quantitative proxy, and erosion risk. Add moat interaction/flywheel analysis, assign moat width (None/Narrow/Wide/Very Wide), and identify primary moat powers. Write `analysis/moat-analysis.md` and structured results `data/processed/powers-assessment.csv`.

</details>

---

### ● Task #8: Execute Anti-Fragility Core Tests

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ⇠ #5 *Normalize Five-Year Financial Fact Base* |
| **Unlocks** | → #9 *Scenario Model And Thesis Synthesis*<br>→ #10 *Create Required Charts And Figure Set* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Perform anti-fragility tests: skin in the game, financial health fortress table, optionality inventory, black swan exposure matrix (with risk correlation notes). Use official filings and trustworthy sources with citations and explicit date ranges. Write `analysis/anti-fragility.md` and structured outputs in `data/processed/anti-fragility-metrics.csv`.

</details>

---

### ● Task #9: Scenario Model And Thesis Synthesis

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ← #6 *Compute CA Score And Quant Narrative*<br>← #7 *Run 7 Powers Moat Assessment*<br>← #8 *Execute Anti-Fragility Core Tests* |
| **Unlocks** | → #11 *Assemble Professional Report And Render PDF* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Build bull/base/bear scenarios with explicit assumptions and probabilities, estimate expected CA trajectory, and synthesize one-sentence investment thesis, moat durability outlook, top 3 ranked risks with early warning signals, and catalysts (12-24 months). Save outputs to `analysis/investment-thesis.md` and `data/processed/scenario-model.csv`.

</details>

---

### ● Task #10: Create Required Charts And Figure Set

`Planned` &nbsp; `high`

| | |
|---|---|
| **Depends on** | ← #6 *Compute CA Score And Quant Narrative*<br>← #7 *Run 7 Powers Moat Assessment*<br>← #8 *Execute Anti-Fragility Core Tests* |
| **Unlocks** | → #11 *Assemble Professional Report And Render PDF* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Produce report visuals with consistent palette and spacing rules: (1) Revenue & market share trend line chart, (2) ROIC vs WACC bar chart, (3) CA Score radar (4 pillars), (4) 7 Powers heatmap, plus comparative visuals if peers are enabled. Reuse high-quality charts from official filings/presentations where appropriate and recreate as SVG when necessary for clarity. Store in `charts/` and `output/report/assets/` with source attribution map `data/processed/figure-sources.csv`.

</details>

---

### ● Task #11: Assemble Professional Report And Render PDF

`Planned` &nbsp; `urgent`

| | |
|---|---|
| **Depends on** | ← #9 *Scenario Model And Thesis Synthesis*<br>← #10 *Create Required Charts And Figure Set* |
| **Unlocks** | → #12 *Human Quality Review And Sign-Off* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Compile all sections into `output/report/moat-analysis.html` following the specified professional template style, include executive summary cards, tables, chart embeds, citations with dates, and comparative section if enabled. Render `output/report/moat-analysis.pdf` via Playwright/Chrome headless and validate that layout has no clipping or overlap.

</details>

---

### ◆ Task #12: Human Quality Review And Sign-Off

`Planned` &nbsp; `Milestone`

| | |
|---|---|
| **Depends on** | ← #11 *Assemble Professional Report And Render PDF* |
| **Unlocks** | → #13 *Competitive Advantage Analysis Complete* |
| **Schedule** | 2026-03-12 → 2026-03-12 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Perform final analyst review for depth, internal consistency, scoring logic compliance, source trustworthiness, and narrative quality. Confirm the quality checklist is satisfied (all pillars, 7 powers, anti-fragility tests, scenario analysis, charts, citations, and thesis coherence). Decide whether revisions are required before completion.

</details>

---

### ◆ Task #13: Competitive Advantage Analysis Complete

`Planned` &nbsp; `Milestone`

| | |
|---|---|
| **Depends on** | ← #12 *Human Quality Review And Sign-Off* |
| **Schedule** | 2026-03-11 → 2026-03-11 |

<details>
<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>

Final milestone: comprehensive moat-fragility analysis package delivered with PDF report, chart set, and auditable source-backed fact base.

</details>

---

