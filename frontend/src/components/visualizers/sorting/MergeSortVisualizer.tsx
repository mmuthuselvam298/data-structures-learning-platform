import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  GitFork,
  Layers,
  ArrowDown,
  CheckCircle2,
  Info,
  HelpCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { AlgorithmNarrator, NarrativeStep } from './AlgorithmNarrator';

export type MergePhase = 'DIVIDING' | 'SINGLE_ELEMENTS' | 'MERGING' | 'SORTED';

export interface TreeNodeState {
  id: string;
  depth: number;
  array: number[];
  status: 'pending' | 'dividing' | 'active_leaf' | 'merging' | 'merged' | 'completed';
  leftId?: string;
  rightId?: string;
  parentId?: string;
}

export interface MergeStep {
  phase: MergePhase;
  treeNodes: TreeNodeState[];
  activeNodeId?: string;
  leftSubarray?: number[];
  rightSubarray?: number[];
  leftIndex?: number;
  rightIndex?: number;
  currentComparison?: { leftVal: number; rightVal: number; smaller: 'left' | 'right' | 'equal' };
  outputArray?: number[];
  narrative: NarrativeStep;
}

const DEFAULT_ARRAY = [38, 27, 43, 3];
const EXAM_ARRAY = [38, 27, 43, 3, 9, 82, 10];

