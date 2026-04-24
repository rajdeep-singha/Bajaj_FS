import { type BFHLResponse } from "../types/api";

interface ResultPanelProps {
  data: BFHLResponse;
}

export function ResultPanel({ data }: ResultPanelProps) {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-bold font-mono text-cyan-400 mb-4">User</h2>
        <div className="space-y-2 text-sm font-mono">
          <p><span className="text-zinc-500">ID:</span> {data.user_id}</p>
          <p><span className="text-zinc-500">Email:</span> {data.email_id}</p>
          <p><span className="text-zinc-500">Roll:</span> {data.college_roll_number}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-bold font-mono text-cyan-400 mb-4">Summary</h2>
        <div className="space-y-2 text-sm font-mono">
          <p><span className="text-zinc-500">Trees:</span> {data.summary.total_trees}</p>
          <p><span className="text-zinc-500">Cycles:</span> {data.summary.total_cycles}</p>
          <p><span className="text-zinc-500">Largest Root:</span> {data.summary.largest_tree_root}</p>
        </div>
      </div>

      {/* Issues */}
      {(data.invalid_entries.length > 0 || data.duplicate_edges.length > 0) && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-6">
          <h2 className="text-lg font-bold font-mono text-rose-400 mb-4">Issues</h2>
          {data.invalid_entries.length > 0 && (
            <p className="text-sm font-mono text-rose-300 mb-2">Invalid: {data.invalid_entries.join(", ")}</p>
          )}
          {data.duplicate_edges.length > 0 && (
            <p className="text-sm font-mono text-rose-300">Duplicates: {data.duplicate_edges.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}