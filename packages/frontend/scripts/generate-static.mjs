import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const serverDir = path.join(distDir, 'server');
const siteUrl = (process.env.VITE_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

const resolveServerEntry = async () => {
  const serverFiles = await fs.readdir(serverDir);
  const entryFile = serverFiles.find(file => file.endsWith('.js') || file.endsWith('.mjs'));

  if (!entryFile) {
    throw new Error('Unable to locate the SSR server bundle in dist/server.');
  }

  return path.join(serverDir, entryFile);
};

const escapeHtml = value => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const upsertMeta = (html, selector, tag) => {
  const patterns = {
    'meta[name="description"]': /<meta name="description" content="[^"]*"\s*\/?>/,
    'meta[name="robots"]': /<meta name="robots" content="[^"]*"\s*\/?>/,
    'meta[property="og:type"]': /<meta property="og:type" content="[^"]*"\s*\/?>/,
    'meta[property="og:site_name"]': /<meta property="og:site_name" content="[^"]*"\s*\/?>/,
    'meta[property="og:title"]': /<meta property="og:title" content="[^"]*"\s*\/?>/,
    'meta[property="og:description"]': /<meta property="og:description" content="[^"]*"\s*\/?>/,
    'meta[property="og:url"]': /<meta property="og:url" content="[^"]*"\s*\/?>/,
    'meta[property="og:image"]': /<meta property="og:image" content="[^"]*"\s*\/?>/,
    'meta[name="twitter:card"]': /<meta name="twitter:card" content="[^"]*"\s*\/?>/,
    'meta[name="twitter:title"]': /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    'meta[name="twitter:description"]': /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    'meta[name="twitter:image"]': /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
  };

  const pattern = patterns[selector];
  if (!pattern) return html;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `  ${tag}\n</head>`);
};

const writeRouteHtml = async (templateHtml, routePath, render) => {
  const { appHtml, meta, structuredData } = render(routePath);
  const canonicalUrl = `${siteUrl}${meta.path}`;
  const ogImageUrl = `${siteUrl}/logo_light.svg`;
  let html = templateHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<!--app-html-->[\s\S]*?<!--\/app-html-->/, `<!--app-html-->${appHtml}<!--/app-html-->`)
    .replace(/<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="structured-data" type="application/ld+json">${JSON.stringify({ ...structuredData, url: canonicalUrl })}</script>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);

  html = upsertMeta(html, 'meta[name="description"]', `<meta name="description" content="${escapeHtml(meta.description)}" />`);
  html = upsertMeta(html, 'meta[name="robots"]', '<meta name="robots" content="index,follow" />');
  html = upsertMeta(html, 'meta[property="og:type"]', '<meta property="og:type" content="website" />');
  html = upsertMeta(html, 'meta[property="og:site_name"]', '<meta property="og:site_name" content="CatSwap" />');
  html = upsertMeta(html, 'meta[property="og:title"]', `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  html = upsertMeta(html, 'meta[property="og:description"]', `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  html = upsertMeta(html, 'meta[property="og:url"]', `<meta property="og:url" content="${canonicalUrl}" />`);
  html = upsertMeta(html, 'meta[property="og:image"]', `<meta property="og:image" content="${ogImageUrl}" />`);
  html = upsertMeta(html, 'meta[name="twitter:card"]', '<meta name="twitter:card" content="summary_large_image" />');
  html = upsertMeta(html, 'meta[name="twitter:title"]', `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  html = upsertMeta(html, 'meta[name="twitter:description"]', `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  html = upsertMeta(html, 'meta[name="twitter:image"]', `<meta name="twitter:image" content="${ogImageUrl}" />`);

  const outputPath = meta.path === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, meta.path.replace(/^\//, ''), 'index.html');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, 'utf8');
};

const buildSitemapXml = routes => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${siteUrl}${route.path}</loc>
  </url>`).join('\n')}
</urlset>
`;

const buildLlmsTxt = routes => `# CatSwap

CatSwap is a Bitcoin L2 DEX focused on spot trading, perpetual futures, and liquidity pools.

## Core routes
${routes.map(route => `${route.path} - ${route.title}`).join('\n')}
`;

const run = async () => {
  const entryPath = await resolveServerEntry();
  const templateHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
  const serverEntry = await import(pathToFileURL(entryPath).href);
  const { APP_ROUTES, render } = serverEntry;
  const routes = Object.values(APP_ROUTES);

  for (const route of routes) {
    await writeRouteHtml(templateHtml, route.path, render);
  }

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(routes), 'utf8');
  await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt(routes), 'utf8');
};

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
