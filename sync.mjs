import { getStore } from "@netlify/blobs";

/*
  Ripple sync backend.

  GET  /.netlify/functions/sync?key=XXXX   -> { data: {...} | null, updated }
  POST /.netlify/functions/sync            -> { key, data }  saves

  The "key" is a long random code generated on the user's device. Whoever holds
  the code can read and write that slot, so it is treated like a password:
  it is never logged and never rendered into any page.

  Note: data is stored as-is (not end-to-end encrypted), so this is intended
  for personal use, not for secrets.
*/

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Keys must look like the ones we generate: 24-64 lowercase alphanumerics.
const validKey = (k) => typeof k === "string" && /^[a-z0-9]{24,64}$/.test(k);

export default async (req) => {
  const store = getStore("ripple-sync");

  if (req.method === "GET") {
    const key = new URL(req.url).searchParams.get("key");
    if (!validKey(key)) return json({ ok: false, error: "bad key" }, 400);
    const blob = await store.get(`u_${key}`, { type: "json" });
    if (!blob) return json({ ok: true, data: null, updated: null });
    return json({ ok: true, data: blob.data ?? null, updated: blob.updated ?? null });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

    const { key, data } = body || {};
    if (!validKey(key)) return json({ ok: false, error: "bad key" }, 400);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return json({ ok: false, error: "data must be an object" }, 400);
    }
    // Keep a lid on payload size so one device can't fill the store.
    const size = JSON.stringify(data).length;
    if (size > 2_000_000) return json({ ok: false, error: "too large" }, 413);

    const updated = new Date().toISOString();
    await store.setJSON(`u_${key}`, { data, updated });
    return json({ ok: true, updated });
  }

  return json({ ok: false, error: "method not allowed" }, 405);
};
