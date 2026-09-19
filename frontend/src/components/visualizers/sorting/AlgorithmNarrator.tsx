import React from 'react';
import { Sparkles, HelpCircle, ArrowRight, Activity } from 'lucide-react';

export interface NarrativeStep {
  what: string;
  why: string;
  next?: string;
  phase?: string;
  comparisons?: number;
  swaps?: number;
  stepNumber: number;
  totalSteps: number;
}

interface AlgorithmNarratorProps {
  narrative: NarrativeStep;
  algorithmName: string;
}

export const AlgorithmNarrator: React.FC<AlgorithmNarratorProps> = ({
  narrative,
  algorithmName
}) => {
  return (
    <div className="w-full bg-linear-to-br from-amber-50/60 via-white to-rose-50/40 rounded-2xl border border-amber-200/80 p-4 shadow-xs">
      {/* Top Banner: Algorithm + Step count + Phase */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            ✨
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            {algorithmName} Story Narrator
          </span>
          {narrative.phase && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
              {narrative.phase}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-600">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            STEP <span className="text-rose-600 font-extrabold">{narrative.stepNumber}</span> / {narrative.totalSteps}
          </span>
          {narrative.comparisons !== undefined && (
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 shadow-2xs hidden sm:inline-block">
              Comps: <strong className="text-slate-800">{narrative.comparisons}</strong>
            </span>
          )}
          {narrative.swaps !== undefined && (
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 shadow-2xs hidden sm:inline-block">
              Swaps: <strong className="text-slate-800">{narrative.swaps}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Guided 3-Part Question Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
        {/* WHAT IS HAPPENING */}
        <div className="bg-white/85 p-3 rounded-xl border border-amber-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-1">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>WHAT IS HAPPENING?</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {narrative.what}
          </p>
        </div>

        {/* WHY IS IT HAPPENING */}
        <div className="bg-white/85 p-3 rounded-xl border border-amber-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>WHY IS IT HAPPENING?</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            {narrative.why}
          </p>
        </div>

        {/* WHAT WILL HAPPEN NEXT */}
        <div className="bg-white/85 p-3 rounded-xl border border-amber-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>WHAT WILL HAPPEN NEXT?</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            {narrative.next || "We evaluate the next step according to the algorithm rules."}
          </p>
        </div>
      </div>
    </div>
  );
};
