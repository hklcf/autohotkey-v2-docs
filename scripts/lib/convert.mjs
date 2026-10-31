// HTML -> Markdown conversion tuned for the AutoHotkey v2 documentation site.
// The upstream HTML is generated from AutoHotkeyDocs and is very regular:
// semantic headings, <pre> blocks, definition lists, simple tables.

import { parse } from 'node-html-parser';

const INLINE_TAGS = new Set([
  'a', 'b', 'i', 'em', 'strong', 'code', 'kbd', 'var', 'span', 'u', 's',
  'sup', 'sub', 'br', 'img', 'small', 'big', 'font', 'nobr', 'del', 'ins',
]);

const BLOCK_TAGS = new Set([
  'p', 'div', 'ul', 'ol', 'dl', 'table', 'pre', 'blockquote', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'link', 'meta',
]);

const VOID_TAGS = new Set(['br', 'img', 'hr', 'meta', 'link', 'input', 'wbr', 'col']);

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
  copy: '\u00a9', reg: '\u00ae', trade: '\u2122', mdash: '\u2014',
  ndash: '\u2013', hellip: '\u2026', laquo: '\u00ab', raquo: '\u00bb',
  times: '\u00d7', divide: '\u00f7', deg: '\u00b0', middot: '\u00b7',
  bull: '\u2022', rarr: '\u2192', larr: '\u2190', uarr: '\u2191',
  darr: '\u2193', harr: '\u2194', shy: '\u00ad', ensp: '\u2002',
  emsp: '\u2003', thinsp: '\u2009',
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const key = body.toLowerCase();
    return Object.prototype.hasOwnProperty.call(ENTITIES, key) ? ENTITIES[key] : m;
  });
}

function escapeText(text) {
  return text
    .replace(/\\/g, (m, i, s) => (/[\\`*_{}[\]()#+\-.!|>~]/.test(s[i + 1] ?? '') ? '\\\\' : m))
    .replace(/([`*<>])/g, '\\$1')
    .replace(/(^|\s)_(?=\S)/g, '$1\\_');
}

