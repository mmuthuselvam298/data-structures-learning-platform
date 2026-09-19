import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Play, Sparkles, Scale, RefreshCw } from 'lucide-react';

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
  height?: number;
  balanceFactor?: number;
}

export const TreeVisualizer: React.FC = () => {
  const [treeMode, setTreeMode] = useState<'bst' | 'avl'>('bst');
  const [keys, setKeys] = useState<number[]>([45, 36, 76, 23, 89]);
  const [inputKey, setInputKey] = useState<string>('39');
  const [searchTarget, setSearchTarget] = useState<string>('76');
  const [highlightKey, setHighlightKey] = useState<number | null>(null);
  const [activePath, setActivePath] = useState<number[]>([]);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string>('Binary Search Tree active. Left < Root < Right.');

  // Build BST from keys
  const buildBST = (arr: number[]): TreeNode | null => {
    if (arr.length === 0) return null;

    const insertNode = (root: TreeNode | null, val: number): TreeNode => {
      if (!root) return { val, height: 1, balanceFactor: 0 };
      if (val < root.val) root.left = insertNode(root.left || null, val);
      else if (val > root.val) root.right = insertNode(root.right || null, val);
      
      const lh = root.left?.height || 0;
      const rh = root.right?.height || 0;
      root.height = 1 + Math.max(lh, rh);
      root.balanceFactor = lh - rh;
      return root;
    };

    let root: TreeNode | null = null;
    arr.forEach(k => {
      root = insertNode(root, k);
    });
    return root;
  };

  const root = buildBST(keys);

  // Insert Key
  const handleInsert = () => {
    const val = parseInt(inputKey.trim());
    if (isNaN(val)) return;
    if (keys.includes(val)) {
      setStatusMsg(`Key ${val} already exists in BST! Duplicates not allowed.`);
      return;
    }
    const newKeys = [...keys, val];
    setKeys(newKeys);
    setHighlightKey(val);
    setStatusMsg(`Inserted ${val} into BST.`);
    setInputKey(String(val + 5));
    setTimeout(() => setHighlightKey(null), 1500);
  };

  // Search Key
  const handleSearch = () => {
    const val = parseInt(searchTarget.trim());
    if (isNaN(val)) return;

    const path: number[] = [];
    let curr = root;
    let found = false;

    while (curr) {
      path.push(curr.val);
      if (curr.val === val) {
        found = true;
        break;
      } else if (val < curr.val) {
        curr = curr.left || null;
      } else {
        curr = curr.right || null;
      }
    }

    setActivePath(path);
    if (found) {
      setHighlightKey(val);
      setStatusMsg(`Found ${val}! Traversal path: ${path.join(' -> ')}`);
    } else {
      setStatusMsg(`${val} not found in BST. Searched path: ${path.join(' -> ')}`);
    }
    setTimeout(() => {
      setActivePath([]);
      setHighlightKey(null);
    }, 2500);
  };

  // Traversals
  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const res: number[] = [];
    const inorder = (n?: TreeNode) => {
      if (!n) return;
      inorder(n.left);
      res.push(n.val);
      inorder(n.right);
    };
    const preorder = (n?: TreeNode) => {
      if (!n) return;
      res.push(n.val);
      preorder(n.left);
      preorder(n.right);
    };
    const postorder = (n?: TreeNode) => {
      if (!n) return;
      postorder(n.left);
      postorder(n.right);
      res.push(n.val);
    };

    if (type === 'inorder') inorder(root || undefined);
    if (type === 'preorder') preorder(root || undefined);
    if (type === 'postorder') postorder(root || undefined);

    setTraversalType(type.toUpperCase());
    setTraversalResult(res);
    setStatusMsg(`Executed ${type.toUpperCase()} traversal: [${res.join(', ')}]`);
  };

  const loadExamSequence = () => {
    // Exact sequence from End Sem Exam Q3: 45, 36, 76, 23, 89, 115, 98, 39, 41, 56, 69, 48
    setKeys([45, 36, 76, 23, 89, 115, 98, 39]);
    setStatusMsg('Loaded End-Term Exam 2025 sequence (first 8 nodes).');
  };

  // Recursive Tree Renderer for SVG
  const renderTreeSvg = (node: TreeNode | null, x: number, y: number, level: number, offset: number): React.ReactNode => {
    if (!node) return null;

    const isHighlighted = highlightKey === node.val || activePath.includes(node.val);
    const leftX = x - offset;
    const rightX = x + offset;
    const nextY = y + 70;

    return (
      <g key={node.val}>
        {/* Left branch line */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={nextY}
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
        )}
        {/* Right branch line */}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={nextY}
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />
        )}

        {/* Node Circle */}
        <motion.circle
          cx={x}
          cy={y}
          r={20}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            fill: isHighlighted ? '#EC4899' : '#FFFFFF',
            stroke: isHighlighted ? '#BE185D' : '#94A3B8'
          }}
          strokeWidth="3"
          className="cursor-pointer transition-colors shadow-sm"
        />

        {/* Value Label */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={isHighlighted ? '#FFFFFF' : '#1E293B'}
          className="font-mono select-none"
        >
          {node.val}
        </text>

        {/* Balance factor pill if in AVL mode */}
        {treeMode === 'avl' && (
          <text
            x={x + 18}
            y={y - 12}
            fontSize="9"
            fontWeight="bold"
            fill={Math.abs(node.balanceFactor || 0) > 1 ? '#EF4444' : '#10B981'}
            className="font-mono select-none"
          >
            BF:{(node.balanceFactor || 0) > 0 ? `+${node.balanceFactor}` : node.balanceFactor}
          </text>
        )}

        {/* Recurse left and right */}
        {renderTreeSvg(node.left || null, leftX, nextY, level + 1, Math.max(offset * 0.52, 28))}
        {renderTreeSvg(node.right || null, rightX, nextY, level + 1, Math.max(offset * 0.52, 28))}
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              Unit III • Hierarchical Trees
            </span>
            <h3 className="text-xl font-bold text-slate-800">Tree & AVL Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Binary Search Trees and AVL Self-Balancing Rotations (LL, RR, LR, RL).
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setTreeMode('bst')}
            className={`px-3 py-1.5 rounded-lg transition-all ${treeMode === 'bst' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600'}`}
          >
            Binary Search Tree (BST)
          </button>
          <button
            onClick={() => setTreeMode('avl')}
            className={`px-3 py-1.5 rounded-lg transition-all ${treeMode === 'avl' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600'}`}
          >
            AVL Self-Balancing Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* SVG Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 bg-pink-50/20 rounded-2xl border border-pink-100 min-h-[420px] relative overflow-hidden">
          <svg className="w-full h-[360px]" viewBox="0 0 500 360">
            {root ? renderTreeSvg(root, 250, 45, 1, 110) : (
              <text x="250" y="180" textAnchor="middle" fill="#94A3B8" fontSize="13">
                Tree is Empty. Insert keys to build.
              </text>
            )}
          </svg>

          {/* Traversal sequence bar */}
          {traversalResult.length > 0 && (
            <div className="w-full bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-pink-200 mt-2 flex items-center justify-between text-xs">
              <span className="font-bold text-pink-700">{traversalType} Result:</span>
              <span className="font-mono font-bold text-slate-800">
                {traversalResult.join(' -> ')}
              </span>
            </div>
          )}

          {/* Status Message */}
          <div className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {statusMsg}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Tree Operations
            </h4>

            {/* Insert Key */}
            <div className="flex gap-2">
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                placeholder="Key"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Insert
              </button>
            </div>

            {/* Search Key */}
            <div className="flex gap-2 pt-1 border-t border-slate-200">
              <input
                type="number"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search key"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
              <button
                onClick={handleSearch}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>

            {/* Traversals */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase">Traversals:</span>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                <button
                  onClick={() => runTraversal('inorder')}
                  className="py-1.5 px-2 bg-white hover:bg-pink-50 text-pink-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Inorder
                </button>
                <button
                  onClick={() => runTraversal('preorder')}
                  className="py-1.5 px-2 bg-white hover:bg-pink-50 text-pink-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Preorder
                </button>
                <button
                  onClick={() => runTraversal('postorder')}
                  className="py-1.5 px-2 bg-white hover:bg-pink-50 text-pink-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Postorder
                </button>
              </div>
            </div>

            {/* Exam Preset */}
            <div className="pt-1">
              <button
                onClick={loadExamSequence}
                className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-pink-600" />
                Load Exam Sequence (Q3)
              </button>
            </div>
          </div>

          {/* C Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-pink-400">BST Inorder C Code</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Time: O(n)</span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              <p><span className="text-pink-400">void</span> inorder(struct Node* root) &#123;</p>
              <p className="pl-3"><span className="text-pink-400">if</span> (root != NULL) &#123;</p>
              <p className="pl-6">inorder(root-&gt;left);</p>
              <p className="pl-6">printf(<span className="text-amber-400">"%d "</span>, root-&gt;data);</p>
              <p className="pl-6">inorder(root-&gt;right);</p>
              <p className="pl-3">&#125;</p>
              <p>&#125;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
