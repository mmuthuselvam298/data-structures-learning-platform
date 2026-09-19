import { UnitInfo } from '../types';

export const unit1Data: UnitInfo = {
  id: 1,
  title: "Unit I: Linear Data Structures, Stacks & Queues",
  badge: "Unit 1",
  accentColor: "from-blue-500 to-cyan-500",
  description: "Introduction to Data Structures, Abstract Data Types (ADT), Array representations (Polynomials & Sparse Matrices), Stack and Queue operations with LIFO and FIFO.",
  downloadFileName: "Unit_1_Intro_Arrays_Stack_Queue.pdf",
  lessons: [
    {
      id: "u1-intro-adt",
      unitId: 1,
      unitTitle: "Unit I: Introduction to Data Structures & ADT",
      title: "Introduction to Data Structures & ADT",
      shortDescription: "What data structures are, why atomic types fall short, and how Abstract Data Types (ADT) separate declaration from implementation.",
      whatIsIt: "A data structure is an aggregation of atomic data types (like int, float, char) into a well-defined composite format that allows computers to store, organize, and manipulate large volumes of data efficiently.",
      whyDoWeNeedIt: "Storing individual variables (e.g. `int student1, student2, ... student1000`) becomes unmaintainable. We need structures that allow systematic searching, insertion, traversal, and algorithmic efficiency.",
      realWorldAnalogy: {
        title: "A Kitchen Spice Rack vs Scattered Jars",
        description: "Without a spice rack (data structure), spices are scattered randomly. Finding cumin takes O(n) chaotic searching. With a labeled, organized rack, you grab what you need instantly.",
        icon: "Box"
      },
      howDoesItWork: [
        "Atomic Data: Non-divisible entities like integers, floats, characters.",
        "Composite Data / Data Structure: Aggregations of atomic types into cohesive collections (Arrays, Stacks, Queues, Lists).",
        "Abstract Data Type (ADT): A mathematical specification of a set of data items and operations on them, completely independent of any programming language or memory representation."
      ],
      operations: [
        {
          name: "ADT Specification",
          description: "Defines public operations (e.g. init, insert, delete, display) without exposing inner memory buffers.",
          timeComplexity: "O(1)",
          cCodeSnippet: "// Stack ADT Interface\ntypedef struct {\n    int items[MAX];\n    int top;\n} Stack;\n\nvoid push(Stack *s, int val);\nint pop(Stack *s);"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define MAX 100

// Abstract Data Type representation of a Student Record
typedef struct {
    int id;
    char name[50];
    float gpa;
} Student;

int main() {
    Student s1 = {101, "Aarav", 9.2};
    printf("Student ID: %d, Name: %s, GPA: %.1f\\n", s1.id, s1.name, s1.gpa);
    return 0;
}`,
      complexity: {
        timeAverage: "O(1)",
        space: "O(1)",
        explanation: "ADT definition is compile-time overhead; basic record access takes constant time."
      },
      commonMistakes: [
        {
          mistake: "Confusing Data Type with Abstract Data Type (ADT)",
          whyItHappens: "Students think an ADT is a built-in C keyword like int or struct.",
          solution: "An ADT is a conceptual model specifying *what* operations can be performed, while a data structure is the concrete C implementation of *how* it is stored in RAM."
        }
      ],
      quizzes: [
        {
          id: "q-u1-1",
          question: "Why is a Stack considered an Abstract Data Type (ADT)?",
          type: "mcq",
          options: [
            "Because it is an abstract mathematical concept that cannot be implemented in C",
            "Because it defines behavior (LIFO operations like push/pop) independently of whether it is implemented using an array or a linked list",
            "Because it only works with void pointers",
            "Because it requires dynamic memory allocation"
          ],
          correctIndex: 1,
          explanationWhy: "An ADT defines the logical operations and behavior (e.g., Push and Pop adhering to LIFO) without binding to a concrete underlying implementation (array or linked list).",
          examSource: "SRM Mid-Sem Exam 2025"
        }
      ],
      examQuestions: [
        {
          year: "Mid Sem March 2025",
          marks: 5,
          question: "What is an Abstract Data Type (ADT)? Why is a stack an ADT, and why are ADTs used in programming?",
          solutionOutline: "An ADT specifies data declaration and valid operations without implementation details. Stack is an ADT because push/pop can be backed by array or linked list without changing client code."
        }
      ]
    },
    {
      id: "u1-arrays-poly-sparse",
      unitId: 1,
      unitTitle: "Unit I: Linear Data Structures",
      title: "Arrays, Polynomials & Sparse Matrices",
      shortDescription: "Contiguous memory layout, addressing formulas, representation of algebraic polynomials, and 3-tuple sparse matrices.",
      whatIsIt: "An Array is a collection of homogeneous elements stored at contiguous memory locations. In CSE-102, arrays are also applied to store polynomials (coefficient, exponent) and sparse matrices (row, col, value triplets) to save space.",
      whyDoWeNeedIt: "A 1000x1000 matrix with only 10 non-zero elements wastes 99.999% of memory if stored normally. A sparse triplet matrix stores only the non-zero cells, cutting memory from 1,000,000 ints to 30 ints.",
      realWorldAnalogy: {
        title: "A Row of Lockers with Sequential Numbers",
        description: "Every locker has a consecutive index (0, 1, 2...). To open locker 4, you don't search from 0; you calculate base address + 4 * locker_size and jump there in O(1) time.",
        icon: "Grid"
      },
      howDoesItWork: [
        "1D Address: Address of A[i] = BaseAddress + i * sizeof(type)",
        "Polynomial Array: Stored as array of structures with `coeff` and `exp`, e.g. 5x^3 + 2x + 7",
        "Sparse Matrix: Stored as a 3-tuple array [Row, Column, Value], plus metadata row (Total Rows, Total Cols, Total Non-Zero elements)."
      ],
      visualizerId: "array",
      operations: [
        {
          name: "Direct Access",
          description: "Instant address calculation using base address offset.",
          timeComplexity: "O(1)",
          cCodeSnippet: "int val = arr[index];"
        },
        {
          name: "Insertion at Index",
          description: "Requires shifting elements to the right to make room.",
          timeComplexity: "O(n)",
          cCodeSnippet: "for (int i = n - 1; i >= pos; i--) arr[i+1] = arr[i];\narr[pos] = val;\nn++;"
        },
        {
          name: "Sparse Matrix Triplet",
          description: "Store only row, col, val.",
          timeComplexity: "O(non-zeros)",
          cCodeSnippet: "struct Element {\n    int row, col, val;\n};\nstruct Element sparse[MAX];"
        }
      ],
      cImplementationFull: `#include <stdio.h>

typedef struct {
    int row;
    int col;
    int val;
} SparseElement;

int main() {
    // 4x4 matrix with only 3 non-zeros: (0,1)=5, (2,3)=9, (3,0)=7
    SparseElement sparse[4];
    // Metadata: total rows, total cols, count
    sparse[0].row = 4; sparse[0].col = 4; sparse[0].val = 3;
    // Elements
    sparse[1].row = 0; sparse[1].col = 1; sparse[1].val = 5;
    sparse[2].row = 2; sparse[2].col = 3; sparse[2].val = 9;
    sparse[3].row = 3; sparse[3].col = 0; sparse[3].val = 7;

    printf("Sparse Matrix Triplet (Row, Col, Val):\\n");
    for(int i = 0; i <= 3; i++) {
        printf("[%d, %d, %d]\\n", sparse[i].row, sparse[i].col, sparse[i].val);
    }
    return 0;
}`,
      complexity: {
        timeBest: "O(1) access",
        timeWorst: "O(n) insert/delete",
        space: "O(n)",
        explanation: "Random access is O(1). Inserting or deleting requires shifting elements O(n)."
      },
      commonMistakes: [
        {
          mistake: "Out of bounds memory access",
          whyItHappens: "Iterating up to index `n` instead of `n - 1` in C.",
          solution: "Always ensure `0 <= index < size` before reading or writing to `arr[index]`."
        }
      ],
      quizzes: [
        {
          id: "q-u1-2",
          question: "In a 3-tuple sparse matrix representation of size N with K non-zero elements, how many rows are required in the triplet table?",
          type: "mcq",
          options: ["K rows", "K + 1 rows (1 for matrix metadata + K non-zero tuples)", "N * N rows", "2 * K rows"],
          correctIndex: 1,
          explanationWhy: "The first row stores matrix metadata (total rows, total columns, total non-zeros), followed by K rows for the actual non-zero entries.",
          examSource: "SRM AP CSE-102 Slide 24"
        }
      ],
      examQuestions: [
        {
          year: "Mid Sem 2025",
          marks: 5,
          question: "Represent a polynomial 4x^4 + 3x^2 + 5 using array of structures and show how addition of two polynomials is performed.",
          solutionOutline: "Store each term as (coeff, exp) in descending order of exponents. Compare exponents: if equal, add coefficients; otherwise copy term with higher exponent."
        }
      ]
    },
    {
      id: "u1-stack",
      unitId: 1,
      unitTitle: "Unit I: Stacks",
      title: "Stack: LIFO, Push, Pop & Infix-to-Postfix",
      shortDescription: "Last In First Out data structure, implementation using arrays, infix to postfix translation, and postfix expression evaluation.",
      whatIsIt: "A Stack is a linear data structure that operates on the Last-In, First-Out (LIFO) principle. All insertions and deletions happen only at one end, known as the TOP.",
      whyDoWeNeedIt: "Function call stacks, recursion management, browser undo/redo history, syntax parentheses validation `[{()}]`, and compiler arithmetic expression conversion (Infix to Postfix).",
      realWorldAnalogy: {
        title: "A Stack of Cafeteria Plates",
        description: "You clean a plate and place it on top of the stack. When someone eats, they take the plate from the top. The last plate placed is the first plate taken.",
        icon: "Layers"
      },
      howDoesItWork: [
        "TOP pointer tracks index of the topmost element.",
        "Push: Check if `top == MAX - 1` (Overflow). If not, increment `++top` and store value.",
        "Pop: Check if `top == -1` (Underflow). If not, read `stack[top--]`.",
        "Infix to Postfix: Operands go directly to output. Operators are pushed to stack following operator precedence (^ > * / > + -)."
      ],
      visualizerId: "stack",
      operations: [
        {
          name: "Push",
          description: "Inserts element at the top of the stack.",
          timeComplexity: "O(1)",
          cCodeSnippet: "if (top == MAX - 1) printf(\"Overflow!\\n\");\nelse stack[++top] = val;"
        },
        {
          name: "Pop",
          description: "Removes and returns top element.",
          timeComplexity: "O(1)",
          cCodeSnippet: "if (top == -1) printf(\"Underflow!\\n\");\nelse val = stack[top--];"
        },
        {
          name: "Peek",
          description: "Views top element without removing it.",
          timeComplexity: "O(1)",
          cCodeSnippet: "return stack[top];"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow! Cannot push %d\\n", val);
        return;
    }
    stack[++top] = val;
    printf("Pushed %d (top=%d)\\n", val, top);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    int val = stack[top--];
    printf("Popped %d (top=%d)\\n", val, top);
    return val;
}

int main() {
    push(10);
    push(20);
    push(30);
    pop();
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(1)",
        timeWorst: "O(1)",
        space: "O(n)",
        explanation: "Push, Pop, Peek are all strictly O(1) operations because they only modify the top index."
      },
      commonMistakes: [
        {
          mistake: "Checking `top == MAX` instead of `MAX - 1`",
          whyItHappens: "Array indices in C are 0 to MAX-1.",
          solution: "Since top starts at -1, when it reaches `MAX - 1`, the array is completely full."
        }
      ],
      quizzes: [
        {
          id: "q-u1-3",
          question: "Consider an empty stack. Operations performed: push(54); push(52); pop(); push(55); push(62); s = pop(); What is the value of s?",
          type: "predict_output",
          options: ["52", "55", "62", "54"],
          correctIndex: 2,
          explanationWhy: "Trace: push(54) -> [54]; push(52) -> [54, 52]; pop() removes 52 -> [54]; push(55) -> [54, 55]; push(62) -> [54, 55, 62]; s = pop() removes top which is 62.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q2"
        },
        {
          id: "q-u1-4",
          question: "What is the time complexity of a push operation in a stack and getting the minimum element from an unmodified basic stack, respectively?",
          type: "complexity",
          options: ["O(1) and O(n)", "O(log n) and O(n)", "O(n) and O(1)", "O(1) and O(n log n)"],
          correctIndex: 0,
          explanationWhy: "Push only inserts at top in O(1). To find the minimum in a regular stack, you must traverse all N elements, taking O(n).",
          examSource: "SRM AP Mid-Term Exam March 2025, Q5"
        }
      ],
      examQuestions: [
        {
          year: "Mid Sem 2025",
          marks: 5,
          question: "Write pseudocode to check for balanced parentheses in an expression using stack operations. Explain for s='[{()}]'.",
          solutionOutline: "Traverse characters: if opening bracket '(', '{', '[', push onto stack. If closing bracket, verify stack not empty and top matches corresponding opening bracket. At end, stack must be empty."
        },
        {
          year: "Mid Sem 2025",
          marks: 5,
          question: "Evaluate the postfix expression: 5 6 7 8 + - * 4 + using a stack.",
          solutionOutline: "Push operands 5, 6, 7, 8. On '+': 7+8=15 -> stack: [5, 6, 15]. On '-': 6-15 = -9 -> stack: [5, -9]. On '*': 5 * -9 = -45 -> stack: [-45]. Push 4 -> stack: [-45, 4]. On '+': -45 + 4 = -41. Final result = -41."
        }
      ]
    },
    {
      id: "u1-queue",
      unitId: 1,
      unitTitle: "Unit I: Queues",
      title: "Queue: FIFO, Linear Limitation & Circular Queue",
      shortDescription: "First In First Out principle, Enqueue, Dequeue, limitation of linear queue (false overflow), and Circular Queue formula.",
      whatIsIt: "A Queue is a linear data structure following First-In, First-Out (FIFO). Elements are inserted at the REAR and deleted from the FRONT.",
      whyDoWeNeedIt: "CPU task scheduling, printer spooling, I/O buffers, and Breadth-First Search (BFS) in graphs.",
      realWorldAnalogy: {
        title: "People Standing in a Ticket Line",
        description: "The first person in line gets their ticket first and leaves from the front. New arrivals join at the back of the line. Nobody jumps the queue.",
        icon: "Users"
      },
      howDoesItWork: [
        "Linear Queue Limitation: When rear reaches MAX-1, enqueue fails even if items were dequeued from front! This is called 'False Overflow'.",
        "Circular Queue Solution: Wrap around pointers using modulo arithmetic: `rear = (rear + 1) % MAX` and `front = (front + 1) % MAX`.",
        "Full Condition in Circular Queue: `(rear + 1) % MAX == front`.",
        "Empty Condition in Circular Queue: `front == -1`."
      ],
      visualizerId: "circular_queue",
      operations: [
        {
          name: "Enqueue (Circular)",
          description: "Inserts value at rear using circular modulo increment.",
          timeComplexity: "O(1)",
          cCodeSnippet: "if ((rear + 1) % MAX == front) printf(\"Queue Full!\\n\");\nelse {\n    if (front == -1) front = 0;\n    rear = (rear + 1) % MAX;\n    queue[rear] = val;\n}"
        },
        {
          name: "Dequeue (Circular)",
          description: "Removes value from front using circular modulo increment.",
          timeComplexity: "O(1)",
          cCodeSnippet: "if (front == -1) printf(\"Queue Empty!\\n\");\nelse {\n    val = queue[front];\n    if (front == rear) front = rear = -1;\n    else front = (front + 1) % MAX;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define MAX 5

int queue[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % MAX == front) {
        printf("Circular Queue Overflow! Cannot insert %d\\n", val);
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    queue[rear] = val;
    printf("Enqueued %d at index %d (front=%d, rear=%d)\\n", val, rear, front, rear);
}

int dequeue() {
    if (front == -1) {
        printf("Circular Queue Underflow!\\n");
        return -1;
    }
    int val = queue[front];
    printf("Dequeued %d from index %d\\n", val, front);
    if (front == rear) front = rear = -1;
    else front = (front + 1) % MAX;
    return val;
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    dequeue();
    enqueue(40);
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(1)",
        timeWorst: "O(1)",
        space: "O(n)",
        explanation: "Enqueue and Dequeue are O(1) constant time with circular modulo pointer arithmetic."
      },
      commonMistakes: [
        {
          mistake: "Using `(rear + 1) == front` instead of modulo `% MAX`",
          whyItHappens: "Forgetting that rear wraps around from index MAX-1 back to index 0.",
          solution: "Always use `(rear + 1) % MAX == front` to detect full circular queues."
        }
      ],
      quizzes: [
        {
          id: "q-u1-5",
          question: "The overflow condition in a circular queue of size maxsize is represented by:",
          type: "mcq",
          options: [
            "if ((rear + 1) % maxsize == front)",
            "if ((rear + 1) % maxsize = front)",
            "if ((rear) % maxsize - front)",
            "if (rear == maxsize)"
          ],
          correctIndex: 0,
          explanationWhy: "In a circular queue, when the next position after rear (computed by (rear+1)%maxsize) points to front, the buffer is full.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q4"
        },
        {
          id: "q-u1-6",
          question: "Consider an empty queue. Operations: enqueue(21); enqueue(24); dequeue(); enqueue(28); enqueue(32); q = dequeue(); What is q?",
          type: "predict_output",
          options: ["21", "24", "28", "32"],
          correctIndex: 1,
          explanationWhy: "Queue trace: enqueue(21) -> [21]; enqueue(24) -> [21, 24]; first dequeue() removes 21 -> [24]; enqueue(28) -> [24, 28]; enqueue(32) -> [24, 28, 32]; q = dequeue() removes front which is 24.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q2"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "Develop pseudocode to implement a circular queue using arrays and perform the operations for Enqueue, Dequeue, and Display, with proper handling for overflow and underflow conditions.",
          solutionOutline: "Define array queue[MAX], front=-1, rear=-1. Overflow check: (rear+1)%MAX == front. Underflow check: front == -1. Wrap pointers with modulo MAX. Display loops from front to rear handling circular boundary."
        }
      ]
    }
  ]
};
