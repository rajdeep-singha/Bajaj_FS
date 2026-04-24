import { type HierarchyObject } from "../types/api";
import { TreeNode } from "./TreeNode";

interface HierarchyCardProps {
  hierarchy: HierarchyObject;
  isLargest: boolean;
}

export const HierarchyCard: React.FC<HierarchyCardProps> = ({
  hierarchy,
  isLargest,
}) => {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div
      className={`
        relative rounded-xl border bg-zinc-900/80 p-4 backdrop-blur-sm
        transition-all duration-300
        ${has_cycle
          ? "border-rose-500/40 shadow-rose-900/20 shadow-lg"
          : isLargest
          ? "border-cyan-400/50 shadow-cyan-900/30 shadow-lg ring-1 ring-cyan-400/20"
          : "border-zinc-700/50"
        }
      `}
    >
      {/* badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="font-mono font-bold text-white text-lg">
          Root: <span className="text-cyan-300">{root}</span>
        </span>

        {has_cycle ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
            ⚠ cycle
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
            depth {depth}
          </span>
        )}

        {isLargest && !has_cycle && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
            ★ largest
          </span>
        )}
      </div>

      {/* tree or cycle message */}
      <div className="font-mono text-sm">
        {has_cycle ? (
          <p className="text-rose-400/80 italic text-sm">
            Cycle detected — no tree structure available.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            <TreeNode
              label={root}
              children={(tree as Record<string, Record<string, unknown>>)[root] ?? {}}
              isRoot
            />
          </div>
        )}
      </div>
    </div>
  );
};