function escapeTableCell(text) {
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function codeSpan(text) {
  const value = text.replace(/\r?\n/g, ' ').trim();
  if (!value) return '';
  const longest = Math.max(0, ...(value.match(/`+/g) ?? []).map((s) => s.length));
  const fence = '`'.repeat(longest + 1);
  const pad = value.startsWith('`') || value.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${value}${pad}${fence}`;
}

function fencedCode(text, lang = '') {
  const body = text.replace(/\r\n/g, '\n').replace(/\s+$/, '').replace(/^\n+/, '');
  if (!body.trim()) return '';
  const longest = Math.max(0, ...(body.match(/`+/g) ?? []).map((s) => s.length));
  const fence = '`'.repeat(Math.max(3, longest + 1));
  return `${fence}${lang}\n${body}\n${fence}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function attr(node, name) {
  return node.getAttribute?.(name) ?? undefined;
}

function classList(node) {
  return (attr(node, 'class') ?? '').split(/\s+/).filter(Boolean);
}

function rewriteHref(href, ctx) {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(href)) {
    if (href.startsWith('#')) return href;
    return href;
  }
  const hashAt = href.indexOf('#');
  let pathPart = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const hash = hashAt >= 0 ? href.slice(hashAt) : '';
  pathPart = pathPart.replace(/\.html?$/i, '.md');
  if (pathPart.endsWith('/')) pathPart += 'index.md';
  if (/\.(ahk|reg|txt|zip|png|jpe?g|gif|svg)$/i.test(pathPart)) ctx.files.add(pathPart);
  return pathPart + hash;
}

function inlineText(node) {
  return (node.textContent ?? '').replace(/\s+/g, ' ');
}

function inlineChildren(node, ctx) {
  let out = '';
  for (const child of node.childNodes ?? []) out += inline(child, ctx);
  return out.replace(/[ \t]{2,}/g, ' ').replace(/\u00a0/g, ' ');
}

function inline(node, ctx) {
  if (node.nodeType === 3) return escapeText(inlineText(node));
  if (node.nodeType !== 1) return '';
  const id = attr(node, 'id');
  const anchorMarkup = id ? anchor(id, ctx) : '';
  return anchorMarkup + inlineInner(node, ctx);
}

function inlineInner(node, ctx) {
  const tag = (node.rawTagName ?? '').toLowerCase();
  const cls = classList(node);

  if (tag === 'script' || tag === 'style') return '';
  if (tag === 'br') return '<br>';
  if (tag === 'img') {
    const src = attr(node, 'src') ?? '';
    const alt = attr(node, 'alt') ?? '';
    if (src && !/^(?:https?:|data:)/i.test(src)) ctx.images.add(src);
    return src ? `![${escapeText(alt)}](${src})` : '';
  }
  if (tag === 'a') {
    const text = inlineChildren(node, ctx).trim();
    if (!text) return '';
    const href = attr(node, 'href');
    if (!href) return text;
    return `[${text}](${rewriteHref(href, ctx)})`;
  }
  if (tag === 'code') {
    const value = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    return value ? codeSpan(value) : '';
  }
  if (tag === 'kbd') {
    const value = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    return value ? codeSpan(value) : '';
  }
  if (tag === 'strong' || tag === 'b') {
    const inner = inlineChildren(node, ctx).trim();
    return inner ? `**${inner}**` : '';
  }
  if (tag === 'em' || tag === 'i') {
    const inner = inlineChildren(node, ctx).trim();
    return inner ? `*${inner}*` : '';
  }
  if (tag === 's' || tag === 'del') {
    const inner = inlineChildren(node, ctx).trim();
    return inner ? `~~${inner}~~` : '';
  }
  if (tag === 'u') {
    const inner = inlineChildren(node, ctx).trim();
    return inner ? `<u>${inner}</u>` : '';
  }
  if (tag === 'sup') return `^${inlineChildren(node, ctx).trim()}`;
  if (tag === 'sub') return `_${inlineChildren(node, ctx).trim()}`;
  if (tag === 'var') {
    const inner = inlineChildren(node, ctx).trim();
    return inner ? `*${inner}*` : '';
  }
  if (tag === 'span' && cls.includes('dull')) {
    return `*${inlineChildren(node, ctx).trim()}*`;
  }
  return inlineChildren(node, ctx);
}

// Flatten block children into a single inline run (used for table cells and
// paragraphs that illegally contain block elements).
function flatten(node, ctx) {
  if (node.nodeType === 3) return escapeText(inlineText(node));
  if (node.nodeType !== 1) return '';
  const tag = (node.rawTagName ?? '').toLowerCase();
  const id = attr(node, 'id');
  const prefix = id && !INLINE_TAGS.has(tag) ? anchor(id, ctx) : '';
  return prefix + flattenInner(node, ctx);
}

function flattenInner(node, ctx) {
  const tag = (node.rawTagName ?? '').toLowerCase();
  if (tag === 'br') return '<br>';
  if (tag === 'script' || tag === 'style') return '';
  if (INLINE_TAGS.has(tag)) return inline(node, ctx);
  const cls = classList(node);
  if (tag === 'div' && cls.includes('fake-sep')) return '---';
  if (tag === 'ul' || tag === 'ol') {
    const items = (node.childNodes ?? [])
      .filter((n) => n.nodeType === 1 && (n.rawTagName ?? '').toLowerCase() === 'li')
      .map((li) => {
        const a = attr(li, 'id') ? anchor(attr(li, 'id'), ctx) : '';
        return a + flattenChildren(li, ctx).trim();
      })
      .filter(Boolean);
    return items.join(' <br> ');
  }
  if (tag === 'pre') {
    const code = preText(node);
    return code ? `<code>${escapeText(code).replace(/\n/g, '<br>')}</code>` : '';
  }
  if (tag === 'p') {
    const inner = flattenChildren(node, ctx).trim();
    return inner ? `${inner}<br>` : '';
  }
  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    const inner = flattenChildren(node, ctx).trim();
    return inner ? `**${inner}**<br>` : '';
  }
  if (tag === 'dl') {
    const parts = [];
    for (const child of node.childNodes ?? []) {
      if (child.nodeType !== 1) continue;
      const t = (child.rawTagName ?? '').toLowerCase();
      if (t === 'dt') parts.push(`**${flattenChildren(child, ctx).trim()}**`);
      else if (t === 'dd') parts.push(`${flattenChildren(child, ctx).trim()}<br>`);
    }
    return parts.join(' ');
  }
  return flattenChildren(node, ctx);
}

function flattenChildren(node, ctx) {
  let out = '';
  for (const child of node.childNodes ?? []) out += flatten(child, ctx);
  return out;
}

function preText(node) {
  let html = node.innerHTML ?? '';
  // <pre> is parsed as raw text, so its inner tags are still literal here.
  html = html.replace(/<br\s*\/?>/gi, '\n');
  html = html.replace(/<\/?[a-zA-Z][^>]*>/g, '');
  html = decodeEntities(html).replace(/\u00a0/g, ' ');
  return html.replace(/\r\n/g, '\n');
}

function serialize(node, ctx) {
  if (node.nodeType === 3) {
    return escapeText(node.textContent ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  if (node.nodeType !== 1) return '';
  const tag = (node.rawTagName ?? '').toLowerCase();
  if (tag === 'script' || tag === 'style') return '';
  if (VOID_TAGS.has(tag)) {
    if (tag === 'br') return '<br>';
    if (tag === 'img') return `<img src="${attr(node, 'src') ?? ''}" alt="${attr(node, 'alt') ?? ''}">`;
    return '';
  }
  const keep = [];
  if (attr(node, 'id')) keep.push(`id="${attr(node, 'id')}"`);
  if (attr(node, 'colspan')) keep.push(`colspan="${attr(node, 'colspan')}"`);
  if (attr(node, 'rowspan')) keep.push(`rowspan="${attr(node, 'rowspan')}"`);
  if (tag === 'a') {
    const href = attr(node, 'href');
    if (href) keep.push(`href="${rewriteHref(href, ctx)}"`);
  }
  if (tag === 'img') {
    const src = attr(node, 'src');
    if (src) keep.push(`src="${src}"`);
  }
  if (attr(node, 'title')) keep.push(`title="${attr(node, 'title')}"`);
  const inner = (node.childNodes ?? []).map((c) => serialize(c, ctx)).join('');
  const open = keep.length ? `<${tag} ${keep.join(' ')}>` : `<${tag}>`;
  return `${open}${inner}</${tag}>`;
}

function renderTable(table, ctx) {
  // Preserve the table element's own id (used as a link target / CSS hook).
  const tableAnchor = attr(table, 'id') ? `${anchor(attr(table, 'id'), ctx)}\n\n` : '';
  const rows = [];
  const collect = (node) => {
    for (const child of node.childNodes ?? []) {
      if (child.nodeType !== 1) continue;
      const tag = (child.rawTagName ?? '').toLowerCase();
      if (tag === 'tr') rows.push(child);
      else if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') collect(child);
    }
  };
  collect(table);
  if (!rows.length) return '';

  const cellsOf = (row) =>
    (row.childNodes ?? []).filter((n) => n.nodeType === 1 && ['td', 'th'].includes((n.rawTagName ?? '').toLowerCase()));

  // A nested table cannot survive flattening into a single cell; keep the
  // original markup for those rare cases.
  if (rows.some((r) => cellsOf(r).some((c) => c.querySelector('table')))) {
    return tableAnchor + serialize(table, ctx).replace(/\n\s*\n/g, '\n');
  }

  const span = (node, name) => {
    const value = Number.parseInt(attr(node, name) ?? '1', 10);
    return Number.isFinite(value) && value > 1 ? value : 1;
  };

  // Expand rowspan/colspan into a rectangular grid so GFM pipe tables can
  // represent the result. A rowspan contributes its text once and blanks in
  // the rows it continues into; a colspan contributes blank filler cells.
  const pending = [];
  const grid = rows.map((row) => {
    const rowAnchor = attr(row, 'id') ? anchor(attr(row, 'id'), ctx) : '';
    const out = [];
    let col = 0;
    const fillPending = () => {
      while ((pending[col] ?? 0) > 0) {
        out.push('');
        pending[col] -= 1;
        col += 1;
      }
    };
    for (const cell of cellsOf(row)) {
      fillPending();
      const cols = span(cell, 'colspan');
      const rowspans = span(cell, 'rowspan');
      const cellAnchor = attr(cell, 'id') ? anchor(attr(cell, 'id'), ctx) : '';
      const text = flattenChildren(cell, ctx).replace(/\s+/g, ' ').trim().replace(/(?:<br>\s*)+$/i, '');
      out.push(cellAnchor + text);
      for (let i = 1; i < cols; i++) out.push('');
      if (rowspans > 1) {
        for (let i = 0; i < cols; i++) pending[col + i] = (pending[col + i] ?? 0) + rowspans - 1;
      }
      col += cols;
      fillPending();
    }
    fillPending();
    if (rowAnchor) {
      if (out.length) out[0] = rowAnchor + out[0];
      else out.push(rowAnchor);
    }
    while (out.length > 1 && out[out.length - 1] === '') out.pop();
    return out;
  });

  const width = Math.max(...grid.map((r) => r.length));
  if (!width) return '';
  for (const row of grid) while (row.length < width) row.push('');

  const headerIndex = rows.findIndex((r) => cellsOf(r).some((c) => (c.rawTagName ?? '').toLowerCase() === 'th'));
  const head = headerIndex > 0 ? grid.splice(headerIndex, 1)[0] : grid.shift();

  const aligns = head.map((_, i) => {
    const cell = cellsOf(rows[headerIndex >= 0 ? headerIndex : 0])[i];
    const cls = cell ? classList(cell) : [];
    if (cls.includes('center')) return ':---:';
    if (cls.includes('right')) return '---:';
    return '---';
  });

  const line = (cells) => `| ${cells.map((c) => escapeTableCell(c)).join(' | ')} |`;
  const out = [line(head), line(aligns), ...grid.map(line)];
  return tableAnchor + out.join('\n');
}

function anchor(id, ctx) {
  if (!id || ctx.anchors.has(id)) return '';
  ctx.anchors.add(id);
  return `<a id="${id}"></a>`;
}

function heading(node, ctx) {
  const tag = (node.rawTagName ?? '').toLowerCase();
  const level = Number(tag[1]);
  const text = inlineChildren(node, ctx).trim();
  if (!text) return '';
  const id = attr(node, 'id');
  const slug = slugify(node.textContent ?? '');
  const parts = [];
  if (id && slug !== id) parts.push(anchor(id, ctx));
  parts.push(`${'#'.repeat(level)} ${text}`);
  return parts.filter(Boolean).join('\n');
}

function renderDl(dl, ctx) {
  const items = [];
  let current = null;
  for (const child of dl.childNodes ?? []) {
    if (child.nodeType !== 1) continue;
    const tag = (child.rawTagName ?? '').toLowerCase();
    if (tag === 'dt') {
      current = { term: inlineChildren(child, ctx).trim(), id: attr(child, 'id'), dd: [] };
      items.push(current);
    } else if (tag === 'dd' && current) {
      const ddAnchor = attr(child, 'id') ? anchor(attr(child, 'id'), ctx) : '';
      const body = renderBlocks(child.childNodes ?? [], ctx);
      if (body) current.dd.push(ddAnchor ? `${ddAnchor}\n\n${body}` : body);
    }
  }
  return items
    .map((item) => {
      const parts = [];
      if (item.id) parts.push(anchor(item.id, ctx));
      if (item.term) parts.push(`**${item.term}**`);
      for (const dd of item.dd) parts.push(dd);
      return parts.filter(Boolean).join('\n\n');
    })
    .filter(Boolean)
    .join('\n\n');
}

function splitListItem(li, ctx) {
  const children = [...(li.childNodes ?? [])];
  const isBlock = (n) =>
    n.nodeType === 1 && BLOCK_TAGS.has((n.rawTagName ?? '').toLowerCase()) &&
    !INLINE_TAGS.has((n.rawTagName ?? '').toLowerCase());

  let first = '';
  let rest = [];
  if (children.length && children[0].nodeType === 1 && (children[0].rawTagName ?? '').toLowerCase() === 'p') {
    first = inlineChildren(children[0], ctx).trim();
    rest = children.slice(1);
  } else {
    const leading = [];
    let i = 0;
    for (; i < children.length; i++) {
      const c = children[i];
      if (isBlock(c)) break;
      leading.push(c);
    }
    if (leading.some((n) => (n.textContent ?? '').trim())) {
      const holder = { childNodes: leading, nodeType: 1, rawTagName: 'span' };
      first = inlineChildren(holder, ctx).trim();
      rest = children.slice(i);
    } else {
      rest = children;
    }
  }
  return { first, rest };
}

function renderList(list, ctx) {
  const ordered = (list.rawTagName ?? '').toLowerCase() === 'ol';
  const items = (list.childNodes ?? []).filter(
    (n) => n.nodeType === 1 && (n.rawTagName ?? '').toLowerCase() === 'li',
  );
  const listAnchor = attr(list, 'id') ? anchor(attr(list, 'id'), ctx) : '';
  const body = items
    .map((li, index) => {
      const { first, rest } = splitListItem(li, ctx);
      const marker = ordered ? `${index + 1}. ` : '- ';
      const id = attr(li, 'id');
      const a = id ? anchor(id, ctx) : '';
      const tail = renderBlocks(rest, ctx, '    ');
      let line = marker + (a ? `${a} ` : '') + first;
      if (tail) line += (first ? '\n' : '') + tail;
      return line;
    })
    .join('\n');
  return listAnchor ? `${listAnchor}\n\n${body}` : body;
}

function renderBlockquote(bq, ctx) {
  const inner = renderBlocks(bq.childNodes ?? [], ctx);
  if (!inner) return '';
  return inner
    .split('\n')
    .map((line) => (line ? `> ${line}` : '>'))
    .join('\n');
}

function exampleBlock(div, ctx) {
  const id = attr(div, 'id');
  const inner = renderBlocks(div.childNodes ?? [], ctx);
  if (!inner) return '';
  let body;
  if (inner.startsWith('```') || inner.startsWith('<a id=') || inner.startsWith('|') || inner.startsWith('>')) {
    body = `**Example**\n\n${inner}`;
  } else {
    body = inner.replace(/^/, '**Example:** ');
  }
  const a = id ? anchor(id, ctx) : '';
  return [a, body].filter(Boolean).join('\n\n');
}

