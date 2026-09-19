import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  Zap,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface ChallengeQuestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  visualArray?: (number | string)[];
  contextSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CHALLENGE_BANK: ChallengeQuestion[] = [
  {
    id: 'merge-1',
    topic: 'Merge Sort',
    difficulty: 'easy',
    question: 'When merging Left: [12, 20] and Right: [5, 8], which element is placed into the output buffer FIRST?',
    visualArray: [12, 20, '|', 5, 8],
    options: ['12', '20', '5', '8'],
    correctIndex: 2,
    explanation: '5 < 12. In Merge Sort, the two-pointer comparison picks the smaller element first (5), advancing the right pointer.'
  },
  {
    id: 'merge-2',
    topic: 'Merge Sort',
    difficulty: 'medium',
    question: 'In Merge Sort on array [38, 27, 43, 3], after single-element arrays [38] and [27] are compared, what is their merged subarray?',
    visualArray: [38, 27],
    options: ['[38, 27]', '[27, 38]', '[38]', '[3, 27]'],
    correctIndex: 1,
    explanation: '27 < 38, so 27 is placed before 38, resulting in the sorted 2-element subarray [27, 38].'
  },
  {
    id: 'merge-3',
    topic: 'Merge Sort',
    difficulty: 'hard',
    question: 'Subarrays [3, 27] and [9, 43] are being merged. After placing 3 and 9 into output [3, 9], which two elements are compared next?',
    visualArray: [27, 'vs', 43],
    options: ['3 vs 9', '27 vs 43', '27 vs 9', '3 vs 43'],
    correctIndex: 1,
    explanation: 'Pointer i is now at 27 (Left[1]) and pointer j is at 43 (Right[1]). Therefore, 27 is compared against 43.'
  },
  {
    id: 'quick-1',
    topic: 'Quick Sort',
    difficulty: 'easy',
    question: 'Using Lomuto partitioning on array [9, 3, 7, 1, 6] with the last element as pivot, what is the pivot value?',
    visualArray: [9, 3, 7, 1, 6],
    options: ['9', '3', '7', '6'],
    correctIndex: 3,
    explanation: 'The standard SRM-AP End-Term exam convention uses the last element A[high] as the pivot (here, value 6).'
  },
  {
    id: 'quick-2',
    topic: 'Quick Sort',
    difficulty: 'medium',
    question: 'With pivot = 6 on [9, 3, 7, 1, 6], which values belong strictly in the LESS-THAN-PIVOT left partition?',
    visualArray: ['Pivot = 6'],
    options: ['[9, 7]', '[3, 1]', '[1, 6, 7]', '[9, 3]'],
    correctIndex: 1,
    explanation: 'Only 3 and 1 are strictly less than 6. They are swapped into the lower partition before placing the pivot.'
  },
  {
    id: 'binary-1',
    topic: 'Binary Search',
    difficulty: 'medium',
    question: 'Given sorted array [2, 5, 8, 12, 16, 23, 38] and target 23: what is the FIRST element examined at mid = (0 + 6)/2 = 3?',
    visualArray: [2, 5, 8, 12, 16, 23, 38],
    options: ['8', '12', '16', '23'],
    correctIndex: 1,
    explanation: 'Index 3 contains value 12. Since 23 > 12, the search space halves and eliminates the left half [2, 5, 8, 12].'
  },
  {
    id: 'stack-1',
    topic: 'Stack LIFO',
    difficulty: 'easy',
    question: 'Given sequence: PUSH(10) -> PUSH(20) -> POP() -> PUSH(30). What is the value at TOP of the stack?',
    contextSnippet: 'push(10); push(20); pop(); push(30);',
    options: ['10', '20', '30', 'Empty'],
    correctIndex: 2,
    explanation: '20 was popped, leaving 10. Then 30 was pushed above 10, making 30 the current TOP.'
  },
  {
    id: 'cqueue-1',
    topic: 'Circular Queue',
    difficulty: 'hard',
    question: 'In a Circular Queue of capacity 6 with FRONT = 4 and REAR = 3, what is the current queue status?',
    contextSnippet: '(REAR + 1) % CAPACITY == FRONT',
    options: ['Queue is Empty', 'Queue is Full', 'Underflow occurred', 'Only 1 element present'],
    correctIndex: 1,
    explanation: '(3 + 1) % 6 = 4 == FRONT. The modulo wrap-around condition signifies the circular queue is completely full!'
  }
];

