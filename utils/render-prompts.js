#!/usr/bin/env node
/**
 * render-prompts.js — Reconstruct and render the full assembled prompt that
 * each task's agent would receive, from an Astro .astro.json export.
 *
 * Usage:
 *   node utils/render-prompts.js <plan.astro.json> <output-dir>
 *
 * Outputs:
 *   <output-dir>/prompts.html  — Styled HTML with full assembled prompts
 *   <output-dir>/prompts.md    — Markdown version
 *
 * The assembled prompt mirrors packages/core/src/dispatch/context-assembler.ts:
 *   1. Project Vision
 *   2. Task Context (graph position)
 *   3. Previous Task Outputs (dependency outputs, if available)
 *   4. Working Directory
 *   5. Current Task (title + description)
 *   6. Instructions
 */

const fs = require("fs");
const path = require("path");

// ─── Palette ─────────────────────────────────────────────────────────────────
const P = {
  bg: "#FAF8F5",
  text: "#3A3A3A",
  textLight: "#6A6A6A",
  sand: "#C4A882",
  blue: "#6E8AA4",
  sage: "#A8B8A0",
  green: "#5D8057",
  codeBg: "#F5F2EE",
  tableBorder: "#E0DCD8",
  sectionBg: "#FFFFFF",
};

// ─── Parse JSON ──────────────────────────────────────────────────────────────
function loadPlan(jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const { project, nodes, edges } = raw.data;
  const sorted = [...nodes].sort((a, b) => a.number - b.number);
  return { meta: raw, project, nodes: sorted, edges };
}

// ─── Graph position calculation (mirrors context-assembler.ts) ───────────────
function calculateGraphPositions(nodes, edges) {
  const incomingEdges = new Map();
  const outgoingEdges = new Map();
  for (const n of nodes) {
    incomingEdges.set(n.id, []);
    outgoingEdges.set(n.id, []);
  }
  for (const e of edges) {
    incomingEdges.get(e.target)?.push(e);
    outgoingEdges.get(e.source)?.push(e);
  }

  function calcDepth(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    const incoming = incomingEdges.get(nodeId) || [];
    if (incoming.length === 0) return 0;
    let max = 0;
    for (const e of incoming) {
      max = Math.max(max, calcDepth(e.source, visited) + 1);
    }
    return max;
  }

  function countAncestors(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    const incoming = incomingEdges.get(nodeId) || [];
    let count = incoming.length;
    for (const e of incoming) count += countAncestors(e.source, visited);
    return count;
  }

  function countDescendants(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return 0;
    visited.add(nodeId);
    const outgoing = outgoingEdges.get(nodeId) || [];
    let count = outgoing.length;
    for (const e of outgoing) count += countDescendants(e.target, visited);
    return count;
  }

  function detectBranch(nodeId) {
    const visited = new Set();
    const toVisit = [nodeId];
    while (toVisit.length > 0) {
      const cur = toVisit.pop();
      if (visited.has(cur)) continue;
      visited.add(cur);
      for (const e of incomingEdges.get(cur) || []) {
        if (e.type === "branch") return { isOnBranch: true, branchId: e.source };
        toVisit.push(e.source);
      }
    }
    return { isOnBranch: false };
  }

  function countParallelSiblings(node) {
    const nodeParents = (incomingEdges.get(node.id) || []).map((e) => e.source).sort();
    if (nodeParents.length === 0) return 0;
    const key = nodeParents.join(",");
    let siblings = 0;
    for (const other of nodes) {
      if (other.id === node.id) continue;
      const otherParents = (incomingEdges.get(other.id) || []).map((e) => e.source).sort();
      if (otherParents.join(",") === key) siblings++;
    }
    return siblings;
  }

  const positions = new Map();
  for (const n of nodes) {
    positions.set(n.id, {
      depth: calcDepth(n.id),
      upstreamCount: countAncestors(n.id),
      downstreamCount: countDescendants(n.id),
      ...detectBranch(n.id),
      parallelSiblings: countParallelSiblings(n),
    });
  }

  return { positions, incomingEdges, outgoingEdges };
}