function renderDiv(div, ctx) {
  const cls = classList(div);
  if (cls.includes('fake-sep')) return '';
  const id = attr(div, 'id');
  if (cls.includes('ex')) return exampleBlock(div, ctx);
  if (cls.includes('methodShort')) {
    const a = id ? anchor(id, ctx) : '';
    const inner = renderBlocks(div.childNodes ?? [], ctx);
    return [a, inner].filter(Boolean).join('\n\n');
  }
  return renderBlocks(div.childNodes ?? [], ctx);
}

function blockNode(node, ctx, indent = '') {
  if (node.nodeType === 3) {
    const text = escapeText(inlineText(node).trim());
    return text;
  }
  if (node.nodeType !== 1) return '';
  const tag = (node.rawTagName ?? '').toLowerCase();

  if (tag === 'script' || tag === 'style' || tag === 'link' || tag === 'meta') return '';
  if (/^h[1-6]$/.test(tag)) return heading(node, ctx);
  if (tag === 'p') {
    const cls = classList(node);
    const id = attr(node, 'id');
    const a = id ? anchor(id, ctx) : '';
    const isQuote = cls.includes('note') || cls.includes('warning');
    const quote = (text) =>
      text
        .split(/\n/)
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n');

    // Upstream sometimes nests block elements (usually a list) inside a <p>.
    // Render leading/inline runs as paragraphs and hand the blocks to blockNode.
    const parts = [];
    let run = [];
    const flush = () => {
      if (!run.length) return;
      const text = inlineChildren({ childNodes: run }, ctx).trim();
      run = [];
      if (text) parts.push(isQuote ? quote(text) : text);
    };
    for (const child of node.childNodes ?? []) {
      const childTag = child.nodeType === 1 ? (child.rawTagName ?? '').toLowerCase() : '';
      if (childTag && BLOCK_TAGS.has(childTag) && !INLINE_TAGS.has(childTag)) {
        flush();
        const rendered = blockNode(child, ctx, indent);
        if (rendered && rendered.trim()) parts.push(rendered);
      } else {
        run.push(child);
      }
    }
    flush();
    const body = parts.join('\n\n');
    if (!body) return a;
    return [a, body].filter(Boolean).join('\n\n');
  }
  if (tag === 'pre') {
    const cls = classList(node);
    const lang = cls.some((c) => c.toLowerCase() === 'no-highlight') ? '' : 'ahk';
    const ids = [attr(node, 'id'), ...[...(node.innerHTML ?? '').matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])];
    const a = ids.map((x) => (x ? anchor(x, ctx) : '')).filter(Boolean).join('\n');
    const code = fencedCode(preText(node), lang);
    return [a, code].filter(Boolean).join('\n\n');
  }
  if (tag === 'dl') return renderDl(node, ctx);
  if (tag === 'ul' || tag === 'ol') return renderList(node, ctx);
  if (tag === 'table') return renderTable(node, ctx);
  if (tag === 'blockquote') return renderBlockquote(node, ctx);
  if (tag === 'hr') return '---';
  if (tag === 'div') return renderDiv(node, ctx);
  if (tag === 'br') return '';
  if (tag === 'a') {
    const id = attr(node, 'id');
    const text = inlineChildren(node, ctx).trim();
    if (!text && id) return anchor(id, ctx);
    return text;
  }
  if (tag === 'img') return inline(node, ctx);
  if (INLINE_TAGS.has(tag)) return inline(node, ctx).trim();
  // Unknown block: render its children as blocks.
  return renderBlocks(node.childNodes ?? [], ctx, indent);
}

