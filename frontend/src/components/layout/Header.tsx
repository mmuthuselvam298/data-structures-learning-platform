import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Flame,
  FlaskConical,
  BookOpen,
  User as UserIcon,
  LogOut,
  Trophy,
  Award,
  History,
  ChevronDown
} from 'lucide-react';
import { ViewMode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ChallengeHistoryModal } from '../profile/ChallengeHistoryModal';

interface HeaderProps {
  onOpenSearch: () => void;
  onSelectView: (view: ViewMode) => void;
  xp?: number;
  streakDays?: number;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onSelectView,
  onToggleMobileMenu
}) => {
  const { user, isAuthenticated, logout, isGuest } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayXP = user?.xp ?? 0;
  const displayStreak = user?.streak ?? 1;
  const initials = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'G';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Left items: Mobile Hamburger + Search trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
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
            <span>{displayXP} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 rounded-xl border border-orange-200 text-xs font-bold text-orange-700 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
            <span>{displayStreak}d</span>
          </div>

          {/* Profile / Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs"
                title="Account Menu"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {initials}
                </div>
                <span className="hidden md:inline-block text-xs font-bold text-slate-700 max-w-[90px] truncate">
                  {user?.full_name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu Popup */}
            {dropdownOpen && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {/* User Info Header */}
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                {/* Navigation Links */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectView('progress');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>My Progress Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectView('progress');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Award className="w-4 h-4 text-purple-500" />
                    <span>Achievements & Badges</span>
                  </button>

                  <button
                    onClick={() => {
                      setHistoryModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <History className="w-4 h-4 text-blue-500" />
                    <span>Challenge History</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Challenge History Modal */}
      <ChallengeHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
      />
    </>
  );
};
