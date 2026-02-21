// Серверлесс-функция для счётчика сердечек
// Использует Netlify Blobs для хранения данных

import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const store = getStore('heart-counter');
  const key = 'total-clicks';

  // GET - получить текущее количество
  if (req.method === 'GET') {
    try {
      const value = await store.get(key);
      return new Response(value || '0', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response('0', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  // POST - увеличить счётчик
  if (req.method === 'POST') {
    let count = 0;
    try {
      const value = await store.get(key);
      count = parseInt(value || '0', 10);
    } catch (error) {
      count = 0;
    }

    count += 1;
    await store.set(key, count.toString());

    return new Response(count.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = {
  path: '/counter'
};
