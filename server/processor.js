/**
 * processor.js
 * All business logic for the /bfhl endpoint.
 */

// ── 1. Validation ─────────────────────────────────────────────────────────────

/**
 * Trim, validate and parse one raw entry.
 * Returns { valid: true, parent, child, entry } or { valid: false, entry }
 */
function parseEntry(raw) {
  const entry = raw.trim();
  const match = entry.match(/^([A-Z])->([A-Z])$/);
  if (!match) return { valid: false, entry };

  const [, parent, child] = match;
  if (parent === child) return { valid: false, entry }; // self-loop

  return { valid: true, parent, child, entry };
}

// ── 2. Duplicate detection ────────────────────────────────────────────────────

/**
 * Splits valid edges into unique (first occurrence) and duplicates (all
 * subsequent occurrences, each pushed only once regardless of repeat count).
 */
function deduplicateEdges(validEdges) {
  const seen = new Set();
  const addedToDuplicates = new Set();
  const unique = [];
  const duplicates = [];

  for (const edge of validEdges) {
    const key = `${edge.parent}->${edge.child}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(edge);
    } else if (!addedToDuplicates.has(key)) {
      addedToDuplicates.add(key);
      duplicates.push(key);
    }
  }

  return { unique, duplicate_edges: duplicates };
}

// ── 3. Graph construction ─────────────────────────────────────────────────────

/**
 * Builds an adjacency map and tracks which nodes appear as children.
 * Diamond / multi-parent rule: first-encountered parent edge wins; later
 * parent edges for the same child are silently discarded.
 */
function buildGraph(uniqueEdges) {
  const children = {};   // parent -> [child, ...]
  const childOf = {};    // child  -> first parent (to detect multi-parent)
  const allNodes = new Set();

  for (const { parent, child } of uniqueEdges) {
    allNodes.add(parent);
    allNodes.add(child);

    // Multi-parent: if child already has a parent, skip
    if (child in childOf) continue;
    childOf[child] = parent;

    if (!children[parent]) children[parent] = [];
    children[parent].push(child);
  }

  return { children, childOf, allNodes };
}

// ── 4. Connected components ───────────────────────────────────────────────────

/**
 * Groups all nodes into connected components (ignoring edge direction).
 */
function getComponents(allNodes, children, childOf) {
  const visited = new Set();
  const components = [];

  // Build an undirected adjacency for traversal
  const undirected = {};
  for (const node of allNodes) undirected[node] = new Set();

  for (const [parent, kids] of Object.entries(children)) {
    for (const child of kids) {
      undirected[parent].add(child);
      undirected[child].add(parent);
    }
  }

  function bfs(start) {
    const queue = [start];
    const component = new Set();
    visited.add(start);
    while (queue.length) {
      const node = queue.shift();
      component.add(node);
      for (const neighbour of undirected[node] || []) {
        if (!visited.has(neighbour)) {
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
    }
    return component;
  }

  for (const node of allNodes) {
    if (!visited.has(node)) {
      components.push(bfs(node));
    }
  }

  return components;
}

// ── 5. Cycle detection ────────────────────────────────────────────────────────

/**
 * Returns true if the subgraph formed by `nodes` contains a cycle.
 * Uses DFS with three-colour marking.
 */
function hasCycle(nodes, children) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  for (const n of nodes) color[n] = WHITE;

  function dfs(node) {
    color[node] = GRAY;
    for (const child of children[node] || []) {
      if (color[child] === GRAY) return true;   // back edge → cycle
      if (color[child] === WHITE && dfs(child)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (const n of nodes) {
    if (color[n] === WHITE && dfs(n)) return true;
  }
  return false;
}

// ── 6. Tree building ──────────────────────────────────────────────────────────

/**
 * Recursively builds the nested tree object: { A: { B: {}, C: { D: {} } } }
 */
function buildNestedTree(root, children) {
  const node = {};
  for (const child of children[root] || []) {
    node[child] = buildNestedTree(child, children);
  }
  return node;
}

/**
 * Depth = number of nodes on the longest root-to-leaf path.
 */
function calcDepth(root, children) {
  const kids = children[root] || [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map((c) => calcDepth(c, children)));
}

// ── 7. Main processor ─────────────────────────────────────────────────────────

function processData(data) {
  // Step 1 – validate
  const invalid_entries = [];
  const validEdges = [];

  for (const raw of data) {
    const parsed = parseEntry(raw);
    if (parsed.valid) {
      validEdges.push(parsed);
    } else {
      invalid_entries.push(parsed.entry);
    }
  }

  // Step 2 – deduplicate
  const { unique, duplicate_edges } = deduplicateEdges(validEdges);

  // Step 3 – build graph
  const { children, childOf, allNodes } = buildGraph(unique);

  // Step 4 – connected components
  const components = getComponents(allNodes, children, childOf);

  // Step 5 – build hierarchy objects
  const hierarchies = [];

  for (const component of components) {
    // Find root(s): nodes in this component that are never a child
    const roots = [...component].filter((n) => !(n in childOf));

    let root;
    if (roots.length > 0) {
      // Lexicographically smallest natural root
      root = roots.sort()[0];
    } else {
      // Pure cycle – no natural root; use lex-smallest node
      root = [...component].sort()[0];
    }

    if (hasCycle(component, children)) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = { [root]: buildNestedTree(root, children) };
      const depth = calcDepth(root, children);
      hierarchies.push({ root, tree, depth });
    }
  }

  // Sort hierarchies by root label for deterministic output (optional, looks clean)
  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  // Step 6 – summary
  const nonCyclic = hierarchies.filter((h) => !h.has_cycle);
  const total_trees = nonCyclic.length;
  const total_cycles = hierarchies.length - total_trees;

  let largest_tree_root = "";
  let maxDepth = -1;
  for (const h of nonCyclic) {
    if (
      h.depth > maxDepth ||
      (h.depth === maxDepth && h.root < largest_tree_root)
    ) {
      maxDepth = h.depth;
      largest_tree_root = h.root;
    }
  }

  return {
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: { total_trees, total_cycles, largest_tree_root },
  };
}

module.exports = { processData };