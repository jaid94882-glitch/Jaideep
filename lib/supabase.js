// Supabase REST helpers — publishable key is safe to expose in the browser.
const SUPABASE_URL = "https://mzqxbvwhdapxxvcgpnpo.supabase.co";
const SUPABASE_KEY = "sb_publishable_4hWVWXdRyGUrgboqD-dR0g_hLYIPABt";

const authHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

/** Insert one row into a table (insert-only; RLS blocks reads). */
export async function insertRow(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Insert failed (${res.status}): ${text}`);
  }
}

/** Upload a file into the private `documents` bucket. */
export async function uploadDocument(path, file) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/documents/${path}`,
    {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
}

/** Call a Postgres function exposed via PostgREST RPC. */
export async function callRpc(name, args = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`RPC ${name} failed (${res.status}): ${text}`);
  }
  return res.json();
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
