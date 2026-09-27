import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { seedTickets, assignTickets, owners } from './src/tickets.mjs';

// Synthetic, local-only fixture. Each browser context gets a separate in-memory
// workspace. Data survives reloads, but deliberately resets on server restart.
const workspaces = new Map();
const port = Number(process.env.PORT || 4310);
const origin = `http://127.0.0.1:${port}`;
const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']],
  ['/styles.css', ['styles.css', 'text/css']]
]);
function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
}
function workspace(req, res) {
  let id = /(?:^|;\s*)demo-workspace=([a-f0-9-]+)/.exec(req.headers.cookie || '')?.[1];
  if (!id || !workspaces.has(id)) {
    id = randomUUID();
    workspaces.set(id, seedTickets());
    res.setHeader('Set-Cookie', `demo-workspace=${id}; HttpOnly; SameSite=Strict; Path=/`);
  }
  return id;
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, origin);
  try {
    if (req.method === 'GET' && assets.has(url.pathname)) {
      const [file, type] = assets.get(url.pathname);
      res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
      res.end(await readFile(new URL(`./public/${file}`, import.meta.url)));
      return;
    }
    if (url.pathname === '/health') { json(res, 200, { ok: true }); return; }
    if (!url.pathname.startsWith('/api/')) { json(res, 404, { error: 'Not found' }); return; }
    if (req.method === 'POST' && req.headers.origin !== origin) {
      json(res, 403, { error: 'Use the local demo page.' }); return;
    }
    const id = workspace(req, res);
    if (req.method === 'GET' && url.pathname === '/api/tickets') {
      json(res, 200, { tickets: workspaces.get(id), owners }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/reset') {
      workspaces.set(id, seedTickets());
      json(res, 200, { tickets: workspaces.get(id) }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/assign') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 4096) { json(res, 413, { error: 'Request too large' }); return; }
      }
      try {
        const { ids, owner } = JSON.parse(body);
        workspaces.set(id, assignTickets(workspaces.get(id), ids, owner));
        json(res, 200, { tickets: workspaces.get(id), count: ids.length });
      } catch {
        json(res, 400, { error: 'Choose valid tickets and an owner.' });
      }
      return;
    }
    json(res, 404, { error: 'Not found' });
  } catch {
    json(res, 500, { error: 'The demo could not complete that request.' });
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Northstar support demo: ${origin}`));
