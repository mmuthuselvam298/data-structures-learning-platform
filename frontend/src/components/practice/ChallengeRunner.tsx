import React, { useState } from 'react';
import { courseChallenges } from '../../content';
import { Challenge, VisualizerId } from '../../types';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Lightbulb, Play } from 'lucide-react';

interface ChallengeRunnerProps {
  onOpenVisualizer: (visId: VisualizerId) => void;
  onChallengeComplete: (challengeId: string, xp: number) => void;
  completedChallenges: string[];
}

export const ChallengeRunner: React.FC<ChallengeRunnerProps> = ({
  onOpenVisualizer,
  onChallengeComplete,
  completedChallenges
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(courseChallenges[0]);
  const [feedback, setFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleLaunchChallenge = () => {
    onOpenVisualizer(selectedChallenge.visualizerId);
  };

  const handleManualComplete = () => {
    onChallengeComplete(selectedChallenge.id, selectedChallenge.xpReward);
    setFeedback({
      success: true,
      msg: `Challenge "${selectedChallenge.title}" marked completed! +${selectedChallenge.xpReward} XP awarded.`
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Interactive Hands-On Labs
            </span>
            <h2 className="text-xl font-bold text-slate-900">Data Structure Challenges</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apply what you learned by executing exact operations in the simulators.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Completed: {completedChallenges.length} / {courseChallenges.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Challenge List */}
        <div className="lg:col-span-5 space-y-2.5">
          {courseChallenges.map((ch) => {
            const isSelected = selectedChallenge.id === ch.id;
            const isDone = completedChallenges.includes(ch.id);

            return (
              <button
                key={ch.id}
                onClick={() => { setSelectedChallenge(ch); setFeedback(null); }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{ch.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{ch.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-amber-700 font-bold pt-1">
                    <span>+{ch.xpReward} XP</span>
                    {ch.examSource && <span className="text-purple-600">• {ch.examSource}</span>}
                  </div>
                </div>

                {isDone && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Challenge Detail Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Active Challenge</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedChallenge.title}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              +{selectedChallenge.xpReward} XP
            </span>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase">Goal:</h5>
            <p className="text-sm text-slate-800 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
              {selectedChallenge.taskGoal}
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase">Step-by-Step Instructions:</h5>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {selectedChallenge.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hint */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Pro Tip: </span>
              <span>{selectedChallenge.hint}</span>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              feedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {feedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.msg}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleLaunchChallenge}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch in Simulator</span>
            </button>

            <button
              onClick={handleManualComplete}
              className="px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              Mark Completed & Claim XP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
