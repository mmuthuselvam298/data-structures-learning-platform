import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Split
} from 'lucide-react';
import { AlgorithmNarrator, NarrativeStep } from './sorting/AlgorithmNarrator';
import { MergeSortVisualizer } from './sorting/MergeSortVisualizer';

export type SortAlgorithmType = 'merge' | 'quick' | 'bubble' | 'selection' | 'insertion';

export const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithmType>('merge');
  const [array, setArray] = useState<number[]>([9, 3, 7, 1, 6]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(600); // ms per step

  const timerRef = useRef<any>(null);

  // Generate steps whenever array or algorithm changes
  useEffect(() => {
    if (algorithm !== 'merge') {
      generateAlgorithmSteps();
    }
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
          const val1 = a[j];
          const val2 = a[j + 1];

          generated.push({
            array: [...a],
            comparing: [j, j + 1],
            swapped: false,
            sortedRegionStart: n - i,
            comps,
            swaps,
            narrative: {
              what: `Compare adjacent elements A[${j}] = ${val1} and A[${j + 1}] = ${val2}.`,
              why: needSwap
                ? `${val1} > ${val2}. In a sorted array, the smaller number must come first.`
                : `${val1} ≤ ${val2}. They are already in correct relative order.`,
              next: needSwap
                ? `Swap ${val1} and ${val2}.`
                : 'Move to the next adjacent pair without swapping.',
              phase: `Pass ${i + 1} of ${n - 1}`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
          });

          if (needSwap) {
            const temp = a[j];
            a[j] = a[j + 1];
            a[j + 1] = temp;
            swaps++;

            generated.push({
              array: [...a],
              comparing: [j, j + 1],
              swapped: true,
              sortedRegionStart: n - i,
              comps,
              swaps,
              narrative: {
                what: `Swapped ${val1} and ${val2}. New positions: A[${j}] = ${val2}, A[${j + 1}] = ${val1}.`,
                why: 'Bubbling the larger element toward the right end of the array.',
                next: j < n - i - 2
                  ? `Continue pass ${i + 1} with pair at indices ${j + 1} and ${j + 2}.`
                  : `Pass ${i + 1} complete. Highest element settled at index ${n - i - 1}.`,
                phase: `Pass ${i + 1} of ${n - 1}`,
                comparisons: comps,
                swaps,
                stepNumber: generated.length + 1,
                totalSteps: 1
              }
            });
          }
        }
      }
    } else if (algorithm === 'selection') {
      const n = a.length;
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        generated.push({
          array: [...a],
          sortedRegionEnd: i,
          minIdx: i,
          comparing: [i],
          comps,
          swaps,
          narrative: {
            what: `Begin search for smallest element in unsorted region [${i}..${n - 1}]. Initial minimum candidate: ${a[i]}.`,
            why: 'Selection Sort incrementally grows a sorted prefix on the left by picking the absolute smallest unsorted element.',
            next: `Scan index ${i + 1} to see if a smaller value exists.`,
            phase: `Pass ${i + 1}: Finding Min`,
            comparisons: comps,
            swaps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });

        for (let j = i + 1; j < n; j++) {
          comps++;
          const isNewMin = a[j] < a[minIdx];
          if (isNewMin) minIdx = j;

          generated.push({
            array: [...a],
            sortedRegionEnd: i,
            minIdx,
            comparing: [i, j],
            comps,
            swaps,
            narrative: {
              what: `Compare unsorted element A[${j}] = ${a[j]} against current minimum ${a[minIdx]}.`,
              why: isNewMin
                ? `Found new smaller value! ${a[j]} is smaller than previous min, so update minimum index to ${j}.`
                : `${a[j]} ≥ ${a[minIdx]}, so current minimum remains ${a[minIdx]}.`,
              next: j < n - 1
                ? `Continue scanning index ${j + 1}.`
                : 'Reached end of unsorted region. Swap minimum into place.',
              phase: `Pass ${i + 1}: Scanning`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
          });
        }

        if (minIdx !== i) {
          const temp = a[i];
          a[i] = a[minIdx];
          a[minIdx] = temp;
          swaps++;

          generated.push({
            array: [...a],
            sortedRegionEnd: i + 1,
            comparing: [i, minIdx],
            swapped: true,
            comps,
            swaps,
            narrative: {
              what: `Swapped minimum element ${a[i]} with A[${i}] (${temp}).`,
              why: `Places the smallest unsorted value into its permanent sorted index ${i}.`,
              next: i < n - 1
                ? `Sorted region now has ${i + 1} elements. Move to index ${i + 1}.`
                : 'All elements sorted!',
              phase: `Pass ${i + 1}: Placed Min`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
          });
        }
      }
    } else if (algorithm === 'insertion') {
      const n = a.length;
      for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;

        generated.push({
          array: [...a],
          keyIdx: i,
          keyValue: key,
          comparing: [i],
          comps,
          swaps,
          narrative: {
            what: `Pick key element ${key} at index ${i}.`,
            why: `Insertion sort builds a sorted hand of cards. We insert ${key} into its sorted position among elements to its left.`,
            next: `Compare key ${key} with left neighbor A[${j}] = ${a[j]}.`,
            phase: `Card Insertion ${i}`,
            comparisons: comps,
            swaps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });

        while (j >= 0 && a[j] > key) {
          comps++;
          a[j + 1] = a[j];
          swaps++;

          generated.push({
            array: [...a],
            keyIdx: j + 1,
            keyValue: key,
            comparing: [j, j + 1],
            comps,
            swaps,
            narrative: {
              what: `Shifted ${a[j]} right from index ${j} to ${j + 1}.`,
              why: `Since ${a[j]} > key (${key}), it belongs to the right of the key. Shifting creates empty space.`,
              next: j > 0
                ? `Compare key ${key} with next left element A[${j - 1}].`
                : `Reached left boundary. Insert key ${key} at index 0.`,
              phase: `Shifting larger values`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
          });
          j--;
        }

        a[j + 1] = key;
        generated.push({
          array: [...a],
          keyIdx: j + 1,
          keyValue: key,
          comparing: [j + 1],
          comps,
          swaps,
          narrative: {
            what: `Inserted key ${key} into its correct spot at index ${j + 1}.`,
            why: `All elements to the left are smaller or equal to ${key}, and all to the right are greater.`,
            next: i < n - 1
              ? `Move to next card at index ${i + 1}.`
              : 'Insertion sort completed!',
            phase: `Key Inserted`,
            comparisons: comps,
            swaps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });
      }
    } else if (algorithm === 'quick') {
      const qs = (low: number, high: number) => {
        if (low < high) {
          const pivot = a[high];
          let i = low - 1;

          generated.push({
            array: [...a],
            pivotIdx: high,
            pivotVal: pivot,
            low,
            high,
            comparing: [high],
            comps,
            swaps,
            narrative: {
              what: `Partitioning range [${low}..${high}]. Selected pivot element = ${pivot} at index ${high}.`,
              why: 'Quick Sort uses a pivot to divide the array: elements smaller than pivot go left, greater go right.',
              next: `Iterate through elements from index ${low} to ${high - 1} comparing each with pivot ${pivot}.`,
              phase: `Partition [${low}..${high}]`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
          });

          for (let j = low; j < high; j++) {
            comps++;
            const currentVal = a[j];
            const isSmaller = currentVal < pivot;

            if (isSmaller) {
              i++;
              const temp = a[i];
              a[i] = a[j];
              a[j] = temp;
              swaps++;

              generated.push({
                array: [...a],
                pivotIdx: high,
                pivotVal: pivot,
                low,
                high,
                comparing: [i, j],
                lessPartitionEnd: i,
                comps,
                swaps,
                narrative: {
                  what: `Element ${currentVal} < pivot ${pivot}. Swapped into lower partition at index ${i}.`,
                  why: 'Values smaller than the pivot must sit in the left partition.',
                  next: `Advance to scan next element A[${j + 1}].`,
                  phase: `Partitioning`,
                  comparisons: comps,
                  swaps,
                  stepNumber: generated.length + 1,
                  totalSteps: 1
                }
              });
            } else {
              generated.push({
                array: [...a],
                pivotIdx: high,
                pivotVal: pivot,
                low,
                high,
                comparing: [j, high],
                lessPartitionEnd: i,
                comps,
                swaps,
                narrative: {
                  what: `Element ${currentVal} ≥ pivot ${pivot}. Kept in right partition.`,
                  why: 'Values larger than or equal to pivot stay in the upper partition.',
                  next: j < high - 1 ? `Advance to scan next element A[${j + 1}].` : 'Place pivot into its final sorted position.',
                  phase: `Partitioning`,
                  comparisons: comps,
                  swaps,
                  stepNumber: generated.length + 1,
                  totalSteps: 1
                }
              });
            }
          }

          // Place pivot into position i + 1
          const temp = a[i + 1];
          a[i + 1] = a[high];
          a[high] = temp;
          swaps++;
          const pi = i + 1;

          generated.push({
            array: [...a],
            pivotIdx: pi,
            pivotVal: pivot,
            low,
            high,
            comparing: [pi],
            comps,
            swaps,
            narrative: {
              what: `Swapped pivot ${pivot} into its permanent sorted index ${pi}.`,
              why: `All items in [${low}..${pi - 1}] are < ${pivot}, and all items in [${pi + 1}..${high}] are ≥ ${pivot}.`,
              next: `Recursively partition left subarray [${low}..${pi - 1}] and right subarray [${pi + 1}..${high}].`,
              phase: `Pivot Locked at Index ${pi}`,
              comparisons: comps,
              swaps,
              stepNumber: generated.length + 1,
              totalSteps: 1
            }
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
      narrative: {
        what: 'Algorithm finished! The entire array is sorted in ascending order.',
        why: 'All elements satisfy A[i] ≤ A[i+1] for all indices.',
        next: 'Try another algorithm or test yourself in Challenge Mode!',
        phase: 'Sorted',
        comparisons: comps,
        swaps,
        stepNumber: generated.length + 1,
        totalSteps: 1
      }
    });

    const total = generated.length;
    generated.forEach(s => {
      s.narrative.totalSteps = total;
    });

    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Play / Pause timer
  useEffect(() => {
    if (isPlaying && algorithm !== 'merge') {
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
  }, [isPlaying, steps, speed, algorithm]);

  const currentStep = steps[currentStepIdx] || {
    array,
    comparing: [],
    comps: 0,
    swaps: 0,
    narrative: {
      what: 'Ready to sort.',
      why: 'Select an algorithm or click Play/Step to begin.',
      stepNumber: 1,
      totalSteps: 1
    }
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const loadExamArray = () => {
    setIsPlaying(false);
    setArray([9, 3, 7, 1, 6]);
  };

  const generateRandomArray = () => {
    setIsPlaying(false);
    const randoms = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 5);
    setArray(randoms);
  };

  const maxVal = Math.max(...array, 10);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              Unit V • Sorting Algorithms & Analysis
            </span>
            <h3 className="text-xl font-bold text-slate-800">Guided Sorting Visualizer</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow the algorithm step-by-step with real-time story narration and animated structural states.
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold flex-wrap">
          {(['merge', 'quick', 'bubble', 'selection', 'insertion'] as const).map(alg => (
            <button
              key={alg}
              onClick={() => {
                setAlgorithm(alg);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all flex items-center gap-1 ${
                algorithm === alg
                  ? 'bg-white text-rose-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {alg === 'merge' && <GitFork className="w-3 h-3 text-rose-500" />}
              {alg} Sort
            </button>
          ))}
        </div>
      </div>

      {/* If Merge Sort selected, display the full dedicated MergeSortVisualizer */}
      {algorithm === 'merge' ? (
        <MergeSortVisualizer />
      ) : (
        /* Other algorithms (Quick, Bubble, Selection, Insertion) with Story Narrator & Enhanced Visual Regions */
        <div className="space-y-6">
          {/* Reusable Algorithm Narrator */}
          <AlgorithmNarrator
            algorithmName={`${algorithm.toUpperCase()} SORT`}
            narrative={currentStep.narrative}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visualizer Canvas */}
            <div className="lg:col-span-8 flex flex-col items-center justify-between p-6 bg-rose-50/20 rounded-2xl border border-rose-100 min-h-[440px]">
              {/* Special Partitions & Labels based on algorithm */}
              <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-600 mb-2 px-2">
                <div className="flex gap-2">
                  {algorithm === 'quick' && currentStep.pivotVal !== undefined && (
                    <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                      <Split className="w-3.5 h-3.5 text-red-600" />
                      PIVOT = {currentStep.pivotVal}
                    </span>
                  )}
                  {algorithm === 'selection' && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
                      Sorted: 0..{currentStep.sortedRegionEnd ?? 0}
                    </span>
                  )}
                  {algorithm === 'insertion' && currentStep.keyValue !== undefined && (
                    <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-md">
                      Key = {currentStep.keyValue}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Comps: <strong className="text-rose-600">{currentStep.comps || 0}</strong>
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Swaps: <strong className="text-blue-600">{currentStep.swaps || 0}</strong>
                  </span>
                </div>
              </div>

              {/* Quick Sort Partition Demarcation Banner */}
              {algorithm === 'quick' && currentStep.low !== undefined && (
                <div className="w-full mb-3 px-3 py-1.5 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="text-blue-700">
                    ← Left Partition (&lt; {currentStep.pivotVal})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold">
                    PIVOT [{currentStep.pivotVal}]
                  </span>
                  <span className="text-purple-700">
                    Right Partition (≥ {currentStep.pivotVal}) →
                  </span>
                </div>
              )}

              {/* Bar Chart Visualization */}
              <div className="w-full flex items-end justify-center gap-3 sm:gap-4 h-56 px-4 pb-2">
                {(currentStep.array || array).map((val: number, idx: number) => {
                  const isComparing = currentStep.comparing?.includes(idx);
                  const isPivot = currentStep.pivotIdx === idx;
                  const isKey = currentStep.keyIdx === idx;
                  const isSorted = currentStep.sorted;
                  const heightPercent = (val / maxVal) * 100;

                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 max-w-[56px] h-full justify-end">
                      <span className="text-xs font-mono font-bold mb-1 text-slate-700">
                        {val}
                      </span>
                      <motion.div
                        layout
                        style={{ height: `${Math.max(heightPercent, 20)}%` }}
                        className={`w-full rounded-t-xl transition-all shadow-xs flex flex-col items-center justify-center font-bold text-xs ${
                          isSorted
                            ? 'bg-emerald-500 text-white'
                            : isPivot
                            ? 'bg-red-500 text-white ring-2 ring-red-300 shadow-red-200'
                            : isKey
                            ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                            : isComparing
                            ? 'bg-amber-400 text-amber-900 ring-2 ring-amber-200 shadow-amber-100'
                            : 'bg-rose-400 text-white'
                        }`}
                      >
                        {isPivot && <span className="text-[10px] uppercase font-mono">PIV</span>}
                        {isKey && <span className="text-[10px] uppercase font-mono">KEY</span>}
                      </motion.div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Indicator */}
              <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {currentStep.narrative.what}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Step {currentStepIdx + 1} / {steps.length}
                </span>
              </div>
            </div>

            {/* Controls & Complexity Box */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  Visualizer Controls
                </h4>

                {/* Step Controls: Back, Play, Forward */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={handleStepBack}
                    disabled={isPlaying || currentStepIdx <= 0}
                    className="py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 col-span-2 shadow-xs ${
                      isPlaying
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={isPlaying || currentStepIdx >= steps.length - 1}
                    className="py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Step
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Beginning
                </button>

                {/* Speed Slider */}
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-xs text-slate-600 font-semibold">
                    <span>Animation Speed:</span>
                    <span>{speed <= 300 ? 'Fast' : speed <= 700 ? 'Normal' : 'Slow'}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1200"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>

                {/* Presets */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <button
                    onClick={loadExamArray}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                  >
                    Load Exam Array: [9, 3, 7, 1, 6]
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
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span className="font-semibold text-[11px] text-rose-400 uppercase">
                    {algorithm} Sort Complexity
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {algorithm === 'quick' ? 'O(n log n)' : 'O(n²)'}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p>
                    Best Case:{' '}
                    <span className="text-emerald-400 font-bold">
                      {algorithm === 'quick'
                        ? 'O(n log n)'
                        : algorithm === 'insertion' || algorithm === 'bubble'
                        ? 'O(n)'
                        : 'O(n²)'}
                    </span>
                  </p>
                  <p>
                    Average Case:{' '}
                    <span className="text-amber-400 font-bold">
                      {algorithm === 'quick' ? 'O(n log n)' : 'O(n²)'}
                    </span>
                  </p>
                  <p>
                    Worst Case:{' '}
                    <span className="text-rose-400 font-bold">O(n²)</span>
                  </p>
                  <p className="text-slate-500 pt-1 text-[11px]">
                    Space:{' '}
                    {algorithm === 'quick'
                      ? 'O(log n) call stack'
                      : 'O(1) in-place auxiliary'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
