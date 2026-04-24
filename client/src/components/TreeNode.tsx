import React, { useState } from "react";

interface TreeNodeProps {
  label: string;
  children: Record<string, unknown>;
  depth?: number;
  isRoot?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  children,
  depth = 0,
  isRoot = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = Object.keys(children).length > 0;

  const nodeColors = [
    "text-cyan-300 border-cyan-400/60",
    "text-emerald-300 border-emerald-400/60",
    "text-violet-300 border-violet-400/60",
    "text-amber-300 border-amber-400/60",
    "text-rose-300 border-rose-400/60",
  ];
  const colorClass = nodeColors[depth % nodeColors.length];

  return (
    <div className="flex flex-col" style={{ paddingLeft: isRoot ? 0 : "1.5rem" }}>
      {/* connector line */}
      <div className="flex items-center gap-2 group">
        {!isRoot && (
          <span className="text-zinc-600 font-mono text-xs select-none">
            {"└─"}
          </span>
        )}
        <button
          onClick={() => hasChildren && setCollapsed((c) => !c)}
          className={`
            inline-flex items-center gap-2 px-2.5 py-0.5 rounded border font-mono text-sm font-semibold
            transition-all duration-150
            ${colorClass}
            ${hasChildren ? "cursor-pointer hover:bg-white/5" : "cursor-default"}
            ${isRoot ? "text-base px-3 py-1" : ""}
          `}
        >
          {hasChildren && (
            <span className="text-xs opacity-60">{collapsed ? "▶" : "▼"}</span>
          )}
          {label}
        </button>
      </div>

      {/* children */}
      {!collapsed && hasChildren && (
        <div className="mt-1 ml-2 border-l border-zinc-700/50 pl-2 flex flex-col gap-1">
          {Object.entries(children).map(([childLabel, grandChildren]) => (
            <TreeNode
              key={childLabel}
              label={childLabel}
              children={grandChildren as Record<string, unknown>}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};