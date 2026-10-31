#!/usr/bin/env node
// Regenerates references/ from the official AutoHotkey v2 documentation.
//
//   npm run update             # fetch, convert, write changed files
//   npm run update -- --check  # fetch + convert, report diffs, write nothing
//   npm run update -- --offline# rebuild from .cache/raw (no network)
//
// Exit codes: 0 = success / no changes, 1 = changes found (--check) or error.

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertPage, decodeEntities } from './lib/convert.mjs';

const BASE = 'https://www.autohotkey.com/docs/v2/';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REFS = join(ROOT, 'references');
const CACHE = join(ROOT, '.cache', 'raw');
const SNAPSHOT = join(ROOT, 'snapshot.json');
const USER_AGENT = 'ahk-v2-docs-skill/1.0';

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const OFFLINE = args.includes('--offline');
const VERBOSE = args.includes('--verbose');
const STRICT = args.includes('--strict');
const CONCURRENCY = Number((args.find((a) => a.startsWith('--concurrency=')) ?? '').split('=')[1] ?? 8);

const log = (...m) => console.log(...m);
const warn = (...m) => console.warn('warning:', ...m);

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

async function fetchBuffer(url, { retries = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': USER_AGENT },
        signal: AbortSignal.timeout(45_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
  throw lastError;
}

const cachePath = (relPath) => join(CACHE, ...relPath.split('/'));

async function get(relPath, { optional = false } = {}) {
  const file = cachePath(relPath);
  if (OFFLINE) {
    if (existsSync(file)) return await readFile(file);
    if (optional) return null;
    throw new Error(`--offline but ${relPath} is not in .cache/raw`);
  }
  try {
    const buf = await fetchBuffer(BASE + relPath);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, buf);
    return buf;
  } catch (err) {
    if (existsSync(file)) {
      warn(`${relPath}: ${err.message}; using cached copy`);
      return await readFile(file);
    }
    if (optional) return null;
    throw err;
  }
}

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index], index);
      }
    }),
  );
  return results;
}

const stripFragment = (href) => href.split('#')[0];

function parseToc(source) {
  const match = source.match(/tocData\s*=\s*(\[[\s\S]*?\])\s*;?\s*$/);
  if (!match) throw new Error('Could not locate tocData in data_toc.js');
  const toc = JSON.parse(match[1]);
  const entries = [];
  const walk = (items, depth) => {
    for (const [title, href, children] of items) {
      if (href) entries.push({ title, href, depth });
      if (children) walk(children, href ? depth + 1 : depth);
    }
  };
  walk(toc, 0);
  return { toc, entries };
}

const mdPathOf = (href) => stripFragment(href).replace(/\.html?$/i, '.md');

