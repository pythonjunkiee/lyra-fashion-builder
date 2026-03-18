import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || 'localhost';
  const url = `${proto}://${host}${req.url}`;

  const headers: Record<string, string> = {};
  for (const [key, val] of Object.entries(req.headers)) {
    if (val) headers[key] = Array.isArray(val) ? val[0] : val;
  }

  let body: Buffer | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = [];
    for await (const chunk of req as AsyncIterable<Buffer>) {
      chunks.push(Buffer.from(chunk));
    }
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const fetchReq = new Request(url, {
    method: req.method ?? 'GET',
    headers,
    body: body ?? null,
  });

  const response = await app.fetch(fetchReq);

  res.status(response.status);
  response.headers.forEach((val, key) => res.setHeader(key, val));
  res.end(Buffer.from(await response.arrayBuffer()));
}
