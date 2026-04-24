import { type BFHLResponse } from "../types/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export async function postBFHL(data: string[]): Promise<BFHLResponse> {
  const endpoint = API_BASE.endsWith("/") ? `${API_BASE}bfhl` : `${API_BASE}/bfhl`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }

  return res.json() as Promise<BFHLResponse>;
}