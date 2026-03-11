#!/usr/bin/env node
/**
 * render-blog.js — Convert a Markdown blog post into a styled HTML page and PDF.
 *
 * Usage:
 *   node utils/render-blog.js <post.md> <output-dir> [--figures=<figures-dir>]
 *
 * Outputs:
 *   <output-dir>/blog.html  — Styled HTML blog post
 *   (PDF generated separately via Chrome headless)
 *
 * The --figures flag remaps image paths to a relative directory (default: "figures").
 */

const fs = require("fs");
const path = require("path");

// ─── Palette (matches Astro examples aesthetic) ──────────────────────────────
const P = {
  bg: "#FAF8F5",
  text: "#3A3A3A",
  textLight: "#6A6A6A",
  sand: "#C4A882",
  blue: "#6E8AA4",
  sage: "#A8B8A0",
  green: "#5D8057",
  rose: "#A86464",
  lavender: "#9B8FAF",
  codeBg: "#F5F2EE",
  tableBorder: "#E0DCD8",
  linkColor: "#6E8AA4",
};

// ─── Markdown → HTML ─────────────────────────────────────────────────────────

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Lightweight Markdown-to-HTML converter.
 * Handles: headers, bold, italic, inline code, links, images, tables,
 * code blocks, blockquotes, lists, horizontal rules, LaTeX math.
 */
