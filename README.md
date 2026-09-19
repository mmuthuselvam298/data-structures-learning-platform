# DS Playground — Interactive Data Structures Learning Platform

> *"See how data structures actually work."*

A modern, vibrant, and interactive educational web platform built for college students studying **Data Structures in C**. Built strictly and faithfully around the official **SRM University-AP (CSE 102: Data Structures)** curriculum, lecture notes, and examination papers.

---

## 🌟 Visual Theme & Design Philosophy

- **Vibrant, energetic, and clean**: Bright warm canvas (`#FFFDF8`) with crisp white cards (`#FFFFFF`) and vibrant accent palettes (Electric Blue, Bright Cyan, Turquoise, Purple, Hot Pink, Orange, Emerald Green).
- **No boring static slides**: Do not just explain a data structure — **make it move!**
- **Student-centric**: Focuses on **C** as the target examination and systems programming language, powered by an internal **Python simulation and state transition engine**.

---

## 📚 Curriculum Structure (Faithful to SRM-AP CSE 102)

| Unit | Title | Core Topics Covered | Interactive Playground |
| :--- | :--- | :--- | :--- |
| **Unit I** | **Linear Data Structures, Stacks & Queues** | Abstract Data Types (ADT), Array addressing formula, Polynomial representation, Sparse Matrix 3-tuple representation, Stack (LIFO: Push, Pop, Peek, IsEmpty, IsFull), Infix-to-Postfix conversion, Postfix evaluation, Balanced Parentheses, Linear Queue false overflow limitation, and Circular Queue (`(rear + 1) % MAX == front`). | **Stack Visualizer**, **Circular Queue Simulator**, **Array & Sparse Matrix Lab** |
| **Unit II** | **Linked Lists** | Singly Linked List (node allocation with `malloc`, `free`, insert/delete at head, middle, tail), Doubly Linked List (bidirectional traversal, palindrome checking), Circular Linked List (continuous loop music playlist application from Mid Sem exam). | **Linked List Visualizer** (SLL, DLL, CLL modes) |
| **Unit III** | **Trees, Binary Search Trees & AVL** | Tree terminology (root, leaf, height, depth), Complete Binary Tree sequential array index mapping (`2k+1`, `2k+2`, `(k-1)/2`), Binary Search Tree (BST) insertion, deletion, search, Traversals (Inorder, Preorder, Postorder, Level-order), and AVL Tree self-balancing with Balance Factors (`{-1, 0, +1}`) and 4 Rotations (LL, RR, LR, RL). | **Tree & AVL Visualizer** |
| **Unit IV** | **Graphs & Shortest Path** | Graph terminology (directed/undirected, weighted), Adjacency Matrix vs. Adjacency List representations, Breadth-First Search (BFS) with FIFO Queue tracking, Depth-First Search (DFS) with LIFO Call Stack tracking, and Dijkstra's Algorithm (featuring the authentic SRM-AP Emergency Medical Drone Dispatch problem from the End Sem exam!). | **Graph Visualizer** (BFS Queue, DFS Stack, Dijkstra Drone Route) |
| **Unit V** | **Searching, Sorting & Hashing** | Linear Search vs Binary Search interval halving, Sorting Algorithms: Bubble Sort, Selection Sort, Insertion Sort, Quick Sort (pivot selection and partitioning on `A = [9, 3, 7, 1, 6]` from End Sem exam), Merge Sort, Radix Sort, and Hashing techniques (Division method `h(k) = k % M` with Linear Probing collision resolution). | **Sorting Visualizer**, **Searching Visualizer**, **Hashing Visualizer** |

---

## 🚀 Key Features

1. **Interactive Visual Labs**:
   - **Stack**: Animated element insertion from above, pop removal, peek highlight, infix-to-postfix step table, postfix evaluator.
   - **Queue**: Demonstrates linear false overflow vs circular queue modulo wrap-around.
   - **Array & Matrices**: Animated shifting on insert/delete, algebraic polynomial representations, and 3-tuple sparse matrix tables.
   - **Linked List**: Visual node blocks with `[Prev | Data | Next]` and arrows reconnecting dynamically without faking pointer logic.
   - **Trees & AVL**: SVG tree hierarchy, path highlighting, traversals, and live balance factors with rotation logging.
   - **Graphs**: Live inspection of the algorithm's internal data structure (Queue in BFS, Stack in DFS) and Dijkstra shortest path routing.
   - **Sorting**: Multi-algorithm step-by-step animator with speed slider, swap/comparison tallies, and exam presets.
   - **Searching**: Visualizes search space elimination in Binary Search vs sequential scans.
   - **Hashing**: Bucket inspection with division formulas and probe sequences.
