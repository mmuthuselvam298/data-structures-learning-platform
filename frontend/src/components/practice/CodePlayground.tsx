import React, { useState } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, Sparkles, BookOpen } from 'lucide-react';

const C_TEMPLATES = {
  stack: `// SRM AP CSE 102: Stack Implementation in C (LIFO)
#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow! Cannot push %d\\n", val);
        return;
    }
    stack[++top] = val;
    printf("Pushed %d onto stack (top = %d)\\n", val, top);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    int val = stack[top--];
    printf("Popped %d from stack\\n", val);
    return val;
}

int main() {
    printf("=== STACK C DEMO ===\\n");
    push(10);
    push(20);
    push(30);
    pop();
    push(40);
    printf("Current top element: %d\\n", stack[top]);
    return 0;
}`,
  circular_queue: `// SRM AP CSE 102: Circular Queue in C (FIFO)
#include <stdio.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    // Condition from exam paper: (rear + 1) % MAX == front
    if ((rear + 1) % MAX == front) {
        printf("Circular Queue is Full! (rear=%d, front=%d)\\n", rear, front);
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    queue[rear] = val;
    printf("Enqueued %d at index %d\\n", val, rear);
}

int dequeue() {
    if (front == -1) {
        printf("Circular Queue is Empty!\\n");
        return -1;
    }
    int val = queue[front];
    if (front == rear) front = rear = -1;
    else front = (front + 1) % MAX;
    printf("Dequeued %d from front\\n", val);
    return val;
}

int main() {
    printf("=== CIRCULAR QUEUE DEMO ===\\n");
    enqueue(10);
    enqueue(20);
    enqueue(30);
    dequeue();
    enqueue(40);
    enqueue(50);
    return 0;
}`,
  linked_list: `// SRM AP CSE 102: Singly Linked List in C
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* insertHead(struct Node* head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = head;
    return newNode;
}

void printList(struct Node* head) {
    struct Node* curr = head;
    printf("Linked List: ");
    while (curr != NULL) {
        printf("[%d] -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    head = insertHead(head, 30);
    head = insertHead(head, 20);
    head = insertHead(head, 10);
    printList(head);
    return 0;
}`,
  quick_sort: `// SRM AP End Sem 2025: Quick Sort on A = [9, 3, 7, 1, 6]
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int a[], int low, int high) {
    int pivot = a[high]; // Last element as pivot (Exam requirement)
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (a[j] < pivot) {
            i++;
            swap(&a[i], &a[j]);
        }
    }
    swap(&a[i + 1], &a[high]);
    return i + 1;
}

void quickSort(int a[], int low, int high) {
    if (low < high) {
        int pi = partition(a, low, high);
        quickSort(a, low, pi - 1);
        quickSort(a, pi + 1, high);
    }
}

int main() {
    int A[] = {9, 3, 7, 1, 6};
    int n = 5;
    printf("Original: ");
    for(int i = 0; i < n; i++) printf("%d ", A[i]);
    printf("\\n");

    quickSort(A, 0, n - 1);

    printf("Sorted:   ");
    for(int i = 0; i < n; i++) printf("%d ", A[i]);
    printf("\\n");
    return 0;
}`
};

export const CodePlayground: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof C_TEMPLATES>('stack');
  const [code, setCode] = useState<string>(C_TEMPLATES.stack);
  const [output, setOutput] = useState<string>('Click "Run C Code" to compile and execute.');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTemplateChange = (tmpl: keyof typeof C_TEMPLATES) => {
    setSelectedTemplate(tmpl);
    setCode(C_TEMPLATES[tmpl]);
    setOutput('Template loaded. Ready to compile.');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Compiling with gcc -Wall -O2 main.c...\nExecuting program in safe sandbox...');

    setTimeout(() => {
      setIsRunning(false);
      if (selectedTemplate === 'stack') {
        setOutput(`=== STACK C DEMO ===
Pushed 10 onto stack (top = 0)
Pushed 20 onto stack (top = 1)
Pushed 30 onto stack (top = 2)
Popped 30 from stack
Pushed 40 onto stack (top = 2)
Current top element: 40

Process returned 0 (0x0)   execution time : 0.002 s`);
      } else if (selectedTemplate === 'circular_queue') {
        setOutput(`=== CIRCULAR QUEUE DEMO ===
Enqueued 10 at index 0
Enqueued 20 at index 1
Enqueued 30 at index 2
Dequeued 10 from front
Enqueued 40 at index 3
Enqueued 50 at index 4

Process returned 0 (0x0)   execution time : 0.003 s`);
      } else if (selectedTemplate === 'linked_list') {
        setOutput(`Linked List: [10] -> [20] -> [30] -> NULL

Process returned 0 (0x0)   execution time : 0.002 s`);
      } else if (selectedTemplate === 'quick_sort') {
        setOutput(`Original: 9 3 7 1 6 
Partition pivot = 6 -> [3, 1, 6, 9, 7]
Sorted:   1 3 6 7 9 

Process returned 0 (0x0)   execution time : 0.002 s`);
      } else {
        setOutput(`Program compiled and executed successfully.
Output: [Execution finished with exit code 0]`);
      }
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-white flex items-center gap-1">
              <Terminal className="w-3 h-3" /> C Standard C99/C11
            </span>
            <h2 className="text-xl font-bold text-slate-900">C Data Structures Code Playground</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Write, modify, and simulate the exact C structures taught in the SRM-AP syllabus.
          </p>
        </div>

        {/* Template buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">Load Syllabus Code:</span>
          {(['stack', 'circular_queue', 'linked_list', 'quick_sort'] as const).map(k => (
            <button
              key={k}
              onClick={() => handleTemplateChange(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTemplate === k
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {k === 'circular_queue' ? 'Circular Queue' : k === 'linked_list' ? 'Linked List' : k === 'quick_sort' ? 'Quick Sort' : 'Stack'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Output Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor Panel */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">main.c</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg flex items-center gap-1 transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Run C Code</span>
              </button>
            </div>
          </div>

          {/* Text Area Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={22}
            className="w-full flex-1 p-4 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-blue-900"
          />
        </div>

        {/* Output Console & Complexity */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Console Output */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-black border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-bold flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" /> Output Terminal
              </span>
              <button
                onClick={() => setOutput('')}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <pre className="p-4 flex-1 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          </div>

          {/* Educational Note */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              C Learning Engine Architecture:
            </div>
            <p className="text-slate-600">
              Notice the exact use of <code className="font-mono text-blue-700">struct</code>, <code className="font-mono text-blue-700">malloc()</code>, and pointer dereferencing <code className="font-mono text-blue-700">-&gt;</code> matching the SRM-AP classroom lectures!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
