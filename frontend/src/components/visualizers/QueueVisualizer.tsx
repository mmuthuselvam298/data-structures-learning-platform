import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface QueueVisualizerProps {
  recordHistory?: (record: any) => void;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ recordHistory }) => {
  const [mode, setMode] = useState<'circular' | 'linear'>('circular');
  const capacity = 6;

  // Circular queue state
  const [cqArray, setCqArray] = useState<(number | null)[]>([10, 20, 30, null, null, null]);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(2);

  // Linear queue state
  const [lqArray, setLqArray] = useState<(number | null)[]>([10, 20, 30, null, null, null]);
  const [lFront, setLFront] = useState<number>(0);
  const [lRear, setLRear] = useState<number>(2);

  const [inputVal, setInputVal] = useState<string>('40');
  const [statusMsg, setStatusMsg] = useState<string>('Circular Queue ready. Capacity = 6. Modulo arithmetic (rear+1)%MAX.');
  const [isError, setIsError] = useState<boolean>(false);

  // Circular Enqueue
  const handleCqEnqueue = () => {
    const val = parseInt(inputVal.trim());
    if (isNaN(val)) {
      setStatusMsg('Please enter a valid integer.');
      setIsError(true);
      return;
    }

    const isFull = (rear + 1) % capacity === front;
    if (isFull) {
      setStatusMsg(`Circular Queue Overflow! Condition ((rear + 1) % ${capacity} == front) met. (front=${front}, rear=${rear})`);
      setIsError(true);
      return;
    }

    let newFront = front;
    let newRear = rear;
    const newArr = [...cqArray];

    if (front === -1) {
      newFront = 0;
      newRear = 0;
    } else {
      newRear = (rear + 1) % capacity;
    }

    newArr[newRear] = val;
    setCqArray(newArr);
    setFront(newFront);
    setRear(newRear);
    setStatusMsg(`Enqueued ${val} at index ${newRear}. (rear updated via (rear + 1) % ${capacity} = ${newRear})`);
    setIsError(false);
    setInputVal(String(val + 10));

    recordHistory?.({
      operation: 'enqueue',
      value: val,
      front: newFront,
      rear: newRear,
      state: newArr.filter(x => x !== null)
    });
  };

  // Circular Dequeue
  const handleCqDequeue = () => {
    if (front === -1) {
      setStatusMsg('Circular Queue Underflow! Queue is empty.');
      setIsError(true);
      return;
    }

    const val = cqArray[front];
    const newArr = [...cqArray];
    newArr[front] = null;

    let newFront = front;
    let newRear = rear;

    if (front === rear) {
      newFront = -1;
      newRear = -1;
    } else {
      newFront = (front + 1) % capacity;
    }

    setCqArray(newArr);
    setFront(newFront);
    setRear(newRear);
    setStatusMsg(`Dequeued ${val} from index ${front}. (front moved to ${newFront})`);
    setIsError(false);

    recordHistory?.({
      operation: 'dequeue',
      value: val,
      front: newFront,
      rear: newRear,
      state: newArr.filter(x => x !== null)
    });
  };

  // Linear Enqueue
  const handleLqEnqueue = () => {
    const val = parseInt(inputVal.trim());
    if (isNaN(val)) return;

    if (lRear === capacity - 1) {
      const isFalseOverflow = lFront > 0;
      setStatusMsg(`Linear Queue Overflow! rear is at MAX - 1.${isFalseOverflow ? ' (NOTE: This is FALSE OVERFLOW because slots exist at front! Circular queue fixes this).' : ''}`);
      setIsError(true);
      return;
    }

    let newF = lFront === -1 ? 0 : lFront;
    let newR = lRear + 1;
    const newArr = [...lqArray];
    newArr[newR] = val;

    setLqArray(newArr);
    setLFront(newF);
    setLRear(newR);
    setStatusMsg(`Enqueued ${val} at rear index ${newR}.`);
    setIsError(false);
    setInputVal(String(val + 10));
  };

  // Linear Dequeue
  const handleLqDequeue = () => {
    if (lFront === -1 || lFront > lRear) {
      setStatusMsg('Linear Queue Underflow! Queue is empty.');
      setIsError(true);
      return;
    }

    const val = lqArray[lFront];
    const newArr = [...lqArray];
    newArr[lFront] = null;
    const newF = lFront + 1;

    setLqArray(newArr);
    setLFront(newF);
    setStatusMsg(`Dequeued ${val} from front index ${lFront}.`);
    setIsError(false);
  };

  const handleReset = () => {
    if (mode === 'circular') {
      setCqArray([null, null, null, null, null, null]);
      setFront(-1);
      setRear(-1);
      setStatusMsg('Circular queue reset.');
    } else {
      setLqArray([null, null, null, null, null, null]);
      setLFront(-1);
      setLRear(-1);
      setStatusMsg('Linear queue reset.');
    }
    setIsError(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
              Unit I • FIFO
            </span>
            <h3 className="text-xl font-bold text-slate-800">Queue Interactive Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            First-In, First-Out: Insert at REAR, remove from FRONT.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => { setMode('circular'); setStatusMsg('Circular Queue active. Full condition: (rear + 1) % MAX == front'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${mode === 'circular' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'}`}
          >
            Circular Queue (Exam Standard)
          </button>
          <button
            onClick={() => { setMode('linear'); setStatusMsg('Linear Queue active. Observe false overflow limitation.'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${mode === 'linear' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'}`}
          >
            Linear Queue (Limitation Demo)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Visual Board */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-cyan-50/30 rounded-2xl border border-cyan-100 min-h-[380px] relative">
          {/* Metadata badges */}
          <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-500 mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                FRONT = <span className="text-cyan-600 font-extrabold">{mode === 'circular' ? front : lFront}</span>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">
                REAR = <span className="text-blue-600 font-extrabold">{mode === 'circular' ? rear : lRear}</span>
              </span>
            </div>
            {mode === 'circular' && (
              <span className="bg-cyan-100/70 text-cyan-900 px-2.5 py-1 rounded-md text-[11px]">
                Full Condition: (rear + 1) % {capacity} == front
              </span>
            )}
          </div>

          {/* Array Cells Visual */}
          <div className="w-full overflow-x-auto py-8">
            <div className="flex items-center justify-center gap-3 min-w-[500px]">
              {(mode === 'circular' ? cqArray : lqArray).map((val, idx) => {
                const curF = mode === 'circular' ? front : lFront;
                const curR = mode === 'circular' ? rear : lRear;
                const isFront = idx === curF;
                const isRear = idx === curR;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Top indicator for FRONT */}
                    <div className="h-6 flex items-center justify-center">
                      {isFront && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-2 py-0.5 bg-cyan-600 text-white rounded text-[10px] font-bold shadow-xs tracking-wider uppercase"
                        >
                          FRONT
                        </motion.div>
                      )}
                    </div>

                    {/* Array Cell */}
                    <motion.div
                      layout
                      className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 font-mono font-bold transition-all shadow-xs relative ${
                        val !== null
                          ? 'bg-white border-cyan-500 text-slate-800 shadow-cyan-100'
                          : 'bg-slate-100/70 border-dashed border-slate-300 text-slate-400'
                      }`}
                    >
                      <span className="text-lg font-black text-slate-800">
                        {val !== null ? val : '—'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        idx {idx}
                      </span>
                    </motion.div>

                    {/* Bottom indicator for REAR */}
                    <div className="h-6 flex items-center justify-center mt-1">
                      {isRear && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold shadow-xs tracking-wider uppercase"
                        >
                          REAR
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Message */}
          <div className={`mt-4 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Queue Operations
            </h4>

            <div className="flex gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (mode === 'circular' ? handleCqEnqueue() : handleLqEnqueue())}
                placeholder="Enter value"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
              />
              <button
                onClick={mode === 'circular' ? handleCqEnqueue : handleLqEnqueue}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
              >
                ENQUEUE
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={mode === 'circular' ? handleCqDequeue : handleLqDequeue}
                className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all active:scale-95"
              >
                DEQUEUE
              </button>
              <button
                onClick={handleReset}
                className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                RESET
              </button>
            </div>

            {mode === 'linear' && (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold">Limitation Notice:</span> Dequeue items to free slots, then fill rear to idx 5. You will witness False Overflow!
              </div>
            )}
          </div>

          {/* C Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-cyan-400">
                {mode === 'circular' ? 'Circular Queue C Logic' : 'Linear Queue C Logic'}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Time: O(1)</span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1 overflow-x-auto">
              {mode === 'circular' ? (
                <>
                  <p className="text-slate-500">// Circular Queue Overflow check</p>
                  <p><span className="text-cyan-400">if</span> ((rear + 1) % MAX == front)</p>
                  <p className="pl-4">printf(<span className="text-amber-400">"Queue Full!\\n"</span>);</p>
                  <p className="text-slate-500 pt-1">// Circular Enqueue</p>
                  <p>rear = (rear + 1) % MAX;</p>
                  <p>queue[rear] = {inputVal || 'x'};</p>
                </>
              ) : (
                <>
                  <p className="text-slate-500">// Linear Queue Overflow check</p>
                  <p><span className="text-cyan-400">if</span> (rear == MAX - 1)</p>
                  <p className="pl-4">printf(<span className="text-amber-400">"Queue Overflow\\n"</span>);</p>
                  <p className="text-slate-500 pt-1">// Linear Enqueue</p>
                  <p>queue[++rear] = {inputVal || 'x'};</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
