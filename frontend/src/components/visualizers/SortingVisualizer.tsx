import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'insertion' | 'quick'>('quick');
  const [array, setArray] = useState<number[]>([9, 3, 7, 1, 6]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500); // ms per step

  const timerRef = useRef<any>(null);

  // Generate steps whenever array or algorithm changes
  useEffect(() => {
    generateAlgorithmSteps();
  }, [algorithm, array]);

  const generateAlgorithmSteps = () => {
    const a = [...array];
    const generated: any[] = [];
    let comps = 0;
    let swaps = 0;

    if (algorithm === 'bubble') {
      const n = a.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comps++;
          const needSwap = a[j] > a[j + 1];
          if (needSwap) {
            const temp = a[j]; a[j] = a[j + 1]; a[j + 1] = temp;
            swaps++;
          }
          generated.push({
            array: [...a],
            comparing: [j, j + 1],
            swapped: needSwap,
            pivotIdx: null,
            comps,
            swaps,
            msg: `Pass ${i + 1}: Compared A[${j}] and A[${j + 1}]. ` + (needSwap ? 'Swapped!' : 'In order.')
          });
        }
      }
    } else if (algorithm === 'selection') {
      const n = a.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comps++;
          if (a[j] < a[minIdx]) minIdx = j;
          generated.push({
            array: [...a],
            comparing: [i, j],
            minIdx,
            comps,
            swaps,
            msg: `Scanning index ${j}. Minimum value is ${a[minIdx]} at index ${minIdx}.`
          });
        }
        if (minIdx !== i) {
          const temp = a[i]; a[i] = a[minIdx]; a[minIdx] = temp;
          swaps++;
          generated.push({
            array: [...a],
            comparing: [i, minIdx],
            swapped: true,
            comps,
            swaps,
            msg: `Swapped minimum element ${a[i]} into position ${i}.`
          });
        }
      }
    } else if (algorithm === 'insertion') {
      const n = a.length;
      for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;
        while (j >= 0 && a[j] > key) {
          comps++;
          a[j + 1] = a[j];
          swaps++;
          generated.push({
            array: [...a],
            comparing: [j, j + 1],
            keyIdx: j,
            comps,
            swaps,
            msg: `Shifted ${a[j]} right because it is greater than key ${key}.`
          });
          j--;
        }
        a[j + 1] = key;
        generated.push({
          array: [...a],
          comparing: [j + 1],
          keyIdx: j + 1,
          comps,
          swaps,
          msg: `Placed key ${key} into position ${j + 1}.`
        });
      }
    } else if (algorithm === 'quick') {
      // Quick sort trace with last element as pivot (End Sem Exam Q7)
      const qs = (low: number, high: number) => {
        if (low < high) {
          const pivot = a[high];
          let i = low - 1;
          generated.push({
            array: [...a],
            comparing: [],
            pivotIdx: high,
            pivotVal: pivot,
            comps,
            swaps,
            msg: `Partition [${low}..${high}]: Chosen pivot = ${pivot} at index ${high}.`
          });

          for (let j = low; j < high; j++) {
            comps++;
            if (a[j] < pivot) {
              i++;
              const temp = a[i]; a[i] = a[j]; a[j] = temp;
              swaps++;
              generated.push({
                array: [...a],
                comparing: [i, j],
                pivotIdx: high,
                comps,
                swaps,
                msg: `${a[i]} < pivot ${pivot}. Swapped into lower partition at index ${i}.`
              });
            }
          }
          const temp = a[i + 1]; a[i + 1] = a[high]; a[high] = temp;
          swaps++;
          const pi = i + 1;
          generated.push({
            array: [...a],
            comparing: [pi],
            pivotIdx: pi,
            comps,
            swaps,
            msg: `Placed pivot ${pivot} into its sorted position at index ${pi}.`
          });

          qs(low, pi - 1);
          qs(pi + 1, high);
        }
      };
      qs(0, a.length - 1);
    }

    generated.push({
      array: [...a],
      comparing: [],
      sorted: true,
      comps,
      swaps,
      msg: 'Sorting complete! Entire array is strictly ordered.'
    });

    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Play / Pause timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps, speed]);

  const currentStep = steps[currentStepIdx] || {
    array,
    comparing: [],
    comps: 0,
    swaps: 0,
    msg: 'Ready to sort.'
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const loadExamArray = () => {
    setIsPlaying(false);
    setArray([9, 3, 7, 1, 6]);
    setAlgorithm('quick');
  };

  const generateRandomArray = () => {
    setIsPlaying(false);
    const randoms = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 5);
    setArray(randoms);
  };

  const maxVal = Math.max(...array, 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              Unit V • Sorting Algorithms
            </span>
            <h3 className="text-xl font-bold text-slate-800">Sorting Interactive Visualizer</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step through comparisons, swaps, pivots, and partitions in real time.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          {(['quick', 'bubble', 'selection', 'insertion'] as const).map(alg => (
            <button
              key={alg}
              onClick={() => { setAlgorithm(alg); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${algorithm === alg ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'}`}
            >
              {alg} Sort
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Animated Bar Visualizer */}
        <div className="lg:col-span-8 flex flex-col items-center justify-between p-6 bg-rose-50/20 rounded-2xl border border-rose-100 min-h-[420px]">
          {/* Metrics bar */}
          <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-600 mb-4 px-2">
            <div className="flex gap-3">
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Comparisons: <span className="text-rose-600 font-extrabold">{currentStep.comps || 0}</span>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                Swaps: <span className="text-blue-600 font-extrabold">{currentStep.swaps || 0}</span>
              </span>
            </div>
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Step: {currentStepIdx + 1} / {steps.length}
            </span>
          </div>

          {/* Bar Chart */}
          <div className="w-full flex items-end justify-center gap-4 h-56 px-6 pb-2">
            {(currentStep.array || array).map((val: number, idx: number) => {
              const isComparing = currentStep.comparing?.includes(idx);
              const isPivot = currentStep.pivotIdx === idx;
              const isSorted = currentStep.sorted;
              const heightPercent = (val / maxVal) * 100;

              return (
                <div key={idx} className="flex flex-col items-center flex-1 max-w-[56px] h-full justify-end">
                  <span className="text-xs font-mono font-bold mb-1 text-slate-700">
                    {val}
                  </span>
                  <motion.div
                    layout
                    style={{ height: `${Math.max(heightPercent, 18)}%` }}
                    className={`w-full rounded-t-xl transition-all shadow-xs flex items-center justify-center font-bold text-xs ${
                      isSorted
                        ? 'bg-emerald-500 text-white'
                        : isPivot
                        ? 'bg-red-500 text-white shadow-red-200'
                        : isComparing
                        ? 'bg-amber-400 text-amber-900 shadow-amber-200'
                        : 'bg-rose-400 text-white'
                    }`}
                  >
                    {isPivot ? 'P' : ''}
                  </motion.div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Message Pill */}
          <div className="w-full mt-4 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{currentStep.msg}</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-600" />
              Simulator Controls
            </h4>

            {/* Playback buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                  isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleStepForward}
                disabled={isPlaying || currentStepIdx >= steps.length - 1}
                className="py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Step
              </button>
              <button
                onClick={handleReset}
                className="py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold active:scale-95 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Speed slider */}
            <div className="space-y-1 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Speed:</span>
                <span>{speed <= 250 ? 'Fast' : speed <= 600 ? 'Normal' : 'Slow'}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Array presets */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <button
                onClick={loadExamArray}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all"
              >
                Load Exam Array: [9, 3, 7, 1, 6] (Q7)
              </button>
              <button
                onClick={generateRandomArray}
                className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                Randomize Array
              </button>
            </div>
          </div>

          {/* Complexity Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-rose-400">
                {algorithm === 'quick' ? 'Quick Sort Complexity' : 'Algorithm Complexity'}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {algorithm === 'quick' ? 'Avg: O(n log n)' : 'O(n^2)'}
              </span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              <p>Best Case: <span className="text-emerald-400 font-bold">{algorithm === 'quick' ? 'O(n log n)' : algorithm === 'insertion' ? 'O(n)' : 'O(n^2)'}</span></p>
              <p>Average: <span className="text-amber-400 font-bold">{algorithm === 'quick' ? 'O(n log n)' : 'O(n^2)'}</span></p>
              <p>Worst Case: <span className="text-rose-400 font-bold">O(n^2)</span></p>
              <p className="text-slate-500 pt-1">// Space: {algorithm === 'quick' ? 'O(log n) recursion stack' : 'O(1) in-place'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
