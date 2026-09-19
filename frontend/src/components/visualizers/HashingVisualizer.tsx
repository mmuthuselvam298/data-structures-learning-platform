import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, RotateCcw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const HashingVisualizer: React.FC = () => {
  const tableSize = 10;
  const [table, setTable] = useState<(number | null)[]>([null, null, 12, null, null, null, null, null, null, null]);
  const [inputKey, setInputKey] = useState<string>('22');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('Hash Table ready (Size M = 10). Division method: h(k) = k % 10.');

  const handleInsert = () => {
    const key = parseInt(inputKey.trim());
    if (isNaN(key)) return;

    const initialHash = key % tableSize;
    let idx = initialHash;
    let probes = 0;
    const newTable = [...table];

    // Check if table full
    if (newTable.filter(x => x !== null).length >= tableSize) {
      setStatusMsg('Hash Table is completely full!');
      return;
    }

    const probeSteps: { idx: number; msg: string; placed: boolean }[] = [];

    while (newTable[idx] !== null && newTable[idx] !== key && probes < tableSize) {
      probeSteps.push({
        idx,
        msg: `Collision at index ${idx}! Key ${newTable[idx]} already occupies slot. Probing next cell...`,
        placed: false
      });
      probes++;
      idx = (idx + 1) % tableSize;
    }

    if (newTable[idx] === key) {
      setStatusMsg(`Key ${key} already in table at index ${idx}.`);
      return;
    }

    newTable[idx] = key;
    probeSteps.push({
      idx,
      msg: `Success! Placed ${key} at index ${idx} after ${probes} collision probe(s).`,
      placed: true
    });

    let i = 0;
    const interval = setInterval(() => {
      if (i < probeSteps.length) {
        const step = probeSteps[i];
        setHighlightIdx(step.idx);
        setStatusMsg(step.msg);
        if (step.placed) {
          setTable(newTable);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setHighlightIdx(null), 1500);
      }
    }, 800);
  };

  const handleReset = () => {
    setTable(Array(tableSize).fill(null));
    setHighlightIdx(null);
    setStatusMsg('Hash table cleared.');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800">
              Unit V • Hashing & Collisions
            </span>
            <h3 className="text-xl font-bold text-slate-800">Hashing Interactive Visualizer</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Division Method $h(k) = k \bmod M$ and Open Addressing Linear Probing.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Table
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Table Buckets Visual */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-violet-50/20 rounded-2xl border border-violet-100 min-h-[380px]">
          <div className="w-full grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
            {table.map((val, idx) => {
              const isHighlight = highlightIdx === idx;
              const isOccupied = val !== null;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[11px] font-mono font-bold text-slate-400 mb-1">
                    #{idx}
                  </span>
                  <motion.div
                    layout
                    className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center border-2 font-mono font-bold shadow-xs transition-all ${
                      isHighlight
                        ? 'bg-violet-600 text-white border-violet-700 shadow-violet-200 scale-105'
                        : isOccupied
                        ? 'bg-white text-slate-800 border-violet-300'
                        : 'bg-slate-50 text-slate-300 border-dashed border-slate-200'
                    }`}
                  >
                    <span className="text-base font-extrabold">{val !== null ? val : '—'}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Formula Callout */}
          <div className="bg-white/80 p-3 rounded-xl border border-violet-200 text-xs text-slate-600 font-mono mt-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-violet-600" />
            <span>Hash Formula: <strong className="text-violet-700">h(key) = key % 10</strong></span>
            <span className="text-slate-400">|</span>
            <span>Collision Probe: <strong className="text-violet-700">(h(key) + i) % 10</strong></span>
          </div>

          {/* Status Message */}
          <div className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {statusMsg}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Insert into Hash Table
            </h4>

            <div className="flex gap-2">
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Key to hash"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
              />
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold active:scale-95 shadow-sm"
              >
                Hash & Insert
              </button>
            </div>

            {/* Quick Test Keys */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase">Test Collisions:</span>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                <button
                  onClick={() => setInputKey('22')}
                  className="py-1 px-2 bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Key 22 (collides with 12)
                </button>
                <button
                  onClick={() => setInputKey('32')}
                  className="py-1 px-2 bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Key 32 (double probe)
                </button>
                <button
                  onClick={() => setInputKey('45')}
                  className="py-1 px-2 bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  Key 45 (idx 5)
                </button>
              </div>
            </div>
          </div>

          {/* C Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-violet-400">Linear Probing C Code</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Avg: O(1)</span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              <p>int idx = key % SIZE;</p>
              <p><span className="text-violet-400">while</span> (table[idx] != -1) &#123;</p>
              <p className="pl-4">idx = (idx + 1) % SIZE; // probe</p>
              <p>&#125;</p>
              <p>table[idx] = key;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