export const MergeSortVisualizer: React.FC = () => {
  const [initialArray, setInitialArray] = useState<number[]>(DEFAULT_ARRAY);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // ms
  const timerRef = useRef<any>(null);

  // Precompute complete pedagogical steps for initialArray
  useEffect(() => {
    buildPedagogicalSteps(initialArray);
  }, [initialArray]);

  const buildPedagogicalSteps = (arr: number[]) => {
    const generated: MergeStep[] = [];
    let comps = 0;

    // Build the full binary recursion tree upfront
    let nodeIdCounter = 0;
    const createTree = (subArr: number[], depth: number, parentId?: string): any => {
      const id = `node_${nodeIdCounter++}`;
      const node: any = {
        id,
        depth,
        array: [...subArr],
        status: 'pending',
        parentId
      };
      if (subArr.length > 1) {
        const mid = Math.floor(subArr.length / 2);
        node.left = createTree(subArr.slice(0, mid), depth + 1, id);
        node.right = createTree(subArr.slice(mid), depth + 1, id);
        node.leftId = node.left.id;
        node.rightId = node.right.id;
      }
      return node;
    };

    const root = createTree(arr, 0);

    // Flatten tree nodes for quick state capture
    const flatten = (n: any): TreeNodeState[] => {
      const res: TreeNodeState[] = [{
        id: n.id,
        depth: n.depth,
        array: [...n.array],
        status: n.status,
        leftId: n.leftId,
        rightId: n.rightId,
        parentId: n.parentId
      }];
      if (n.left) res.push(...flatten(n.left));
      if (n.right) res.push(...flatten(n.right));
      return res;
    };

    const currentTreeState = flatten(root);
    const updateNodeStatus = (id: string, status: TreeNodeState['status'], newArray?: number[]) => {
      const target = currentTreeState.find(n => n.id === id);
      if (target) {
        target.status = status;
        if (newArray) target.array = [...newArray];
      }
    };

    // Step 0: Initial state
    updateNodeStatus(root.id, 'active_leaf');
    generated.push({
      phase: 'DIVIDING',
      treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
      activeNodeId: root.id,
      narrative: {
        what: `We begin with the full unsorted array [${arr.join(', ')}].`,
        why: 'Merge Sort is a Divide-and-Conquer algorithm. It cannot sort directly until it breaks the problem into trivial pieces.',
        next: `We will divide [${arr.join(', ')}] into two roughly equal halves.`,
        phase: 'Phase 1 • Divide',
        comparisons: 0,
        swaps: 0,
        stepNumber: 1,
        totalSteps: 1
      }
    });

    // Simulate recursive Divide & Merge
    const runDivide = (node: any) => {
      if (node.array.length <= 1) {
        updateNodeStatus(node.id, 'active_leaf');
        generated.push({
          phase: 'SINGLE_ELEMENTS',
          treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
          activeNodeId: node.id,
          narrative: {
            what: `Single-element array [${node.array[0]}] reached at depth ${node.depth}.`,
            why: 'A single element is trivially sorted by definition. This is the base case of recursion!',
            next: 'We can now begin merging this with its adjacent sibling.',
            phase: 'Phase 2 • Base Case',
            comparisons: comps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });
        return [...node.array];
      }

      // Dividing node
      updateNodeStatus(node.id, 'dividing');
      const mid = Math.floor(node.array.length / 2);
      const leftArr = node.array.slice(0, mid);
      const rightArr = node.array.slice(mid);

      generated.push({
        phase: 'DIVIDING',
        treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
        activeNodeId: node.id,
        leftSubarray: leftArr,
        rightSubarray: rightArr,
        narrative: {
          what: `Divide [${node.array.join(', ')}] into Left: [${leftArr.join(', ')}] and Right: [${rightArr.join(', ')}].`,
          why: `Splitting reduces an O(n) problem into two subproblems of size ${mid} and ${node.array.length - mid}.`,
          next: `Recurse on the left subarray [${leftArr.join(', ')}].`,
          phase: 'Phase 1 • Divide',
          comparisons: comps,
          stepNumber: generated.length + 1,
          totalSteps: 1
        }
      });

      updateNodeStatus(node.left.id, 'pending');
      updateNodeStatus(node.right.id, 'pending');

      const sortedLeft = runDivide(node.left);
      const sortedRight = runDivide(node.right);

      // Now Merge Stage
      updateNodeStatus(node.id, 'merging');
      const merged: number[] = [];
      let i = 0;
      let j = 0;

      generated.push({
        phase: 'MERGING',
        treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
        activeNodeId: node.id,
        leftSubarray: [...sortedLeft],
        rightSubarray: [...sortedRight],
        leftIndex: 0,
        rightIndex: 0,
        outputArray: [],
        narrative: {
          what: `Begin merging sorted Left: [${sortedLeft.join(', ')}] and sorted Right: [${sortedRight.join(', ')}].`,
          why: 'Both subarrays are now individually sorted. We use two pointers to pick the smaller front element in O(n) time.',
          next: `Compare Left[0] (${sortedLeft[0]}) with Right[0] (${sortedRight[0]}).`,
          phase: 'Phase 3 • Merge',
          comparisons: comps,
          stepNumber: generated.length + 1,
          totalSteps: 1
        }
      });

      while (i < sortedLeft.length && j < sortedRight.length) {
        comps++;
        const leftVal = sortedLeft[i];
        const rightVal = sortedRight[j];
        const smaller = leftVal <= rightVal ? 'left' : 'right';
        const chosenVal = smaller === 'left' ? leftVal : rightVal;

        // Step: Comparison event
        generated.push({
          phase: 'MERGING',
          treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
          activeNodeId: node.id,
          leftSubarray: [...sortedLeft],
          rightSubarray: [...sortedRight],
          leftIndex: i,
          rightIndex: j,
          currentComparison: { leftVal, rightVal, smaller },
          outputArray: [...merged],
          narrative: {
            what: `Compare Left pointer (${leftVal}) vs Right pointer (${rightVal}).`,
            why: `${chosenVal} is smaller, so it is placed next in the output buffer.`,
            next: `Advance the ${smaller} pointer and append ${chosenVal} to output.`,
            phase: 'Phase 3 • Merge',
            comparisons: comps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });

        // Step: Move to output event
        merged.push(chosenVal);
        if (smaller === 'left') i++;
        else j++;

        generated.push({
          phase: 'MERGING',
          treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
          activeNodeId: node.id,
          leftSubarray: [...sortedLeft],
          rightSubarray: [...sortedRight],
          leftIndex: i,
          rightIndex: j,
          outputArray: [...merged],
          narrative: {
            what: `Moved ${chosenVal} into merged output: [${merged.join(', ')}].`,
            why: 'Maintains strict monotonic non-decreasing order in the resulting segment.',
            next: i < sortedLeft.length && j < sortedRight.length
              ? `Compare next elements: ${sortedLeft[i]} and ${sortedRight[j]}.`
              : 'One subarray is exhausted; flush the remaining elements.',
            phase: 'Phase 3 • Merge',
            comparisons: comps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });
      }

      // Flush remaining elements
      while (i < sortedLeft.length) {
        merged.push(sortedLeft[i]);
        i++;
        generated.push({
          phase: 'MERGING',
          treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
          activeNodeId: node.id,
          leftSubarray: [...sortedLeft],
          rightSubarray: [...sortedRight],
          leftIndex: i,
          rightIndex: j,
          outputArray: [...merged],
          narrative: {
            what: `Right subarray empty. Appending remaining Left element ${sortedLeft[i - 1]} directly.`,
            why: 'Remaining elements in the left subarray are already sorted and larger than all output elements so far.',
            next: i < sortedLeft.length ? 'Continue appending remaining left elements.' : 'Merge for this segment is complete.',
            phase: 'Phase 3 • Merge',
            comparisons: comps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });
      }

      while (j < sortedRight.length) {
        merged.push(sortedRight[j]);
        j++;
        generated.push({
          phase: 'MERGING',
          treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
          activeNodeId: node.id,
          leftSubarray: [...sortedLeft],
          rightSubarray: [...sortedRight],
          leftIndex: i,
          rightIndex: j,
          outputArray: [...merged],
          narrative: {
            what: `Left subarray empty. Appending remaining Right element ${sortedRight[j - 1]} directly.`,
            why: 'Remaining elements in the right subarray are already sorted and larger than all output elements so far.',
            next: j < sortedRight.length ? 'Continue appending remaining right elements.' : 'Merge for this segment is complete.',
            phase: 'Phase 3 • Merge',
            comparisons: comps,
            stepNumber: generated.length + 1,
            totalSteps: 1
          }
        });
      }

      updateNodeStatus(node.id, 'merged', merged);
      updateNodeStatus(node.left.id, 'completed');
      updateNodeStatus(node.right.id, 'completed');

      generated.push({
        phase: 'MERGING',
        treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
        activeNodeId: node.id,
        outputArray: [...merged],
        narrative: {
          what: `Segment merge complete! Combined result: [${merged.join(', ')}].`,
          why: `We merged two arrays into a single sorted subarray of length ${merged.length}.`,
          next: node.id === root.id ? 'Algorithm finished! The entire array is sorted.' : 'Return to parent recursive level.',
          phase: 'Phase 3 • Merge',
          comparisons: comps,
          stepNumber: generated.length + 1,
          totalSteps: 1
        }
      });

      return merged;
    };

    const finalSorted = runDivide(root);

    // Final state
    updateNodeStatus(root.id, 'completed', finalSorted);
    generated.push({
      phase: 'SORTED',
      treeNodes: JSON.parse(JSON.stringify(currentTreeState)),
      activeNodeId: root.id,
      outputArray: [...finalSorted],
      narrative: {
        what: `Merge Sort Complete! Final sorted array: [${finalSorted.join(', ')}].`,
        why: 'Every recursive level was divided in O(log n) steps and merged in O(n) time, yielding total O(n log n) efficiency.',
        next: 'Experiment with a different array or test your knowledge in Challenge Mode!',
        phase: 'Phase 4 • Sorted',
        comparisons: comps,
        stepNumber: generated.length + 1,
        totalSteps: 1
      }
    });

    // Update totalSteps across all steps
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
    phase: 'DIVIDING',
    treeNodes: [],
    narrative: {
      what: 'Preparing Merge Sort...',
      why: '',
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

  // Group tree nodes by depth for hierarchy rendering
  const nodesByDepth: { [depth: number]: TreeNodeState[] } = {};
  if (currentStep.treeNodes) {
    currentStep.treeNodes.forEach(node => {
      if (!nodesByDepth[node.depth]) nodesByDepth[node.depth] = [];
      nodesByDepth[node.depth].push(node);
    });
  }
  const depths = Object.keys(nodesByDepth).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* 1. Reusable Algorithm Narrator Header */}
      <AlgorithmNarrator
        algorithmName="Merge Sort"
        narrative={currentStep.narrative}
      />

      {/* 2. Visual Algorithm Progress Map */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span className="flex items-center gap-1.5 text-slate-700">
            <GitFork className="w-3.5 h-3.5 text-rose-500" />
            Execution Phase Map
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Current: <strong className="text-rose-600">{currentStep.phase}</strong>
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'DIVIDING', label: '1. Dividing', icon: '✂️' },
            { id: 'SINGLE_ELEMENTS', label: '2. Single Elements', icon: '🎯' },
            { id: 'MERGING', label: '3. Merging', icon: '🔗' },
            { id: 'SORTED', label: '4. Sorted Array', icon: '✨' }
          ].map(phaseItem => {
            const isActive = currentStep.phase === phaseItem.id;
            const isDone =
              (phaseItem.id === 'DIVIDING' && currentStep.phase !== 'DIVIDING') ||
              (phaseItem.id === 'SINGLE_ELEMENTS' && (currentStep.phase === 'MERGING' || currentStep.phase === 'SORTED')) ||
              (phaseItem.id === 'MERGING' && currentStep.phase === 'SORTED');

            return (
              <div
                key={phaseItem.id}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-200/50'
                    : isDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span>{isDone ? '✓' : phaseItem.icon}</span>
                <span className="truncate">{phaseItem.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Central Visualizer with Three-Layer Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* LAYER 1: Recursive Division Tree (Hierarchy) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-800">
                  Recursive Division & Hierarchy Tree
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Level 0..{depths.length - 1}
              </span>
            </div>

            {/* Tree nodes organized by depth level */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[480px] space-y-4 flex flex-col items-center">
                {depths.map(depth => {
                  const nodesAtLevel = nodesByDepth[depth] || [];
                  return (
                    <div key={depth} className="w-full flex items-center justify-center gap-4 sm:gap-8 relative">
                      {nodesAtLevel.map(node => {
                        const isFocused = currentStep.activeNodeId === node.id;
                        const isCompleted = node.status === 'completed';
                        const isMerging = node.status === 'merging';
                        const isSingle = node.array.length === 1;

                        return (
                          <motion.div
                            key={node.id}
                            layout
                            className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                              isFocused
                                ? 'bg-amber-50 border-amber-400 ring-3 ring-amber-200 shadow-md scale-105'
                                : isCompleted
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : isMerging
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                                : isSingle
                                ? 'bg-blue-50 border-blue-200 text-blue-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">
                              {isSingle ? 'Single' : `L${depth}`}
                            </span>
                            <div className="flex gap-1">
                              {node.array.map((val, idx) => (
                                <div
                                  key={idx}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shadow-2xs ${
                                    isCompleted
                                      ? 'bg-emerald-500 text-white'
                                      : isFocused
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-white border border-slate-300 text-slate-800'
                                  }`}
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* LAYER 2 & 3: Active Merge Comparison & Output Buffer */}
          {(currentStep.phase === 'MERGING' || currentStep.leftSubarray || currentStep.outputArray) && (
            <div className="bg-linear-to-br from-indigo-50/50 via-white to-purple-50/40 rounded-2xl border border-indigo-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-indigo-950">
                    Active Two-Pointer Merging Engine
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  Left[i] vs Right[j]
                </span>
              </div>

              {/* Comparing Groups */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Left Subarray */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-2xs">
                  <div className="flex justify-between text-xs font-bold text-blue-700 mb-2">
                    <span>LEFT SUBARRAY</span>
                    <span className="font-mono">Pointer i = {currentStep.leftIndex ?? 0}</span>
                  </div>
                  <div className="flex gap-2">
                    {(currentStep.leftSubarray || []).map((val, idx) => {
                      const isPointer = currentStep.leftIndex === idx;
                      const isExhausted = (currentStep.leftIndex ?? 0) > idx;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-2xs transition-all ${
                              isPointer
                                ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-105'
                                : isExhausted
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                : 'bg-blue-50 text-blue-900 border border-blue-200'
                            }`}
                          >
                            {val}
                          </div>
                          {isPointer && (
                            <span className="text-[10px] font-extrabold text-blue-600 mt-0.5 animate-bounce">
                              ↑ i
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Subarray */}
                <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs">
                  <div className="flex justify-between text-xs font-bold text-purple-700 mb-2">
                    <span>RIGHT SUBARRAY</span>
                    <span className="font-mono">Pointer j = {currentStep.rightIndex ?? 0}</span>
                  </div>
                  <div className="flex gap-2">
                    {(currentStep.rightSubarray || []).map((val, idx) => {
                      const isPointer = currentStep.rightIndex === idx;
                      const isExhausted = (currentStep.rightIndex ?? 0) > idx;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-2xs transition-all ${
                              isPointer
                                ? 'bg-purple-600 text-white ring-2 ring-purple-300 scale-105'
                                : isExhausted
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through'
                                : 'bg-purple-50 text-purple-900 border border-purple-200'
                            }`}
                          >
                            {val}
                          </div>
                          {isPointer && (
                            <span className="text-[10px] font-extrabold text-purple-600 mt-0.5 animate-bounce">
                              ↑ j
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Comparison indicator if comparing */}
              {currentStep.currentComparison && (
                <div className="flex items-center justify-center gap-3 my-3 py-2 px-4 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                  <span className="text-blue-700">Left: {currentStep.currentComparison.leftVal}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    {currentStep.currentComparison.leftVal <= currentStep.currentComparison.rightVal ? '≤' : '>'}
                  </span>
                  <span className="text-purple-700">Right: {currentStep.currentComparison.rightVal}</span>
                  <ArrowDown className="w-3.5 h-3.5 text-amber-600 ml-2" />
                  <span className="text-emerald-700 font-extrabold">
                    {currentStep.currentComparison.smaller === 'left'
                      ? currentStep.currentComparison.leftVal
                      : currentStep.currentComparison.rightVal}{' '}
                    moves to merged array
                  </span>
                </div>
              )}

              {/* LAYER 3: Output Merged Buffer */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <div className="flex justify-between text-xs font-bold text-emerald-700 mb-2">
                  <span>MERGED RESULT OUTPUT BUFFER</span>
                  <span className="font-mono">{currentStep.outputArray?.length || 0} Elements</span>
                </div>
                <div className="flex items-center gap-2 min-h-[44px]">
                  {currentStep.outputArray && currentStep.outputArray.length > 0 ? (
                    currentStep.outputArray.map((val, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        {val}
                      </motion.div>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">
                      Output buffer waiting for smaller element...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Controls & Educational Side Panels */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Controls Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Merge Sort Controls
            </h4>

            {/* Step Controls: Play, Step Back, Step Forward, Reset */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleStepBack}
                disabled={isPlaying || currentStepIdx <= 0}
                className="py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center justify-center gap-1 shadow-2xs"
                title="Step Back"
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
                title="Step Forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Step
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Restart Animation
            </button>

            {/* Speed slider */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Speed:</span>
                <span>{speed <= 600 ? 'Fast (0.5s)' : speed <= 1200 ? 'Normal (1.0s)' : 'Slow (1.8s)'}</span>
              </div>
              <input
                type="range"
                min="300"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Preset Arrays */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Preset Arrays:
              </span>
              <button
                onClick={() => { setIsPlaying(false); setInitialArray(DEFAULT_ARRAY); }}
                className={`w-full py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all ${
                  initialArray === DEFAULT_ARRAY
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Standard 4 Elements: [38, 27, 43, 3]
              </button>
              <button
                onClick={() => { setIsPlaying(false); setInitialArray(EXAM_ARRAY); }}
                className={`w-full py-2 px-3 text-left rounded-xl text-xs font-semibold border transition-all ${
                  initialArray === EXAM_ARRAY
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Exam Array 7 Elements: [38, 27, 43, 3, 9, 82, 10]
              </button>
            </div>
          </div>

          {/* Complexity Explanation Card with Beginner "Why?" */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner text-xs space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-rose-400">Merge Sort Complexity</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[10px]">
                Guaranteed O(n log n)
              </span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>Best Case: <span className="text-emerald-400 font-bold">O(n log n)</span></p>
              <p>Average Case: <span className="text-amber-400 font-bold">O(n log n)</span></p>
              <p>Worst Case: <span className="text-emerald-400 font-bold">O(n log n)</span></p>
              <p>Space Auxiliary: <span className="text-rose-400 font-bold">O(n)</span> (requires buffer array)</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-sans leading-relaxed">
              <strong className="text-slate-200">Why is it always O(n log n)?</strong>
              <p className="mt-1">
                The array is halved at each level, creating exactly <strong className="text-amber-300">log₂ n</strong> levels. At every level, merging all elements takes <strong className="text-amber-300">O(n)</strong> operations. Thus, <em className="text-rose-300">n × log n</em> work is done in every scenario!
              </p>
            </div>
          </div>

          {/* Part 8: "Why It Feels Confusing" Teaching Feature */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>WHY IT FEELS CONFUSING</span>
            </div>
            <p className="text-amber-900 leading-relaxed font-medium">
              Merge Sort is difficult at first because two separate processes occur:
            </p>
            <div className="space-y-1.5 font-semibold text-[11px] text-amber-950">
              <div className="p-1.5 bg-white/80 rounded-lg border border-amber-100 flex items-center gap-2">
                <span className="text-rose-600 font-extrabold">1. DIVIDE:</span>
                <span>Break array until single elements remain (no sorting occurs yet).</span>
              </div>
              <div className="p-1.5 bg-white/80 rounded-lg border border-amber-100 flex items-center gap-2">
                <span className="text-emerald-600 font-extrabold">2. MERGE:</span>
                <span>Combine already-sorted pairs using two pointers.</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-800 font-medium">
              💡 <strong>The trick:</strong> Think of DIVIDE and MERGE as two completely separate algorithms!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
