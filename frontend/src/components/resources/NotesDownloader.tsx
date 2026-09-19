import React from 'react';
import { Download, FileText, CheckCircle2, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

export const NotesDownloader: React.FC = () => {
  const notePdfs = [
    {
      title: "Unit I: Introduction, Arrays, Stacks & Queues",
      subtitle: "Official SRM University-AP Lecture Slides (57 pages)",
      fileName: "Unit_1_Intro_Arrays_Stack_Queue.pdf",
      size: "4.1 MB",
      badge: "Unit 1",
      color: "border-blue-200 bg-blue-50/30 text-blue-800"
    },
    {
      title: "Unit II: Linked Lists (Singly, Doubly, Circular)",
      subtitle: "Dynamic memory allocation & pointer reassignments (31 pages)",
      fileName: "Unit_2_Linked_Lists.pdf",
      size: "1.4 MB",
      badge: "Unit 2",
      color: "border-teal-200 bg-teal-50/30 text-teal-800"
    },
    {
      title: "Unit III: Trees, Binary Search Trees & AVL",
      subtitle: "Tree terminology, BST traversals & AVL rotations (39 pages)",
      fileName: "Unit_3_Trees_and_AVL.pdf",
      size: "2.7 MB",
      badge: "Unit 3",
      color: "border-pink-200 bg-pink-50/30 text-pink-800"
    },
    {
      title: "Unit IV: Graphs, BFS, DFS & Shortest Path",
      subtitle: "Adjacency representations, traversals & Dijkstra (43 pages)",
      fileName: "Unit_4_Graphs_and_Algorithms.pdf",
      size: "1.7 MB",
      badge: "Unit 4",
      color: "border-orange-200 bg-orange-50/30 text-orange-800"
    },
    {
      title: "Unit V: Searching, Sorting & Hashing",
      subtitle: "Bubble, Quick, Merge sort & collision resolution (47 pages)",
      fileName: "Unit_5_Searching_and_Sorting.pdf",
      size: "1.4 MB",
      badge: "Unit 5",
      color: "border-rose-200 bg-rose-50/30 text-rose-800"
    }
  ];

  const examPdfs = [
    {
      title: "Mid-Term Examination Paper (March 2025)",
      subtitle: "CSE 102 Data Structures original question paper (25 Marks)",
      fileName: "Mid_Term_Exam_March_2025.pdf",
      size: "2.5 MB",
      badge: "Mid Sem Exam"
    },
    {
      title: "End-Term Examination Paper (May 2025)",
      subtitle: "CSE 102 Data Structures comprehensive final paper (50 Marks)",
      fileName: "End_Term_Exam_May_2025.pdf",
      size: "1.6 MB",
      badge: "End Sem Exam"
    },
    {
      title: "Mid-Sem Solved Problems & Infix/Postfix Traces",
      subtitle: "Step-by-step solutions for expression conversions and circular queue",
      fileName: "Mid_Sem_Solved_Sample_Problems.pdf",
      size: "4.0 MB",
      badge: "Solutions"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Department of CSE • SRM University-AP
            </span>
            <h2 className="text-xl font-bold text-slate-900">Download Authentic Course Material</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Download the authentic classroom lecture slides, exam question papers, and revision notes.
          </p>
        </div>
      </div>

      {/* Unit Notes Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Unit-Wise Lecture Slides & Notes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notePdfs.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${doc.color}`}>
                    {doc.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{doc.size}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{doc.subtitle}</p>
              </div>

              <a
                href={`/notes/${doc.fileName}`}
                download={doc.fileName}
                className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Slides PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Papers Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          Previous Year Examination Papers & Solved Keys
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examPdfs.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                    {doc.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{doc.size}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{doc.subtitle}</p>
              </div>

              <a
                href={`/notes/${doc.fileName}`}
                download={doc.fileName}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Exam PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
