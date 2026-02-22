import { kv } from '@vercel/kv';

export const config = {
  runtime: 'nodejs',  // ← ключевой фикс: явно Node.js (или просто удали эту строку — Vercel сам выберет Node.js)
};

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const countKey = 'victims-count';

  if (req.method === 'GET') {
    const count = await kv.get(countKey) || 0;
    return new Response(count.toString(), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  if (req.method === 'POST') {
    let count = await kv.get(countKey) || 0;
    count += 1;
    await kv.set(countKey, count);
    return new Response(count.toString(), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}
