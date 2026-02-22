import { createClient } from 'redis';

// Создаём клиента Redis с переменными из Vercel (Upstash)
const client = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Подключаемся к Redis (лучше делать один раз, но для простоты здесь)
await client.connect().catch(err => {
  console.error('Ошибка подключения к Redis:', err);
});

export default async function handler(req) {
  // Заголовки CORS — обязательны для fetch из браузера
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Обработка preflight-запроса (OPTIONS) от браузера
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const countKey = 'victims-count'; // ключ, где хранится число

  try {
    if (req.method === 'GET') {
      // Получаем текущее значение (если нет — 0)
      const count = (await client.get(countKey)) || '0';
      return new Response(count, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    if (req.method === 'POST') {
      // Получаем текущее значение
      let count = parseInt((await client.get(countKey)) || '0', 10);
      count += 1;
      // Сохраняем новое значение
      await client.set(countKey, count.toString());
      return new Response(count.toString(), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    // Если метод не GET и не POST
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error('Ошибка работы с Redis:', err);
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
  }
}
