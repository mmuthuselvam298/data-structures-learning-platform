import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const SearchingVisualizer: React.FC = () => {
  const [method, setMethod] = useState<'binary' | 'linear'>('binary');
  const [sortedArray] = useState<number[]>([5, 12, 18, 23, 31, 44, 56, 72, 85, 99]);
  const [target, setTarget] = useState<string>('23');

  // Binary search state
  const [low, setLow] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [foundIdx, setFoundIdx] = useState<number | null>(null);

  // Linear search state
  const [currentScanIdx, setCurrentScanIdx] = useState<number | null>(null);

  const [statusMsg, setStatusMsg] = useState<string>('Select an algorithm and input a key to search.');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleBinarySearch = () => {
    const key = parseInt(target.trim());
    if (isNaN(key)) return;

    setIsSearching(true);
    setFoundIdx(null);

    let l = 0;
    let h = sortedArray.length - 1;
    const steps: { l: number; m: number; h: number; found: boolean; msg: string }[] = [];

    while (l <= h) {
      const m = Math.floor((l + h) / 2);
      const val = sortedArray[m];
      if (val === key) {
        steps.push({ l, m, h, found: true, msg: `A[${m}] = ${val} == ${key}. MATCH FOUND!` });
        break;
      } else if (val < key) {
        steps.push({ l, m, h, found: false, msg: `A[${m}] = ${val} < ${key}. Target is in right half. low = ${m + 1}.` });
        l = m + 1;
      } else {
        steps.push({ l, m, h, found: false, msg: `A[${m}] = ${val} > ${key}. Target is in left half. high = ${m - 1}.` });
        h = m - 1;
      }
    }

    if (l > h) {
      steps.push({ l, m: -1, h, found: false, msg: `Target ${key} not present in sorted array.` });
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        const s = steps[i];
        setLow(s.l);
        setMid(s.m);
        setHigh(s.h);
        if (s.found) setFoundIdx(s.m);
        setStatusMsg(s.msg);
        i++;
      } else {
        clearInterval(interval);
        setIsSearching(false);
      }
    }, 1000);
  };

  const handleLinearSearch = () => {
    const key = parseInt(target.trim());
    if (isNaN(key)) return;

    setIsSearching(true);
    setFoundIdx(null);
    setLow(null); setMid(null); setHigh(null);

    let i = 0;
    const interval = setInterval(() => {
      if (i < sortedArray.length) {
        setCurrentScanIdx(i);
        if (sortedArray[i] === key) {
          setFoundIdx(i);
          setStatusMsg(`Key ${key} found at index ${i} after ${i + 1} comparison(s)!`);
          clearInterval(interval);
          setIsSearching(false);
        } else {
          setStatusMsg(`Scanning index ${i} (${sortedArray[i]} != ${key}). Moving next.`);
          i++;
        }
      } else {
        setCurrentScanIdx(null);
        setStatusMsg(`Key ${key} not found after ${sortedArray.length} comparisons.`);
        clearInterval(interval);
        setIsSearching(false);
      }
    }, 500);
  };

  const handleReset = () => {
    setLow(null);
    setMid(null);
    setHigh(null);
    setFoundIdx(null);
    setCurrentScanIdx(null);
    setStatusMsg('Reset to initial state.');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Unit V • Searching Techniques
            </span>
            <h3 className="text-xl font-bold text-slate-800">Searching Interactive Visualizer</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential scan O(n) vs. divide-and-conquer interval halving O(log n).
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => { setMethod('binary'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${method === 'binary' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
          >
            Binary Search (O(log n))
          </button>
          <button
            onClick={() => { setMethod('linear'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${method === 'linear' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
          >
            Linear Search (O(n))
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Visual Array Window */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-emerald-50/20 rounded-2xl border border-emerald-100 min-h-[380px]">
          {/* Pointer status */}
          {method === 'binary' && low !== null && (
            <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-600 mb-6 px-4">
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                LOW = idx {low}
              </span>
              <span className="bg-white px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-extrabold">
                MID = idx {mid} ({sortedArray[mid!]})
              </span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200">
                HIGH = idx {high}
              </span>
            </div>
          )}

          {/* Array Cells */}
          <div className="flex items-center gap-2 overflow-x-auto p-4 max-w-full">
            {sortedArray.map((val, idx) => {
              const isFound = foundIdx === idx;
              const isMid = mid === idx;
              const isScanning = currentScanIdx === idx;
              const isOutsideRange = method === 'binary' && low !== null && high !== null && (idx < low || idx > high);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">
                    {idx === low ? 'LOW' : idx === high ? 'HIGH' : ''}
                  </span>
                  <motion.div
                    layout
                    className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center border-2 font-mono font-bold transition-all shadow-xs ${
                      isFound
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200 scale-105'
                        : isMid
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-amber-200 scale-105'
                        : isScanning
                        ? 'bg-blue-500 text-white border-blue-600'
                        : isOutsideRange
                        ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-40'
                        : 'bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-base font-extrabold">{val}</span>
                    <span className="text-[9px] opacity-70">[{idx}]</span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          <div className="mt-6 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {statusMsg}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Search Controls
            </h4>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Search Target Key:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Target key"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                />
                <button
                  onClick={method === 'binary' ? handleBinarySearch : handleLinearSearch}
                  disabled={isSearching}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50 flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setTarget('23')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                Key: 23
              </button>
              <button
                onClick={() => setTarget('72')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                Key: 72
              </button>
              <button
                onClick={handleReset}
                className="ml-auto px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Complexity Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-emerald-400">
                {method === 'binary' ? 'Binary Search' : 'Linear Search'}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {method === 'binary' ? 'O(log n)' : 'O(n)'}
              </span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              {method === 'binary' ? (
                <>
                  <p>mid = low + (high - low) / 2;</p>
                  <p><span className="text-emerald-400">if</span> (arr[mid] == target) <span className="text-amber-400">return</span> mid;</p>
                  <p><span className="text-emerald-400">else if</span> (arr[mid] &lt; target) low = mid + 1;</p>
                  <p><span className="text-emerald-400">else</span> high = mid - 1;</p>
                </>
              ) : (
                <>
                  <p><span className="text-emerald-400">for</span> (int i = 0; i &lt; n; i++) &#123;</p>
                  <p className="pl-4"><span className="text-emerald-400">if</span> (arr[i] == target) <span className="text-amber-400">return</span> i;</p>
                  <p>&#125;</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
