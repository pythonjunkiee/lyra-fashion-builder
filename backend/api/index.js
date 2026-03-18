const app = require('../dist/src/app').default;

module.exports = async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'localhost';
  const url = `${proto}://${host}${req.url}`;

  const headers = {};
  for (const [key, val] of Object.entries(req.headers)) {
    if (val) headers[key] = Array.isArray(val) ? val[0] : val;
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const fetchReq = new Request(url, {
    method: req.method || 'GET',
    headers,
    body: body || null,
  });

  const response = await app.fetch(fetchReq);

  res.status(response.status);
  response.headers.forEach((val, key) => res.setHeader(key, val));
  res.end(Buffer.from(await response.arrayBuffer()));
};
