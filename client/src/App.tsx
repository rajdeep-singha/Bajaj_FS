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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* noise overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4=')]" />

      {/* glow blobs */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-3xl mx-auto px-4 py-12">

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase">
              SRM Full Stack Challenge
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-white">Node</span>
            <span className="text-cyan-400">Graph</span>
            <span className="text-zinc-500"> /bfhl</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1 font-mono">
            Enter edge strings like <code className="text-zinc-300">A-&gt;B</code>, one per line or comma-separated.
          </p>
        </header>

        {/* ── Input form ── */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder={PLACEHOLDER}
              className="
                w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3
                font-mono text-sm text-zinc-200 placeholder-zinc-600
                focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30
                resize-none transition-colors duration-150
              "
            />
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600
                text-zinc-950 font-bold font-mono text-sm py-2.5 px-6
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-cyan-500/20
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-zinc-900/40 border-t-zinc-900 rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                "Submit →"
              )}
            </button>

            <button
              type="button"
              onClick={loadExample}
              className="
                rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800
                text-zinc-400 hover:text-zinc-200 font-mono text-sm py-2.5 px-4
                transition-all duration-150
              "
            >
              Load Example
            </button>
          </div>
        </form>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-rose-300 font-mono text-sm">
            <span className="text-rose-400 font-bold">Error: </span>{error}
          </div>
        )}

        {/* ── Result ── */}
        {result && <ResultPanel data={result} />}
      </div>
    </div>
  );
}