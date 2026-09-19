import React, { useState } from 'react';
import { glossaryTerms } from '../../content';
import { BookMarked, Search, Tag, ArrowRight } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('All');

  const filtered = glossaryTerms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.technicalDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnit === 'All' || t.unit.toLowerCase().includes(selectedUnit.toLowerCase());
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5" /> Comprehensive Terminology
            </span>
            <h2 className="text-xl font-bold text-slate-900">Data Structures Glossary</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard definitions, beginner analogies, and code examples for all syllabus concepts.
          </p>
        </div>

        {/* Search & Unit filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter terms..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Units</option>
            <option value="Unit 1">Unit 1</option>
            <option value="Unit 2">Unit 2</option>
            <option value="Unit 3">Unit 3</option>
            <option value="Unit 4">Unit 4</option>
            <option value="Unit 5">Unit 5</option>
          </select>
        </div>
      </div>

      {/* Terms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">{item.term}</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {item.unit}
              </span>
            </div>

            {/* Beginner Friendly */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                Simple Explanation:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {item.simpleDefinition}
              </p>
            </div>

            {/* Technical */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Technical Definition:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.technicalDefinition}
              </p>
            </div>

            {/* Example */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800">
              <span className="text-teal-700 font-bold block mb-0.5 text-[10px] uppercase font-sans">Example:</span>
              {item.example}
            </div>

            {/* Related */}
            {item.relatedTerms.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3 h-3 text-slate-400" />
                {item.relatedTerms.map((rel, rIdx) => (
                  <span key={rIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {rel}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