2. **Standard 10-Part Lesson Sequence**:
   Every lesson follows: *1. What is it? 2. Why do we need it? (with real-world visual analogy) 3. How does it work? 4. Interactive visualizer 5. Operations & C code 6. Complete C program 7. Time & space complexity 8. Hands-on challenge 9. Common mistakes 10. Actual SRM-AP exam questions*.
3. **C Code Playground**:
   - In-browser code editor with syntax highlighting and preloaded syllabus templates (Stack, Circular Queue, Linked List, Quick Sort).
   - Safe simulation sandbox showing compiler output.
4. **Unit Quizzes & Real Exam Questions**:
   - Question bank derived directly from Mid-Term (March 2025) and End-Term (May 2025) exam papers.
   - Detailed educational explanations of **WHY** the answer is correct or incorrect.
5. **Interactive Practice Challenges**:
   - Complete tasks in the simulators (e.g. "Build stack [10, 20, 30]", "Trigger circular queue wrap-around", "Dispatch Dijkstra drones").
6. **Download Authentic Course Materials**:
   - Direct download links for all original SRM University-AP lecture slides (Units 1–5), solved sample problems, and examination papers.
7. **Personal Gamification**:
   - XP system, daily streak, topic mastery badges (*Stack Explorer*, *Queue Master*, *Pointer Pioneer*, *Tree Explorer*, *Graph Navigator*, *Sorting Wizard*, *DSA Detective*).
8. **DSA Glossary & ⌘K Course Search**:
   - Instant search across all syllabus concepts, terminology, and visualizers.

---

## 🛠️ Architecture & Tech Stack

```
Data Structures Web/
├── backend/                        # Python Simulation & API Engine
│   ├── structures/                 # Stack, Queue, LinkedList, Tree, AVL, Graph
│   ├── algorithms/                 # Sorting, Searching, Infix/Postfix, Hashing, Dijkstra
│   ├── api/                        # FastAPI simulation endpoints
│   ├── tests/                      # Automated pytest test suite (100% passing)
│   └── main.py                     # Backend server entry point
├── frontend/                       # Modern React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── visualizers/        # Interactive visualizer components
│   │   │   ├── layout/             # Sidebar, Header, Navigation
│   │   │   ├── practice/           # CodePlayground, QuizEngine, ChallengeRunner
│   │   │   ├── resources/          # NotesDownloader, GlossaryView, SearchModal
│   │   │   └── home/               # HomeView & Course Roadmap
│   │   ├── content/                # Units 1-5 structured curriculum data
│   │   ├── store/                  # LocalStorage user progress & XP store
│   │   └── types/                  # TypeScript domain interfaces
│   ├── public/notes/               # Authentic course lecture PDFs & exam papers
│   └── vite.config.ts
└── README.md
```

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, Lucide React, Canvas-Confetti.
- **Backend Simulation Engine**: Python 3, FastAPI, Uvicorn, Pydantic, Pytest.

---

## 🏃 Running Locally

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Backend Simulation Engine
```bash
# From repository root
pip install fastapi uvicorn pytest pydantic

# Run unit tests
PYTHONPATH=. pytest backend/tests/ -v

# Start FastAPI backend (port 8000)
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend Application
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server (port 5173)
npm run dev

# Or build for production
npm run build
```

Open your browser at: `http://localhost:5173/`

---

## 🧪 Testing Summary

- **Backend Pytest**:
  - `test_stack_operations` (PASSED)
  - `test_circular_queue_overflow_formula` (PASSED)
  - `test_singly_linked_list` (PASSED)
  - `test_bst_and_traversals` (PASSED)
  - `test_avl_rotations` (PASSED)
  - `test_graph_bfs_and_dijkstra` (PASSED)
  - `test_quick_sort_exam_array` (PASSED)
  - `test_binary_search` (PASSED)
  - `test_infix_to_postfix_and_evaluation` (PASSED)
- **Frontend TypeScript Build**: Clean production bundle generated with zero errors.

---

## 🎓 Academic Attribution

Course curriculum, lecture materials, and exam questions are based on:
- **Course**: CSE 102 — Data Structures
- **Institution**: Department of Computer Science & Engineering, SRM University-AP, Andhra Pradesh
- **Faculty Slides**: Dr. Elakkiya E, Asst. Professor, Dept. of CSE
- **Standard Reference Texts**: Richard F. Gilberg & Behrouz A. Forouzan, Aaron M. Tenenbaum, Reema Thareja.