export const InteractiveChallengeMode: React.FC = () => {
  const { submitChallenge, progressData } = useAuth();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [activeQuestions, setActiveQuestions] = useState<ChallengeQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isDaily, setIsDaily] = useState<boolean>(false);

  // Initialize questions based on difficulty or daily challenge
  useEffect(() => {
    startNewChallenge(difficulty, isDaily);
  }, [difficulty, isDaily]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (!isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted]);

  const startNewChallenge = (diff: 'easy' | 'medium' | 'hard', daily: boolean) => {
    let pool = CHALLENGE_BANK.filter(q => (daily ? true : q.difficulty === diff));
    if (daily) {
      // Pick 3 questions for daily sprint
      pool = pool.slice(0, 3);
    } else {
      pool = pool.slice(0, 5);
    }
    setActiveQuestions(pool);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setMistakes([]);
    setIsCompleted(false);
    setTimerSeconds(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const currentQ = activeQuestions[currentQIndex];
    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setMistakes(prev => [
        ...prev,
        {
          question: currentQ.question,
          chosen: currentQ.options[idx],
          correct: currentQ.options[currentQ.correctIndex],
          explanation: currentQ.explanation
        }
      ]);
    }
  };

  const handleNext = async () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Finished
      setIsCompleted(true);
      const totalScore = score + (selectedAnswer === activeQuestions[currentQIndex].correctIndex ? 0 : 0);
      const challengeId = isDaily ? 'daily-challenge-sprint' : `algorithm-challenge-${difficulty}`;
      await submitChallenge(
        challengeId,
        difficulty,
        totalScore,
        activeQuestions.length,
        timerSeconds,
        mistakes
      );
    }
  };

  const currentQ = activeQuestions[currentQIndex];
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Daily Challenge Highlight Card */}
      <div className="bg-linear-to-r from-amber-500 via-rose-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Daily Algorithm Sprint</span>
          </div>
          <h3 className="text-xl font-black">Today's Step Prediction Challenge</h3>
          <p className="text-xs text-amber-100 max-w-md">
            Test your understanding with 3 quick predictive step questions and boost your streak!
          </p>
        </div>

        <button
          onClick={() => {
            setIsDaily(true);
            startNewChallenge('medium', true);
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-2 ${
            isDaily
              ? 'bg-white text-rose-600'
              : 'bg-amber-100 hover:bg-white text-rose-700'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isDaily ? 'Active Daily Sprint' : 'Start Daily Sprint (+45 XP)'}</span>
        </button>
      </div>

      {/* Mode & Difficulty Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Difficulty Tier:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => {
                  setIsDaily(false);
                  setDifficulty(diff);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  !isDaily && difficulty === diff
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Live Timer & Score counter */}
        <div className="flex items-center gap-3 font-mono text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formatTime(timerSeconds)}
          </span>
          <span className="bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
            Score: <strong className="text-amber-600">{score}</strong> / {activeQuestions.length}
          </span>
        </div>
      </div>

      {/* Main Challenge Card */}
      {!isCompleted && currentQ ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {currentQ.topic}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Question {currentQIndex + 1} of {activeQuestions.length}
              </span>
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5" /> +15 XP
            </span>
          </div>

          {/* Question Title */}
          <h4 className="text-lg font-bold text-slate-800 leading-snug">
            {currentQ.question}
          </h4>

          {/* Visual Array / Context Representation if present */}
          {currentQ.visualArray && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 flex-wrap">
              {currentQ.visualArray.map((item, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl font-mono font-bold text-sm shadow-2xs ${
                    item === '|' || item === 'vs'
                      ? 'text-slate-400 text-xs'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {currentQ.contextSnippet && (
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
              {currentQ.contextSnippet}
            </pre>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedAnswer === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;

              let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-700';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                } else if (isChosen && !isCorrectOpt) {
                  btnStyle = 'bg-red-50 border-red-300 text-red-900 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 text-left text-xs font-semibold transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isAnswered && isChosen && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Alert */}
          {isAnswered && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>EXPLANATION:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{currentQIndex < activeQuestions.length - 1 ? 'Next Step' : 'Finish Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : isCompleted ? (
        /* Summary Score Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🏆
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900">Challenge Completed!</h3>
            <p className="text-xs text-slate-500">
              Great work practicing your algorithm step predictions.
            </p>
          </div>

          {/* Score Metrics */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-2xl font-black text-slate-800">
                {score} / {activeQuestions.length}
              </span>
              <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5">Score</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-2xl font-black text-amber-600">
                +{score * 15}
              </span>
              <p className="text-[11px] font-bold text-amber-800 uppercase mt-0.5">XP Earned</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-2xl font-black text-blue-600">
                {formatTime(timerSeconds)}
              </span>
              <p className="text-[11px] font-bold text-blue-800 uppercase mt-0.5">Time Taken</p>
            </div>
          </div>

          {/* Review Mistakes Section */}
          {mistakes.length > 0 && (
            <div className="text-left space-y-3 pt-4 border-t border-slate-100 max-w-xl mx-auto">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Review Mistakes ({mistakes.length}):
              </h5>
              <div className="space-y-2">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{m.question}</p>
                    <p className="text-red-700">Your choice: <span className="line-through">{m.chosen}</span></p>
                    <p className="text-emerald-700 font-bold">Correct answer: {m.correct}</p>
                    <p className="text-slate-600 text-[11px] pt-1">{m.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => startNewChallenge(difficulty, isDaily)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