// ─── Build position context string (mirrors context-assembler.ts) ────────────
function buildPositionContext(pos) {
  const parts = [];
  if (pos.depth > 0) parts.push(`This task is at depth ${pos.depth} in the plan graph.`);
  if (pos.upstreamCount > 0) parts.push(`It has ${pos.upstreamCount} upstream dependencies.`);
  if (pos.downstreamCount > 0) parts.push(`${pos.downstreamCount} tasks depend on this one.`);
  if (pos.isOnBranch) parts.push(`This task is on an exploration branch.`);
  if (pos.parallelSiblings > 0) parts.push(`${pos.parallelSiblings} other tasks are running in parallel.`);
  return parts.join(" ");
}

// ─── Gather dependency outputs (mirrors context-assembler.ts) ────────────────
function gatherDependencyOutputs(node, allNodes) {
  const outputs = [];
  const deps = node.dependencies || [];
  for (const depId of deps) {
    const depNode = allNodes.find((n) => n.id === depId);
    if (!depNode) continue;
    if (!depNode.executionOutput) continue;
    const output = depNode.executionOutput;
    const truncated = output.length > 20000;
    outputs.push({
      title: depNode.title,
      output: truncated ? output.slice(0, 20000) + "\n\n[Output truncated...]" : output,
      truncated,
      status: depNode.status,
    });
  }
  return outputs;
}

// ─── Assemble full prompt (mirrors buildExecutionPrompt) ─────────────────────
function assemblePrompt(node, plan, graphPositions) {
  const { project, nodes } = plan;
  const pos = graphPositions.positions.get(node.id);

  const sections = [];

  // 1. Vision doc
  if (project?.visionDoc) {
    sections.push({
      heading: "Project Vision",
      content: project.visionDoc,
      tag: "vision",
    });
  }

  // 2. Task context (graph position)
  const posContext = buildPositionContext(pos);
  if (posContext) {
    sections.push({
      heading: "Task Context",
      content: posContext,
      tag: "context",
    });
  }

  // 3. Dependency outputs
  const depOutputs = gatherDependencyOutputs(node, nodes);
  if (depOutputs.length > 0) {
    const depContent =
      "The following tasks have been completed. Use their outputs as context:\n\n" +
      depOutputs.map((d) => `### ${d.title}\n\n${d.output}`).join("\n\n---\n\n");
    sections.push({
      heading: "Previous Task Outputs",
      content: depContent,
      tag: "deps",
    });
  }

  // 4. Working directory
  const wd = project?.sourceDirectory || project?.repository;
  if (wd) {
    sections.push({
      heading: "Working Directory",
      content: wd,
      tag: "wd",
    });
  }

  // 5. Current task
  sections.push({
    heading: "Current Task",
    content: `**${node.title}**\n\n${node.description || "(no description)"}`,
    tag: "task",
  });

  // 6. Instructions
  sections.push({
    heading: "Instructions",
    content: `Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.`,
    tag: "instructions",
  });

  return sections;
}

// ─── Escape helpers ──────────────────────────────────────────────────────────
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeForPre(s) {
  return escapeHtml(s);
}

// ─── Render Markdown output ─────────────────────────────────────────────────
function renderPromptsMd(plan) {
  const { nodes, edges } = plan;
  const graphPositions = calculateGraphPositions(nodes, edges);

  let md = `# Assembled Prompts\n\n`;
  md += `**${plan.meta.name}** — ${nodes.length} tasks\n\n`;
  md += `Each section below shows the full context that would be assembled and sent to the agent at dispatch time, mirroring Astro's \`ContextAssembler.buildExecutionPrompt()\`.\n\n`;
  md += `---\n\n`;

  for (const node of nodes) {
    const isMilestone = node.type === "milestone" || node.estimate === "None" || node.estimate === null;
    const icon = isMilestone ? "◆" : "●";

    md += `## ${icon} Task #${node.number}: ${node.title}\n\n`;

    const sections = assemblePrompt(node, plan, graphPositions);

    for (const section of sections) {
      if (section.tag === "vision") {
        md += `<details>\n<summary><strong>§ ${section.heading}</strong> <em>(${section.content.length.toLocaleString()} chars — click to expand)</em></summary>\n\n`;
        md += `\`\`\`\n${section.content}\n\`\`\`\n\n`;
        md += `</details>\n\n`;
      } else if (section.tag === "task") {
        md += `### § ${section.heading}\n\n`;
        md += section.content + "\n\n";
      } else {
        md += `### § ${section.heading}\n\n`;
        md += section.content + "\n\n";
      }
    }

    md += `---\n\n`;
  }

  return md;
}

