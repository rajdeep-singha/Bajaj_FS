import React, { useState } from "react";
import { postBFHL } from "./api/bfhl.ts";
import { type BFHLResponse } from "./types/api";
import { ResultPanel } from "./components/ResultPanel.tsx";

const PLACEHOLDER = `A->B, A->C, B->D, C->E, E->F
X->Y, Y->Z, Z->X
P->Q, Q->R
G->H, G->H, G->I
hello, 1->2, A->`;

function parseInput(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BFHLResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = parseInput(input);
      if (data.length === 0) throw new Error("Please enter at least one node string.");
      const res = await postBFHL(data);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setInput(PLACEHOLDER);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-[#fff45f] text-black font-mono">
      <div className="relative max-w-4xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <header className="mb-8 border-4 border-black bg-[#ff6ad5] p-5 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-black tracking-widest uppercase bg-black text-white px-2 py-1">
              SRM Full Stack Challenge
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            <span>Node</span>
            <span className="text-white bg-black px-2 ml-1">Graph</span>
            <span className="text-black"> /bfhl</span>
          </h1>
          <p className="text-sm mt-2 font-bold">
            Enter edge strings like <code className="bg-black text-white px-1">A-&gt;B</code>, one per line or comma-separated.
          </p>
        </header>

        {/* ── Input form ── */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 border-4 border-black bg-[#37d5ff] p-5 shadow-[8px_8px_0_0_#000]"
        >
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder={PLACEHOLDER}
              className="w-full border-4 border-black bg-white px-4 py-3 text-sm font-bold placeholder:text-zinc-500 focus:outline-none focus:bg-yellow-100 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border-4 border-black bg-[#97ff60] text-black font-black text-sm py-2.5 px-6 transition-transform duration-75 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none shadow-[5px_5px_0_0_#000] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                "Submit →"
              )}
            </button>

            <button
              type="button"
              onClick={loadExample}
              className="border-4 border-black bg-white text-black font-black text-sm py-2.5 px-4 transition-transform duration-75 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none shadow-[5px_5px_0_0_#000]"
            >
              Load Example
            </button>
          </div>
        </form>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 border-4 border-black bg-[#ff7a7a] px-4 py-3 text-black text-sm font-bold shadow-[6px_6px_0_0_#000]">
            <span className="font-black">Error: </span>
            {error}
          </div>
        )}

        {/* ── Result ── */}
        {result && <ResultPanel data={result} />}
      </div>
    </div>
  );
}