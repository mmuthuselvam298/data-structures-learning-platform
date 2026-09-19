import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allUnits } from '../../content';
import { QuizQuestion } from '../../types';
import { CheckCircle2, XCircle, HelpCircle, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizEngineProps {
  onQuizPassed?: (quizId: string) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ onQuizPassed }) => {
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Extract all questions for the selected unit
  const activeUnit = allUnits.find(u => u.id === selectedUnit) || allUnits[0];
  const questions: QuizQuestion[] = activeUnit.lessons.flatMap(l => l.quizzes);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      onQuizPassed?.(currentQ.id);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header & Unit Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Exam Practice & Validation
            </span>
            <h2 className="text-xl font-bold text-slate-900">Unit-Wise Quizzes & Real Exam Questions</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Questions compiled directly from SRM University-AP Mid-Term & End-Term examination papers.
          </p>
        </div>

        {/* Unit Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          {[1, 2, 3, 4, 5].map(u => (
            <button
              key={u}
              onClick={() => { setSelectedUnit(u); handleRestart(); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedUnit === u ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Progress & Source */}
          <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-100">
            <span className="font-bold text-slate-500">
              Question {currentIdx + 1} of {questions.length}
            </span>
            {currentQ.examSource && (
              <span className="bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-lg border border-purple-200">
                Source: {currentQ.examSource}
              </span>
            )}
            <span className="font-bold text-emerald-600">
              Score: {score} / {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                {currentQ.codeSnippet}
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/20";
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-50 border-red-500 text-red-900 font-bold";
                } else {
                  btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between text-xs leading-normal ${btnStyle}`}
                >
                  <span className="flex-1 pr-4">{opt}</span>
                  {isAnswered && (
                    <span>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {!isCorrect && isSelected && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation WHY Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-1.5 text-xs text-indigo-950"
              >
                <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Educational Explanation (WHY):
                </div>
                <p className="leading-relaxed text-slate-700">
                  {currentQ.explanationWhy}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Quiz
            </button>

            {isAnswered && currentIdx < questions.length - 1 && (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isAnswered && currentIdx === questions.length - 1 && (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                🎉 Unit Quiz Finished! Score: {score}/{questions.length}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
          No questions available for this unit.
        </div>
      )}
    </div>
  );
};
