#!/usr/bin/env node
/**
 * render-plan.js — Generate DAG visualization (SVG) and detailed plan documentation
 * from an Astro .astro.json export file.
 *
 * Usage:
 *   node utils/render-plan.js <plan.astro.json> <output-dir>
 *
 * Outputs:
 *   <output-dir>/dag.svg          — Visual DAG diagram
 *   <output-dir>/plan-detail.md   — Detailed per-step plan documentation
 *   <output-dir>/plan-summary.md  — Compact summary for README embedding
 */

const fs = require("fs");
const path = require("path");

// ─── Palette ────────────────────────────────────────────────────────────────
const P = {
  bg: "#FAF8F5",
  text: "#3A3A3A",
  textLight: "#8A8A8A",
  textWhite: "#FAFAFA",
  sand: "#C4A882",
  blue: "#6E8AA4",
  green: "#5D8057",
  sage: "#A8B8A0",
  rose: "#A86464",
  lavender: "#9B8FAF",
  gridLine: "#E0DCD8",
  status: {
    planned: { fill: "#6E8AA4", label: "Planned" },
    in_progress: { fill: "#C4A882", label: "In Progress" },
    completed: { fill: "#5D8057", label: "Completed" },
    pruned: { fill: "#A86464", label: "Pruned" },
    auto_verified: { fill: "#5D8057", label: "Verified" },
    awaiting_judgment: { fill: "#9B8FAF", label: "Awaiting" },
    dispatched: { fill: "#C4A882", label: "Dispatched" },
  },
  estimate: {
    XS: "#A8B8A0",
    S: "#A8B8A0",
    M: "#6E8AA4",
    L: "#C4A882",
    XL: "#A86464",
  },
};

// ─── Parse JSON ─────────────────────────────────────────────────────────────
function loadPlan(jsonPath) {
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const { project, nodes, edges } = raw.data;
  const sorted = [...nodes].sort((a, b) => a.number - b.number);
  return { meta: raw, project, nodes: sorted, edges };
}

function isMilestone(n) {
  return n.type === "milestone" || n.estimate === "None" || n.estimate === null;
}

// ─── Measure text width (approximate) ───────────────────────────────────────
function measureText(text, fontSize) {
  // Approximate: Palatino averages ~0.52em per character at a given font size
  return text.length * fontSize * 0.52;
}

// ─── Layout DAG ─────────────────────────────────────────────────────────────
function layoutDAG(nodes, edges) {
  const children = new Map();
  const parents = new Map();
  for (const n of nodes) {
    children.set(n.id, []);
    parents.set(n.id, []);
  }
  for (const e of edges) {
    children.get(e.source)?.push(e.target);
    parents.get(e.target)?.push(e.source);
  }

  // Assign ranks via BFS
  const rank = new Map();
  const roots = nodes.filter((n) => parents.get(n.id).length === 0);
  const queue = roots.map((r) => ({ id: r.id, r: 0 }));
  while (queue.length > 0) {
    const { id, r } = queue.shift();
    if (r > (rank.get(id) ?? -1)) {
      rank.set(id, r);
      for (const c of children.get(id)) queue.push({ id: c, r: r + 1 });
    }
  }

  // Group by rank
  const ranks = new Map();
  for (const n of nodes) {
    const r = rank.get(n.id) ?? 0;
    if (!ranks.has(r)) ranks.set(r, []);
    ranks.get(r).push(n);
  }

  // Compute per-node widths based on title length
  const FONT_SIZE = 12;
  const NUM_WIDTH = 28; // "#10" badge
  const PAD_INNER = 24; // left + right padding inside node
  const NODE_H = 56;
  const H_GAP = 36;
  const V_GAP = 52;
  const PAD_X = 40;
  const PAD_Y = 60;

  const nodeWidths = new Map();
  for (const n of nodes) {
    const titleW = measureText(n.title, FONT_SIZE);
    const w = Math.max(200, NUM_WIDTH + titleW + PAD_INNER);
    nodeWidths.set(n.id, Math.ceil(w));
  }

  // Compute row widths to find max
  const maxRank = Math.max(...ranks.keys());
  let maxRowWidth = 0;
  for (const [, group] of ranks) {
    const rowW = group.reduce((s, n) => s + nodeWidths.get(n.id), 0) + (group.length - 1) * H_GAP;
    if (rowW > maxRowWidth) maxRowWidth = rowW;
  }

  // Position nodes centered per rank
  const positions = new Map();
  for (const [r, group] of ranks) {
    const rowW = group.reduce((s, n) => s + nodeWidths.get(n.id), 0) + (group.length - 1) * H_GAP;
    let x = PAD_X + (maxRowWidth - rowW) / 2;
    for (const n of group) {
      const w = nodeWidths.get(n.id);
      positions.set(n.id, { x, y: PAD_Y + r * (NODE_H + V_GAP), w, h: NODE_H });
      x += w + H_GAP;
    }
  }

  const svgW = Math.max(900, Math.ceil(maxRowWidth + PAD_X * 2)); // min 900 for legend
  const svgH = Math.ceil(PAD_Y * 2 + (maxRank + 1) * (NODE_H + V_GAP) - V_GAP + 50); // +50 for legend

  return { positions, svgW, svgH, children, parents, rank };
}

