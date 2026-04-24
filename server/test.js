/**
 * test.js  –  run with: node test.js
 * Validates processor output against the spec's worked example.
 */
const { processData } = require("./processor");

const input = [
  "A->B", "A->C", "B->D", "C->E", "E->F",
  "X->Y", "Y->Z", "Z->X",
  "P->Q", "Q->R",
  "G->H", "G->H", "G->I",
  "hello", "1->2", "A->",
];

const result = processData(input);
console.log(JSON.stringify(result, null, 2));

// ── Assertions ────────────────────────────────────────────────────────────────
const assert = (cond, msg) => {
  if (!cond) { console.error("FAIL:", msg); process.exitCode = 1; }
  else        { console.log ("PASS:", msg); }
};

const h = Object.fromEntries(result.hierarchies.map((x) => [x.root, x]));

assert(h["A"].depth === 4,          "Tree A depth = 4");
assert(!h["A"].has_cycle,           "Tree A has no cycle");
assert(h["X"].has_cycle === true,   "Group X has cycle");
assert(h["X"].tree &&
       Object.keys(h["X"].tree).length === 0, "Cyclic tree = {}");
assert(h["P"].depth === 3,          "Tree P depth = 3");
assert(h["G"].depth === 2,          "Tree G depth = 2");

assert(result.invalid_entries.includes("hello"),  "invalid: hello");
assert(result.invalid_entries.includes("1->2"),   "invalid: 1->2");
assert(result.invalid_entries.includes("A->"),    "invalid: A->");

assert(result.duplicate_edges.includes("G->H"),   "duplicate: G->H");
assert(result.duplicate_edges.length === 1,       "only one duplicate entry for G->H");

assert(result.summary.total_trees  === 3,  "total_trees = 3");
assert(result.summary.total_cycles === 1,  "total_cycles = 1");
assert(result.summary.largest_tree_root === "A", "largest root = A");