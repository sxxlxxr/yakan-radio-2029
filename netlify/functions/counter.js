import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("victims-counter");

  if (req.method === "GET") {
    try {
      const value = await store.get("count", { type: "text" });
      return new Response(value || "0", {
        status: 200,
        headers: { 
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (e) {
      console.error(e);
      return new Response("0", { 
        status: 200,
        headers: { 
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }

  if (req.method === "POST") {
    let count = 0;
    try {
      const value = await store.get("count", { type: "text" });
      count = parseInt(value || "0", 10);
    } catch (e) {
      console.error(e);
    }

    count += 1;
    await store.set("count", count.toString());

    return new Response(count.toString(), {
      status: 200,
      headers: { 
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/counter" };
