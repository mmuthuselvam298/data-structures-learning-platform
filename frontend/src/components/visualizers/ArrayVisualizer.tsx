import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, Sparkles, Layers, Grid } from 'lucide-react';

export const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50]);
  const [activeTab, setActiveTab] = useState<'basic' | 'poly' | 'sparse'>('basic');
  const [inputVal, setInputVal] = useState<string>('25');
  const [insertIdx, setInsertIdx] = useState<number>(2);
  const [searchKey, setSearchKey] = useState<string>('30');
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('Array loaded in contiguous memory. Access is O(1).');

  // Handle Search
  const handleSearch = () => {
    const key = parseInt(searchKey.trim());
    if (isNaN(key)) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < array.length) {
        setHighlightIdx(i);
        if (array[i] === key) {
          setStatusMsg(`Key ${key} found at index ${i}!`);
          clearInterval(interval);
        } else {
          setStatusMsg(`Index ${i} (${array[i]}) does not match ${key}...`);
          i++;
        }
      } else {
        setHighlightIdx(null);
        setStatusMsg(`Key ${key} not found in array.`);
        clearInterval(interval);
      }
    }, 450);
  };

  // Handle Insert
  const handleInsert = () => {
    const val = parseInt(inputVal.trim());
    if (isNaN(val)) return;
    if (array.length >= 8) {
      setStatusMsg('Array at max demonstration capacity (8).');
      return;
    }
    const idx = Math.max(0, Math.min(insertIdx, array.length));
    const newArr = [...array.slice(0, idx), val, ...array.slice(idx)];
    setArray(newArr);
    setHighlightIdx(idx);
    setStatusMsg(`Inserted ${val} at index ${idx}. Elements shifted right (O(n)).`);
    setTimeout(() => setHighlightIdx(null), 1500);
  };

  // Handle Delete
  const handleDelete = (idx: number) => {
    const val = array[idx];
    const newArr = array.filter((_, i) => i !== idx);
    setArray(newArr);
    setStatusMsg(`Deleted ${val} from index ${idx}. Remaining elements shifted left (O(n)).`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Unit I • Contiguous Storage
            </span>
            <h3 className="text-xl font-bold text-slate-800">Array & Matrix Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Homogeneous contiguous elements in RAM with direct indexing.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'basic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
          >
            Standard Array
          </button>
          <button
            onClick={() => setActiveTab('poly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'poly' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
          >
            Polynomial ADT
          </button>
          <button
            onClick={() => setActiveTab('sparse')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'sparse' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'}`}
          >
            Sparse Matrix Triplet
          </button>
        </div>
      </div>

      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Main Visual */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-blue-50/30 rounded-2xl border border-blue-100 min-h-[360px]">
            <div className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
              Contiguous Physical RAM Memory Layout
            </div>

            {/* Array Cells */}
            <div className="flex items-center gap-2 overflow-x-auto p-4 max-w-full">
              {array.map((val, idx) => {
                const isHighlight = highlightIdx === idx;
                return (
                  <motion.div
                    key={`${idx}-${val}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isHighlight ? 1.08 : 1,
                      opacity: 1,
                      borderColor: isHighlight ? '#2563EB' : '#CBD5E1'
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`w-16 h-20 rounded-xl flex flex-col items-center justify-between p-2 border-2 transition-all shadow-xs ${
                      isHighlight
                        ? 'bg-blue-600 text-white shadow-blue-200 border-blue-700'
                        : 'bg-white text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-60">
                      0x{1000 + idx * 4}
                    </span>
                    <span className="text-xl font-extrabold">{val}</span>
                    <button
                      onClick={() => handleDelete(idx)}
                      title="Delete element"
                      className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
                        isHighlight ? 'hover:bg-blue-700 text-blue-100' : 'hover:bg-red-50 text-red-500'
                      }`}
                    >
                      Delete
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Index Labels */}
            <div className="flex items-center gap-2 mt-2">
              {array.map((_, idx) => (
                <div key={idx} className="w-16 text-center text-xs font-mono font-bold text-slate-400">
                  [{idx}]
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="mt-6 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
              {statusMsg}
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Array Operations
              </h4>

              {/* Insert */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Insert (Value & Index):</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Val"
                    className="w-1/2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                  />
                  <input
                    type="number"
                    value={insertIdx}
                    onChange={(e) => setInsertIdx(parseInt(e.target.value) || 0)}
                    placeholder="Idx"
                    className="w-1/2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                  />
                  <button
                    onClick={handleInsert}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold active:scale-95 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insert
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <label className="text-xs font-semibold text-slate-600">Search Key:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Key to search"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* C Complexity Box */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-semibold text-[11px] text-blue-400">Address Formula</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Access: O(1)</span>
              </div>
              <div className="pt-3 text-slate-300 space-y-1">
                <p>Address(A[i]) = Base + i * sizeof(int)</p>
                <p className="text-slate-500 pt-1">// Insert requires shifting O(n)</p>
                <p><span className="text-blue-400">for</span> (int i = n-1; i &gt;= pos; i--)</p>
                <p className="pl-4">arr[i+1] = arr[i];</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Polynomial Representation Tab */}
      {activeTab === 'poly' && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Algebraic Polynomial: </span>
              <span className="font-mono text-blue-700 font-extrabold text-sm">P(x) = 5x⁴ + 3x² + 7x + 2</span>
            </div>
            <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              Array of Structs: (coeff, exp)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-3">Term Index</th>
                  <th className="p-3">Coefficient (coeff)</th>
                  <th className="p-3">Exponent (exp)</th>
                  <th className="p-3">Mathematical Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3">[0]</td>
                  <td className="p-3 text-blue-600 font-bold">5</td>
                  <td className="p-3 text-slate-700 font-bold">4</td>
                  <td className="p-3 font-bold text-slate-800">5x⁴</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3">[1]</td>
                  <td className="p-3 text-blue-600 font-bold">3</td>
                  <td className="p-3 text-slate-700 font-bold">2</td>
                  <td className="p-3 font-bold text-slate-800">3x²</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3">[2]</td>
                  <td className="p-3 text-blue-600 font-bold">7</td>
                  <td className="p-3 text-slate-700 font-bold">1</td>
                  <td className="p-3 font-bold text-slate-800">7x¹</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3">[3]</td>
                  <td className="p-3 text-blue-600 font-bold">2</td>
                  <td className="p-3 text-slate-700 font-bold">0</td>
                  <td className="p-3 font-bold text-slate-800">2x⁰ = 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sparse Matrix Triplet Tab */}
      {activeTab === 'sparse' && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Sparse Matrix 3-Tuple Representation: </span>
              <span className="text-slate-600">Stores only non-zero coordinates saving ~95% RAM!</span>
            </div>
            <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              Tuple: [Row, Col, Val]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original 4x4 Matrix */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h5 className="text-xs font-bold text-slate-700 mb-2">Original 4x4 Matrix (16 cells)</h5>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs text-center">
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-blue-100 font-bold text-blue-700 rounded border border-blue-300">5</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>

                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>

                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-blue-100 font-bold text-blue-700 rounded border border-blue-300">9</span>

                <span className="p-2 bg-blue-100 font-bold text-blue-700 rounded border border-blue-300">7</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
                <span className="p-2 bg-white rounded border border-slate-200">0</span>
              </div>
            </div>

            {/* Triplet Table */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h5 className="text-xs font-bold text-slate-700 mb-2">Sparse Triplet Table (4 entries)</h5>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-1.5">Row</th>
                    <th className="p-1.5">Col</th>
                    <th className="p-1.5">Val</th>
                    <th className="p-1.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-amber-50 text-amber-900 font-bold">
                    <td className="p-1.5">4</td>
                    <td className="p-1.5">4</td>
                    <td className="p-1.5">3</td>
                    <td className="p-1.5 text-[10px]">Metadata (Rows, Cols, Non-zeros)</td>
                  </tr>
                  <tr>
                    <td className="p-1.5">0</td>
                    <td className="p-1.5">1</td>
                    <td className="p-1.5 text-blue-600 font-bold">5</td>
                    <td className="p-1.5 text-[10px]">Non-zero cell at (0, 1)</td>
                  </tr>
                  <tr>
                    <td className="p-1.5">2</td>
                    <td className="p-1.5">3</td>
                    <td className="p-1.5 text-blue-600 font-bold">9</td>
                    <td className="p-1.5 text-[10px]">Non-zero cell at (2, 3)</td>
                  </tr>
                  <tr>
                    <td className="p-1.5">3</td>
                    <td className="p-1.5">0</td>
                    <td className="p-1.5 text-blue-600 font-bold">7</td>
                    <td className="p-1.5 text-[10px]">Non-zero cell at (3, 0)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
