import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeftRight, Repeat, Plus, Trash2, Search, Sparkles, Music } from 'lucide-react';

interface ListNode {
  id: number;
  data: number | string;
  nextId: number | null;
  prevId?: number | null;
}

export const LinkedListVisualizer: React.FC = () => {
  const [listType, setListType] = useState<'singly' | 'doubly' | 'circular'>('singly');
  const [nodes, setNodes] = useState<ListNode[]>([
    { id: 1, data: 10, nextId: 2, prevId: null },
    { id: 2, data: 20, nextId: 3, prevId: 1 },
    { id: 3, data: 30, nextId: null, prevId: 2 }
  ]);
  const [inputVal, setInputVal] = useState<string>('25');
  const [positionInput, setPositionInput] = useState<number>(1);
  const [statusMsg, setStatusMsg] = useState<string>('Singly Linked list active. Insertions at head take O(1).');
  const [highlightId, setHighlightId] = useState<number | null>(null);

  // Singly / DLL / CLL Insert Beginning
  const handleInsertBeginning = () => {
    const val = parseInt(inputVal.trim());
    if (isNaN(val)) return;

    const newId = Date.now();
    const firstNode = nodes[0];
    const newNode: ListNode = {
      id: newId,
      data: val,
      nextId: firstNode ? firstNode.id : (listType === 'circular' ? newId : null),
      prevId: null
    };

    let updatedNodes = [newNode, ...nodes];
    if (listType === 'doubly' && firstNode) {
      updatedNodes[1] = { ...updatedNodes[1], prevId: newId };
    }
    if (listType === 'circular') {
      // update tail to point to new head
      const lastIdx = updatedNodes.length - 1;
      updatedNodes[lastIdx] = { ...updatedNodes[lastIdx], nextId: newId };
    }

    setNodes(updatedNodes);
    setHighlightId(newId);
    setStatusMsg(`Inserted ${val} at Beginning. head = newNode; (O(1)).`);
    setTimeout(() => setHighlightId(null), 1200);
  };

  // Insert End
  const handleInsertEnd = () => {
    const val = parseInt(inputVal.trim());
    if (isNaN(val)) return;

    const newId = Date.now();
    const lastNode = nodes[nodes.length - 1];
    const firstNode = nodes[0];

    const newNode: ListNode = {
      id: newId,
      data: val,
      nextId: listType === 'circular' ? (firstNode ? firstNode.id : newId) : null,
      prevId: listType === 'doubly' ? (lastNode ? lastNode.id : null) : undefined
    };

    let updated = [...nodes];
    if (lastNode) {
      updated[updated.length - 1] = { ...lastNode, nextId: newId };
    }
    updated.push(newNode);

    setNodes(updated);
    setHighlightId(newId);
    setStatusMsg(`Inserted ${val} at End. Traversed to tail and updated next pointer (O(n)).`);
    setTimeout(() => setHighlightId(null), 1200);
  };

  // Delete Beginning
  const handleDeleteBeginning = () => {
    if (nodes.length === 0) {
      setStatusMsg('List is already empty!');
      return;
    }
    const val = nodes[0].data;
    const remaining = nodes.slice(1);
    if (listType === 'doubly' && remaining.length > 0) {
      remaining[0] = { ...remaining[0], prevId: null };
    }
    if (listType === 'circular' && remaining.length > 0) {
      const last = remaining.length - 1;
      remaining[last] = { ...remaining[last], nextId: remaining[0].id };
    }
    setNodes(remaining);
    setStatusMsg(`Deleted head node [${val}]. head updated to next node (O(1)).`);
  };

  // Delete End
  const handleDeleteEnd = () => {
    if (nodes.length === 0) return;
    const val = nodes[nodes.length - 1].data;
    const remaining = nodes.slice(0, -1);
    if (remaining.length > 0) {
      const last = remaining.length - 1;
      remaining[last] = {
        ...remaining[last],
        nextId: listType === 'circular' ? remaining[0].id : null
      };
    }
    setNodes(remaining);
    setStatusMsg(`Deleted tail node [${val}].`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
              Unit II • Dynamic Memory & Pointers
            </span>
            <h3 className="text-xl font-bold text-slate-800">Linked List Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pointers connect non-contiguous nodes allocated with malloc().
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setListType('singly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${listType === 'singly' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
          >
            Singly Linked List
          </button>
          <button
            onClick={() => setListType('doubly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${listType === 'doubly' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
          >
            Doubly Linked List (DLL)
          </button>
          <button
            onClick={() => setListType('circular')}
            className={`px-3 py-1.5 rounded-lg transition-all ${listType === 'circular' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'}`}
          >
            Circular Linked List (CLL)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Visual Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-teal-50/30 rounded-2xl border border-teal-100 min-h-[380px] relative overflow-hidden">
          {/* Head Indicator */}
          <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-500 mb-4 px-2">
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              HEAD: {nodes.length > 0 ? `[Node ${nodes[0].data}]` : 'NULL'}
            </span>
            {listType === 'circular' && (
              <span className="bg-teal-100 text-teal-900 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                Continuous Loop (Zero NULL Pointers)
              </span>
            )}
          </div>

          {/* Node Chain */}
          <div className="w-full overflow-x-auto py-8">
            <div className="flex items-center gap-3 min-w-max px-4">
              <AnimatePresence>
                {nodes.map((node, idx) => {
                  const isHead = idx === 0;
                  const isTail = idx === nodes.length - 1;
                  const isHighlight = highlightId === node.id;

                  return (
                    <React.Fragment key={node.id}>
                      {/* Node Box */}
                      <motion.div
                        layout
                        initial={{ scale: 0.7, opacity: 0, y: -20 }}
                        animate={{
                          scale: isHighlight ? 1.08 : 1,
                          opacity: 1,
                          y: 0,
                          borderColor: isHighlight ? '#14B8A6' : '#CBD5E1'
                        }}
                        exit={{ scale: 0.7, opacity: 0, y: 20 }}
                        className={`flex rounded-xl overflow-hidden border-2 shadow-xs bg-white font-mono text-xs ${
                          isHighlight ? 'shadow-teal-200 border-teal-500 ring-2 ring-teal-300' : ''
                        }`}
                      >
                        {/* Prev pointer partition if Doubly */}
                        {listType === 'doubly' && (
                          <div className="px-2 py-3 bg-slate-100 border-r border-slate-200 text-[10px] text-slate-500 flex items-center">
                            {isHead ? 'NULL' : '•'}
                          </div>
                        )}

                        {/* Data Partition */}
                        <div className="px-4 py-3 bg-white flex flex-col items-center justify-center min-w-[54px]">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">DATA</span>
                          <span className="text-base font-extrabold text-slate-800">{node.data}</span>
                        </div>

                        {/* Next pointer partition */}
                        <div className="px-2 py-3 bg-teal-50 border-l border-teal-100 text-[10px] text-teal-700 flex items-center font-bold">
                          {isTail && listType !== 'circular' ? 'NULL' : '•'}
                        </div>
                      </motion.div>

                      {/* Connecting Arrow */}
                      {!isTail && (
                        <div className="flex items-center text-teal-600">
                          {listType === 'doubly' ? (
                            <ArrowLeftRight className="w-5 h-5 text-teal-500" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-teal-500" />
                          )}
                        </div>
                      )}

                      {/* Circular Return Loop Arrow */}
                      {isTail && listType === 'circular' && nodes.length > 1 && (
                        <div className="flex items-center text-teal-600 gap-1 text-[11px] font-bold px-2 py-1 bg-teal-100/70 rounded-full border border-teal-200">
                          <Repeat className="w-3.5 h-3.5 animate-spin" />
                          <span>↳ Loop to Head</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>

              {nodes.length === 0 && (
                <div className="text-xs text-slate-400 font-medium py-12 mx-auto">
                  List is empty (head == NULL)
                </div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {statusMsg}
          </div>
        </div>

        {/* Operations & C Code */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              List Operations
            </h4>

            {/* Input Value */}
            <div className="flex gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleInsertBeginning}
                className="px-2.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold active:scale-95"
              >
                Insert Head (O(1))
              </button>
              <button
                onClick={handleInsertEnd}
                className="px-2.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold active:scale-95"
              >
                Insert Tail (O(n))
              </button>
              <button
                onClick={handleDeleteBeginning}
                disabled={nodes.length === 0}
                className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50"
              >
                Delete Head
              </button>
              <button
                onClick={handleDeleteEnd}
                disabled={nodes.length === 0}
                className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50"
              >
                Delete Tail
              </button>
            </div>
          </div>

          {/* C Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-teal-400">C Struct Definition</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Heap: malloc()</span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              <p><span className="text-teal-400">struct</span> Node &#123;</p>
              {listType === 'doubly' && <p className="pl-4"><span className="text-teal-400">struct</span> Node *prev;</p>}
              <p className="pl-4">int data;</p>
              <p className="pl-4"><span className="text-teal-400">struct</span> Node *next;</p>
              <p>&#125;;</p>
              <p className="text-slate-500 pt-1">// Allocate & Link Head</p>
              <p>newNode-&gt;next = head;</p>
              <p>head = newNode;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
