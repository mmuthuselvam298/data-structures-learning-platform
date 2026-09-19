import React from 'react';
import { 
  ViewMode, 
  VisualizerId 
} from '../../types';
import { allUnits } from '../../content';
import { 
  BookOpen, 
  FlaskConical, 
  Terminal, 
  Award, 
  Download, 
  BookMarked, 
  ChevronRight,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  selectedUnitId: number;
  onSelectUnit: (unitId: number) => void;
  selectedVisualizerId: VisualizerId;
  onSelectVisualizer: (visId: VisualizerId) => void;
  completedLessons: string[];
  xp: number;
  streakDays: number;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedUnitId,
  onSelectUnit,
  selectedVisualizerId,
  onSelectVisualizer,
  completedLessons,
  xp,
  streakDays,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const visualizerList: { id: VisualizerId; label: string; unit: string; color: string }[] = [
    { id: 'stack', label: 'Stack (LIFO)', unit: 'Unit 1', color: 'text-purple-600' },
    { id: 'circular_queue', label: 'Circular Queue (FIFO)', unit: 'Unit 1', color: 'text-cyan-600' },
    { id: 'array', label: 'Array & Sparse Matrix', unit: 'Unit 1', color: 'text-blue-600' },
    { id: 'linked_list', label: 'Linked Lists (SLL/DLL/CLL)', unit: 'Unit 2', color: 'text-teal-600' },
    { id: 'tree_bst', label: 'Binary Search Tree (BST)', unit: 'Unit 3', color: 'text-pink-600' },
    { id: 'tree_avl', label: 'AVL Self-Balancing Tree', unit: 'Unit 3', color: 'text-rose-600' },
    { id: 'graph', label: 'Graph & Dijkstra Drone', unit: 'Unit 4', color: 'text-orange-600' },
    { id: 'sorting', label: 'Sorting Visualizer', unit: 'Unit 5', color: 'text-red-600' },
    { id: 'searching', label: 'Searching Visualizer', unit: 'Unit 5', color: 'text-emerald-600' },
    { id: 'hashing', label: 'Hashing & Linear Probing', unit: 'Unit 5', color: 'text-violet-600' }
  ];

  const handleNav = (fn: () => void) => {
    fn();
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div 
            onClick={() => handleNav(() => onSelectView('home'))}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Custom Brand Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-all">
              <div className="relative">
                <div className="w-4 h-4 rounded-sm bg-white/90 border border-indigo-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 absolute -top-1.5 -right-1.5 ring-2 ring-indigo-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-pink-400 absolute -bottom-1.5 -left-1.5 ring-2 ring-indigo-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900">
                  DS PLAYGROUND
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                See how data structures move.
              </p>
            </div>
          </div>

          {/* Gamification / XP Bar */}
          <div className="mt-4 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streakDays} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section: Learn */}
          <div>
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Course Units
            </span>
            <div className="mt-1 space-y-0.5">
              {allUnits.map((u) => {
                const isSelected = currentView === 'learn' && selectedUnitId === u.id;
                const completedCount = u.lessons.filter(l => completedLessons.includes(l.id)).length;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleNav(() => { onSelectUnit(u.id); onSelectView('learn'); })}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      <span className="truncate max-w-[170px]">{u.badge}: {u.title.split(':')[1]?.trim() || u.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {completedCount}/{u.lessons.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Visual Lab */}
          <div>
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Visual Lab</span>
              <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
            </span>
            <div className="mt-1 space-y-0.5">
              {visualizerList.map((vis) => {
                const isSelected = currentView === 'lab' && selectedVisualizerId === vis.id;
                return (
                  <button
                    key={vis.id}
                    onClick={() => handleNav(() => { onSelectVisualizer(vis.id); onSelectView('lab'); })}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-purple-50 text-purple-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{vis.label}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{vis.unit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Practice & Labs */}
          <div>
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Practice & Exams
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => handleNav(() => onSelectView('practice'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'practice' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Interactive Challenges</span>
              </button>

              <button
                onClick={() => handleNav(() => onSelectView('quiz'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'quiz' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unit Quizzes & Exams</span>
              </button>

              <button
                onClick={() => handleNav(() => onSelectView('code'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'code' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>C Code Playground</span>
              </button>
            </div>
          </div>

          {/* Section: Extra Resources */}
          <div>
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Resources
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => handleNav(() => onSelectView('resources'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'resources' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Download className="w-4 h-4 text-blue-500" />
                <span>Download Notes & Exams</span>
              </button>

              <button
                onClick={() => handleNav(() => onSelectView('glossary'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'glossary' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookMarked className="w-4 h-4 text-teal-500" />
                <span>DSA Glossary</span>
              </button>

              <button
                onClick={() => handleNav(() => onSelectView('progress'))}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  currentView === 'progress' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>My Badges & Progress</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[11px] text-slate-500">
            <span className="font-bold text-slate-700">SRM University - AP</span>
            <p>CSE 102: Data Structures</p>
          </div>
        </div>
      </aside>
    </>
  );
};
