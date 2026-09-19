import React from 'react';
import { UserProgress } from '../../types';
import { allUnits, courseChallenges } from '../../content';
import { Award, Sparkles, Flame, CheckCircle2, BookOpen, RotateCcw, Trophy } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress
}) => {
  const allBadges = [
    { name: 'New Explorer', desc: 'Started your Data Structures journey', icon: '🌱', threshold: 0 },
    { name: 'Stack Explorer', desc: 'Mastered LIFO, Push, Pop & Infix conversions', icon: '🥞', threshold: 100 },
    { name: 'Queue Master', desc: 'Conquered Circular Queue & FIFO mechanics', icon: '🎫', threshold: 200 },
    { name: 'Pointer Pioneer', desc: 'Navigated Singly, Doubly & Circular Linked Lists', icon: '🔗', threshold: 300 },
    { name: 'Tree Explorer', desc: 'Built BSTs and balanced AVL Rotations', icon: '🌳', threshold: 450 },
    { name: 'Graph Navigator', desc: 'Traversed BFS, DFS & routed Dijkstra medical drones', icon: '🗺️', threshold: 600 },
    { name: 'Sorting Wizard', desc: 'Conquered Quick Sort partition & algorithm speeds', icon: '🪄', threshold: 750 },
    { name: 'DSA Detective', desc: 'Mastered hashing collisions and binary search', icon: '🕵️', threshold: 900 }
  ];

  const totalLessons = allUnits.reduce((acc, u) => acc + u.lessons.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Stat Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Student Dashboard</span>
          </div>
          <h2 className="text-3xl font-black">My Progress & Achievements</h2>
          <p className="text-sm text-indigo-100 mt-1 max-w-md">
            Track your interactive mastery of the SRM University-AP Data Structures curriculum.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center px-4">
            <span className="text-3xl font-black text-amber-300 flex items-center justify-center gap-1">
              <Sparkles className="w-6 h-6 fill-amber-300" /> {progress.xp}
            </span>
            <span className="text-[11px] font-bold text-indigo-100 uppercase">Total XP</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center px-4">
            <span className="text-3xl font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6 fill-orange-400" /> {progress.streakDays}
            </span>
            <span className="text-[11px] font-bold text-indigo-100 uppercase">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {progress.completedLessons.length} / {totalLessons}
            </span>
            <p className="text-xs text-slate-500 font-medium">Lessons Mastered</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {progress.completedChallenges.length} / {courseChallenges.length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Challenges Solved</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800">
              {progress.passedQuizzes.length}
            </span>
            <p className="text-xs text-slate-500 font-medium">Exam Questions Solved</p>
          </div>
        </div>
      </div>

      {/* Unit Completion Progress Bars */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Curriculum Syllabus Breakdown
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
                    className={`h-full bg-gradient-to-r ${unit.accentColor} transition-all duration-500`} 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Badges & Milestones
          </h3>
          <span className="text-xs text-slate-500">
            {progress.unlockedBadges.length} / {allBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allBadges.map((b, idx) => {
            const isUnlocked = progress.unlockedBadges.includes(b.name);
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
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

      {/* Reset progress */}
      <div className="text-right">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all your progress and XP?")) {
              onResetProgress();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset My Progress
        </button>
      </div>
    </div>
  );
};
