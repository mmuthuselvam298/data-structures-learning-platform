import React, { useState, useEffect } from 'react';
import { allUnits } from '../../content';
import { VisualizerId, ViewMode } from '../../types';
import { Search, X, ArrowRight, FlaskConical, BookOpen } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLesson: (unitId: number, lessonId: string) => void;
  onNavigateVisualizer: (visId: VisualizerId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateLesson,
  onNavigateVisualizer
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search lessons and visualizers
  const matchedLessons = allUnits.flatMap(u => 
    u.lessons
      .filter(l => 
        l.title.toLowerCase().includes(query.toLowerCase()) ||
        l.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        l.whatIsIt.toLowerCase().includes(query.toLowerCase())
      )
      .map(l => ({ ...l, unitName: u.badge }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, concepts, structures (e.g. stack, circular queue, BST, Dijkstra)..."
            className="flex-1 text-sm bg-transparent focus:outline-none text-slate-900 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {matchedLessons.length > 0 ? (
            matchedLessons.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateLesson(item.unitId, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {item.unitName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.shortDescription}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
              </button>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching topics found for "{query}". Try "stack", "tree", "dijkstra", or "sort".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
