import { getStore } from "@netlify/blobs";

/*
  Ripple changelog backend.
  GET   -> returns the live changelog: { data: [...] | null }
  POST  -> { action: "verify", password }            checks the password
           { action: "save", password, data: [...] } saves (password required)

  The password is read from the ADMIN_PASSWORD environment variable
  (set it in Netlify: Site settings -> Environment variables). It is never
  shipped to the browser.
*/

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore("ripple-changelog");

  if (req.method === "GET") {
    const data = await store.get("entries", { type: "json" });
    return json({ data: data ?? null });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }

    const { action, password, data } = body || {};
    const secret = process.env.ADMIN_PASSWORD;

    if (!secret) return json({ ok: false, error: "backend not configured" }, 500);
    if (password !== secret) return json({ ok: false, error: "unauthorized" }, 401);

    if (action === "verify") return json({ ok: true });

    if (action === "save") {
      if (!Array.isArray(data)) return json({ ok: false, error: "data must be an array" }, 400);
      await store.setJSON("entries", data);
      return json({ ok: true });
    }
    return json({ ok: false, error: "unknown action" }, 400);
  }

  return json({ ok: false, error: "method not allowed" }, 405);
};
