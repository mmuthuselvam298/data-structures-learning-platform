import React, { useState } from 'react';
import { ViewMode, VisualizerId } from './types';
import { allUnits } from './content';
import { useProgress } from './store/useProgress';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeView } from './components/home/HomeView';
import { LessonView } from './components/learn/LessonView';
import { CodePlayground } from './components/practice/CodePlayground';
import { QuizEngine } from './components/practice/QuizEngine';
import { ChallengeRunner } from './components/practice/ChallengeRunner';
import { NotesDownloader } from './components/resources/NotesDownloader';
import { GlossaryView } from './components/resources/GlossaryView';
import { ProgressView } from './components/progress/ProgressView';
import { SearchModal } from './components/resources/SearchModal';

// Visualizers
import { StackVisualizer } from './components/visualizers/StackVisualizer';
import { QueueVisualizer } from './components/visualizers/QueueVisualizer';
import { ArrayVisualizer } from './components/visualizers/ArrayVisualizer';
import { LinkedListVisualizer } from './components/visualizers/LinkedListVisualizer';
import { TreeVisualizer } from './components/visualizers/TreeVisualizer';
import { GraphVisualizer } from './components/visualizers/GraphVisualizer';
import { SortingVisualizer } from './components/visualizers/SortingVisualizer';
import { SearchingVisualizer } from './components/visualizers/SearchingVisualizer';
import { HashingVisualizer } from './components/visualizers/HashingVisualizer';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('u1-intro-adt');
  const [selectedVisualizerId, setSelectedVisualizerId] = useState<VisualizerId>('stack');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const { 
    progress, 
    markLessonComplete, 
    markChallengeComplete, 
    markQuizPassed, 
    resetProgress 
  } = useProgress();

  // Find active unit and lesson
  const activeUnit = allUnits.find(u => u.id === selectedUnitId) || allUnits[0];
  const activeLesson = activeUnit.lessons.find(l => l.id === selectedLessonId) || activeUnit.lessons[0];

  const handleSelectUnit = (unitId: number) => {
    setSelectedUnitId(unitId);
    const unit = allUnits.find(u => u.id === unitId);
    if (unit && unit.lessons.length > 0) {
      setSelectedLessonId(unit.lessons[0].id);
    }
    setCurrentView('learn');
  };

  const handleNavigateLesson = (unitId: number, lessonId: string) => {
    setSelectedUnitId(unitId);
    setSelectedLessonId(lessonId);
    setCurrentView('learn');
  };

  const handleNextLesson = () => {
    const currentLessonIdx = activeUnit.lessons.findIndex(l => l.id === activeLesson.id);
    if (currentLessonIdx < activeUnit.lessons.length - 1) {
      setSelectedLessonId(activeUnit.lessons[currentLessonIdx + 1].id);
    } else if (selectedUnitId < allUnits.length) {
      handleSelectUnit(selectedUnitId + 1);
    }
  };

  const renderVisualLabComponent = () => {
    switch (selectedVisualizerId) {
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
      default: return <StackVisualizer />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        selectedUnitId={selectedUnitId}
        onSelectUnit={handleSelectUnit}
        selectedVisualizerId={selectedVisualizerId}
        onSelectVisualizer={setSelectedVisualizerId}
        completedLessons={progress.completedLessons}
        xp={progress.xp}
        streakDays={progress.streakDays}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onSelectView={setCurrentView}
          xp={progress.xp}
          streakDays={progress.streakDays}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1 p-4 sm:p-8">
          {currentView === 'home' && (
            <HomeView
              onStartLearning={() => { handleSelectUnit(1); setCurrentView('learn'); }}
              onOpenVisualizer={(visId) => { setSelectedVisualizerId(visId); setCurrentView('lab'); }}
              onSelectUnit={handleSelectUnit}
              completedLessons={progress.completedLessons}
            />
          )}

          {currentView === 'learn' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Lesson Horizontal Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                {activeUnit.lessons.map((les) => {
                  const isSelected = les.id === activeLesson.id;
                  const isDone = progress.completedLessons.includes(les.id);
                  return (
                    <button
                      key={les.id}
                      onClick={() => setSelectedLessonId(les.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{les.title}</span>
                      {isDone && <span className="text-[10px] text-emerald-300">✓</span>}
                    </button>
                  );
                })}
              </div>

              <LessonView
                lesson={activeLesson}
                onLessonComplete={markLessonComplete}
                isCompleted={progress.completedLessons.includes(activeLesson.id)}
                onNextLesson={handleNextLesson}
              />
            </div>
          )}

          {currentView === 'lab' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Visual Algorithm & Structure Lab</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select any data structure from the sidebar or tabs to inspect state transitions.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['stack', 'circular_queue', 'array', 'linked_list', 'tree_bst', 'graph', 'sorting', 'searching', 'hashing'] as const).map(k => (
                    <button
                      key={k}
                      onClick={() => setSelectedVisualizerId(k)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedVisualizerId === k
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {k === 'circular_queue' ? 'Queue' : k === 'linked_list' ? 'List' : k === 'tree_bst' ? 'Tree' : k}
                    </button>
                  ))}
                </div>
              </div>

              {renderVisualLabComponent()}
            </div>
          )}

          {currentView === 'practice' && (
            <ChallengeRunner
              onOpenVisualizer={(visId) => { setSelectedVisualizerId(visId); setCurrentView('lab'); }}
              onChallengeComplete={markChallengeComplete}
              completedChallenges={progress.completedChallenges}
            />
          )}

          {currentView === 'quiz' && (
            <QuizEngine onQuizPassed={markQuizPassed} />
          )}

          {currentView === 'code' && (
            <CodePlayground />
          )}

          {currentView === 'resources' && (
            <NotesDownloader />
          )}

          {currentView === 'glossary' && (
            <GlossaryView />
          )}

          {currentView === 'progress' && (
            <ProgressView
              progress={progress}
              onResetProgress={resetProgress}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateLesson={handleNavigateLesson}
        onNavigateVisualizer={(visId) => { setSelectedVisualizerId(visId); setCurrentView('lab'); }}
      />
    </div>
  );
}

export default App;