function markdownToHtml(md, figuresDir) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  let inList = null; // "ul" | "ol" | null

  function closeList() {
    if (inList) {
      out.push(`</${inList}>`);
      inList = null;
    }
  }

  function inlineFormat(text) {
    // Protect LaTeX from other formatting: temporarily replace math spans
    const mathBlocks = [];
    // Display math (shouldn't appear inline, but protect anyway)
    text = text.replace(/\$\$([^$]+)\$\$/g, (_, m) => {
      mathBlocks.push(`$$${m}$$`);
      return `\x00MATH${mathBlocks.length - 1}\x00`;
    });
    // Inline math
    text = text.replace(/\$([^$\n]+?)\$/g, (_, m) => {
      mathBlocks.push(`$${m}$`);
      return `\x00MATH${mathBlocks.length - 1}\x00`;
    });

    // Inline code
    text = text.replace(/`([^`]+?)`/g, '<code>$1</code>');
    // Images: ![alt](src)
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      const resolvedSrc = resolveFigurePath(src, figuresDir);
      return `<figure><img src="${resolvedSrc}" alt="${escapeHtml(alt)}" loading="lazy"><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
    });
    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Bold+italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Italic
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Restore math
    text = text.replace(/\x00MATH(\d+)\x00/g, (_, idx) => {
      const m = mathBlocks[parseInt(idx)];
      // Wrap in spans for KaTeX auto-render
      if (m.startsWith("$$")) return m;
      return m;
    });

    return text;
  }

  function resolveFigurePath(src, figuresDir) {
    if (src.startsWith("http")) return src;
    // Normalize: strip leading ../ and resolve to figuresDir
    const basename = path.basename(src);
    return figuresDir ? `${figuresDir}/${basename}` : src;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.match(/^```/)) {
      closeList();
      const lang = line.replace(/^```/, "").trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // skip closing ```
      out.push(
        `<pre><code${lang ? ` class="language-${lang}"` : ""}>${codeLines.join("\n")}</code></pre>`
      );
      continue;
    }

    // Display math block ($$...$$)
    if (line.trim().startsWith("$$") && !line.trim().endsWith("$$")) {
      closeList();
      const mathLines = [line];
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) {
        mathLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        mathLines.push(lines[i]);
        i++;
      }
      out.push(`<div class="math-block">${mathLines.join("\n")}</div>`);
      continue;
    }
    // Single-line display math
    if (line.trim().startsWith("$$") && line.trim().endsWith("$$")) {
      closeList();
      out.push(`<div class="math-block">${line.trim()}</div>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+\s*$/) || line.match(/^\*\*\*+\s*$/)) {
      closeList();
      out.push("<hr>");
      i++;
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      closeList();
      const level = headerMatch[1].length;
      const text = inlineFormat(headerMatch[2]);
      out.push(`<h${level}>${text}</h${level}>`);
      i++;
      continue;
    }

    // Table (detect by pipe-delimited lines)
    if (line.match(/^\|.+\|/) && i + 1 < lines.length && lines[i + 1].match(/^\|[-:\s|]+\|/)) {
      closeList();
      const tableLines = [];
      while (i < lines.length && lines[i].match(/^\|.+\|/)) {
        tableLines.push(lines[i]);
        i++;
      }
      out.push(renderTable(tableLines));
      continue;
    }

    // Image on its own line: ![alt](src)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      closeList();
      const alt = imgMatch[1];
      const src = resolveFigurePath(imgMatch[2], figuresDir);
      // Check if next line is an italic caption (*text*)
      let caption = alt;
      if (i + 1 < lines.length && lines[i + 1].match(/^\*[^*].*\*$/)) {
        caption = lines[i + 1].replace(/^\*/, "").replace(/\*$/, "");
        i++;
      }
      out.push(
        `<figure><img src="${src}" alt="${escapeHtml(alt)}" loading="lazy"><figcaption>${inlineFormat(caption)}</figcaption></figure>`
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.match(/^>\s*/)) {
      closeList();
      const bqLines = [];
      while (i < lines.length && lines[i].match(/^>\s*/)) {
        bqLines.push(lines[i].replace(/^>\s*/, ""));
        i++;
      }
      out.push(`<blockquote>${bqLines.map(l => `<p>${inlineFormat(l)}</p>`).join("\n")}</blockquote>`);
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s+/)) {
      if (inList !== "ul") {
        closeList();
        inList = "ul";
        out.push("<ul>");
      }
      out.push(`<li>${inlineFormat(line.replace(/^[-*]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (inList !== "ol") {
        closeList();
        inList = "ol";
        out.push("<ol>");
      }
      out.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      // Peek ahead: if next non-empty line continues the same list type, keep it open
      let nextIdx = i + 1;
      while (nextIdx < lines.length && lines[nextIdx].trim() === "") nextIdx++;
      const nextLine = nextIdx < lines.length ? lines[nextIdx] : "";
      const continuesList =
        (inList === "ul" && nextLine.match(/^[-*]\s+/)) ||
        (inList === "ol" && nextLine.match(/^\d+\.\s+/));
      if (!continuesList) closeList();
      i++;
      continue;
    }

    // Italic-only line (caption after image): *text*
    if (line.match(/^\*[^*].*\*$/) && out.length > 0 && out[out.length - 1].includes("</figure>")) {
      // Already handled above as part of image caption
      i++;
      continue;
    }

    // Regular paragraph
    closeList();
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].match(/^[-*]\s+/) &&
      !lines[i].match(/^\d+\.\s+/) &&
      !lines[i].match(/^```/) &&
      !lines[i].match(/^---/) &&
      !lines[i].match(/^\|/) &&
      !lines[i].match(/^>/) &&
      !lines[i].match(/^!\[/) &&
      !lines[i].match(/^\$\$/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    out.push(`<p>${inlineFormat(paraLines.join(" "))}</p>`);
  }
  closeList();
  return out.join("\n");
}

function renderTable(lines) {
  // Parse header, alignment, and rows
  const parseRow = (line) =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const header = parseRow(lines[0]);
  const aligns = parseRow(lines[1]).map((c) => {
    if (c.match(/^:-+:$/)) return "center";
    if (c.match(/^-+:$/)) return "right";
    return "left";
  });

  let html = '<div class="table-wrap"><table>\n<thead><tr>';
  for (let j = 0; j < header.length; j++) {
    html += `<th style="text-align:${aligns[j] || "left"}">${inlineFormatSimple(header[j])}</th>`;
  }
  html += "</tr></thead>\n<tbody>";

  for (let r = 2; r < lines.length; r++) {
    const cells = parseRow(lines[r]);
    html += "<tr>";
    for (let j = 0; j < cells.length; j++) {
      html += `<td style="text-align:${aligns[j] || "left"}">${inlineFormatSimple(cells[j])}</td>`;
    }
    html += "</tr>\n";
  }
  html += "</tbody></table></div>";
  return html;
}

function inlineFormatSimple(text) {
  // Simplified inline formatting for table cells
  text = text.replace(/`([^`]+?)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline math
  text = text.replace(/\$([^$\n]+?)\$/g, (_, m) => `$${m}$`);
  return text;
}

// ─── HTML Template ───────────────────────────────────────────────────────────

function wrapHtml(bodyHtml, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});"></script>
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 22mm 18mm;
  }

  :root {
    --bg: ${P.bg};
    --text: ${P.text};
    --text-light: ${P.textLight};
    --sand: ${P.sand};
    --blue: ${P.blue};
    --sage: ${P.sage};
    --code-bg: ${P.codeBg};
    --table-border: ${P.tableBorder};
    --link: ${P.linkColor};
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 32px 64px;
    font-size: 16px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Typography ── */
  h1 {
    font-size: 2.2em;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.3em;
    color: var(--text);
  }

  h2 {
    font-size: 1.5em;
    font-weight: 600;
    margin: 1.8em 0 0.6em;
    padding-bottom: 0.25em;
    border-bottom: 2px solid var(--sand);
    color: var(--text);
  }

  h3 {
    font-size: 1.2em;
    font-weight: 600;
    margin: 1.4em 0 0.5em;
    color: var(--text);
  }

  h4, h5, h6 {
    font-size: 1.05em;
    font-weight: 600;
    margin: 1.2em 0 0.4em;
  }

  p {
    margin: 0.8em 0;
  }

  a {
    color: var(--link);
    text-decoration: none;
    border-bottom: 1px solid rgba(110,138,164,0.3);
  }
  a:hover {
    border-bottom-color: var(--link);
  }

  strong { font-weight: 700; }
  em { font-style: italic; }

  /* ── Horizontal rule ── */
  hr {
    border: none;
    height: 2px;
    background: var(--sand);
    margin: 2.5em 0;
    opacity: 0.5;
  }

  /* ── Lists ── */
  ul, ol {
    margin: 0.8em 0;
    padding-left: 1.8em;
  }
  li {
    margin: 0.35em 0;
  }
  ul li::marker {
    color: var(--blue);
  }
  ol li::marker {
    color: var(--blue);
    font-weight: 600;
  }

  /* ── Code ── */
  code {
    font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 0.88em;
    background: var(--code-bg);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    color: var(--text);
  }
  pre {
    background: var(--code-bg);
    border-left: 3px solid var(--blue);
    border-radius: 6px;
    padding: 16px 20px;
    overflow-x: auto;
    margin: 1.2em 0;
    line-height: 1.5;
  }
  pre code {
    background: none;
    padding: 0;
    font-size: 0.85em;
  }

  /* ── Blockquote ── */
  blockquote {
    border-left: 4px solid var(--sand);
    background: rgba(196,168,130,0.08);
    padding: 12px 20px;
    margin: 1.2em 0;
    border-radius: 0 6px 6px 0;
  }
  blockquote p {
    margin: 0.3em 0;
    color: var(--text-light);
  }

  /* ── Figures ── */
  figure {
    margin: 1.8em 0;
    text-align: center;
  }
  figure img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid var(--table-border);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  figcaption {
    margin-top: 8px;
    font-size: 0.88em;
    color: var(--text-light);
    line-height: 1.4;
    font-style: italic;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── Tables ── */
  .table-wrap {
    overflow-x: auto;
    margin: 1.2em 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92em;
  }
  th {
    background: rgba(110,138,164,0.1);
    font-weight: 600;
    padding: 10px 14px;
    border-bottom: 2px solid var(--blue);
    text-align: left;
  }
  td {
    padding: 8px 14px;
    border-bottom: 1px solid var(--table-border);
  }
  tr:last-child td {
    border-bottom: none;
  }
  tbody tr:hover {
    background: rgba(110,138,164,0.04);
  }

  /* ── Math ── */
  .math-block {
    margin: 1.2em 0;
    padding: 12px 16px;
    background: rgba(110,138,164,0.06);
    border-left: 3px solid var(--blue);
    border-radius: 0 6px 6px 0;
    overflow-x: auto;
    text-align: center;
  }

  /* ── Print ── */
  @media print {
    body {
      padding: 0;
      max-width: none;
      font-size: 11pt;
    }
    figure {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    h2, h3 {
      break-after: avoid;
      page-break-after: avoid;
    }
    pre, blockquote, .table-wrap {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: node render-blog.js <post.md> <output-dir> [--figures=<dir>]");
    process.exit(1);
  }

  const mdPath = args[0];
  const outDir = args[1];
  let figuresDir = null;

  for (const arg of args.slice(2)) {
    if (arg.startsWith("--figures=")) {
      figuresDir = arg.replace("--figures=", "");
    }
  }

  const md = fs.readFileSync(mdPath, "utf-8");

  // Extract title from first H1
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Blog Post";

  const bodyHtml = markdownToHtml(md, figuresDir);
  const html = wrapHtml(bodyHtml, title);

  fs.mkdirSync(outDir, { recursive: true });

  const htmlPath = path.join(outDir, "blog.html");
  fs.writeFileSync(htmlPath, html);
  console.log(`  blog.html (${(html.length / 1024).toFixed(1)}KB)`);
  console.log(`\nTo generate PDF:`);
  console.log(
    `  /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\`
  );
  console.log(`    --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${path.join(outDir, "blog.pdf")}" \\`);
  console.log(`    --no-margins \\`);
  console.log(`    "file://${path.resolve(htmlPath)}"`);
  console.log("\nDone.");
}

main();