function renderBlocks(nodes, ctx, indent = '') {
  const parts = [];
  for (const node of nodes) {
    const text = blockNode(node, ctx, indent);
    if (!text || !text.trim()) continue;
    parts.push(indentLines(text, indent));
  }
  return parts.join('\n\n');
}

function indentLines(text, indent) {
  if (!indent) return text;
  return text
    .split('\n')
    .map((line) => (line ? indent + line : line))
    .join('\n');
}

function cleanup(markdown) {
  let out = markdown.replace(/\r\n?/g, '\n');
  out = out.replace(/[ \t]+\n/g, '\n');
  out = out.replace(/<br>(?=\n?$)/g, '');
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/^\n+/, '').replace(/\s+$/, '');
  return out ? `${out}\n` : '';
}

export function convertPage(html, sourcePath) {
  const root = parse(html, {
    comment: false,
    blockTextElements: { script: true, style: true, pre: true },
  });
  const body = root.querySelector('body') ?? root;

  const ctx = {
    source: sourcePath,
    anchors: new Set(),
    images: new Set(),
    files: new Set(),
  };

  // Strip site chrome and analytics.
  for (const el of body.querySelectorAll('script, style, link, meta')) el.remove();
  const scrub = (node) => {
    for (const child of [...(node.childNodes ?? [])]) {
      if (child.nodeType === 1) {
        if (attr(child, 'aria-hidden') === 'true') {
          child.remove();
          continue;
        }
        scrub(child);
      }
    }
  };
  scrub(body);

  let markdown = renderBlocks(body.childNodes ?? [], ctx);
  markdown = cleanup(markdown);

  // Drop leftover cloudflare artifacts and stray inline scripts text.
  markdown = markdown
    .replace(/\n*\(function\(\)\{function c\(\).*$/s, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/, '') + '\n';

  return { markdown, ctx };
}
