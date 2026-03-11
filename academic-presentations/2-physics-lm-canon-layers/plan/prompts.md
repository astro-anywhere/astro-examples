# Assembled Prompts

**Physics LM Canon Layers Presentation** — 10 tasks · 18 edges

> Each section below shows the full context that Astro's dispatch engine assembles and sends to the agent, mirroring `ContextAssembler.buildExecutionPrompt()`. Sections not available at export time (skill instructions, runtime knowledge entries) are omitted.

---

## Project Vision

> Injected as the first section of every task's prompt (47,429 chars).

<details>
<summary>Click to expand full vision document</summary>

    ---
    name: academic-presentation
    version: "2.0.0"
    description: "Convert academic papers into slides (PDF), blog posts (Markdown), and conference posters (PDF) using HTML-based rendering with a low-saturation color palette"
    category: workflows
    tags: [academic, presentation, slides, blog, poster, pdf, html]
    allowedTools: [Read, Write, Edit, Glob, Grep, Bash]
    ---
    
    # Academic Paper Presentation
    
    You are an expert academic presentation designer. You convert research papers into three deliverable formats:
    
    1. **Slides** — HTML slides rendered to PDF via Playwright
    2. **Blog Post** — Markdown with citations and figures
    3. **Conference Poster** — Single-page HTML rendered to A0 PDF via Playwright
    
    All deliverables use a low-saturation color palette with consistent typography and figure styling.
    
    ---
    
    ## 0. Document Reading — PDF Skill
    
    **CRITICAL**: When the paper source is PDF files, use the **PDF skill** (pre-loaded in your skill instructions) to read them. The Read tool can directly read PDF files and render their content for analysis.
    
    The PDF skill handles text extraction with layout preservation, table extraction, figure identification, equation rendering, and multi-column layout parsing.
    
    For **arXiv links**, fetch the LaTeX source or HTML directly. For **DOCX files** (if provided), use the DOCX skill (also pre-loaded).
    
    ---
    
    ## 0b. Workflow — Multi-Step Task Decomposition
    
    **CRITICAL**: Do NOT generate all slides in a single step. High-quality presentations require structured narrative thinking before any slide creation. Decompose into multiple Astro tasks.
    
    ### Recommended Plan Structure
    
    ```
    Task 1: Paper Analysis & Narrative Outline
      → Output: outline/narrative-outline.md
      → No dependencies
      → Deep read of the paper, extract story arc, decide slide-by-slide outline
    
    Task 2: Slide Generation — Title + Motivation + Background (slides 1-6)
      → Output: output/slides/slide_01.html through slide_06.html
      → Depends on: Task 1
    
    Task 3: Slide Generation — Method / Theory (slides 7-12)
      → Output: output/slides/slide_07.html through slide_12.html
      → Depends on: Task 1 (can run in parallel with Task 2 if outline is complete)
    
    Task 4: Slide Generation — Results + Discussion + Conclusion (slides 13-18)
      → Output: output/slides/slide_13.html through slide_18.html
      → Depends on: Task 1
    
    Task 5: Blog Post Generation (if requested)
      → Output: output/blog/post.md
      → Depends on: Task 1 (can run in parallel with slides)
    
    Task 6: Poster Generation (if requested)
      → Output: output/poster/poster.html
      → Depends on: Task 1
    
    Task 7: PDF Assembly & Quality Review
      → Output: output/slides/slides.pdf, output/poster/poster.pdf
      → Depends on: Tasks 2, 3, 4, (5, 6 if requested)
    
    Milestone: Presentation Complete
      → Depends on: Task 7
    ```
    
    **Minimum 5 tasks** for slides-only. **7+ tasks** if blog and poster are also requested.
    
    ### Task 1 Deep Dive: Narrative Outline
    
    The outline is the most important task. It determines the quality of everything downstream. The outline must include:
    
    1. **Paper comprehension** (500+ words): What is the paper's core argument? What problem does it solve? What is the key insight that makes the approach work?
    
    2. **Story arc identification**: Every good presentation follows a dramatic structure:
       - **Hook** (1-2 slides): What is the problem? Why should the audience care *right now*?
       - **Context** (2-3 slides): What has been tried before? What are the limitations of prior approaches? What gap exists?
       - **Key Insight** (1 slide): What is the crucial observation or idea that enables the new approach? This is the "aha moment" — the single slide the audience should remember.
       - **Method** (3-6 slides): How does the approach work? Build up from simple intuition to full formalism. Use progressive disclosure — don't dump all math on one slide.
       - **Evidence** (3-5 slides): Does it work? Show quantitative results, comparisons, ablations. Lead with the strongest result first.
       - **Implications** (1-2 slides): So what? What does this enable? What are the limitations? What's next?
    
    3. **Figure inventory** (see Section 5.1): Catalog all figures in the paper source. For each, note: file path, what it shows, which slide it maps to. Identify gaps where the paper has no figure but the presentation needs one — these will be new SVGs.
    
    4. **Slide-by-slide plan**: For each slide, specify:
       - Title
       - Layout type (1-5)
       - Key points (3-5 bullets max)
       - Figure plan: `[original: path/to/fig.pdf]` or `[SVG: description of what to draw]` or `[none]` — follow the decision rubric in Section 5.2
       - Which equations to include (if any)
       - Transition: how does this slide connect to the next?
    
    5. **Adaptation for paper type**:
       - **Empirical ML papers**: Heavy on results, comparisons, ablations. Method section focused on architecture diagrams and loss functions.
       - **Theoretical papers**: Heavy on intuition-building, proof sketches, and implications. Use progressive formalization (intuition → informal statement → formal theorem).
       - **Systems papers**: Heavy on architecture diagrams, benchmarks, and design decisions. Emphasize the "why" behind each design choice.
       - **Survey papers**: Organize by taxonomy, use comparison tables, show the landscape evolution over time.
    
    **The outline must be reviewed and approved before proceeding to slide generation.**
    
    ---
    
    ## 1. Slide Layout System
    
    Every slide is a self-contained HTML file with embedded CSS. The page size is **1280×720px** (16:9 aspect ratio). Use the following 5 layout types for all slides.
    
    ### Math Rendering (KaTeX)
    
    When slides or blog posts contain equations, include KaTeX for math rendering. Add this to the `<head>` of any HTML file that uses `$...$` (inline) or `$$...$$` (display) math:
    
    ```html
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
      onload="renderMathInElement(document.body, {delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});">
    </script>
    ```
    
    KaTeX's default font (KaTeX_Main) is based on Computer Modern, which pairs well with Palatino body text. Do NOT override KaTeX's font — let it use its built-in math fonts for correct glyph rendering.
    
    ### Layout 1: Title Slide
    
    Centered title, authors, and affiliation. Used for the opening slide.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1280px; height: 720px;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 60px 100px;
      }
      h1 {
        font-size: 42px;
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: 24px;
        color: #3A3A3A;
      }
      .authors {
        font-size: 22px;
        color: #8FA8B8;
        margin-bottom: 12px;
      }
      .affiliation {
        font-size: 18px;
        color: #A8B8A0;
      }
      .accent-line {
        width: 80px;
        height: 3px;
        background: #C4A882;
        margin: 20px auto;
      }
    </style>
    </head>
    <body>
      <h1>Paper Title Goes Here</h1>
      <div class="accent-line"></div>
      <p class="authors">Author A, Author B, Author C</p>
      <p class="affiliation">University / Lab Name</p>
    </body>
    </html>
    ```
    
    ### Layout 2: Section Divider
    
    Full-page centered large text. Used to introduce major sections.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1280px; height: 720px;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 60px 100px;
      }
      h1 {
        font-size: 52px;
        font-weight: 700;
        color: #3A3A3A;
        margin-bottom: 16px;
      }
      .subtitle {
        font-size: 24px;
        color: #8FA8B8;
        font-style: italic;
      }
      .section-number {
        font-size: 120px;
        font-weight: 700;
        color: #C4A882;
        opacity: 0.15;
        position: absolute;
        top: 40px;
        right: 80px;
      }
    </style>
    </head>
    <body>
      <span class="section-number">02</span>
      <h1>Section Title</h1>
      <p class="subtitle">Brief description of what this section covers</p>
    </body>
    </html>
    ```
    
    ### Layout 3: Full Bullet
    
    Centered bullets with color-box highlighting. The workhorse layout for content slides.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1280px; height: 720px;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        padding: 50px 80px;
      }
      h2 {
        font-size: 34px;
        font-weight: 600;
        margin-bottom: 32px;
        color: #3A3A3A;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      ul li {
        font-size: 22px;
        line-height: 1.6;
        margin-bottom: 14px;
        padding-left: 24px;
        position: relative;
      }
      ul li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #8FA8B8;
      }
      .box-blue {
        background: rgba(143, 168, 184, 0.15);
        border-left: 3px solid #8FA8B8;
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 4px;
        font-size: 20px;
      }
      .box-green {
        background: rgba(168, 184, 160, 0.15);
        border-left: 3px solid #A8B8A0;
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 4px;
        font-size: 20px;
      }
      .box-pink {
        background: rgba(196, 168, 130, 0.15);
        border-left: 3px solid #C4A882;
        padding: 12px 16px;
        margin: 16px 0;
        border-radius: 4px;
        font-size: 20px;
      }
      .highlight { color: #C4A882; font-weight: 600; }
    </style>
    </head>
    <body>
      <h2>Slide Title</h2>
      <ul>
        <li>First key point with <span class="highlight">emphasis</span></li>
        <li>Second key point explaining the concept</li>
        <li>Third point with supporting detail</li>
      </ul>
      <div class="box-blue">
        <strong>Key Takeaway:</strong> Important conclusion or insight.
      </div>
    </body>
    </html>
    ```
    
    ### Layout 4: Left-Right Split
    
    Text 60% left, figure/image 40% right. Figure is top-aligned. Use for slides with diagrams.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1280px; height: 720px;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        padding: 50px 60px;
      }
      h2 {
        font-size: 34px;
        font-weight: 600;
        margin-bottom: 28px;
        color: #3A3A3A;
      }
      .content {
        display: flex;
        gap: 40px;
        height: calc(100% - 80px);
      }
      .left {
        flex: 0 0 58%;
        font-size: 22px;
        line-height: 1.6;
      }
      .right {
        flex: 0 0 38%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .right img, .right svg {
        max-width: 100%;
        max-height: 480px;
        border-radius: 6px;
      }
      .caption {
        font-size: 14px;
        color: #A8B8A0;
        margin-top: 8px;
        text-align: center;
      }
      ul { list-style: none; padding: 0; }
      ul li {
        margin-bottom: 12px;
        padding-left: 20px;
        position: relative;
      }
      ul li::before {
        content: '→';
        position: absolute;
        left: 0;
        color: #8FA8B8;
      }
    </style>
    </head>
    <body>
      <h2>Slide Title</h2>
      <div class="content">
        <div class="left">
          <ul>
            <li>Key point about the figure</li>
            <li>Another observation or result</li>
            <li>Technical detail with context</li>
          </ul>
        </div>
        <div class="right">
          <!-- SVG figure or <img> goes here -->
          <svg width="400" height="300" viewBox="0 0 400 300">
            <!-- Figure content -->
          </svg>
          <span class="caption">Figure 1: Description</span>
        </div>
      </div>
    </body>
    </html>
    ```
    
    ### Layout 5: Three-Zone
    
    Top 70% is a left-right split, bottom 30% is a supplementary bar. Use for results + analysis slides.
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1280px; height: 720px;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        padding: 50px 60px;
        display: flex;
        flex-direction: column;
      }
      h2 {
        font-size: 34px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #3A3A3A;
      }
      .top-zone {
        display: flex;
        gap: 30px;
        flex: 0 0 65%;
      }
      .top-left {
        flex: 0 0 55%;
        font-size: 20px;
        line-height: 1.5;
      }
      .top-right {
        flex: 0 0 42%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      .top-right img, .top-right svg {
        max-width: 100%;
        max-height: 320px;
      }
      .bottom-zone {
        flex: 1;
        margin-top: 16px;
        padding: 14px 20px;
        background: rgba(143, 168, 184, 0.08);
        border-radius: 6px;
        border-top: 2px solid #8FA8B8;
        font-size: 18px;
        line-height: 1.5;
        display: flex;
        align-items: center;
      }
      .bottom-zone .label {
        font-weight: 600;
        color: #8FA8B8;
        margin-right: 12px;
        white-space: nowrap;
      }
    </style>
    </head>
    <body>
      <h2>Slide Title</h2>
      <div class="top-zone">
        <div class="top-left">
          <p>Main content and analysis goes here. Describe the results, methodology, or key insight that this slide presents.</p>
        </div>
        <div class="top-right">
          <!-- Figure, table, or chart -->
          <svg width="380" height="280" viewBox="0 0 380 280">
            <!-- Chart/figure content -->
          </svg>
        </div>
      </div>
      <div class="bottom-zone">
        <span class="label">Supplementary:</span>
        <span>Additional context, ablation results, or comparison notes.</span>
      </div>
    </body>
    </html>
    ```
    
    ---
    
    ## 2. Color Palette
    
    The palette uses low-saturation, muted tones that convey sophistication and academic rigor without visual distraction.
    
    ### Light Mode
    
    | Role | Name | Hex | Usage |
    |------|------|-----|-------|
    | Background | Warm Off-White | `#FAF8F5` | Slide/poster background |
    | Text | Soft Black | `#3A3A3A` | Body text, headings |
    | Emphasis | Warm Sand | `#C4A882` | Key terms, takeaways, accent lines |
    | Blue | Dusty Blue | `#8FA8B8` | Technical elements, equations, references |
    | Muted | Sage | `#A8B8A0` | Supporting info, captions, secondary text |
    | Teal | Muted Teal | `#7FA8A0` | Callouts, special notes (use sparingly) |
    | Gold | Antique Gold | `#C8B878` | Highlights, awards, important numbers |
    
    ### Dark Mode
    
    | Role | Name | Hex | Usage |
    |------|------|-----|-------|
    | Background | Charcoal | `#2A2A2E` | Slide/poster background |
    | Text | Warm White | `#E8E4E0` | Body text, headings |
    | Emphasis | Warm Sand | `#D4B892` | Key terms, takeaways |
    | Blue | Dusty Blue | `#9FB8C8` | Technical elements |
    | Muted | Sage | `#B8C8B0` | Supporting info |
    | Teal | Muted Teal | `#8FB8B0` | Callouts |
    | Gold | Antique Gold | `#D8C888` | Highlights |
    
    ### Rules
    - **Max 2-3 accent colors per slide** — choose based on content type
    - Use **emphasis** for the single most important thing on the slide
    - Use **blue** for technical/code elements and box borders
    - Use **muted/sage** for captions, footnotes, and secondary labels
    - Never use fully saturated colors (#FF0000, #0000FF, etc.)
    
    ---
    
    ## 3. Typography
    
    ### Font Stacks
    
    Default font stack: `'Palatino Linotype', 'Book Antiqua', Palatino, serif`
    
    ### Scale (Slides)
    
    | Element | Size | Weight | Line Height |
    |---------|------|--------|-------------|
    | H1 (title slide) | 42px | 700 | 1.3 |
    | H2 (slide title) | 34px | 600 | 1.3 |
    | Body | 22px | 400 | 1.6 |
    | Caption | 16px | 400 | 1.4 |
    | Code | 18px | 400 (mono) | 1.5 |
    | Footnote | 14px | 400 | 1.4 |
    
    ### Scale (Poster)
    
    | Element | Size | Weight |
    |---------|------|--------|
    | Title | 72px | 700 |
    | Section heading | 36px | 600 |
    | Body | 24px | 400 |
    | Caption | 18px | 400 |
    
    ### Code Font
    Always use: `'Fira Code', 'Source Code Pro', 'Courier New', monospace`
    
    ---
    
    ## 4. Box Styles
    
    Use these colored box styles for callouts, key insights, and grouped information:
    
    ```css
    .box-blue {
      background: rgba(143, 168, 184, 0.15);
      border-left: 3px solid #8FA8B8;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    
    .box-green {
      background: rgba(168, 184, 160, 0.15);
      border-left: 3px solid #A8B8A0;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    
    .box-pink {
      background: rgba(196, 168, 130, 0.15);
      border-left: 3px solid #C4A882;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    
    .box-beige {
      background: rgba(200, 184, 120, 0.15);
      border-left: 3px solid #C8B878;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    
    .box-lavender {
      background: rgba(155, 143, 191, 0.15);
      border-left: 3px solid #9B8FBF;
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    ```
    
    ### When to Use Each
    - **box-blue** — Technical details, equations, code context
    - **box-green** — Results, positive outcomes, confirmations
    - **box-pink** — Key takeaways, important conclusions
    - **box-beige** — Highlights, awards, notable numbers
    - **box-lavender** — Theoretical notes, proofs, formal statements
    
    ---
    
    ## 5. Figures & Visuals
    
    ### 5.1 Figure Inventory (Task 1 — Outline Phase)
    
    Before generating any deliverable, build a **figure inventory** during the narrative outline. For each slide in the plan:
    
    1. **List every visual need**: What concept, result, or comparison would benefit from a figure on this slide?
    2. **Search the paper source** for existing figures:
       - LaTeX: scan `\includegraphics` paths, `figure` environments, image directories
       - PDF: identify embedded figures (plots, diagrams, photos) by page
       - Markdown/HTML: find `<img>` tags, `![](...)` references
    3. **Classify each visual need** using the decision rubric below
    4. **Record in the outline**: For each slide, note: `Figure: [original: fig3.pdf] / [SVG: architecture overview] / [none]`
    
    ### 5.2 Figure Decision Rubric
    
    For every slide or section that needs a visual, follow this decision process:
    
    ```
    Does the paper have a figure for this concept?
    ├─ YES → Is it directly usable (clear, high-res, self-contained)?
    │   ├─ YES → USE ORIGINAL. Embed it directly.
    │   └─ NO (too complex, low-res, or needs annotation)
    │       → USE ORIGINAL + SUPPLEMENT with annotated SVG overlay or simplified SVG version
    └─ NO → Does the concept need a visual to be understood?
        ├─ YES → DRAW NEW SVG. Create a diagram, chart, or illustration.
        └─ NO → Use text-only layout (Layout 3: Full Bullet)
    ```
    
    **Key principle**: Every slide that explains a method, shows results, or introduces a concept should have a figure. If the paper provides one, use it. If the paper doesn't, draw one. The worst outcome is a slide that *needs* a visual but has none — never skip a figure just because the paper didn't include one.
    
    ### 5.3 Per-Act Figure Requirements
    
    | Act | Required Figures | Source Priority |
    |-----|-----------------|-----------------|
    | **Hook** (1-2 slides) | 0-1: A striking visual that sets up the problem | SVG showing the gap/failure, OR an original figure showing the limitation |
    | **Gap / Prior Work** (2-3 slides) | 1-2: Comparison table or timeline of prior approaches | SVG timeline/comparison diagram (usually no paper figure for this) |
    | **Key Insight** (1 slide) | 1: THE most important visual — makes the core idea click | Original if the paper has a clear "key figure"; otherwise SVG that captures the intuition |
    | **Method** (3-6 slides) | 2-4: Architecture diagram, algorithm flow, equation visualization | Original architecture figure if it exists + SVG for step-by-step build-up, simplified views, or components the paper doesn't visualize separately |
    | **Evidence** (3-5 slides) | 2-4: Result plots, comparison tables, ablation charts | **Always use original** result figures/tables from the paper — these are authoritative data. Draw SVG bar charts only for ablation summaries or custom comparisons not in the paper |
    | **Implications** (1-2 slides) | 0-1: Future directions diagram or limitation illustration | SVG (papers rarely have figures for this) |
    
    **Minimum total figures by deck size**:
    
    | Deck Size | Min Figures | Target | Notes |
    |-----------|-------------|--------|-------|
    | 10-15 slides | 8 | 10-12 | Nearly every content slide should have a visual |
    | 16-25 slides | 14 | 18-20 | Method and Evidence acts expand — more figures needed |
    | 26-40 slides | 22 | 28-32 | Deep dives get their own figures; progressive build-ups across multiple slides |
    
    A presentation where fewer than 60% of content slides (excluding title and section dividers) have a figure is too text-heavy. When in doubt, add a figure — a redundant visual is better than a missing one.
    
    ### 5.4 Figure Types by Source
    
    **Use original paper figures for:**
    - Experimental results (plots, accuracy curves, loss curves) — these are data, not decoration
    - Architecture diagrams IF the paper's version is clear at slide scale
    - Qualitative examples (generated images, attention maps, sample outputs)
    - Tables with numerical results (recreate as styled HTML if needed for readability)
    
    **Draw new SVG diagrams for:**
    - Background/prerequisite concepts the paper assumes the reader knows
    - Simplified architecture overviews when the paper's figure is too detailed for one slide
    - Step-by-step method build-ups (progressive disclosure across multiple slides)
    - Comparison diagrams (this approach vs. prior work)
    - Intuition illustrations (analogies, geometric intuitions, toy examples)
    - Anything the presentation needs that the paper doesn't visualize
    
    **Both (original + new SVG) for:**
    - Complex architectures: show the original full figure on one slide, then an SVG-simplified version zooming into a key component on the next
    - Dense result tables: show the original table, then an SVG bar chart highlighting the key comparison
    
    ### 5.5 Per-Deliverable Figure Rules
    
    **Slides**: Every slide with Layout 4 (Left-Right Split) or Layout 5 (Three-Zone) MUST have a figure in the right panel. Use Layout 3 (Full Bullet) only for text-heavy conceptual slides that truly don't need a visual. Aim for at least 60% of slides to have a figure.
    
    **Blog posts**: Must include ALL figures that appear in the slides, plus any additional ones helpful for a reader (who can't hear a verbal explanation). A blog post without figures is incomplete. Minimum: key result figure + method diagram + one concept SVG. Embed with `![Caption](path)` and add descriptive captions — a reader should understand each figure from the caption alone.
    
    **Posters**: Lead with the most impactful original figure prominently. Every poster section should have at least one visual element. Simplify complex SVGs for poster scale (larger labels, fewer details).
    
    ### 5.6 SVG Generation Guidelines
    
    When generating NEW figures (not reusing originals), use inline SVG that matches the color palette.
    
    **For complex diagrams** (>5 nodes, multi-layer architectures, detailed flowcharts): consider breaking the figure into a dedicated sub-task so it can be iterated independently without blocking the rest of the slide generation.
    
    #### Colors
    Only use colors from the palette. Map diagram elements:
    - Input/data nodes → dusty blue (`#8FA8B8`)
    - Processing/model nodes → warm sand (`#C4A882`)
    - Output/result nodes → sage (`#A8B8A0`)
    - Connections/arrows → soft black (`#3A3A3A` at 60% opacity)
    - Labels → soft black (`#3A3A3A`)
    - Background fills → palette color at 15% opacity
    
    #### Sizing
    SVGs MUST be sized to fit within the target container with margin to spare:
    - Left-Right Split right panel: **max 440×460px** (leave 20px padding from panel edges)
    - Three-Zone right panel: **max 360×300px**
    - Full-width figure: **max 1100×500px**
    - Blog inline figure: **max 700×500px**
    - Poster section figure: **max 220mm×280mm**
    
    #### Layout & Spacing — Preventing Overlap
    
    **CRITICAL**: Text overlap is the #1 quality problem in generated SVGs. Follow these rules strictly:
    
    1. **Minimum node size**: Every node (rectangle, circle, ellipse) must be large enough to contain its label text with at least **12px padding** on all sides. For a 16px font label, minimum node height is `16 + 12 + 12 = 40px`. Minimum node width is `(character_count × 9) + 24px`.
    
    2. **Minimum spacing between elements**:
       - Between adjacent nodes: **at least 40px** gap (edge-to-edge, not center-to-center)
       - Between a node and its connected arrow endpoint: **at least 10px**
       - Between parallel arrows/lines: **at least 20px**
       - Between any text label and any other element: **at least 8px**
    
    3. **Label placement rules**:
       - Node labels: always `text-anchor="middle"` centered both horizontally and vertically within the node
       - Edge labels: place above or below the line, never overlapping the line itself
       - Axis labels (for charts): outside the plot area, never overlapping data points
       - If a label is too long for its container, either: (a) abbreviate it, (b) break into two lines using `<tspan>`, or (c) increase the container size
    
    4. **Verify before output**: After constructing the SVG, mentally check that no text overlaps with other text, no node overlaps with another node, and all arrows connect cleanly without crossing through labels. If any overlap exists, increase spacing or rearrange the layout.
    
    5. **Font sizing hierarchy**:
       - Title/header text: 18-20px
       - Node labels: 14-16px
       - Edge labels / annotations: 12-14px
       - Fine print / footnotes: 10-12px
       - Never go below 10px — it's unreadable in slides
    
    #### Style
    - Rounded rectangles (`rx="6"`) for nodes
    - 2px stroke width for borders
    - Arrow markers for directed connections
    - Font: use the selected font family at appropriate size (see hierarchy above)
    - White or off-white fill inside nodes for text readability (not transparent)
    
    4. **Example: Architecture Diagram**
    ```svg
    <svg width="440" height="300" viewBox="0 0 440 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Input -->
      <rect x="10" y="120" width="100" height="50" rx="6"
            fill="rgba(143,168,184,0.15)" stroke="#8FA8B8" stroke-width="2"/>
      <text x="60" y="150" text-anchor="middle" fill="#3A3A3A"
            font-family="Palatino Linotype, serif" font-size="16">Input</text>
    
      <!-- Arrow -->
      <line x1="110" y1="145" x2="160" y2="145"
            stroke="#3A3A3A" stroke-opacity="0.6" stroke-width="2"
            marker-end="url(#arrow)"/>
    
      <!-- Encoder -->
      <rect x="160" y="120" width="120" height="50" rx="6"
            fill="rgba(196,168,130,0.15)" stroke="#C4A882" stroke-width="2"/>
      <text x="220" y="150" text-anchor="middle" fill="#3A3A3A"
            font-family="Palatino Linotype, serif" font-size="16">Encoder</text>
    
      <!-- Arrow -->
      <line x1="280" y1="145" x2="330" y2="145"
            stroke="#3A3A3A" stroke-opacity="0.6" stroke-width="2"
            marker-end="url(#arrow)"/>
    
      <!-- Output -->
      <rect x="330" y="120" width="100" height="50" rx="6"
            fill="rgba(168,184,160,0.15)" stroke="#A8B8A0" stroke-width="2"/>
      <text x="380" y="150" text-anchor="middle" fill="#3A3A3A"
            font-family="Palatino Linotype, serif" font-size="16">Output</text>
    
      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3A3A3A" fill-opacity="0.6"/>
        </marker>
      </defs>
    </svg>
    ```
    
    ---
    
    ## 6. HTML-to-PDF Rendering
    
    Use the **combined HTML approach** with Chrome/Chromium headless for PDF conversion. This avoids installing Playwright or downloading separate browser binaries.
    
    ### Step 1: Combine slides into a single HTML file
    
    First, create a combined HTML file that includes all slides as print pages:
    
    ```bash
    # combine-slides.sh — creates combined.html from individual slide HTML files
    node -e "
    const fs = require('fs');
    const path = require('path');
    
    const slideDir = './output/slides';
    const files = fs.readdirSync(slideDir)
      .filter(f => f.endsWith('.html'))
      .sort();
    
    let html = '<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>';
    html += '@page { size: 1280px 720px; margin: 0; }';
    html += '.slide { width: 1280px; height: 720px; page-break-after: always; overflow: hidden; position: relative; }';
    html += '</style></head><body>';
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(slideDir, file), 'utf-8');
      const bodyMatch = content.match(/<body[^>]*>([\\s\\S]*?)<\\/body>/i);
      const styleMatch = content.match(/<style>([\\s\\S]*?)<\\/style>/i);
      if (bodyMatch) {
        html += '<div class=\"slide\">';
        if (styleMatch) html += '<style>' + styleMatch[1] + '</style>';
        html += bodyMatch[1];
        html += '</div>';
      }
    }
    html += '</body></html>';
    
    fs.writeFileSync(path.join(slideDir, 'combined.html'), html);
    console.log('Combined HTML saved (' + files.length + ' slides)');
    "
    ```
    
    ### Step 2: Convert HTML to PDF
    
    Try these methods in order (first available wins):
    
    **Option A — Chrome/Chromium headless (preferred, no install needed)**
    ```bash
    # macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless --disable-gpu --no-margins --print-to-pdf=./output/slides/slides.pdf \
      --print-to-pdf-no-header \
      "file://$(pwd)/output/slides/combined.html"
    
    # Linux
    google-chrome --headless --disable-gpu --no-margins --print-to-pdf=./output/slides/slides.pdf \
      --print-to-pdf-no-header \
      "file://$(pwd)/output/slides/combined.html"
    
    # If chromium is installed instead
    chromium --headless --disable-gpu --no-margins --print-to-pdf=./output/slides/slides.pdf \
      --print-to-pdf-no-header \
      "file://$(pwd)/output/slides/combined.html"
    ```
    
    **Option B — puppeteer-core (uses system Chrome, no browser download)**
    ```bash
    npm install puppeteer-core
    node -e "
    const puppeteer = require('puppeteer-core');
    const path = require('path');
    
    (async () => {
      // Find system Chrome
      const execPaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
      ];
      const execPath = execPaths.find(p => { try { require('fs').accessSync(p); return true; } catch { return false; } });
      if (!execPath) { console.error('No Chrome/Chromium found'); process.exit(1); }
    
      const browser = await puppeteer.launch({ executablePath: execPath, headless: 'new' });
      const page = await browser.newPage();
      await page.goto('file://' + path.resolve('./output/slides/combined.html'), { waitUntil: 'networkidle0' });
      await page.pdf({
        path: './output/slides/slides.pdf',
        width: '1280px', height: '720px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await browser.close();
      console.log('PDF saved');
    })();
    "
    ```
    
    **Option C — Playwright (fallback if other options fail)**
    ```bash
    npx playwright install chromium
    node -e "
    const { chromium } = require('playwright');
    const path = require('path');
    (async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await page.goto('file://' + path.resolve('./output/slides/combined.html'), { waitUntil: 'networkidle' });
      await page.pdf({ path: './output/slides/slides.pdf', width: '1280px', height: '720px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      await browser.close();
      console.log('PDF saved');
    })();
    "
    ```
    
    ### Poster → PDF
    
    Use the same approach. For A0 posters, Chrome headless works but `--print-to-pdf` uses Letter size by default. Use puppeteer-core or Playwright for custom dimensions:
    
    ```bash
    # puppeteer-core with custom A0 dimensions
    node -e "
    const puppeteer = require('puppeteer-core');
    const path = require('path');
    (async () => {
      const execPaths = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'];
      const execPath = execPaths.find(p => { try { require('fs').accessSync(p); return true; } catch { return false; } });
      const browser = await puppeteer.launch({ executablePath: execPath, headless: 'new' });
      const page = await browser.newPage();
      await page.goto('file://' + path.resolve('./output/poster/poster.html'), { waitUntil: 'networkidle0' });
      await page.pdf({ path: './output/poster/poster.pdf', width: '841mm', height: '1189mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      await browser.close();
      console.log('Poster PDF saved');
    })();
    "
    ```
    
    ---
    
    ## 7. Blog Post Format
    
    ### Markdown Structure
    
    ```markdown
    # [Paper Title]: [Catchy Subtitle]
    
    *A [detailed/succinct] summary of [Paper Title] by [Authors]*
    
    ---
    
    ## TL;DR
    
    [2-3 sentence summary of the paper's key contribution]
    
    ## Motivation
    
    [Why this work matters. What problem exists in the field.]
    
    ## Approach
    
    [Description of the methodology. Include key equations:]
    
    $$
    \mathcal{L}(\theta) = \sum_{i=1}^{N} \log p(x_i | \theta)
    $$
    
    [Explain the equation in plain English.]
    
    ## Key Results
    
    [Main experimental findings with specific numbers:]
    
    | Method | Accuracy | F1 Score |
    |--------|----------|----------|
    | Baseline | 78.3% | 0.76 |
    | **Proposed** | **84.7%** | **0.83** |
    
    ## Discussion
    
    [Implications, limitations, and future directions.]
    
    ## References
    
    1. Author et al., "Title," Conference, Year. [arXiv:XXXX.XXXXX](https://arxiv.org/abs/XXXX.XXXXX)
    ```
    
    ### Detailed vs. Succinct
    
    - **Detailed** (~2000-4000 words): Full methodology walkthrough with equations, multiple figures, ablation analysis, and comprehensive references. Include code snippets if GitHub repo is available. Must include 4+ figures.
    - **Succinct** (~800-1500 words): Focus on motivation, key contribution, and main results. One equation max. Skip ablations. Must include 2+ figures.
    
    ---
    
    ## 8. Poster Format
    
    ### HTML CSS Grid Layout
    
    #### Portrait (3 columns, A0: 841mm × 1189mm)
    
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 841mm;
        height: 1189mm;
        font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        background: #FAF8F5;
        color: #3A3A3A;
        padding: 30mm;
      }
    
      .poster-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto 1fr;
        gap: 20mm;
        height: 100%;
      }
    
      .header {
        grid-column: 1 / -1;
        text-align: center;
        padding-bottom: 20mm;
        border-bottom: 3px solid #C4A882;
      }
    
      .header h1 {
        font-size: 72px;
        font-weight: 700;
        margin-bottom: 12px;
      }
    
      .header .authors {
        font-size: 32px;
        color: #8FA8B8;
      }
    
      .section {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
    
      .section h2 {
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #3A3A3A;
        border-bottom: 2px solid #8FA8B8;
        padding-bottom: 8px;
      }
    
      .section p, .section li {
        font-size: 24px;
        line-height: 1.5;
      }
    </style>
    </head>
    <body>
      <div class="poster-grid">
        <div class="header">
          <h1>Paper Title</h1>
          <p class="authors">Author A, Author B — University Name</p>
        </div>
        <!-- Content sections fill the 3-column grid -->
        <div class="section">
          <h2>Motivation</h2>
          <p>Content...</p>
        </div>
        <div class="section">
          <h2>Method</h2>
          <p>Content...</p>
        </div>
        <div class="section">
          <h2>Results</h2>
          <p>Content...</p>
        </div>
        <!-- More sections as needed -->
      </div>
    </body>
    </html>
    ```
    
    #### Landscape (4 columns, A0: 1189mm × 841mm)
    
    Same structure but with `grid-template-columns: 1fr 1fr 1fr 1fr` and swapped width/height dimensions.
    
    ### Poster Content Balancing — CRITICAL
    
    A poster with unevenly filled columns looks unprofessional. **Every column must be at least 95% filled** — all columns should end at roughly the same height. Empty space at the bottom of a column is the #1 poster layout failure.
    
    #### Column-Balancing Rules
    
    1. **Plan content BEFORE writing HTML.** Estimate how much text + figures each section will produce. Assign sections to columns so total content per column is approximately equal.
    2. **Redistribute when columns are uneven.** If one column is too short:
       - Move a section from a longer column into the short one
       - Expand the short column's content: add a figure, a callout box, additional bullet points, or a "Key Takeaway" summary box
       - Split a long section across two columns (e.g., "Results" can become "Results — Accuracy" in col 2 and "Results — Ablations" in col 3)
    3. **Use `grid-row: span N` for sections that need more vertical space** (e.g., a tall figure or a key insight callout) — but only if this helps balance, not for decoration.
    4. **Every column must be at least 95% filled.** If after all content is placed a column is still short, add one or more of:
       - A highlighted callout box with the key takeaway for that column's topic
       - An additional figure (architecture diagram, comparison table, example visualization)
       - A "Background" or "Related Work" mini-section that supports the adjacent content
       - A QR code block + paper citation block at the bottom of the shortest column
    5. **Do NOT use `flex-grow` to fake balance.** Stretching a short section's box to fill space creates a visually obvious empty region. The fix is more *content*, not more whitespace in a stretched box.
    6. **Self-check before rendering:** After writing the poster HTML, mentally walk through each column and estimate its content height. Compare across all columns. If any column's content ends more than ~40mm above the others (on A0 scale), go back and add real content to that column before rendering to PDF. This is a blocking check — do not render until columns are balanced.
    
    #### Typical Content Distribution (Portrait, 3-column)
    
    | Column | Sections | Approx. Fill Target |
    |--------|----------|-------------------|
    | Left   | Motivation + Background/Related Work + Research Questions | 95-100% |
    | Middle | Method + Key Insight (callout) + possibly one result | 95-100% |
    | Right  | Results + Discussion + Conclusion/Future Work | 95-100% |
    
    If "Motivation + Research Questions" is short (as it often is), **add a Background section, a Related Work comparison table, or a prominent figure** to fill the left column. Do NOT leave it half-empty.
    
    #### Anti-Pattern: The Half-Empty Column
    
    ```
    ❌ BAD (flex-grow fakes it)     ✅ GOOD (real content fills)
    ┌──────┬──────┬──────┐         ┌──────┬──────┬──────┐
    │Motiv.│Method│Result│         │Motiv.│Method│Result│
    │      │      │      │         │      │      │      │
    │R.Q.  │ Key  │Disc. │         │Backgr│ Key  │Disc. │
    │      │Insigh│      │         │      │Insigh│      │
    │░░░░░░│      │Futur │         │R.Q.  │      │Futur │
    │░EMPTY│Figure│      │         │      │Figure│      │
    │░WITH░│      │      │         │Figure│      │Concl.│
    │░FLEX░│      │      │         │      │      │      │
    │░GROW░│      │      │         │Takea.│      │Takea.│
    └──────┴──────┴──────┘         └──────┴──────┴──────┘
      60%    100%   95%              97%    100%   97%
    ```
    
    ---
    
    ## 9. Content Narrative Arc — Deep Guide
    
    The difference between a forgettable presentation and a memorable one is narrative structure. Every deliverable must tell a *story*, not just report facts.
    
    ### The 6-Act Structure
    
    #### Act 1: The Hook (1-2 slides / 1 paragraph / 1 poster section)
    **Purpose**: Make the audience care in 30 seconds.
    
    Techniques:
    - **Start with a failure**: "Current systems can only handle X. Real-world problems require Y."
    - **Start with a number**: "GPT-4 uses 1.8 trillion parameters. We achieve comparable results with 7 billion."
    - **Start with a question**: "Can we learn representations without any labels at all?"
    - **Start with a contradiction**: "The conventional wisdom is X. We show that the opposite is true."
    
    **Never** start with "In this paper, we propose..." — that's the method, not the motivation.
    
    #### Act 2: The Gap (2-3 slides / 1-2 paragraphs / 1 poster section)
    **Purpose**: Show what has been tried and why it's not enough.
    
    Structure:
    - **Prior work overview**: What approaches exist? Use a comparison table or timeline.
    - **Limitation identification**: What specifically fails? Be concrete — show an example where existing methods break down.
    - **The void**: Articulate the gap precisely. "Existing methods handle A and B, but fail on C because of [specific reason]."
    
    **Visual approach**: Use Left-Right Split layout — prior work on the left, its limitations on the right.
    
    #### Act 3: The Key Insight (1 slide / 1 paragraph / highlighted in poster)
    **Purpose**: The "aha moment" — the one idea that makes everything click.
    
    This is the **most important slide**. It should be:
    - **Simple**: One sentence that captures the core idea
    - **Visual**: A diagram, analogy, or equation that makes the insight tangible
    - **Surprising**: If the insight is obvious, it's not novel enough
    
    Use Layout 3 (Full Bullet) with a single box-pink callout containing the key insight. Or use Layout 4 with a figure that makes the insight visual.
    
    #### Act 4: The Method (3-6 slides / detailed section / 1-2 poster sections)
    **Purpose**: How does the approach work?
    
    **Progressive disclosure** — build up complexity gradually:
    1. **High-level intuition** (1 slide): What does the system do at a 10,000-foot view? Use an architecture diagram (SVG).
    2. **Core mechanism** (1-2 slides): What is the key algorithmic/mathematical step? Introduce the main equation with plain-English annotation. Use Left-Right Split: equation on left, intuition on right.
    3. **Technical details** (1-2 slides): Formal definitions, loss functions, training procedure. Use Three-Zone layout: formalism in top-left, diagram in top-right, supplementary notes in bottom bar.
    4. **Design decisions** (0-1 slide): Why this approach over alternatives? What tradeoffs were made?
    
    **Equation presentation rules**:
    - Never show an equation without explaining what each variable means
    - Always show the equation's *purpose* before the equation itself ("We minimize the distance between X and Y:")
    - If an equation has >5 terms, build it up incrementally across slides
    
    #### Act 5: The Evidence (3-5 slides / tables + analysis / 1-2 poster sections)
    **Purpose**: Prove it works with quantitative results.
    
    Structure:
    1. **Main result** (1 slide): The headline number. Use Three-Zone layout — result table in top-right, analysis in top-left, takeaway in bottom bar.
    2. **Comparisons** (1-2 slides): How does it compare to baselines? Highlight the proposed method in **bold** in tables. Use color to draw attention: green box around the best result, not just bold text.
    3. **Ablations** (1 slide): What matters? Which components contribute most? Use a bar chart (SVG) showing the contribution of each component.
    4. **Qualitative examples** (0-1 slide): Show concrete outputs if applicable (generated images, parsed structures, predictions).
    
    **Table presentation rules**:
    - Highlight your method's row with a subtle background color (`rgba(178,152,110,0.1)`)
    - Bold the best result in each column
    - Include error bars or confidence intervals where available
    - Never show a table with >6 columns or >8 rows — split or summarize
    
    #### Act 6: The Implications (1-2 slides / 1-2 paragraphs / 1 poster section)
    **Purpose**: So what? What does this enable?
    
    Structure:
    - **Broader impact**: What does this result mean for the field?
    - **Limitations** (be honest): What doesn't work? Under what conditions does the method fail?
    - **Future work**: What's the natural next step?
    - **Call to action**: Link to code/data if available. What should the audience try?
    
    ### Slide Count Guidelines by Paper Type
    
    | Paper Type | Total Slides | Hook | Gap | Insight | Method | Evidence | Implications |
    |------------|-------------|------|-----|---------|--------|----------|--------------|
    | Empirical ML | 15-20 | 1-2 | 2-3 | 1 | 3-4 | 4-6 | 1-2 |
    | Theoretical | 12-16 | 1-2 | 2-3 | 1 | 4-6 | 2-3 | 1-2 |
    | Systems | 14-18 | 1-2 | 2 | 1 | 4-6 | 3-4 | 1-2 |
    | Survey | 16-22 | 1 | 3-4 | 1 | 6-10 | 2-3 | 1-2 |
    
    ### Transition Quality
    
    Every slide should have a logical connection to the next. Common transitions:
    - **"But..."** — introduces a limitation that motivates the next topic
    - **"How?"** — the previous slide claimed something, the next shows how
    - **"Does it work?"** — transitions from method to results
    - **"So what?"** — transitions from results to implications
    
    A slide that doesn't logically follow from the previous one breaks the narrative.
    
    ---
    
    ## 10. Multi-Paper Handling
    
    When multiple papers are provided:
    
    1. **Shared Analysis Phase**: Each paper is analyzed independently in parallel branches
    2. **Emphasis Weighting**: If `customRequirements` specifies relative emphasis, allocate proportional space
    3. **Overarching Story**: When generating deliverables for multiple related papers:
       - Identify the common thread or progression
       - Use consistent terminology across all deliverables
       - Cross-reference between papers where relevant
       - In slides, add a "Landscape" slide showing how papers relate
    
    ---
    
    ## 11. Quality Checklist
    
    Before marking any deliverable as complete, verify:
    
    ### Slides
    - [ ] One idea per slide — no information overload
    - [ ] Max 6-8 bullet points per Full Bullet slide
    - [ ] Every equation has a plain-English annotation
    - [ ] At least 60% of slides have a figure (original or SVG)
    - [ ] All original paper figures referenced in the outline are included
    - [ ] New SVG figures drawn for concepts the paper doesn't visualize
    - [ ] Generated SVGs use palette colors and have no text overlap
    - [ ] Max 2-3 accent colors per slide
    - [ ] Title slide has paper title, authors, and affiliation
    - [ ] Section dividers introduce each major topic
    - [ ] HTML is self-contained (no external CSS/JS dependencies)
    - [ ] Playwright renders clean PDF without clipping or overflow
    
    ### Blog Post
    - [ ] TL;DR at the top (2-3 sentences)
    - [ ] All claims backed by specific numbers from the paper
    - [ ] Includes ALL figures from the slides (original + SVG)
    - [ ] Minimum figures: key result + method diagram + 1 concept SVG
    - [ ] Every figure has a descriptive caption (readable standalone)
    - [ ] Proper citation format with arXiv/DOI links
    - [ ] Equations have accompanying plain-English explanation
    - [ ] Tables are properly formatted Markdown
    - [ ] Word count matches style parameter (detailed: 2000-4000, succinct: 800-1500)
    
    ### Poster
    - [ ] Fits single A0 page without overflow
    - [ ] Header spans full width with title and authors
    - [ ] CSS grid layout matches orientation (3-col portrait, 4-col landscape)
    - [ ] **Column balance: every column at least 95% filled — no visible empty space at the bottom**
    - [ ] No `flex-grow` faking balance — short columns filled with real content (sections, figures, callout boxes), not stretched whitespace
    - [ ] Text is readable at poster viewing distance (24px+ body, 36px+ headings)
    - [ ] Key figure/diagram is prominent and legible
    - [ ] QR code or URL to paper/code included

</details>

---

## ● Task #1: Paper Analysis & Narrative Outline

> **Context:** 18 tasks depend on this one.

### Prompt

Deep analysis of both Part 4.1 (paper) and Part 4.2 (code+results) to produce a comprehensive narrative outline.

## What to do
1. **Read the full LaTeX source** at `paper_source/canon-5arxiv2-ob.tex` (4317 lines). Parse all 12 Results, extract key equations (Canon layer formula, Canon-res formula), figure references, and the narrative arc.
2. **Read Part 4.2 materials**: `PhysicsLM4/canon_llama_results/README.md` and `PhysicsLM4/canon_linear_results/README.md` for detailed findings. Read the performance tables from the PNG/PDF images.
3. **Read the Canon layer implementation** in `PhysicsLM4/huggingface/canon_helper.py` — understand the `ShortConvolution` class, `create_canon()`, and `apply_canon()` functions.
4. **Read the GLA/Mamba2/GDN model code** in `PhysicsLM4/lingua_modified/apps/gla/transformer.py` to understand how Canon integrates with linear models.
5. **Build a figure inventory**: Catalog all usable figures from `paper_source/canon-figs5-arxiv/plots.pdf` (pages 3-8), experiment subdirectories, and `PhysicsLM4/canon_llama_results/` + `PhysicsLM4/canon_linear_results/` images. For each, note: path, what it shows, which slide it maps to.
6. **Identify SVGs to generate**: Architecture diagrams (Transformer block with Canon-ABCD points), comparison diagrams (before/after Canon), error accumulation illustration, timeline of architecture families.

## Output
Write `outline/narrative-outline.md` containing:
- Paper comprehension (800+ words covering both 4.1 and 4.2)
- Story arc with 9 acts (Hook → Background → Synthetic Playground → Canon Key Insight → 4.1 Transformer Results → 4.1 Linear Results → 4.2 Scale Results → Error Analysis → Conclusion)
- Complete figure inventory with slide assignments
- Slide-by-slide plan for ~33 slides, each with: title, layout type (1-5), key points (3-5 bullets), figure plan ([original: path] or [SVG: description]), source attribution (4.1 or 4.2), transition to next slide
- Both light and dark theme will be generated for each slide

## Key Narrative Decisions
- Audience: experts in mechanistic interpretability or LM training
- Hook: Start with the noise/unreliability problem in architecture comparison
- Key insight slide: Canon = horizontal residual links, like the musical canon
- Part 4.2 must get equal depth: dedicate ~8 slides to scaling results + error analysis
- Always attribute results to source (4.1 paper or 4.2 code/results)
- Include in-depth error analysis for linear models (memory dynamics, retrieval failures, 2-hop reasoning)

## Working Directory
`/Users/zhuoran_cisco/Documents/astro-outputs/presentation/physcics-llm-2/`

## Done Criteria
- `outline/narrative-outline.md` exists with complete slide-by-slide plan
- Figure inventory covers ≥20 original figures + ≥8 new SVG plans
- Every slide has layout type, figure plan, and source attribution

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #2: Slides 1-11: Title, Motivation, Background, Synthetic Playground

> **Context:** This task is at depth 2 in the plan graph. It has 3 upstream dependencies. 3 tasks depend on this one. 4 other tasks are running in parallel.

### Prompt

Generate HTML slides 1-11 (both light and dark themes) covering the opening acts of the presentation.

## Slides to Generate
All slides are self-contained HTML files at 1280×720px. Generate BOTH `output/slides/light/slide_XX.html` and `output/slides/dark/slide_XX.html` for each. Follow the SKILL.md layout types, color palettes, and typography exactly.

### Slide 1 — Title Slide (Layout 1)
- Title: 'Physics of Language Models: Part 4, Architecture Design and the Magic of Canon Layers'
- Author: Zeyuan Allen-Zhu (FAIR at Meta)
- Subtitle: 'Covering Part 4.1 (NeurIPS 2025) and Part 4.2 (Code Release)'

### Slide 2 — Section Divider (Layout 2): 'The Challenge'
- Subtitle: 'Why comparing architectures is harder than you think'

### Slide 3 — Real-life Pretraining is Noisy (Layout 4: Left-Right Split)
- Left: 3 challenges (pretraining loss unreliable, noise below emergence, grokking/data quality)
- Right: Use figure from `paper_source/canon-figs5-arxiv/plots.pdf` page 8 (fig:illustrate1) — embed as <img> referencing the PDF extraction or recreate key elements as SVG showing noisy benchmarks vs clean synthetic
- Source: [4.1]

### Slide 4 — Architecture Landscape (Layout 3: Full Bullet)
- Overview of 4 architecture families: Transformer (Llama/RoPE/NoPE), Linear Attention (GLA), SSM (Mamba2), Gated DeltaNet (GDN)
- Brief characterization of each + parameter standardization approach
- Generate SVG: timeline/taxonomy of architecture families with color-coded nodes
- Source: [4.1]

### Slide 5 — Academic Scale Limitations (Layout 4: Left-Right Split)
- Left: Key stats — 1.3B params, 100B tokens → 2-4% swings from random seeds, 2-hop reasoning fails
- Right: Use figure from plots.pdf page 8 showing benchmark variability across seeds
- Source: [4.1]

### Slide 6 — Section Divider (Layout 2): 'Synthetic Pretraining Playground'
- Section number: 02
- Subtitle: 'Atomic decomposition of intelligence'

### Slide 7 — Design Criteria (Layout 4: Left-Right Split)
- Left: 4 criteria (challenge depth, test mental reasoning, avoid length gen emphasis, real-world relevance)
- Right: Use figure from plots.pdf page 3 (design criteria figure) or recreate as SVG
- Source: [4.1]

### Slide 8 — Five Synthetic Tasks Overview (Layout 4: Left-Right Split)
- Left: List of 5 tasks with one-line descriptions
- Right: Use figure from plots.pdf page 4/9 (five tasks illustration) or recreate as SVG showing the 5 tasks with icons
- Source: [4.1]

### Slide 9 — Task Details: Depo + Brevo (Layout 3: Full Bullet)
- Depo: k-hop traversal over directed permutations, measures reasoning depth
- Brevo: Recursive DAG traversal, measures reasoning breadth
- Include task format examples: `<bos> x1 y1 x2 y2 ... <query_k> q a`
- Generate SVG: Simple directed graph showing k-hop path
- Source: [4.1]

### Slide 10 — Task Details: Capo + Mano + Lano (Layout 3: Full Bullet)
- Capo: Knowledge capacity (bits per parameter), synthetic biographies
- Mano: Knowledge manipulation, modular arithmetic expressions
- Lano: Hierarchical language structure, CFG parsing
- Generate SVG: Expression tree for Mano example
- Source: [4.1]

### Slide 11 — Initial Comparison Results (Layout 5: Three-Zone)
- Top-left: Key findings — GLA weakest, Mamba2 excels at knowledge, GDN strong reasoning, RoPE best depth
- Top-right: Use heatmap figures from `paper_source/canon-figs5-arxiv/perm_4/` or create summary SVG bar chart
- Bottom: 'This comparison is incomplete — Mamba2/GDN have conv1d but GLA/Transformer don't → unfair!'
- Source: [4.1]

## File Paths
- Light slides: `output/slides/light/slide_01.html` through `slide_11.html`
- Dark slides: `output/slides/dark/slide_01.html` through `slide_11.html`
- Generated SVGs: inline within HTML
- Paper figures: reference via relative path from `paper_source/canon-figs5-arxiv/`

## Technical Requirements
- Include KaTeX CDN in any slide with math
- All original paper figures: copy relevant PNGs/extract PDF pages to `output/figures/` for embedding
- Use `<img>` for raster figures, inline `<svg>` for generated diagrams
- Follow SKILL.md color palette exactly (light: bg #FAF8F5, text #3A3A3A; dark: bg #2A2A2E, text #E8E4E0)
- Max 2-3 accent colors per slide

## Done Criteria
- 22 HTML files exist (11 light + 11 dark)
- Each is self-contained, renders at 1280×720
- ≥7 slides have figures (original or SVG)
- All SVGs use palette colors with no text overlap

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #3: Slides 12-22: Canon Layers + Part 4.1 Results

> **Context:** This task is at depth 2 in the plan graph. It has 3 upstream dependencies. 3 tasks depend on this one. 4 other tasks are running in parallel.

### Prompt

Generate HTML slides 12-22 (both light and dark themes) covering Canon layers and all Part 4.1 synthetic results.

## Slides to Generate

### Slide 12 — Section Divider (Layout 2): 'Canon Layers'
- Section number: 03
- Subtitle: 'Enhancing horizontal information flow'

### Slide 13 — Why Canon? The Associative Recall Problem (Layout 4: Left-Right Split)
- Left: Explain the folklore — associative recall `[A] [B] ... [A] [?]` needs 2 attention layers because causal masking prevents attending backward. 'Shooting a bird with a cannon' — using global attention just to pass info to neighbors.
- Right: Use figure from plots.pdf page 5 showing the two-layer attention mechanism for recall. Show the problem and solution.
- Include equation context: first attention stores A→B, second retrieves B via key=A
- Source: [4.1]

### Slide 14 — Canon Layer Definition (Layout 4: Left-Right Split)
- Left: The Canon formula: $h'_t = w_0 \odot h_t + w_1 \odot h_{t-1} + w_2 \odot h_{t-2} + w_3 \odot h_{t-3}$
- Musical analogy: Pachelbel's Canon — overlapping melodies at fixed temporal delays
- Implementation: 1-d causal convolution, kernel size 4, with residual: $h' = h + \text{conv1d}(h)$
- Right: Use Canon layer illustration from plots.pdf page 6 — the horizontal arrows showing delayed repetition
- Source: [4.1]

### Slide 15 — Canon-ABCD Integration Points (Layout 3: Full Bullet + SVG)
- Canon-A: Before attention (m=d), after RMSnorm
- Canon-B: Inside attention, after Q/K/V projections (m=3d)
- Canon-C: Before MLP (m=d), after RMSnorm
- Canon-D: Inside MLP (m=4d or 16d/3 for gated), before activation
- Generate SVG: Transformer block diagram with 4 Canon insertion points highlighted in different colors
- Highlight: <0.45% parameter increase for GPT2-small, 12-20% runtime overhead on H100
- Source: [4.1]

### Slide 16 — Code: Canon Implementation (Layout 3: Full Bullet)
- Show simplified code from `canon_helper.py`: the `create_canon()` and `apply_canon()` functions
- Key insight: Just a few lines of code change — `ShortConvolution` wrapping `nn.Conv1d` with causal padding
- Residual connection: `if canon._zeyuan_residual: return hidden_states + hidden_states2`
- Use code font styling (Fira Code)
- Source: [4.1 + 4.2 code]

### Slide 17 — Section Divider (Layout 2): 'Results: Transformer + Canon'
- Section number: 04
- Subtitle: 'Part 4.1 — Synthetic pretraining results'

### Slide 18 — Result 2: RoPE + Canon Dramatically Improves Reasoning (Layout 5: Three-Zone)
- Top-left: Key findings — reasoning depth improves 200-400%, breadth +30%, knowledge manipulation +30%
- Top-right: Use heatmap comparison figures from `perm/` directory showing RoPE original vs RoPE+Canon-ABCD
- Bottom: 'Canon enables hierarchical learning dynamics with minimal computational overhead'
- Source: [4.1, Result 2]

### Slide 19 — Result 3: NoPE + Canon = Strong Performer (Layout 5: Three-Zone)
- Top-left: NoPE (no positional embeddings) was weak → with Canon, matches or surpasses RoPE! RoPE(¼)+Canon is best — great for length generalization.
- Top-right: Figure comparison of NoPE original vs NoPE+Canon columns from fig:trans-canon
- Bottom: 'Partial RoPE (¼ dimensions) + Canon outperforms both → reduces RoPE dependency for better length generalization'
- Source: [4.1, Result 3]

### Slide 20 — Results 4-5: Ablations + MLP/MoE (Layout 3: Full Bullet)
- Canon-A/B/C/D contribute cumulatively; each independently useful
- Residual Canon improves training efficiency
- Canon recovers knowledge capacity lost in gated MLP and MoE architectures
- Generate SVG: Bar chart showing incremental contribution of Canon-A, AB, ABC, ABCD
- Source: [4.1, Results 4-5]

### Slide 21 — Section Divider (Layout 2): 'Results: Linear Models + Canon'
- Section number: 05
- Subtitle: 'Part 4.1 — GLA, Mamba2, GDN meet Canon'

### Slide 22 — Results 6-8: Universal Boost for Linear Models (Layout 5: Three-Zone)
- Top-left: GLA+Canon: reasoning depth 1→4 hop, doubles breadth. Mamba2's conv1d ≈ Canon-B. GDN benefits least (already has Canon-like behavior).
- Top-right: Use comparison heatmaps from experiment directories or create SVG summary
- Bottom: 'Canon-ACD alone matches internal conv1d → horizontal mixing useful across ALL sublayers, not just recurrent/SSM'
- Source: [4.1, Results 6-8]

## File Paths
- Light slides: `output/slides/light/slide_12.html` through `slide_22.html`
- Dark slides: `output/slides/dark/slide_12.html` through `slide_22.html`

## Done Criteria
- 22 HTML files exist (11 light + 11 dark)
- Each is self-contained, renders at 1280×720
- Canon formula slide has properly rendered KaTeX math
- Architecture SVG diagram has no text overlap, uses palette colors
- ≥7 slides have figures

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #4: Slides 23-33: Part 4.2 Scale Results, Error Analysis, Conclusion

> **Context:** This task is at depth 2 in the plan graph. It has 3 upstream dependencies. 3 tasks depend on this one. 4 other tasks are running in parallel.

### Prompt

Generate HTML slides 23-33 (both light and dark themes) covering Part 4.2 real-world scaling results, in-depth error analysis, and conclusions.

## Slides to Generate

### Slide 23 — Results 9-10: Final Controlled Comparison [4.1] (Layout 5: Three-Zone)
- Top-left: Result 9 (GLA+Canon-AbCD matches most linear models → current architecture direction may warrant re-evaluation) + Result 10 ranking across all 5 tasks:
  - Reasoning depth: RoPE ≈ NoPE >> Linear models (4× deeper)
  - Knowledge capacity: Linear >> Transformer (1.4× capacity)
  - Reasoning breadth: GDN ≥ RoPE ≈ NoPE ≈ GLA > Mamba2
- Top-right: Use heatmaps from fig:final-compare or create SVG comparison table
- Bottom: 'With Canon, the landscape shifts drastically — GLA+Canon is surprisingly competitive'
- Source: [4.1, Results 9-10]

### Slide 24 — Section Divider (Layout 2): 'Part 4.2: Scaling to Reality'
- Section number: 06
- Subtitle: 'Where synthetic pretraining resonates in real-world results'

### Slide 25 — Part 4.2 Experimental Setup (Layout 4: Left-Right Split)
- Left: 16 Llama/LlamaCanon models (1B, 3B, 8B) on Nemotron-CC (1T-2T tokens). 48 linear models (GLA5, GDN2, Mamba2 ± Canon). Controlled: same data, same hyperparameters, 2-3 learning rates each.
- Right: Use `PhysicsLM4/canon_llama_results/table-params.png` showing model configurations
- Source: [4.2]

### Slide 26 — Part 4.2 Transformer Results: LlamaCanon Wins (Layout 5: Three-Zone)
- Top-left: LlamaCanon consistently surpasses Llama in ALL 8 controlled comparisons. ~2% MMLU gain. Competitive with open-source models at same compute.
- Top-right: Use `PhysicsLM4/canon_llama_results/table-performance.png` (benchmark table)
- Bottom: 'Validates Part 4.1 Results 2+3: Canon improves Transformers at 1-8B real pretraining scale'
- Source: [4.2]

### Slide 27 — Part 4.2 Training Curves + Compute Efficiency (Layout 4: Left-Right Split)
- Left: MMLU training curves show LlamaCanon consistently above Llama throughout training, not just at convergence. Performance scales with model size as expected.
- Right: Use `PhysicsLM4/canon_llama_results/curve-mmlu.png` and/or `model-training-time.png`
- Source: [4.2]

### Slide 28 — Part 4.2 Linear Models at Scale: Key Findings (Layout 5: Three-Zone)
- Top-left: Finding 1: Canon yields significant gains for GLA. Finding 2: GLA+Canon matches or exceeds GDN and outperforms Mamba2 across 1B/3B/8B. This confirms Result 9 from Part 4.1.
- Top-right: Use `PhysicsLM4/canon_linear_results/table-performance-illustration.png` (the summary figure)
- Bottom: 'Much of GDN/Mamba2 advantage vanishes once Canon is added → suggests these architectures largely replicate Canon-like mixing'
- Source: [4.2, validates 4.1 Results 6-9]

### Slide 29 — Part 4.2 Linear Training Curves (Layout 4: Left-Right Split)
- Left: MMLU curves for GLA/GDN models ± Canon at 1B/3B/8B scale. Canon provides consistent improvement throughout training.
- Right: Use `PhysicsLM4/canon_linear_results/mmlu-gla.png` and `mmlu-gdn.png` side by side
- Source: [4.2]

### Slide 30 — Section Divider (Layout 2): 'Error Analysis'
- Section number: 07
- Subtitle: 'Why linear models struggle — and the limits of current architectures'

### Slide 31 — Deep Dive: Memory Dynamics Bottleneck (Layout 5: Three-Zone)
- Top-left: Linear models fail NOT from insufficient memory (each Mamba2 layer has 128d parameters — hundreds of times more than needed). The bottleneck is MEMORY DYNAMICS — accumulated errors in compression and retrieval compound across hops.
- Top-right: Use training curve figures from `paper_source/canon-figs5-arxiv/curve-perm_multi_4/` showing 1-hop vs 2-hop vs 4-hop accuracy over training
- Bottom: 'Result 11 [4.1]: This is the Achilles heel of linear architectures — hybrid Transformer+Linear approaches are the practical path forward'
- Source: [4.1 Result 11 + 4.2 validation]

### Slide 32 — In-Context Retrieval Failures at Scale [4.2] (Layout 5: Three-Zone)
- Top-left: ALL linear models struggle with in-context retrieval even for short contexts (~100 tokens). Even 8B models with 1T tokens fail 2-hop reasoning at ALL context lengths. This is remarkable — the simplest multi-hop task defeats all architectures.
- Top-right: Use multi-hop results columns from linear_model_best-0.pdf or create SVG bar chart showing 1-hop vs 2-hop accuracy by architecture
- Bottom: 'Explains emergence of hybrids: Qwen3-Next (Transformer+GDN), Falcon-H1 (Transformer+Mamba2)'
- Source: [4.2, validates 4.1 Result 11]

### Slide 33 — Conclusion & Future Directions (Layout 3: Full Bullet)
- Canon layers: simple yet powerful — like residual connections or LoRA
- Synthetic playground: cost-effective, principled path for architecture science
- Key open questions: dynamic Canon, fine-grained Canon design, enriching synthetic tasks
- Call to action: Code at github.com/facebookresearch/PhysicsLM4, models on HuggingFace
- Generate SVG: Summary diagram showing Canon as a universal add-on across architectures
- Source: [4.1 + 4.2]

## File Paths
- Light slides: `output/slides/light/slide_23.html` through `slide_33.html`
- Dark slides: `output/slides/dark/slide_23.html` through `slide_33.html`
- Copy needed images to `output/figures/` from PhysicsLM4 directories

## Done Criteria
- 22 HTML files exist (11 light + 11 dark)
- Part 4.2 gets ≥6 dedicated slides with detailed result analysis
- Error analysis slides include specific numbers and figure evidence
- Every result attributed to source (4.1 or 4.2)
- Multi-hop and retrieval failure analysis is in-depth with data from the result PDFs/PNGs

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #5: Blog Post Generation

> **Context:** This task is at depth 2 in the plan graph. It has 3 upstream dependencies. 3 tasks depend on this one. 4 other tasks are running in parallel.

### Prompt

Generate a detailed Markdown blog post (~3000-4000 words) covering both Part 4.1 and Part 4.2.

## Output
Write to `output/blog/post.md`

## Structure (following SKILL.md blog format)

```
# Physics of Language Models: The Magic of Canon Layers
*A detailed summary of Part 4.1 (NeurIPS 2025) and Part 4.2 by Zeyuan Allen-Zhu*

---

## TL;DR
[3 sentences: Canon layers are lightweight conv1d components that dramatically improve reasoning across all architectures. Validated on synthetic tasks and 1-8B scale real pretraining.]

## Motivation: Why Architecture Comparison is Broken
[~400 words: 3 challenges, noise at academic scale, the physics analogy]

## The Synthetic Pretraining Playground [4.1]
[~500 words: 5 tasks described, design criteria, initial comparison showing GLA weakest]

## Canon Layers: The Key Innovation [4.1]
[~500 words: associative recall problem, Canon formula with LaTeX, Canon-ABCD integration, implementation simplicity, musical analogy]

## When Transformer Meets Canon [4.1]
[~400 words: Results 2-5 with specific numbers, tables for key comparisons]

## When Linear Models Meet Canon [4.1]
[~400 words: Results 6-9, GLA+Canon insight]

## Scaling to Reality: Part 4.2 Results
[~600 words: Detailed coverage of 4.2 — setup (16+48 models), Transformer results (LlamaCanon consistent 2% MMLU gain), linear model results (GLA+Canon ≥ GDN), training curves, comparison with open models]

## Error Analysis: Why Deep Reasoning Fails [4.1 + 4.2]
[~400 words: Memory dynamics bottleneck, retrieval errors compound, 2-hop failure at all scales, implications for hybrid architectures]

## Key Takeaways and Future Directions
[~300 words: Canon as architectural primitive, synthetic benchmarking, open questions]

## References
[Proper citations with arXiv/SSRN links]
```

## Figure Requirements
- Include ALL key figures from slides (minimum 8 figures)
- Each figure with descriptive standalone caption
- Embed using `![Caption](../figures/filename.png)` or inline SVG
- Required figures: noise comparison, 5-task overview, Canon illustration, Canon integration diagram (SVG), Transformer+Canon results, linear model results, Part 4.2 performance table, Part 4.2 training curves, error analysis training curves

## Content Requirements
- **Detailed style**: 3000-4000 words, full methodology walkthrough
- Include Canon layer equation with KaTeX-compatible LaTeX
- Include comparison tables (Markdown) for key results
- Code snippet from `canon_helper.py` showing the simplicity
- Always attribute to source (4.1 or 4.2)
- Specific numbers: 2-4× reasoning depth, 0.45% parameter increase, ~2% MMLU gain at scale
- Link to: arXiv paper, SSRN, GitHub repo, HuggingFace models

## Working Directory
`/Users/zhuoran_cisco/Documents/astro-outputs/presentation/physcics-llm-2/`

## Done Criteria
- `output/blog/post.md` exists with 3000-4000 words
- TL;DR at top
- ≥8 figures with captions
- All claims backed by specific numbers
- Proper citation format with links
- Code snippet included
- Covers both 4.1 and 4.2 in depth

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #6: Poster Generation

> **Context:** This task is at depth 2 in the plan graph. It has 3 upstream dependencies. 3 tasks depend on this one. 4 other tasks are running in parallel.

### Prompt

Generate a single-page portrait A0 poster (841mm × 1189mm) as HTML with CSS grid layout.

## Output
Write to `output/poster/poster.html`

## Layout (Portrait, 3-column CSS grid)
Follow SKILL.md poster format exactly.

### Header (spans all 3 columns)
- Title: 'Physics of Language Models: Part 4 — Architecture Design and the Magic of Canon Layers'
- Author: Zeyuan Allen-Zhu (FAIR at Meta)
- Conference: NeurIPS 2025 (Part 4.1) + Code Release (Part 4.2)
- Accent line below

### Column 1 (Left): Motivation + Background + Synthetic Playground
- **Section: Motivation** (~200 words): Why architecture comparison at academic scale is unreliable. 3 challenges. The physics analogy.
- **Section: Background** (~150 words): Architecture families overview with mini SVG taxonomy diagram.
- **Section: Synthetic Playground**: 5 tasks with brief descriptions. Include small SVG or figure of the task overview from plots.pdf.
- **Key Takeaway Box**: 'Synthetic tasks isolate atomic skills, enabling clean architectural comparisons at low cost.'
- Target: 95-100% filled

### Column 2 (Middle): Canon Layers + Method + Part 4.1 Key Results
- **Section: Canon Layers** (~200 words): Formula, Canon-ABCD integration points, musical analogy. Include Canon layer SVG diagram.
- **Section: Key Insight** (callout box): 'Canon layers add horizontal residual links — like residual connections but across neighboring tokens. Even random-weight Canon notably enhances performance.'
- **Section: Part 4.1 Results**: Transformer+Canon (2-4× reasoning depth), Linear+Canon (GLA+Canon matches Mamba2/GDN). Include summary comparison figure.
- Target: 95-100% filled

### Column 3 (Right): Part 4.2 Results + Error Analysis + Conclusion
- **Section: Scaling to Reality [4.2]** (~250 words): 16 Llama + 48 linear models at 1-8B scale. LlamaCanon consistently outperforms. GLA+Canon ≥ GDN. Include performance table figure.
- **Section: Error Analysis** (~200 words): Memory dynamics bottleneck, 2-hop failure, retrieval struggles. Include key figure.
- **Section: Conclusion & Future** (~100 words): Canon as universal architectural primitive.
- **QR Code + Citation Block** at bottom
- Target: 95-100% filled

## Column Balancing
- CRITICAL: All 3 columns must be ≥95% filled
- Left column: If short, add a Background/Related Work section or larger figure
- Right column: If short, expand error analysis or add a 'Broader Impact' section
- Do NOT use flex-grow to fake balance

## Technical Requirements
- Use SKILL.md poster CSS grid layout exactly
- Body dimensions: width 841mm, height 1189mm
- Font sizes: Title 72px, Section heading 36px, Body 24px, Caption 18px
- Colors: Follow light theme palette
- Include KaTeX for Canon formula
- Embed figures as <img> with proper sizing for poster scale
- All SVGs must have larger labels (18px+ for poster viewing distance)

## Figures to Include
- Canon layer diagram (SVG or from plots.pdf page 6)
- 5-task overview (from plots.pdf)
- Key result comparison (from Part 4.1 final comparison or SVG summary)
- Part 4.2 performance illustration (table-performance-illustration.png)
- Training curves (curve-mmlu.png or mmlu-gla.png)

## Working Directory
`/Users/zhuoran_cisco/Documents/astro-outputs/presentation/physcics-llm-2/`

## Done Criteria
- `output/poster/poster.html` exists
- Renders at A0 (841mm × 1189mm) without overflow
- 3-column grid with all columns ≥95% filled
- ≥5 figures/visuals included
- QR code or URL to paper/code
- Canon formula rendered via KaTeX
- Text readable at poster viewing distance

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #7: Figure Extraction and Preparation

> **Context:** This task is at depth 1 in the plan graph. It has 1 upstream dependencies. 12 tasks depend on this one.

### Prompt

Extract and prepare all figures needed by slides, blog, and poster. This task creates the shared `output/figures/` directory that all deliverables reference.

## What to do

### 1. Extract PDF pages as images
The main paper figures are in `paper_source/canon-figs5-arxiv/plots.pdf`. Use Python (pypdf/pdf2image or similar) or Bash tools to extract individual pages as PNG:
- Page 3: Design criteria figure → `output/figures/design-criteria.png`
- Page 4: Five synthetic tasks overview → `output/figures/five-tasks.png`
- Page 5: Associative recall illustration → `output/figures/associative-recall.png`
- Page 6: Canon layer illustration → `output/figures/canon-illustration.png`
- Page 7: Real-life experiment results → `output/figures/real-life-results.png`
- Page 8: Noisy pretraining comparison → `output/figures/noisy-comparison.png`
- Page 9: Five tasks with diagrams → `output/figures/five-tasks-detail.png`

### 2. Copy Part 4.2 figures
Copy key images from the PhysicsLM4 repository:
- `PhysicsLM4/canon_llama_results/model-training-time.png` → `output/figures/model-training-time.png`
- `PhysicsLM4/canon_llama_results/curve-mmlu.png` → `output/figures/curve-mmlu.png`
- `PhysicsLM4/canon_llama_results/table-performance.png` → `output/figures/table-performance-transformer.png`
- `PhysicsLM4/canon_llama_results/table-params.png` → `output/figures/table-params-transformer.png`
- `PhysicsLM4/canon_linear_results/table-performance-illustration.png` → `output/figures/table-performance-linear.png`
- `PhysicsLM4/canon_linear_results/mmlu-gla.png` → `output/figures/mmlu-gla.png`
- `PhysicsLM4/canon_linear_results/mmlu-gdn.png` → `output/figures/mmlu-gdn.png`
- `PhysicsLM4/canon_linear_results/table-params-brief.png` → `output/figures/table-params-linear.png`

### 3. Extract experiment heatmaps
From `paper_source/canon-figs5-arxiv/` subdirectories, extract page 1 of key PDF result files:
- `perm_4/Llama_RoPE_-original.pdf` page 1 → `output/figures/depo-rope-original.png`
- `perm_4/Llama_RoPE_-Res-Canon-ABCD.pdf` page 1 (if exists) → `output/figures/depo-rope-canon.png`
- Similar for GLA, Mamba2, GDN comparison pairs
- `real-life/slimp-1B-3rd-0.pdf` page 1 → `output/figures/real-life-slimp.png`
- `real-life/fwedu-1B-3rd-0.pdf` page 1 → `output/figures/real-life-fwedu.png`

### 4. Convert linear model result PDFs
- `PhysicsLM4/canon_linear_results/linear_model_best-0.pdf` → `output/figures/linear-model-best-0.png`
- `PhysicsLM4/canon_linear_results/linear_model_best-1.pdf` → `output/figures/linear-model-best-1.png`

### Implementation
Use Python with `pdf2image` (poppler), or `sips` (macOS built-in), or Chrome headless to render PDFs to PNG. If pdf2image isn't available, try:
```bash
# macOS: use sips or qlmanage for basic conversion
# Or: python3 with PyMuPDF (fitz)
pip3 install PyMuPDF
python3 -c "import fitz; doc=fitz.open('input.pdf'); page=doc[0]; pix=page.get_pixmap(dpi=200); pix.save('output.png')"
```

Create `output/figures/` directory structure first.

## Working Directory
`/Users/zhuoran_cisco/Documents/astro-outputs/presentation/physcics-llm-2/`

## Done Criteria
- `output/figures/` directory exists with ≥15 PNG files
- All key paper figures extracted from plots.pdf
- All Part 4.2 figures copied
- Images are readable at slide resolution (≥1000px wide for full-width figures)

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #8: PDF Assembly and Quality Check

> **Context:** This task is at depth 3 in the plan graph. It has 16 upstream dependencies. 2 tasks depend on this one.

### Prompt

Combine all HTML slides into PDFs (light and dark themes), render poster to PDF, and run quality checks across all deliverables.

## Step 1: Combine Light Theme Slides
Using the approach from SKILL.md Section 6:

1. Create `output/slides/light/combined.html` by extracting <body> and <style> from each slide HTML file (slide_01.html through slide_33.html), wrapping each in a `.slide` div with `page-break-after: always`.
2. Render to PDF using Chrome headless or puppeteer-core:
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-margins \
  --print-to-pdf=./output/slides/slides-light.pdf \
  --print-to-pdf-no-header \
  "file://$(pwd)/output/slides/light/combined.html"
```

## Step 2: Combine Dark Theme Slides
Same process for dark theme:
1. Create `output/slides/dark/combined.html`
2. Render to `output/slides/slides-dark.pdf`

## Step 3: Render Poster to PDF
Use puppeteer-core or Chrome headless with custom A0 dimensions:
```bash
npm install puppeteer-core
node -e "
const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + require('path').resolve('./output/poster/poster.html'), { waitUntil: 'networkidle0' });
  await page.pdf({ path: './output/poster/poster.pdf', width: '841mm', height: '1189mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
})();
"
```

## Step 4: Quality Checklist
Verify all deliverables against SKILL.md quality checklist:

### Slides
- [ ] One idea per slide — no information overload
- [ ] Max 6-8 bullet points per Full Bullet slide
- [ ] Every equation has plain-English annotation
- [ ] At least 60% of slides have a figure (target: ≥20 of 33 slides)
- [ ] All original paper figures referenced in outline are included
- [ ] New SVG figures use palette colors with no text overlap
- [ ] Max 2-3 accent colors per slide
- [ ] Title slide has paper title, authors, affiliation
- [ ] Section dividers introduce each major topic
- [ ] KaTeX renders correctly in all math slides
- [ ] PDF renders clean without clipping or overflow
- [ ] Both light and dark PDFs generated

### Blog Post
- [ ] TL;DR at top
- [ ] Word count 3000-4000
- [ ] ≥8 figures with descriptive captions
- [ ] All claims backed by specific numbers
- [ ] Proper citations with links
- [ ] Both 4.1 and 4.2 covered in depth

### Poster
- [ ] Fits single A0 page without overflow
- [ ] 3-column grid, all columns ≥95% filled
- [ ] Text readable at poster distance (24px+ body)
- [ ] Key figures prominent and legible
- [ ] QR code or URL included

## Step 5: Cross-Check Consistency
- Verify key numbers match across all 3 deliverables
- Ensure all result attributions (4.1 vs 4.2) are consistent
- Check that Canon formula is identical in slides, blog, and poster

## Working Directory
`/Users/zhuoran_cisco/Documents/astro-outputs/presentation/physcics-llm-2/`

## Output Files
- `output/slides/slides-light.pdf`
- `output/slides/slides-dark.pdf`
- `output/poster/poster.pdf`
- `output/quality-report.md` (checklist results)

## Done Criteria
- Both slide PDFs exist and are multi-page (33 pages each)
- Poster PDF exists at A0 dimensions
- Quality report confirms all checklist items pass
- No rendering artifacts (clipping, overflow, missing figures)

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ● Task #9: Content Review and Narrative Polish

> **Context:** This task is at depth 4 in the plan graph. It has 17 upstream dependencies. 1 tasks depend on this one.

### Prompt

Human review of all deliverables for content quality, narrative flow, and technical accuracy.

## Review Criteria

### Narrative Flow (Slides)
1. Does the presentation tell a compelling story from problem → insight → evidence → implications?
2. Are transitions between slides logical? Does each slide connect to the next?
3. Is the audience engagement maintained? (Expert in mechanistic interpretability or LM training)
4. Is Part 4.2 given sufficient depth? (≥6 slides + in-depth error analysis)
5. Are all results properly attributed to 4.1 or 4.2?

### Technical Accuracy
1. Is the Canon layer formula correct: $h'_t = w_0 \odot h_t + w_1 \odot h_{t-1} + w_2 \odot h_{t-2} + w_3 \odot h_{t-3}$?
2. Are the 12 results accurately summarized?
3. Are the Part 4.2 benchmark numbers consistent with the source tables?
4. Is the error analysis (memory dynamics, not memory size) accurately explained?
5. Are architecture descriptions (GLA, Mamba2, GDN) technically precise?

### Visual Quality
1. Do all SVG diagrams follow the palette and have no text overlap?
2. Are original paper figures readable at slide/poster scale?
3. Is the figure-to-slide ratio ≥60% for content slides?
4. Do both light and dark themes look polished?

### Blog Post
1. Is the writing clear and engaging for the target audience?
2. Are equations explained in plain English?
3. Do figure captions stand alone (readable without surrounding text)?
4. Is the code snippet from canon_helper.py illuminating?

### Poster
1. Are all 3 columns balanced (≥95% filled)?
2. Is the visual hierarchy clear (title → sections → body)?
3. Can the poster be read in 3-5 minutes?

## Output
`output/review-notes.md` with any corrections needed.

## Done Criteria
- All deliverables reviewed
- Any critical errors flagged and corrected
- Narrative flow confirmed as compelling

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

## ◆ Task #10: All Deliverables Complete

> **Context:** This task is at depth 5 in the plan graph. It has 18 upstream dependencies.

### Prompt

All three deliverables (slides in both themes, blog post, poster) have been generated, rendered to PDF, and quality-checked. Final outputs:
- `output/slides/slides-light.pdf` (~33 slides, light theme)
- `output/slides/slides-dark.pdf` (~33 slides, dark theme)
- `output/blog/post.md` (detailed blog post, 3000-4000 words)
- `output/poster/poster.pdf` (A0 portrait poster)
- `output/quality-report.md` (quality checklist results)

### Instructions

Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.

---

