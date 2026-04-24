import { type BFHLResponse } from "../types/api";
import { HierarchyCard } from "./HierarchyCard";

interface ResultPanelProps {
  data: BFHLResponse;
}

export function ResultPanel({ data }: ResultPanelProps) {
  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="inline-block text-lg font-black mb-4 px-2 py-1 border-2 border-black bg-[#97ff60]">
          User
        </h2>
        <div className="space-y-2 text-sm font-bold">
          <p><span className="text-zinc-600">ID:</span> {data.user_id}</p>
          <p><span className="text-zinc-600">Email:</span> {data.email_id}</p>
          <p><span className="text-zinc-600">Roll:</span> {data.college_roll_number}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="border-4 border-black bg-[#ffd36a] p-6 shadow-[8px_8px_0_0_#000]">
        <h2 className="inline-block text-lg font-black mb-4 px-2 py-1 border-2 border-black bg-white">
          Summary
        </h2>
        <div className="space-y-2 text-sm font-bold">
          <p><span className="text-zinc-700">Trees:</span> {data.summary.total_trees}</p>
          <p><span className="text-zinc-700">Cycles:</span> {data.summary.total_cycles}</p>
          <p><span className="text-zinc-700">Largest Root:</span> {data.summary.largest_tree_root}</p>
        </div>
      </div>

      {/* Hierarchies */}
      {data.hierarchies.length > 0 && (
        <div className="border-4 border-black bg-[#d5b7ff] p-6 shadow-[8px_8px_0_0_#000]">
          <h2 className="inline-block text-lg font-black mb-4 px-2 py-1 border-2 border-black bg-white">
            Hierarchies
          </h2>
          <div className="space-y-4">
            {data.hierarchies.map((hierarchy, index) => (
              <HierarchyCard
                key={`${hierarchy.root}-${index}`}
                hierarchy={hierarchy}
                isLargest={hierarchy.root === data.summary.largest_tree_root}
              />
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {(data.invalid_entries.length > 0 || data.duplicate_edges.length > 0) && (
        <div className="border-4 border-black bg-[#ff7a7a] p-6 shadow-[8px_8px_0_0_#000]">
          <h2 className="inline-block text-lg font-black mb-4 px-2 py-1 border-2 border-black bg-white">
            Issues
          </h2>
          {data.invalid_entries.length > 0 && (
            <p className="text-sm font-bold mb-2">Invalid: {data.invalid_entries.join(", ")}</p>
          )}
          {data.duplicate_edges.length > 0 && (
            <p className="text-sm font-bold">Duplicates: {data.duplicate_edges.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}