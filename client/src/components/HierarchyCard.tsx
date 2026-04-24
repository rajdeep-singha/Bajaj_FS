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
        border-4 p-4 bg-white transition-transform duration-100
        ${has_cycle
          ? "border-black bg-[#ff9a9a] shadow-[6px_6px_0_0_#000]"
          : isLargest
          ? "border-black bg-[#97ff60] shadow-[8px_8px_0_0_#000]"
          : "border-black bg-white shadow-[6px_6px_0_0_#000]"
        }
      `}
    >
      {/* badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="font-black text-black text-lg">
          Root: <span className="bg-black text-white px-2">{root}</span>
        </span>

        {has_cycle ? (
          <span className="text-xs px-2 py-0.5 border-2 border-black bg-white text-black font-black">
            ⚠ cycle
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 border-2 border-black bg-white text-black font-black">
            depth {depth}
          </span>
        )}

        {isLargest && !has_cycle && (
          <span className="text-xs px-2 py-0.5 border-2 border-black bg-[#37d5ff] text-black font-black">
            ★ largest
          </span>
        )}
      </div>

      {/* tree or cycle message */}
      <div className="font-mono text-sm">
        {has_cycle ? (
          <p className="text-black italic text-sm font-bold">
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