function buildIndex(snapshot, toc, extraTitles) {
  const lines = [
    '# AutoHotkey v2 Documentation — Index',
    '',
    `Offline Markdown mirror of the official English documentation: **AutoHotkey ${
      snapshot.upstream.version ?? 'v2'
    }** · ${snapshot.counts.pages} pages · snapshot ${snapshot.upstream.fetchedAt.slice(0, 10)}.`,
    '',
    `Upstream: <${BASE}>`,
    '',
    'Every page below mirrors the `.htm` page at the same relative path in `references/`.',
    '',
  ];

  const render = (items, depth) => {
    for (const [title, href, children] of items) {
      const pad = '  '.repeat(depth);
      if (href) lines.push(`${pad}- [${title}](${mdPathOf(href)}${href.includes('#') ? `#${href.split('#')[1]}` : ''})`);
      else lines.push(`${pad}- **${title}**`);
      if (children) render(children, depth + 1);
    }
  };
  render(toc, 0);

  if (extraTitles.size) {
    lines.push('', '## Additional pages', '', 'These pages are linked from the documentation but not listed in its table of contents.', '');
    for (const [path, title] of [...extraTitles].sort((a, b) => a[0].localeCompare(b[0]))) {
      lines.push(`- [${title}](${path.replace(/\.md$/, '.md')})`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

// --- link validation -------------------------------------------------------

const HEADING_SLUG = (text) =>
  text
    .replace(/<[^>]*>/g, '')
    .replace(/`/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

function anchorsOf(markdown) {
  const anchors = new Set();
  for (const m of markdown.matchAll(/<a id="([^"]+)"><\/a>/g)) anchors.add(m[1]);
  for (const m of markdown.matchAll(/\sid="([^"]+)"/g)) anchors.add(m[1]);
  for (const m of markdown.matchAll(/^#{1,6} (.+)$/gm)) anchors.add(HEADING_SLUG(m[1]));
  return anchors;
}

function checkLinks(pages, assets) {
  const problems = [];
  const anchorCache = new Map();
  const getAnchors = (path) => {
    if (!anchorCache.has(path)) anchorCache.set(path, anchorsOf(pages.get(path) ?? ''));
    return anchorCache.get(path);
  };

  for (const [path, markdown] of pages) {
    const dir = posix.dirname(path);
    const prose = markdown
      .replace(/^`{3,}[^\n]*\n[\s\S]*?^`{3,}\s*$/gm, '')
      .replace(/`[^`\n]*`/g, '');
    for (const m of prose.matchAll(/\[(?:[^\]\\]|\\.)*\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g)) {
      const target = m[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
      const [rawPath, hash = ''] = target.split('#');
      let file = rawPath ? posix.normalize(posix.join(dir, decodeURIComponent(rawPath))) : path;
      if (file.startsWith('..')) {
        problems.push(`${path}: link escapes references/: ${target}`);
        continue;
      }
      if (!pages.has(file) && !assets.has(file)) {
        problems.push(`${path}: missing target ${target}`);
        continue;
      }
      const decoded = hash ? decodeURIComponent(hash) : '';
      if (decoded && pages.has(file) && !getAnchors(file).has(decoded)) {
        problems.push(`${path}: missing anchor ${target}`);
      }
    }
  }
  return problems;
}

function titleOf(html) {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '';
  return decodeEntities(h1.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

// --- main ------------------------------------------------------------------

async function main() {
  log('AutoHotkey v2 docs — sync', CHECK ? '(check only)' : '');

  const tocSource = (await get('static/source/data_toc.js')).toString('utf8');
  const { toc, entries } = parseToc(tocSource);

  const indexHtml = (await get('index.htm')).toString('utf8');
  const version = /<!--ver-->([^<]+)<!--\/ver-->/.exec(indexHtml)?.[1] ?? null;

  // Seed the crawl with the table of contents, then follow every .htm link so
  // that pages missing from the toc (lib/Type.htm, misc/EscapeChar.htm, ...)
  // are still mirrored.
  const queue = [...new Set(entries.map((e) => stripFragment(e.href)))];
  const seen = new Set(queue);
  const html = new Map();
  const tocPaths = new Set(queue);

  const discover = (pagePath, text) => {
    for (const m of text.matchAll(/href="([^"]+)"/g)) {
      let target = m[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) {
        if (target.startsWith(BASE)) target = target.slice(BASE.length);
        else continue;
      }
      target = target.split('#')[0].split('?')[0];
      if (!/\.html?$/i.test(target)) continue;
      target = target.startsWith('/') ? target.slice(1) : posix.normalize(posix.join(posix.dirname(pagePath), target));
      if (!target || target.startsWith('..')) continue;
      if (!seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  };

  log(`${queue.length} pages in the table of contents${version ? ` (v${version})` : ''}`);
  for (let index = 0; index < queue.length; index += CONCURRENCY) {
    const batch = queue.slice(index, index + CONCURRENCY);
    const fetched = await Promise.all(batch.map((p) => get(p)));
    batch.forEach((p, i) => {
      const text = fetched[i].toString('utf8');
      html.set(p, text);
      discover(p, text);
    });
    if (VERBOSE) log(`  fetched ${Math.min(index + CONCURRENCY, queue.length)}/${queue.length}`);
  }
  log(`${queue.length} pages discovered (${queue.length - tocPaths.size} outside the toc)`);

  const pages = new Map();
  const extras = new Map();
  const assets = new Map();
  const assetSources = new Map();

  for (const href of queue) {
    const { markdown, ctx } = convertPage(html.get(href), href);
    pages.set(mdPathOf(href), markdown);
    if (!tocPaths.has(href)) extras.set(mdPathOf(href), titleOf(html.get(href)) || mdPathOf(href));

    const dir = posix.dirname(href);
    for (const src of ctx.images) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) continue;
      const target = posix.normalize(posix.join(dir, src));
      assetSources.set(target, new URL(src, BASE + href).href);
    }
    for (const file of ctx.files) {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(file)) continue;
      const target = posix.normalize(posix.join(dir, file));
      assetSources.set(target, new URL(file, BASE + href).href);
    }
  }

  log(`${pages.size} markdown pages converted`);
  log(`${assetSources.size} linked assets (images, .ahk examples, ...)`);

  const assetTargets = [...assetSources.keys()];
  const fetchedAssets = await pool(assetTargets, CONCURRENCY, async (target) => {
    try {
      return await get(target, { optional: true });
    } catch (err) {
      warn(`asset ${target}: ${err.message}`);
      return null;
    }
  });
  assetTargets.forEach((target, i) => {
    if (fetchedAssets[i]) assets.set(target, fetchedAssets[i]);
    else warn(`asset not available upstream: ${target}`);
  });

  const previous = existsSync(SNAPSHOT) ? JSON.parse(await readFile(SNAPSHOT, 'utf8')) : { files: {}, assets: {}, upstream: {} };

  const added = [];
  const changed = [];
  for (const [path, markdown] of pages) {
    const full = join(REFS, ...path.split('/'));
    const next = Buffer.from(markdown, 'utf8');
    if (!existsSync(full)) added.push(path);
    else if (!(await readFile(full)).equals(next)) changed.push(path);
  }
  const removed = Object.keys(previous.files ?? {}).filter(
    (p) => !pages.has(p) && existsSync(join(REFS, ...p.split('/'))),
  );
  const changedAssets = [];
  for (const [path, buf] of assets) {
    const full = join(REFS, ...path.split('/'));
    if (!existsSync(full) || !(await readFile(full)).equals(buf)) changedAssets.push(path);
  }

  const contentChanged = added.length + changed.length + removed.length + changedAssets.length > 0;
  const fetchedAt =
    contentChanged || !previous.upstream?.fetchedAt ? new Date().toISOString() : previous.upstream.fetchedAt;

  const snapshot = {
    $comment:
      'Generated by scripts/update.mjs. Do not edit by hand. Documentation content is the official AutoHotkey v2 documentation (GPL v2).',
    upstream: { baseUrl: BASE, product: 'AutoHotkey v2', version, tocSha256: sha256(tocSource), fetchedAt },
    counts: { pages: pages.size, assets: assets.size, tocPages: tocPaths.size },
    files: Object.fromEntries(
      [...pages].map(([path, markdown]) => [path, { source: path.replace(/\.md$/, '.htm'), sha256: sha256(markdown) }]),
    ),
    assets: Object.fromEntries(
      [...assets].map(([path, buf]) => [path, { url: assetSources.get(path), sha256: sha256(buf) }]),
    ),
  };

  const indexMd = buildIndex(snapshot, toc, extras);
  // NOTE: the docs homepage is mirrored as references/index.md, so the
  // generated navigation index must not be INDEX.md (case-insensitive
  // filesystems would treat them as the same file).
  const indexFile = join(REFS, '_index.md');
  const previousIndex = existsSync(indexFile) ? await readFile(indexFile, 'utf8') : null;
  if (previousIndex !== indexMd) changed.push('_index.md');

  const linkProblems = checkLinks(new Map([...pages, ['_index.md', indexMd]]), new Set(assets.keys()));

  log('');
  log(`version:        ${version ?? 'unknown'}`);
  log(`pages added:    ${added.length}`);
  log(`pages changed:  ${changed.length}`);
  log(`pages removed:  ${removed.length}`);
  log(`assets changed: ${changedAssets.length}`);
  log(`link warnings:  ${linkProblems.length}`);

  if (VERBOSE || CHECK) {
    for (const p of added.slice(0, 40)) log(`  + ${p}`);
    for (const p of changed.slice(0, 40)) log(`  ~ ${p}`);
    for (const p of removed.slice(0, 40)) log(`  - ${p}`);
    for (const p of changedAssets.slice(0, 40)) log(`  ~ asset: ${p}`);
  }
  if (linkProblems.length) {
    for (const p of linkProblems.slice(0, 60)) log(`  ! ${p}`);
    if (linkProblems.length > 60) log(`  ... ${linkProblems.length - 60} more`);
  }

  if (CHECK) {
    if (contentChanged || changed.includes('INDEX.md')) {
      log('\nUpstream documentation differs from this snapshot. Run `npm run update`.');
      process.exitCode = 1;
    } else {
      log('\nSnapshot is up to date.');
    }
    if (STRICT && linkProblems.length) process.exitCode = 1;
    return;
  }

  for (const [path, markdown] of pages) {
    const full = join(REFS, ...path.split('/'));
    const next = Buffer.from(markdown, 'utf8');
    if (existsSync(full) && (await readFile(full)).equals(next)) continue;
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, next);
  }
  for (const [path, buf] of assets) {
    const full = join(REFS, ...path.split('/'));
    if (existsSync(full) && (await readFile(full)).equals(buf)) continue;
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, buf);
  }
  for (const path of removed) await rm(join(REFS, ...path.split('/')), { force: true });
  if (previousIndex !== indexMd) await writeFile(indexFile, indexMd);
  await writeFile(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);

  log(`\nWrote references/ (${pages.size} pages, ${assets.size} assets) and snapshot.json.`);
  if (linkProblems.length) {
    log('Some links could not be resolved locally; review the warnings above.');
    if (STRICT) process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.stack ?? err);
  process.exitCode = 1;
});
