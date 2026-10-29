import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chargeToken } from './lib/nmi.mjs';
import { upsertLead, createOrder, completeOrder, declineOrder } from './lib/database.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const product = { id: 'infinite-ai-income', name: 'Infinite AI Income', amount: 67 };
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png' };

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'content-type': type, 'cache-control': type.startsWith('text/html') ? 'no-cache' : 'public, max-age=300' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const json = (res, status, body) => send(res, status, body);
const body = req => new Promise((resolve, reject) => {
  let value = '';
  req.on('data', chunk => { value += chunk; if (value.length > 1e6) reject(new Error('Request too large')); });
  req.on('end', () => { try { resolve(value ? JSON.parse(value) : {}); } catch { reject(new Error('Invalid JSON')); } });
  req.on('error', reject);
});

export async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'POST' && url.pathname === '/api/leads') {
      const input = await body(req);
      await upsertLead({ ...input, source: 'opt-in', metadata: input.metadata || {} });
      return json(res, 200, { ok: true, next: '/fe2' });
    }
    if (req.method === 'GET' && url.pathname === '/api/checkout/config') {
      return json(res, 200, { gateway: 'nmi', publicKey: process.env.NMI_PUBLIC_KEY || '', product });
    }
    if (req.method === 'POST' && url.pathname === '/api/checkout') {
      const input = await body(req);
      if (!input.consent) return json(res, 400, { error: 'Please authorize the one-time charge.' });
      if (!input.paymentToken) return json(res, 400, { error: 'Secure payment token is missing.' });
      const lead = await upsertLead({ ...input, source: 'checkout', metadata: input.metadata || {} });
      const order = await createOrder(lead.id, product);
      try {
        const result = await chargeToken({ product, paymentToken: input.paymentToken, customer: input, invoice: `IAI-${order.id}` });
        await completeOrder(order.id, result);
        return json(res, 200, { ok: true, next: '/thankyou', transactionId: result.transactionId });
      } catch (error) {
        await declineOrder(order.id, error);
        return json(res, 402, { error: error.message || 'The card was declined.', code: error.code || 'declined' });
      }
    }
    if (url.pathname.startsWith('/api/')) return json(res, 404, { error: 'Not found' });

    const routes = { '/': 'fe1.html', '/fe1': 'fe1.html', '/fe2': 'fe2.html', '/checkout': 'checkout.html', '/thankyou': 'thankyou.html', '/refund-policy': 'refund-policy.html', '/ftc': 'ftc.html', '/earnings-disclaimer': 'earnings-disclaimer.html' };
    const relative = routes[url.pathname] || url.pathname.replace(/^\//, '');
    const file = normalize(join(root, 'public', relative));
    if (!file.startsWith(join(root, 'public'))) return send(res, 403, 'Forbidden', 'text/plain');
    const content = await readFile(file);
    return send(res, 200, content, mime[extname(file)] || 'application/octet-stream');
  } catch (error) {
    if (error.code === 'ENOENT') return send(res, 404, 'Not found', 'text/plain');
    console.error(error);
    return json(res, 500, { error: 'Server error' });
  }
}

export default handler;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createServer(handler).listen(port, () => console.log(`Infinite AI Income running at http://localhost:${port}`));
}
