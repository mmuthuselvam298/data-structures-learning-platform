import React from 'react';
import { Menu, Search, Sparkles, Flame, FlaskConical, BookOpen } from 'lucide-react';
import { ViewMode } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onSelectView: (view: ViewMode) => void;
  xp: number;
  streakDays: number;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onSelectView,
  xp,
  streakDays,
  onToggleMobileMenu
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Left items: Mobile Hamburger + Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-medium text-slate-600 border border-slate-200 transition-all min-w-[200px] md:min-w-[280px]"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search topics, structures, algorithms...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onSelectView('lab')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Visual Lab</span>
        </button>

        <button
          onClick={() => onSelectView('learn')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Syllabus</span>
        </button>

        {/* Gamification stats */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{xp} XP</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 rounded-xl border border-orange-200 text-xs font-bold text-orange-700 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
          <span>{streakDays}d</span>
        </div>
      </div>
    </header>
  );
};
