import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Clock, CheckCircle2, AlertCircle, History, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChallengeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengeHistoryModal: React.FC<ChallengeHistoryModalProps> = ({ isOpen, onClose }) => {
  const { progressData, isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  const attempts = progressData.challengeAttempts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-amber-50 via-rose-50 to-orange-50 p-6 border-b border-amber-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <History className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Interactive Practice
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Challenge History & Attempts
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {isAuthenticated
              ? `Showing logged records for ${user?.full_name} (${user?.email})`
              : 'Guest Mode: Attempts stored locally in this browser.'}
          </p>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {attempts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                🎯
              </div>
              <p className="text-sm font-bold text-slate-700">No challenge attempts yet!</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Head over to the Practice or Challenge tab to test your algorithm step-prediction skills.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((att: any, idx: number) => {
                const isPerfect = att.score === att.max_score;
                return (
                  <div
                    key={att.id || idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-all shadow-2xs flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 capitalize">
                          {att.challenge_id ? att.challenge_id.replace(/-/g, ' ') : 'Algorithm Challenge'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            att.difficulty === 'hard'
                              ? 'bg-red-100 text-red-800'
                              : att.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {att.difficulty || 'Normal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {att.time_seconds ? `${Math.floor(att.time_seconds / 60)}m ${att.time_seconds % 60}s` : '1m 20s'}
                        </span>
                        <span>•</span>
                        <span>{att.created_at ? new Date(att.created_at).toLocaleDateString() : 'Today'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900 flex items-center justify-end gap-1">
                          {isPerfect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Trophy className="w-4 h-4 text-amber-500" />
                          )}
                          <span>
                            {att.score} / {att.max_score}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 font-mono">
                          +{att.score * 15} XP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
