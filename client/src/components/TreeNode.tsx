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
    "bg-[#37d5ff]",
    "bg-[#97ff60]",
    "bg-[#ffd36a]",
    "bg-[#ffb3e6]",
    "bg-[#d5b7ff]",
  ];
  const colorClass = nodeColors[depth % nodeColors.length];

  return (
    <div className="flex flex-col" style={{ paddingLeft: isRoot ? 0 : "1.5rem" }}>
      {/* connector line */}
      <div className="flex items-center gap-2 group">
        {!isRoot && (
          <span className="text-zinc-800 font-mono text-xs select-none font-bold">
            {"└─"}
          </span>
        )}
        <button
          onClick={() => hasChildren && setCollapsed((c) => !c)}
          className={`
            inline-flex items-center gap-2 px-2.5 py-0.5 border-2 border-black text-sm font-black
            transition-transform duration-75 text-black
            ${colorClass}
            ${hasChildren ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5" : "cursor-default"}
            ${isRoot ? "text-base px-3 py-1 border-4 shadow-[4px_4px_0_0_#000]" : ""}
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
        <div className="mt-1 ml-2 border-l-2 border-black pl-2 flex flex-col gap-1">
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