// ─── Render SVG ─────────────────────────────────────────────────────────────
function renderSVG(plan) {
  const { meta, nodes, edges } = plan;
  const { positions, svgW, svgH } = layoutDAG(nodes, edges);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="${P.textLight}" />
  </marker>
  <marker id="arr-branch" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="${P.sand}" />
  </marker>
  <filter id="shadow" x="-4%" y="-4%" width="108%" height="116%">
    <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.06"/>
  </filter>
</defs>
<rect width="${svgW}" height="${svgH}" fill="${P.bg}" rx="12"/>
`;

  // Draw edges (behind nodes)
  for (const e of edges) {
    const s = positions.get(e.source);
    const t = positions.get(e.target);
    if (!s || !t) continue;
    const sx = s.x + s.w / 2, sy = s.y + s.h;
    const tx = t.x + t.w / 2, ty = t.y;
    const isBranch = e.type === "branch";
    const color = isBranch ? P.sand : P.textLight;
    const dash = isBranch ? ' stroke-dasharray="6,4"' : "";
    const marker = isBranch ? "arr-branch" : "arr";
    const midY = (sy + ty) / 2;
    svg += `  <path d="M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}" fill="none" stroke="${color}" stroke-width="1.5"${dash} marker-end="url(#${marker})" />\n`;
  }

  // Draw nodes
  for (const n of nodes) {
    const pos = positions.get(n.id);
    if (!pos) continue;
    const ms = isMilestone(n);
    const statusColor = (P.status[n.status] || P.status.planned).fill;

    // Node background
    const fill = ms ? "rgba(93,128,87,0.06)" : "#FFFFFF";
    const dash = ms ? ' stroke-dasharray="6,3"' : "";
    svg += `  <rect x="${pos.x}" y="${pos.y}" width="${pos.w}" height="${pos.h}" rx="10" fill="${fill}" stroke="${statusColor}" stroke-width="${ms ? 2 : 1.5}"${dash} filter="url(#shadow)" />\n`;

    // Left color accent bar
    svg += `  <rect x="${pos.x}" y="${pos.y + 8}" width="3" height="${pos.h - 16}" rx="1.5" fill="${statusColor}" />\n`;

    // Number badge (colored circle)
    const badgeCx = pos.x + 18;
    const badgeCy = pos.y + pos.h / 2;
    svg += `  <circle cx="${badgeCx}" cy="${badgeCy}" r="11" fill="${statusColor}" />\n`;
    svg += `  <text x="${badgeCx}" y="${badgeCy + 4}" text-anchor="middle" font-family="'Palatino Linotype', serif" font-size="10" font-weight="700" fill="${P.textWhite}">${n.number}</text>\n`;

    // Title (full, no truncation)
    const titleX = pos.x + 34;
    const titleY = pos.y + pos.h / 2 + 4;
    const titleFont = ms ? "font-style='italic'" : "";
    svg += `  <text x="${titleX}" y="${titleY}" font-family="'Palatino Linotype', 'Book Antiqua', Palatino, serif" font-size="12" fill="${P.text}" ${titleFont}>${escapeXml(n.title)}</text>\n`;

    // (Estimate badges removed — t-shirt sizes are internal planning detail)

    // Milestone diamond indicator
    if (ms) {
      const dX = pos.x + pos.w - 16;
      const dY = pos.y + pos.h / 2;
      svg += `  <polygon points="${dX},${dY - 6} ${dX + 6},${dY} ${dX},${dY + 6} ${dX - 6},${dY}" fill="${P.green}" opacity="0.6" />\n`;
    }
  }

  // ─── Legend ──────────────────────────────────────────────────────────────
  const legendY = svgH - 40;
  const legendX = 24;
  svg += `\n  <!-- Legend -->\n`;
  svg += `  <line x1="${legendX}" y1="${legendY - 10}" x2="${svgW - legendX}" y2="${legendY - 10}" stroke="${P.gridLine}" stroke-width="1" />\n`;

  // Task node example
  svg += `  <rect x="${legendX}" y="${legendY}" width="60" height="22" rx="6" fill="#FFFFFF" stroke="${P.blue}" stroke-width="1.5" />\n`;
  svg += `  <text x="${legendX + 68}" y="${legendY + 15}" font-family="'Palatino Linotype', serif" font-size="11" fill="${P.textLight}">Task</text>\n`;

  // Milestone node example
  const lm = legendX + 120;
  svg += `  <rect x="${lm}" y="${legendY}" width="60" height="22" rx="6" fill="rgba(93,128,87,0.06)" stroke="${P.green}" stroke-width="2" stroke-dasharray="6,3" />\n`;
  svg += `  <text x="${lm + 68}" y="${legendY + 15}" font-family="'Palatino Linotype', serif" font-size="11" fill="${P.textLight}">Milestone</text>\n`;

  // Dependency edge
  const ld = lm + 150;
  svg += `  <line x1="${ld}" y1="${legendY + 11}" x2="${ld + 40}" y2="${legendY + 11}" stroke="${P.textLight}" stroke-width="1.5" marker-end="url(#arr)" />\n`;
  svg += `  <text x="${ld + 48}" y="${legendY + 15}" font-family="'Palatino Linotype', serif" font-size="11" fill="${P.textLight}">Dependency</text>\n`;

  // Branch edge
  const lb = ld + 130;
  svg += `  <line x1="${lb}" y1="${legendY + 11}" x2="${lb + 40}" y2="${legendY + 11}" stroke="${P.sand}" stroke-width="1.5" stroke-dasharray="6,4" marker-end="url(#arr-branch)" />\n`;
  svg += `  <text x="${lb + 48}" y="${legendY + 15}" font-family="'Palatino Linotype', serif" font-size="11" fill="${P.textLight}">Parallel branch</text>\n`;

  svg += `</svg>\n`;
  return svg;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Render detailed plan markdown ──────────────────────────────────────────
function renderPlanDetail(plan) {
  const { meta, project, nodes, edges } = plan;
  const idToNode = new Map(nodes.map((n) => [n.id, n]));

  const deps = new Map();
  const downstream = new Map();
  for (const n of nodes) {
    deps.set(n.id, []);
    downstream.set(n.id, []);
  }
  for (const e of edges) {
    deps.get(e.target)?.push({ from: e.source, type: e.type });
    downstream.get(e.source)?.push({ to: e.target, type: e.type });
  }

  let md = "";

  // Header with project info
  md += `<div align="center">\n\n`;
  md += `# ${meta.name}\n\n`;
  md += `**${nodes.length} tasks** &bull; **${edges.length} dependencies** &bull; Exported ${new Date(meta.exportedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n\n`;
  md += `</div>\n\n`;

  // DAG overview
  md += `## DAG Overview\n\n`;
  md += `![Planning DAG](dag.svg)\n\n`;

  // Stats summary
  const taskNodes = nodes.filter((n) => !isMilestone(n));
  const milestones = nodes.filter((n) => isMilestone(n));
  md += `### At a Glance\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| Tasks | ${taskNodes.length} |\n`;
  md += `| Milestones | ${milestones.length} |\n`;
  md += `| Dependencies | ${edges.filter((e) => e.type === "dependency").length} |\n`;
  md += `| Parallel branches | ${edges.filter((e) => e.type === "branch").length} |\n`;
  md += `\n`;

  // Critical path (longest chain)
  md += `### Execution Flow\n\n`;
  md += `\`\`\`\n`;
  // Build a simple topological ASCII
  const ranks = new Map();
  for (const n of nodes) {
    // Simple rank: count of longest path from root
    let r = 0;
    const visited = new Set();
    const stack = [{ id: n.id, depth: 0 }];
    // BFS backwards
    const q = [n.id];
    const seen = new Set([n.id]);
    let maxD = 0;
    while (q.length > 0) {
      const cur = q.shift();
      for (const d of deps.get(cur) || []) {
        if (!seen.has(d.from)) {
          seen.add(d.from);
          q.push(d.from);
          maxD++;
        }
      }
    }
    ranks.set(n.id, maxD);
  }
  // Group by rank
  const byRank = new Map();
  for (const n of nodes) {
    const r = ranks.get(n.id);
    if (!byRank.has(r)) byRank.set(r, []);
    byRank.get(r).push(n);
  }
  for (const r of [...byRank.keys()].sort((a, b) => a - b)) {
    const group = byRank.get(r);
    const indent = "  ".repeat(r);
    if (group.length === 1) {
      const n = group[0];
      const icon = isMilestone(n) ? "◆" : "●";
      md += `${indent}${icon} #${n.number} ${n.title}\n`;
    } else {
      // Parallel tasks
      for (let i = 0; i < group.length; i++) {
        const n = group[i];
        const icon = isMilestone(n) ? "◆" : "●";
        const prefix = i === 0 ? "┬─" : i === group.length - 1 ? "└─" : "├─";
        md += `${indent}${prefix} ${icon} #${n.number} ${n.title}\n`;
      }
    }
  }
  md += `\`\`\`\n\n`;

  md += `---\n\n`;
  md += `## Task Details\n\n`;

  // Per-task detail
  for (const n of nodes) {
    const ms = isMilestone(n);
    const icon = ms ? "◆" : "●";
    const statusInfo = P.status[n.status] || P.status.planned;

    md += `### ${icon} Task #${n.number}: ${n.title}\n\n`;

    // Inline badges (GitHub renders these as images)
    const badges = [];
    badges.push(`\`${statusInfo.label}\``);
    if (n.priority) badges.push(`\`${n.priority}\``);
    if (ms) badges.push("`Milestone`");
    md += badges.join(" &nbsp; ") + "\n\n";

    // Dependencies and downstream
    const nodeDeps = deps.get(n.id) || [];
    const nodeDown = downstream.get(n.id) || [];

    if (nodeDeps.length > 0 || nodeDown.length > 0) {
      md += `| | |\n|---|---|\n`;
      if (nodeDeps.length > 0) {
        const depList = nodeDeps
          .map((d) => {
            const from = idToNode.get(d.from);
            const arrow = d.type === "branch" ? "⇠" : "←";
            return `${arrow} #${from?.number} *${from?.title}*`;
          })
          .join("<br>");
        md += `| **Depends on** | ${depList} |\n`;
      }
      if (nodeDown.length > 0) {
        const downList = nodeDown
          .map((d) => {
            const to = idToNode.get(d.to);
            const arrow = d.type === "branch" ? "⇢" : "→";
            return `${arrow} #${to?.number} *${to?.title}*`;
          })
          .join("<br>");
        md += `| **Unlocks** | ${downList} |\n`;
      }
      if (n.startDate || n.endDate) {
        md += `| **Schedule** | ${n.startDate || "?"} → ${n.endDate || "?"} |\n`;
      }
      md += `\n`;
    }

    // Description
    const desc = stripHtml(n.description || "");
    if (desc.trim()) {
      md += `<details>\n<summary><strong>Task Description</strong> <em>(click to expand)</em></summary>\n\n`;
      md += desc.trim() + "\n\n";
      md += `</details>\n\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

function stripHtml(html) {
  let text = html;
  // Handle ordered lists
  text = text.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let i = 1;
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => {
      return `${i++}. ${content.replace(/<\/?p>/gi, "").trim()}\n`;
    });
  });
  // Handle unordered lists
  text = text.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, content) => {
      return `- ${content.replace(/<\/?p>/gi, "").trim()}\n`;
    });
  });
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n**$1**\n\n");
  text = text.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
  text = text.replace(/<em>(.*?)<\/em>/gi, "*$1*");
  text = text.replace(/<code>(.*?)<\/code>/gi, "`$1`");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<p>([\s\S]*?)<\/p>/gi, "$1\n\n");
  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text;
}

// ─── Render summary (for README) ────────────────────────────────────────────
function renderSummary(plan) {
  const { nodes, edges } = plan;
  const idToNode = new Map(nodes.map((n) => [n.id, n]));

  const depMap = new Map();
  for (const n of nodes) depMap.set(n.id, []);
  for (const e of edges) depMap.get(e.target)?.push(e.source);

  let md = `## Planning DAG\n\n`;
  md += `**${nodes.length} tasks** &bull; **${edges.length} dependencies**\n\n`;
  md += `![Planning DAG](dag.svg)\n\n`;

  md += `| # | Task | Depends on |\n`;
  md += `|:---:|------|------------|\n`;

  for (const n of nodes) {
    const ms = isMilestone(n);
    const depNums = (depMap.get(n.id) || []).map((id) => `#${idToNode.get(id)?.number}`).join(", ");
    const title = ms ? `**${n.title}**` : n.title;
    md += `| ${n.number} | ${ms ? "◆ " : ""}${title} | ${depNums || "--"} |\n`;
  }
  md += `\n`;
  md += `> ◆ = milestone\n`;
  md += `>\n`;
  md += `> **[View full task descriptions and prompts →](plan-detail.md)**\n`;

  return md;
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node render-plan.js <plan.astro.json> <output-dir>");
    process.exit(1);
  }

  const [jsonPath, outDir] = args;
  const plan = loadPlan(jsonPath);

  fs.mkdirSync(outDir, { recursive: true });

  const svg = renderSVG(plan);
  fs.writeFileSync(path.join(outDir, "dag.svg"), svg);
  console.log(`  dag.svg (${(svg.length / 1024).toFixed(1)}KB)`);

  const detail = renderPlanDetail(plan);
  fs.writeFileSync(path.join(outDir, "plan-detail.md"), detail);
  console.log(`  plan-detail.md (${(detail.length / 1024).toFixed(1)}KB)`);

  const summary = renderSummary(plan);
  fs.writeFileSync(path.join(outDir, "plan-summary.md"), summary);
  console.log(`  plan-summary.md (${(summary.length / 1024).toFixed(1)}KB)`);

  console.log("Done.");
}

main();
