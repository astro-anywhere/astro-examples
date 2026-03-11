#!/usr/bin/env node
/**
 * render-prompts.js — Reconstruct and render the full assembled prompt that
 * each task's agent would receive, from an Astro .astro.json export.
 *
 * Usage:
 *   node utils/render-prompts.js <plan.astro.json> <output-dir>
 *
 * Outputs:
 *   <output-dir>/prompts.md — Markdown with full assembled prompts
 *
 * The assembled prompt mirrors packages/core/src/dispatch/context-assembler.ts:
 *   1. Project Vision (shown once at top)
 *   2. Task Context (graph position)
 *   3. Previous Task Outputs (dependency outputs, if available)
 *   4. Working Directory
 *   5. Current Task (title + description)
 *   6. Instructions
 */

const fs = require("fs");
const path = require("path");

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

  return positions;
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
    if (!depNode || !depNode.executionOutput) continue;
    const output = depNode.executionOutput;
    const truncated = output.length > 20000;
    outputs.push({
      title: depNode.title,
      output: truncated ? output.slice(0, 20000) + "\n\n[Output truncated...]" : output,
    });
  }
  return outputs;
}

// ─── Generic instructions (mirrors context-assembler.ts) ─────────────────────
const INSTRUCTIONS = `Execute the task described above. Focus on completing the task thoroughly and correctly.
- Use appropriate tools to accomplish the task
- Report progress and any issues encountered
- Verify your work when possible
- Be thorough but efficient
- When you make code changes, commit them with a descriptive commit message before finishing. Do not leave uncommitted changes.`;

// ─── Render Markdown ─────────────────────────────────────────────────────────
function renderPromptsMd(plan) {
  const { nodes, edges, project } = plan;
  const positions = calculateGraphPositions(nodes, edges);

  let md = "";

  // ── Header ──
  md += `# Assembled Prompts\n\n`;
  md += `**${plan.meta.name}** — ${nodes.length} tasks · ${edges.length} edges\n\n`;
  md += `> Each section below shows the full context that Astro's dispatch engine assembles and sends to the agent, mirroring \`ContextAssembler.buildExecutionPrompt()\`. Sections not available at export time (skill instructions, runtime knowledge entries) are omitted.\n\n`;

  // ── Vision doc (once, at the top) ──
  if (project?.visionDoc) {
    md += `---\n\n`;
    md += `## Project Vision\n\n`;
    md += `> Injected as the first section of every task's prompt (${project.visionDoc.length.toLocaleString()} chars).\n\n`;
    md += `<details>\n<summary>Click to expand full vision document</summary>\n\n`;
    // Use indented block instead of code fence to avoid GitHub rendering issues with --- inside fences
    const lines = project.visionDoc.split("\n");
    for (const line of lines) {
      md += `    ${line}\n`;
    }
    md += `\n</details>\n\n`;
  }

  // ── Working directory (once) ──
  const wd = project?.sourceDirectory || project?.repository;
  if (wd) {
    md += `**Working Directory:** \`${wd}\`\n\n`;
  }

  md += `---\n\n`;

  // ── Per-task sections ──
  for (const node of nodes) {
    const isMilestone = node.type === "milestone" || node.estimate === "None" || node.estimate === null;
    const icon = isMilestone ? "◆" : "●";
    const pos = positions.get(node.id);

    md += `## ${icon} Task #${node.number}: ${node.title}\n\n`;

    // Context line
    const ctx = buildPositionContext(pos);
    if (ctx) {
      md += `> **Context:** ${ctx}\n\n`;
    }

    // Dependency outputs (if available)
    const depOutputs = gatherDependencyOutputs(node, nodes);
    if (depOutputs.length > 0) {
      md += `### Previous Task Outputs\n\n`;
      for (const d of depOutputs) {
        md += `<details>\n<summary><strong>${d.title}</strong></summary>\n\n`;
        md += d.output + "\n\n";
        md += `</details>\n\n`;
      }
    }

    // Task description (the core prompt)
    md += `### Prompt\n\n`;
    md += node.description || "(no description)";
    md += "\n\n";

    // Instructions
    md += `### Instructions\n\n`;
    md += INSTRUCTIONS + "\n\n";

    md += `---\n\n`;
  }

  return md;
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

  const md = renderPromptsMd(plan);
  fs.writeFileSync(path.join(outDir, "prompts.md"), md);
  console.log(`  prompts.md (${(md.length / 1024).toFixed(1)}KB)`);

  console.log("Done.");
}

main();
