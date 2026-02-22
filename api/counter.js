import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const config = {
  runtime: 'nodejs', // явно Node.js
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
    const count = (await redis.get(countKey)) || 0;
    return new Response(count.toString(), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  if (req.method === 'POST') {
    let count = (await redis.get(countKey)) || 0;
    count += 1;
    await redis.set(countKey, count);
    return new Response(count.toString(), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
}
