import React, { useState } from 'react';
import { LessonContent, VisualizerId } from '../../types';
import { 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  Code2, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCode,
  GraduationCap
} from 'lucide-react';
import { StackVisualizer } from '../visualizers/StackVisualizer';
import { QueueVisualizer } from '../visualizers/QueueVisualizer';
import { ArrayVisualizer } from '../visualizers/ArrayVisualizer';
import { LinkedListVisualizer } from '../visualizers/LinkedListVisualizer';
import { TreeVisualizer } from '../visualizers/TreeVisualizer';
import { GraphVisualizer } from '../visualizers/GraphVisualizer';
import { SortingVisualizer } from '../visualizers/SortingVisualizer';
import { SearchingVisualizer } from '../visualizers/SearchingVisualizer';
import { HashingVisualizer } from '../visualizers/HashingVisualizer';

interface LessonViewProps {
  lesson: LessonContent;
  onLessonComplete: (lessonId: string) => void;
  isCompleted: boolean;
  onNextLesson?: () => void;
  onOpenVisualizer?: (visId: VisualizerId) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onLessonComplete,
  isCompleted,
  onNextLesson,
  onOpenVisualizer
}) => {
  const [showFullCode, setShowFullCode] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});

  const renderVisualizer = (visId?: VisualizerId) => {
    switch (visId) {
      case 'stack': return <StackVisualizer />;
      case 'circular_queue':
      case 'queue': return <QueueVisualizer />;
      case 'array': return <ArrayVisualizer />;
      case 'linked_list': return <LinkedListVisualizer />;
      case 'tree_bst':
      case 'tree_avl': return <TreeVisualizer />;
      case 'graph': return <GraphVisualizer />;
      case 'sorting': return <SortingVisualizer />;
      case 'searching': return <SearchingVisualizer />;
      case 'hashing': return <HashingVisualizer />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 tracking-wide">
            {lesson.unitTitle}
          </span>
          <button
            onClick={() => onLessonComplete(lesson.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed ✓ (+40 XP)' : 'Mark Lesson Complete'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
          {lesson.shortDescription}
        </p>
      </div>

      {/* 2. WHAT IS IT? */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>1. What is it?</span>
        </div>
        <p className="text-slate-800 font-semibold text-base sm:text-lg leading-relaxed">
          {lesson.whatIsIt}
        </p>
      </section>

      {/* 3. WHY DO WE NEED IT & REAL WORLD ANALOGY */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>2. Why do we need it?</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {lesson.whyDoWeNeedIt}
          </p>
        </div>

        <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Real-World Analogy</span>
          </div>
          <h4 className="text-sm font-bold text-amber-950">
            {lesson.realWorldAnalogy.title}
          </h4>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            {lesson.realWorldAnalogy.description}
          </p>
        </div>
      </section>

      {/* 4. HOW DOES IT WORK? */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>3. How Does It Work?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.howDoesItWork.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE VISUALIZATION PLAYGROUND */}
      {lesson.visualizerId && (
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>4. Interactive Visual Playground</span>
            </div>
            {onOpenVisualizer && (
              <button
                onClick={() => onOpenVisualizer(lesson.visualizerId!)}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Try {lesson.title.includes('Merge') ? 'Merge Sort' : 'this'} in Visual Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {renderVisualizer(lesson.visualizerId)}
        </section>
      )}

      {/* 6. OPERATIONS & C CODE */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-blue-600" />
          <span>5. Standard Operations & C Code Logic</span>
        </div>

        <div className="space-y-4">
          {lesson.operations.map((op, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{op.name}</h4>
                <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  Time: {op.timeComplexity}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{op.description}</p>
              <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                {op.cCodeSnippet}
              </pre>
            </div>
          ))}
        </div>

        {/* Full C Program toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowFullCode(!showFullCode)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <FileCode className="w-4 h-4 text-slate-600" />
            <span>{showFullCode ? 'Hide Full C Program' : 'View Complete Working C Implementation'}</span>
            {showFullCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFullCode && (
            <pre className="mt-4 p-5 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              {lesson.cImplementationFull}
            </pre>
          )}
        </div>
      </section>

      {/* 7. TIME & SPACE COMPLEXITY */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>6. Time & Space Complexity Breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Best Time</span>
            <span className="text-lg font-black text-emerald-700 font-mono mt-1 block">
              {lesson.complexity.timeBest || 'O(1)'}
            </span>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Average Time</span>
            <span className="text-lg font-black text-blue-700 font-mono mt-1 block">
              {lesson.complexity.timeAverage || 'O(1)'}
            </span>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Worst Time</span>
            <span className="text-lg font-black text-amber-700 font-mono mt-1 block">
              {lesson.complexity.timeWorst || 'O(n)'}
            </span>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Space</span>
            <span className="text-lg font-black text-purple-700 font-mono mt-1 block">
              {lesson.complexity.space || 'O(n)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
          {lesson.complexity.explanation}
        </p>
      </section>

      {/* 8. COMMON MISTAKES */}
      {lesson.commonMistakes.length > 0 && (
        <section className="bg-red-50/40 p-6 sm:p-8 rounded-3xl border border-red-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>7. Common Mistakes Made in Exams</span>
          </div>

          <div className="space-y-3">
            {lesson.commonMistakes.map((m, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-red-200 space-y-2 text-xs">
                <h5 className="font-bold text-red-900">⚠️ {m.mistake}</h5>
                <p className="text-slate-600"><strong className="text-slate-700">Why it happens: </strong>{m.whyItHappens}</p>
                <p className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  💡 Solution: {m.solution}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. EXAM QUESTIONS */}
      {lesson.examQuestions.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>8. Actual SRM-AP Examination Questions</span>
          </div>

          <div className="space-y-3">
            {lesson.examQuestions.map((q, idx) => (
              <div key={idx} className="border border-purple-200 rounded-2xl p-5 bg-purple-50/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                    {q.year} • [{q.marks} Marks]
                  </span>
                </div>
                <p className="font-bold text-slate-800 leading-relaxed pt-1">{q.question}</p>
                <div className="bg-white p-3 rounded-xl border border-purple-200 text-slate-700 mt-2 font-mono leading-relaxed">
                  <span className="font-sans font-bold text-purple-800 block mb-1">Solution Outline:</span>
                  {q.solutionOutline}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. QUIZ */}
      {lesson.quizzes.length > 0 && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>9. Concept Check Quiz</span>
          </div>

          <div className="space-y-4">
            {lesson.quizzes.map((quiz) => {
              const selectedIdx = selectedQuizAnswers[quiz.id];
              const isAnswered = selectedIdx !== undefined;

              return (
                <div key={quiz.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3 text-xs">
                  <h5 className="font-bold text-slate-800 text-sm">{quiz.question}</h5>
                  <div className="space-y-2">
                    {quiz.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === quiz.correctIndex;
                      const isChosen = selectedIdx === oIdx;

                      let style = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";
                      if (isAnswered) {
                        if (isCorrect) style = "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold";
                        else if (isChosen) style = "bg-red-100 border-red-400 text-red-900 font-bold";
                        else style = "bg-white border-slate-200 text-slate-400 opacity-60";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [quiz.id]: oIdx }))}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
                      <strong>Why: </strong>{quiz.explanationWhy}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lesson Complete Button Bar */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">Finished this lesson?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Claim +40 XP and update your course progress roadmap.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLessonComplete(lesson.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
              isCompleted
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Completed ✓' : 'Mark as Mastered (+40 XP)'}</span>
          </button>

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Next Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
