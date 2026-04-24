import { type BFHLResponse } from "../types/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function postBFHL(data: string[]): Promise<BFHLResponse> {
  const res = await fetch(`${API_BASE}/bfhl`, {
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