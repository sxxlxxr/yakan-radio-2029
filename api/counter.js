import { kv } from '@vercel/kv'; // для хранения (альтернатива Blobs)

export const config = { runtime: 'edge' }; // или 'nodejs' для простоты

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const countKey = 'victims-count';

  if (req.method === 'GET') {
    const count = await kv.get(countKey) || 0;
    return new Response(count.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (req.method === 'POST') {
    let count = await kv.get(countKey) || 0;
    count += 1;
    await kv.set(countKey, count);
    return new Response(count.toString(), {
      status: 200,
      headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
