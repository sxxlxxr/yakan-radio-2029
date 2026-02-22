import { createClient } from 'redis';

// Создаём клиента Redis (переменные окружения уже есть от Vercel)
const client = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Подключаемся один раз (лучше делать это глобально, но для простоты здесь)
await client.connect().catch(err => console.error('Redis connect error:', err));

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Обработка preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const countKey = 'victims-count';

  try {
    if (req.method === 'GET') {
      const count = (await client.get(countKey)) || '0';
      return new Response(count, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    if (req.method === 'POST') {
      let count = parseInt(await client.get(countKey) || '0', 10);
      count += 1;
      await client.set(countKey, count.toString());
      return new Response(count.toString(), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error('Redis error:', err);
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
  }
}
