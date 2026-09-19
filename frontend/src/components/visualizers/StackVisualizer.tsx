import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Trash2, Eye, Play, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface StackVisualizerProps {
  onAction?: (action: string, data: any) => void;
  recordHistory?: (record: any) => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ recordHistory }) => {
  const [items, setItems] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState<string>('40');
  const [statusMsg, setStatusMsg] = useState<string>('Stack ready. Capacity = 7. LIFO (Last In, First Out).');
  const [isError, setIsError] = useState<boolean>(false);
  const [peeked, setPeeked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'stack' | 'infix' | 'eval'>('stack');

  // Infix to postfix state
  const [infixExpr, setInfixExpr] = useState<string>('K+L-M*N+(O^P)*W/U/V*T+Q');
  const [postfixResult, setPostfixResult] = useState<any>(null);
  const [postfixStepIdx, setPostfixStepIdx] = useState<number>(0);

  // Postfix eval state
  const [evalExpr, setEvalExpr] = useState<string>('5 6 7 8 + - * 4 +');
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evalStepIdx, setEvalStepIdx] = useState<number>(0);

  const capacity = 7;

  const handlePush = () => {
    const val = parseInt(inputValue.trim());
    if (isNaN(val)) {
      setStatusMsg('Please enter a valid integer to push.');
      setIsError(true);
      return;
    }
    if (items.length >= capacity) {
      setStatusMsg(`Stack Overflow! Cannot push ${val}. Max capacity is ${capacity}.`);
      setIsError(true);
      return;
    }

    const newItems = [...items, val];
    setItems(newItems);
    setStatusMsg(`Pushed ${val} onto the top of the stack. (top index: ${newItems.length - 1})`);
    setIsError(false);
    setPeeked(false);
    setInputValue(String(val + 10));

    recordHistory?.({
      operation: 'push',
      value: val,
      state: newItems,
      top: val
    });
  };

  const handlePop = () => {
    if (items.length === 0) {
      setStatusMsg('Stack Underflow! Cannot pop from an empty stack.');
      setIsError(true);
      return;
    }

    const popped = items[items.length - 1];
    const newItems = items.slice(0, -1);
    setItems(newItems);
    setStatusMsg(`Popped ${popped} from the top of the stack.`);
    setIsError(false);
    setPeeked(false);

    recordHistory?.({
      operation: 'pop',
      value: popped,
      state: newItems,
      top: newItems.length > 0 ? newItems[newItems.length - 1] : null
    });
  };

  const handlePeek = () => {
    if (items.length === 0) {
      setStatusMsg('Stack is empty. No top element to peek.');
      setIsError(true);
      return;
    }
    const topVal = items[items.length - 1];
    setStatusMsg(`Peeked top element: ${topVal} at index ${items.length - 1}.`);
    setIsError(false);
    setPeeked(true);
  };

  const handleClear = () => {
    setItems([]);
    setStatusMsg('Stack cleared to empty.');
    setIsError(false);
    setPeeked(false);
  };

  const runInfixConversion = async () => {
    try {
      const res = await fetch('/api/expression/infix-to-postfix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: infixExpr })
      });
      const data = await res.json();
      setPostfixResult(data);
      setPostfixStepIdx(0);
    } catch {
      // client-side fallback
      setStatusMsg('Running conversion...');
    }
  };

  const runPostfixEval = async () => {
    try {
      const res = await fetch('/api/expression/evaluate-postfix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: evalExpr })
      });
      const data = await res.json();
      setEvalResult(data);
      setEvalStepIdx(0);
    } catch {
      setStatusMsg('Running evaluation...');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              Unit I • LIFO
            </span>
            <h3 className="text-xl font-bold text-slate-800">Stack Interactive Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Last-In, First-Out: All pushes and pops operate strictly at the TOP.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'stack' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Stack Simulator
          </button>
          <button
            onClick={() => { setActiveTab('infix'); if (!postfixResult) runInfixConversion(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'infix' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Infix to Postfix Converter
          </button>
          <button
            onClick={() => { setActiveTab('eval'); if (!evalResult) runPostfixEval(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'eval' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Postfix Evaluator
          </button>
        </div>
      </div>

      {activeTab === 'stack' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Visual Container */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-amber-50/40 rounded-2xl border border-amber-100 min-h-[420px] relative">
            <div className="absolute top-4 left-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
              <span>Capacity: {items.length} / {capacity}</span>
              <span className={`w-2 h-2 rounded-full ${items.length === capacity ? 'bg-red-500' : items.length === 0 ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            </div>

            {/* Stack Bucket Visual */}
            <div className="relative w-48 flex flex-col items-center">
              {/* TOP Indicator Arrow */}
              {items.length > 0 && (
                <motion.div
                  layout
                  className="flex items-center gap-1.5 text-purple-600 font-bold text-xs mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                  <span>TOP = index {items.length - 1}</span>
                </motion.div>
              )}

              {/* Bucket Frame */}
              <div className="w-44 min-h-[260px] border-b-4 border-l-4 border-r-4 border-slate-700 rounded-b-xl flex flex-col-reverse p-2 gap-2 bg-white/70 shadow-inner">
                <AnimatePresence>
                  {items.map((val, idx) => {
                    const isTop = idx === items.length - 1;
                    return (
                      <motion.div
                        key={`${idx}-${val}`}
                        initial={{ opacity: 0, y: -60, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: isTop && peeked ? 1.06 : 1,
                          borderColor: isTop && peeked ? '#8B5CF6' : '#CBD5E1'
                        }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className={`h-11 rounded-lg flex items-center justify-between px-3 border-2 font-bold shadow-xs text-sm ${
                          isTop
                            ? 'bg-purple-500 text-white border-purple-600 shadow-purple-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="text-xs opacity-75 font-mono">[{idx}]</span>
                        <span className="text-base font-extrabold">{val}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {isTop ? 'TOP' : ''}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {items.length === 0 && (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium py-16">
                    Stack is Empty
                  </div>
                )}
              </div>
              <div className="w-52 h-2.5 bg-slate-700 rounded-full mt-0.5 shadow-xs" />
            </div>

            {/* Status pill */}
            <div className={`mt-5 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{statusMsg}</span>
            </div>
          </div>

          {/* Controls & C Equivalent */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Operations Panel
              </h4>

              {/* Value Input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePush()}
                  placeholder="Enter value"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                />
                <button
                  onClick={handlePush}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                >
                  PUSH
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={handlePop}
                  disabled={items.length === 0}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
                >
                  POP
                </button>
                <button
                  onClick={handlePeek}
                  disabled={items.length === 0}
                  className="py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  PEEK
                </button>
                <button
                  onClick={handleClear}
                  className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  RESET
                </button>
              </div>
            </div>

            {/* Equivalent C Code Panel */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-semibold text-[11px] text-purple-400">Equivalent C Code</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Time: O(1)</span>
              </div>
              <div className="pt-3 text-slate-300 space-y-1 overflow-x-auto">
                <p><span className="text-purple-400">int</span> stack[MAX];</p>
                <p><span className="text-purple-400">int</span> top = <span className="text-amber-400">{items.length - 1}</span>;</p>
                <p className="text-slate-500 pt-1">// Push operation</p>
                <p>stack[++top] = {inputValue || 'x'};</p>
                <p className="text-slate-500 pt-1">// Pop operation</p>
                <p><span className="text-purple-400">int</span> val = stack[top--];</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Infix to Postfix Converter Tab */}
      {activeTab === 'infix' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <span className="text-xs font-bold text-purple-900">Infix Expression:</span>
            <input
              type="text"
              value={infixExpr}
              onChange={(e) => setInfixExpr(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg font-mono flex-1 min-w-[240px]"
            />
            <button
              onClick={runInfixConversion}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              Convert to Postfix
            </button>
            <button
              onClick={() => setInfixExpr('A+B*(C+D)')}
              className="px-2.5 py-1 text-xs text-purple-700 hover:underline"
            >
              Load Mid-Sem Example
            </button>
          </div>

          {postfixResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  Result Postfix: <span className="font-mono text-purple-700 font-bold text-sm">{postfixResult.postfix}</span>
                </span>
                <span className="text-xs text-slate-400">Total Steps: {postfixResult.steps.length}</span>
              </div>

              {/* Step Table */}
              <div className="max-h-72 overflow-y-auto mt-3">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Step</th>
                      <th className="p-2">Symbol</th>
                      <th className="p-2">Stack (LIFO)</th>
                      <th className="p-2">Output Expression</th>
                      <th className="p-2">Action / Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {postfixResult.steps.map((st: any, i: number) => (
                      <tr key={i} className={i === postfixStepIdx ? 'bg-purple-50/70 font-semibold text-purple-900' : 'hover:bg-slate-50'}>
                        <td className="p-2">{st.step}</td>
                        <td className="p-2 text-purple-600 font-bold">{st.symbol}</td>
                        <td className="p-2 font-mono">[{st.stack?.join(', ') || ''}]</td>
                        <td className="p-2 text-emerald-600 font-bold">{st.output}</td>
                        <td className="p-2 text-slate-600">{st.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Postfix Evaluator Tab */}
      {activeTab === 'eval' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <span className="text-xs font-bold text-purple-900">Postfix Expression:</span>
            <input
              type="text"
              value={evalExpr}
              onChange={(e) => setEvalExpr(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-purple-200 rounded-lg font-mono flex-1 min-w-[240px]"
            />
            <button
              onClick={runPostfixEval}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              Evaluate Expression
            </button>
            <button
              onClick={() => setEvalExpr('5 6 7 8 + - * 4 +')}
              className="px-2.5 py-1 text-xs text-purple-700 hover:underline"
            >
              Load Exam Q11: "5 6 7 8 + - * 4 +"
            </button>
          </div>

          {evalResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  Calculated Result: <span className="font-mono text-emerald-600 font-extrabold text-base">{evalResult.result}</span>
                </span>
                <span className="text-xs text-slate-400">Total Steps: {evalResult.steps?.length}</span>
              </div>

              <div className="max-h-72 overflow-y-auto mt-3">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2">Step</th>
                      <th className="p-2">Token</th>
                      <th className="p-2">Evaluation Stack</th>
                      <th className="p-2">Action / Operation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evalResult.steps?.map((st: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2">{st.step}</td>
                        <td className="p-2 text-purple-700 font-bold">{st.token}</td>
                        <td className="p-2 text-emerald-700 font-bold">[{st.stack?.join(', ')}]</td>
                        <td className="p-2 text-slate-700">{st.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