// ─── Render HTML output ──────────────────────────────────────────────────────
function renderPromptsHtml(plan) {
  const { nodes, edges } = plan;
  const graphPositions = calculateGraphPositions(nodes, edges);

  const tagColors = {
    vision: { bg: "rgba(168,184,160,0.12)", border: P.sage, label: "Project Vision" },
    context: { bg: "rgba(110,138,164,0.08)", border: P.blue, label: "Task Context" },
    deps: { bg: "rgba(196,168,130,0.08)", border: P.sand, label: "Previous Task Outputs" },
    wd: { bg: "rgba(110,138,164,0.06)", border: P.blue, label: "Working Directory" },
    task: { bg: "#FFFFFF", border: P.sand, label: "Current Task" },
    instructions: { bg: "rgba(93,128,87,0.06)", border: P.green, label: "Instructions" },
  };

  let taskCards = "";
  let tocItems = "";

  for (const node of nodes) {
    const isMilestone = node.type === "milestone" || node.estimate === "None" || node.estimate === null;
    const icon = isMilestone ? "◆" : "●";
    const sections = assemblePrompt(node, plan, graphPositions);

    tocItems += `<li><a href="#task-${node.number}">${icon} #${node.number} ${escapeHtml(node.title)}</a></li>\n`;

    let sectionsHtml = "";
    for (const section of sections) {
      const colors = tagColors[section.tag] || tagColors.context;
      const contentHtml = escapeForPre(section.content);

      if (section.tag === "vision") {
        sectionsHtml += `
        <div class="prompt-section" style="border-left-color:${colors.border};background:${colors.bg}">
          <div class="section-label">${colors.label}</div>
          <details class="vision-collapse">
            <summary>${section.content.length.toLocaleString()} chars — click to expand</summary>
            <pre class="prompt-content">${contentHtml}</pre>
          </details>
        </div>`;
      } else if (section.tag === "task") {
        sectionsHtml += `
        <div class="prompt-section task-section" style="border-left-color:${colors.border};background:${colors.bg}">
          <div class="section-label">${colors.label}</div>
          <pre class="prompt-content">${contentHtml}</pre>
        </div>`;
      } else {
        sectionsHtml += `
        <div class="prompt-section" style="border-left-color:${colors.border};background:${colors.bg}">
          <div class="section-label">${colors.label}</div>
          <pre class="prompt-content">${contentHtml}</pre>
        </div>`;
      }
    }

    taskCards += `
    <div class="task-card" id="task-${node.number}">
      <div class="task-header">
        <span class="task-icon ${isMilestone ? "milestone" : "task"}">${icon}</span>
        <span class="task-number">#${node.number}</span>
        <span class="task-title">${escapeHtml(node.title)}</span>
      </div>
      <div class="prompt-sections">
        ${sectionsHtml}
      </div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(plan.meta.name)} — Assembled Prompts</title>
<style>
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    background: ${P.bg};
    color: ${P.text};
    line-height: 1.6;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 28px 60px;
    font-size: 15px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page-header {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 2px solid ${P.sand};
    margin-bottom: 32px;
  }
  .page-header h1 { font-size: 1.8em; font-weight: 700; margin-bottom: 8px; }
  .page-header .subtitle { font-size: 0.95em; color: ${P.textLight}; }
  .page-header .meta { margin-top: 12px; font-size: 0.85em; color: ${P.sage}; }

  .explanation {
    background: rgba(110,138,164,0.08);
    border-left: 4px solid ${P.blue};
    border-radius: 0 6px 6px 0;
    padding: 14px 18px;
    margin-bottom: 28px;
    font-size: 0.92em;
    color: ${P.textLight};
    line-height: 1.5;
  }

  .toc { margin-bottom: 32px; }
  .toc h2 { font-size: 1.15em; margin-bottom: 10px; color: ${P.text}; }
  .toc ul { list-style: none; columns: 2; column-gap: 24px; }
  .toc li { margin: 4px 0; font-size: 0.9em; }
  .toc a { color: ${P.blue}; text-decoration: none; border-bottom: 1px solid rgba(110,138,164,0.3); }
  .toc a:hover { border-bottom-color: ${P.blue}; }

  .task-card { margin-bottom: 36px; break-inside: avoid; }
  .task-header {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: ${P.sectionBg};
    border: 1px solid ${P.tableBorder};
    border-radius: 8px 8px 0 0;
    border-bottom: 2px solid ${P.sand};
  }
  .task-icon { font-size: 1.1em; }
  .task-icon.milestone { color: ${P.green}; }
  .task-icon.task { color: ${P.blue}; }
  .task-number { font-weight: 700; font-size: 0.95em; color: ${P.blue}; min-width: 28px; }
  .task-title { font-weight: 600; font-size: 1.05em; }

  .prompt-sections {
    border: 1px solid ${P.tableBorder};
    border-top: none;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
  }
  .prompt-section {
    border-left: 4px solid ${P.blue};
    padding: 12px 16px;
    border-bottom: 1px solid ${P.tableBorder};
  }
  .prompt-section:last-child { border-bottom: none; }
  .section-label {
    font-size: 0.78em; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: ${P.textLight}; margin-bottom: 6px;
  }
  .prompt-content {
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 0.82em; line-height: 1.55;
    white-space: pre-wrap; word-wrap: break-word;
    background: rgba(0,0,0,0.02);
    padding: 10px 12px; border-radius: 4px;
    max-height: 600px; overflow-y: auto;
    color: ${P.text};
  }

  .task-section { border-left-width: 5px; }
  .task-section .prompt-content {
    background: rgba(196,168,130,0.06);
    font-size: 0.85em; max-height: none;
  }

  .vision-collapse summary {
    cursor: pointer; font-size: 0.88em;
    color: ${P.textLight}; padding: 4px 0;
  }
  .vision-collapse summary:hover { color: ${P.blue}; }
  .vision-collapse .prompt-content { max-height: 400px; margin-top: 8px; }

  .legend {
    display: flex; gap: 20px; flex-wrap: wrap;
    margin-bottom: 24px; padding: 12px 16px;
    background: ${P.sectionBg};
    border-radius: 6px; border: 1px solid ${P.tableBorder};
  }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.82em; color: ${P.textLight}; }
  .legend-swatch { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(0,0,0,0.1); }

  @media print {
    body { padding: 0; max-width: none; font-size: 10pt; }
    .task-card { break-inside: avoid; page-break-inside: avoid; }
    .prompt-content { max-height: none !important; overflow: visible !important; }
    .vision-collapse[open] .prompt-content { max-height: none !important; }
  }
</style>
</head>
<body>
  <div class="page-header">
    <h1>${escapeHtml(plan.meta.name)}</h1>
    <div class="subtitle">Assembled Agent Prompts</div>
    <div class="meta">${nodes.length} tasks &bull; ${edges.length} edges &bull; Exported ${new Date(plan.meta.exportedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>

  <div class="explanation">
    Each card below shows the <strong>full assembled prompt</strong> that Astro's dispatch engine sends to the agent for each task.
    This mirrors <code>ContextAssembler.buildExecutionPrompt()</code> — the sections are assembled at dispatch time from the project vision document,
    dependency graph, completed task outputs, and the task description. Sections not available at export time (skill instructions, runtime knowledge)
    are omitted.
  </div>

  <div class="legend">
    <div class="legend-item"><div class="legend-swatch" style="background:rgba(168,184,160,0.25);border-color:${P.sage}"></div> Vision</div>
    <div class="legend-item"><div class="legend-swatch" style="background:rgba(110,138,164,0.15);border-color:${P.blue}"></div> Context</div>
    <div class="legend-item"><div class="legend-swatch" style="background:rgba(196,168,130,0.15);border-color:${P.sand}"></div> Dependencies</div>
    <div class="legend-item"><div class="legend-swatch" style="background:#FFFFFF;border-color:${P.sand}"></div> Task (prompt)</div>
    <div class="legend-item"><div class="legend-swatch" style="background:rgba(93,128,87,0.12);border-color:${P.green}"></div> Instructions</div>
  </div>

  <div class="toc">
    <h2>Tasks</h2>
    <ul>
      ${tocItems}
    </ul>
  </div>

  ${taskCards}
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node render-prompts.js <plan.astro.json> <output-dir>");
    process.exit(1);
  }

  const [jsonPath, outDir] = args;
  const plan = loadPlan(jsonPath);

  fs.mkdirSync(outDir, { recursive: true });

  const html = renderPromptsHtml(plan);
  fs.writeFileSync(path.join(outDir, "prompts.html"), html);
  console.log(`  prompts.html (${(html.length / 1024).toFixed(1)}KB)`);

  const md = renderPromptsMd(plan);
  fs.writeFileSync(path.join(outDir, "prompts.md"), md);
  console.log(`  prompts.md (${(md.length / 1024).toFixed(1)}KB)`);

  console.log("\nDone.");
}

main();
