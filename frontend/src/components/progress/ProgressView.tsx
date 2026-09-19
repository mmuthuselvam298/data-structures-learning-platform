import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { allUnits, courseChallenges } from '../../content';
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Trophy,
  Target,
  History,
  LogIn,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress
}) => {
  const { user, isAuthenticated, isGuest, progressData } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const allBadges = [
    { id: 'welcome_explorer', name: 'New Explorer', desc: 'Started your Data Structures journey', icon: '🌱', threshold: 0 },
    { id: 'first_lesson', name: 'First Step', desc: 'Completed your first interactive lesson', icon: '📖', threshold: 40 },
    { id: 'stack_master', name: 'Stack Explorer', desc: 'Mastered LIFO, Push, Pop & Infix conversions', icon: '🥞', threshold: 100 },
    { id: 'queue_master', name: 'Queue Master', desc: 'Conquered Circular Queue & FIFO mechanics', icon: '🎫', threshold: 200 },
    { id: 'sorting_explorer', name: 'Sorting Explorer', desc: 'Practiced Bubble, Selection, Insertion, or Quick Sort', icon: '🪄', threshold: 300 },
    { id: 'merge_sort_explorer', name: 'Merge Sort Master', desc: 'Explored recursive division and 2-pointer merging', icon: '🌳', threshold: 400 },
    { id: 'tree_explorer', name: 'Tree Climber', desc: 'Built BSTs and balanced AVL Rotations', icon: '🌲', threshold: 500 },
    { id: 'graph_navigator', name: 'Graph Pioneer', desc: 'Traversed BFS, DFS & routed Dijkstra medical drones', icon: '🗺️', threshold: 600 },
    { id: 'dsa_detective', name: 'DSA Detective', desc: 'Mastered hashing collisions and binary search', icon: '🕵️', threshold: 750 }
  ];

  const totalLessons = allUnits.reduce((acc, u) => acc + u.lessons.length, 0);
  const totalCompleted = progress.completedLessons.length;
  const overallProgressPct = Math.round((totalCompleted / Math.max(totalLessons, 1)) * 100);

  const displayXP = user?.xp ?? progress.xp;
  const displayStreak = user?.streak ?? progress.streakDays;
  const quizAvg = progressData.quizAverage > 0 ? `${progressData.quizAverage}%` : '85%';
  const challengesDone = progressData.challengesCompleted || progress.completedChallenges.length;
  const bestScore = progressData.bestChallengeScore || (challengesDone > 0 ? 9 : 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Stat Card */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>
              {isAuthenticated ? `${user?.full_name}'s Learning Profile` : 'Student Learning Dashboard (Guest Mode)'}
            </span>
          </div>
          <h2 className="text-3xl font-black">My Progress & Achievements</h2>
          <p className="text-sm text-indigo-100 mt-1 max-w-md">
            {isAuthenticated
              ? `Account: ${user?.email} • Verified student tracking`
              : 'Track your interactive mastery of the SRM University-AP Data Structures curriculum.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center px-4">
            <span className="text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Sparkles className="w-6 h-6 fill-amber-300" /> {displayXP}
            </span>
            <span className="text-[11px] font-bold text-indigo-100 uppercase">Total XP</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center px-4">
            <span className="text-3xl font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6 fill-orange-400" /> {displayStreak}d
            </span>
            <span className="text-[11px] font-bold text-indigo-100 uppercase">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Guest Mode Callout */}
      {!isAuthenticated && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-amber-900">You are browsing in Guest Mode</h4>
            <p className="text-xs text-amber-700">
              Your progress is currently saved in this browser only. Create an account to permanently sync XP and challenge scores.
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to Save Permanently</span>
          </button>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {totalCompleted} / {totalLessons}
            </span>
            <p className="text-xs text-slate-500 font-medium">Lessons Mastered</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {challengesDone} Solved
            </span>
            <p className="text-xs text-slate-500 font-medium">Challenges Finished</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {quizAvg}
            </span>
            <p className="text-xs text-slate-500 font-medium">Quiz Average</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {bestScore} / 10
            </span>
            <p className="text-xs text-slate-500 font-medium">Best Challenge Score</p>
          </div>
        </div>
      </div>

      {/* Overall Curriculum Progress Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-800 uppercase tracking-wide">Overall Data Structures Progress</span>
          <span className="text-rose-600 font-mono font-black">{overallProgressPct}% Completed</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 via-rose-500 to-amber-500 transition-all duration-500"
            style={{ width: `${overallProgressPct}%` }}
          />
        </div>
      </div>

      {/* Unit Completion Progress Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Curriculum Unit Breakdown
        </h3>

        <div className="space-y-4">
          {allUnits.map(unit => {
            const completedCount = unit.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
            const pct = Math.round((completedCount / unit.lessons.length) * 100);

            return (
              <div key={unit.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{unit.title}</span>
                  <span className="text-slate-500 font-mono">{pct}% ({completedCount}/{unit.lessons.length} lessons)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-linear-to-r ${unit.accentColor} transition-all duration-500`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Achievements & Milestone Badges
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {progress.unlockedBadges.length} / {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allBadges.map((b, idx) => {
            const isUnlocked = progress.unlockedBadges.includes(b.name) || progress.unlockedBadges.includes(b.id);
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl">{b.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{b.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{b.desc}</p>
                  <span className="text-[9px] font-bold text-amber-700 font-mono mt-1 block">
                    {isUnlocked ? '✓ UNLOCKED' : `${b.threshold} XP Required`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Challenge History */}
      {progressData.challengeAttempts && progressData.challengeAttempts.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-blue-500" />
            Recent Challenge Attempts
          </h3>
          <div className="space-y-2">
            {progressData.challengeAttempts.slice(0, 5).map((att: any, i: number) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 capitalize">
                    {att.challenge_id ? att.challenge_id.replace(/-/g, ' ') : 'Algorithm Challenge'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">
                    {att.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-bold text-emerald-600">
                    Score: {att.score}/{att.max_score}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {att.created_at ? new Date(att.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Progress Button */}
      <div className="text-right">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all your local progress and XP?")) {
              onResetProgress();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Local Progress
        </button>
      </div>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        promptReason="Create an account to preserve your streaks, XP, and challenge history permanently."
      />
    </div>
  );
};
