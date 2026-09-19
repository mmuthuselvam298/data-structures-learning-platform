import React from 'react';
import { motion } from 'framer-motion';
import { allUnits } from '../../content';
import { ViewMode, VisualizerId } from '../../types';
import { 
  Play, 
  FlaskConical, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  FolderTree, 
  Network, 
  ArrowUpDown, 
  Link, 
  CheckCircle2, 
  Clock, 
  Terminal,
  Download,
  GraduationCap
} from 'lucide-react';

interface HomeViewProps {
  onStartLearning: () => void;
  onOpenVisualizer: (visId: VisualizerId) => void;
  onSelectUnit: (unitId: number) => void;
  completedLessons: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartLearning,
  onOpenVisualizer,
  onSelectUnit,
  completedLessons
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
          <GraduationCap className="w-4 h-4 text-amber-600" />
          <span>SRM University-AP • CSE 102 Data Structures Curriculum</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Learn Data Structures by <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">making them move.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Build, modify, and explore data structures step by step. Designed for college students learning Data Structures in C through live animation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartLearning}
            className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenVisualizer('stack')}
            className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-2xl text-sm font-extrabold shadow-xs transition-all active:scale-95 flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 text-purple-600" />
            <span>Open Visual Lab</span>
          </button>
        </div>

        {/* Hero Visual Centerpiece: Animated Connected Nodes, Stack, Queue */}
        <div className="pt-8">
          <div className="bg-gradient-to-b from-white to-amber-50/40 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto overflow-hidden relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Stack Preview Card */}
              <div 
                onClick={() => onOpenVisualizer('stack')}
                className="p-4 bg-white rounded-2xl border-2 border-purple-200 shadow-xs hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">LIFO</span>
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <div className="space-y-1.5 flex flex-col-reverse mb-3">
                  <div className="h-6 bg-purple-500 rounded text-white text-xs font-mono font-bold flex items-center justify-center">30 (TOP)</div>
                  <div className="h-6 bg-slate-100 rounded text-slate-700 text-xs font-mono font-bold flex items-center justify-center">20</div>
                  <div className="h-6 bg-slate-100 rounded text-slate-700 text-xs font-mono font-bold flex items-center justify-center">10</div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Stack Simulator</h4>
              </div>

              {/* Linked List Preview Card */}
              <div 
                onClick={() => onOpenVisualizer('linked_list')}
                className="p-4 bg-white rounded-2xl border-2 border-teal-200 shadow-xs hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">Pointers</span>
                  <Link className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex items-center justify-center gap-1.5 py-4 mb-2 font-mono text-xs">
                  <span className="px-2 py-1 bg-teal-50 border border-teal-200 rounded font-bold">10•</span>
                  <span className="text-teal-500 font-bold">→</span>
                  <span className="px-2 py-1 bg-teal-50 border border-teal-200 rounded font-bold">20•</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600">Linked List</h4>
              </div>

              {/* Tree BST Preview Card */}
              <div 
                onClick={() => onOpenVisualizer('tree_bst')}
                className="p-4 bg-white rounded-2xl border-2 border-pink-200 shadow-xs hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-700">BST</span>
                  <FolderTree className="w-4 h-4 text-pink-600" />
                </div>
                <div className="flex flex-col items-center py-2 mb-2 font-mono text-xs">
                  <span className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold flex items-center justify-center text-[11px]">45</span>
                  <div className="flex gap-6 mt-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[10px]">36</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[10px]">76</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-pink-600">Tree & AVL</h4>
              </div>

              {/* Sorting Bar Preview */}
              <div 
                onClick={() => onOpenVisualizer('sorting')}
                className="p-4 bg-white rounded-2xl border-2 border-rose-200 shadow-xs hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Quick</span>
                  <ArrowUpDown className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex items-end justify-center gap-1.5 h-16 py-1 mb-2">
                  <div className="w-3 h-8 bg-rose-400 rounded-t" />
                  <div className="w-3 h-4 bg-amber-400 rounded-t" />
                  <div className="w-3 h-12 bg-rose-400 rounded-t" />
                  <div className="w-3 h-2 bg-emerald-500 rounded-t" />
                  <div className="w-3 h-10 bg-red-500 rounded-t" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600">Sorting Lab</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Roadmap Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Course Curriculum Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Strictly mirroring the 5 units of the official SRM University-AP CSE 102 Data Structures curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allUnits.map((u) => {
            const completedCount = u.lessons.filter(l => completedLessons.includes(l.id)).length;
            const pct = Math.round((completedCount / u.lessons.length) * 100);

            return (
              <div
                key={u.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700">
                      {u.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {completedCount} / {u.lessons.length} Done
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {u.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {u.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${u.accentColor} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectUnit(u.id)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Explore Unit Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
