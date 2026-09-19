import { UnitInfo, GlossaryTerm, Challenge } from '../types';
import { unit1Data } from './unit1';
import { unit2Data } from './unit2';
import { unit3Data } from './unit3';
import { unit4Data } from './unit4';
import { unit5Data } from './unit5';

export const allUnits: UnitInfo[] = [
  unit1Data,
  unit2Data,
  unit3Data,
  unit4Data,
  unit5Data
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Abstract Data Type (ADT)",
    unit: "Unit 1",
    simpleDefinition: "A blueprint specifying what a data structure can do without specifying how it is coded in C.",
    technicalDefinition: "A mathematical model for data types where a data type is defined by its behavior (semantics) from the point of view of a user of the data, specifically in terms of possible values, possible operations on data of this type, and the behavior of these operations.",
    example: "Stack ADT defines push() and pop() whether backed by an array or a linked list.",
    relatedTerms: ["Stack", "Queue", "Data Structure"]
  },
  {
    term: "Sparse Matrix",
    unit: "Unit 1",
    simpleDefinition: "A matrix where most numbers are zeroes, stored as a compact table of (row, column, value) triplets.",
    technicalDefinition: "A 2D matrix in which the number of zero-valued elements is significantly greater than non-zero elements. Stored using 3-tuple representation to save memory.",
    example: "A 100x100 matrix with only 5 non-zero entries stored in 6 rows instead of 10,000 cells.",
    relatedTerms: ["Array ADT", "Polynomial Representation"]
  },
  {
    term: "LIFO (Last In, First Out)",
    unit: "Unit 1",
    simpleDefinition: "The last item added is the first one to be removed (like a stack of plates).",
    technicalDefinition: "An ordering policy where the most recently inserted item is the first element accessed or removed.",
    example: "Pushing 10 then 20; popping removes 20 first.",
    relatedTerms: ["Stack", "Push", "Pop"]
  },
  {
    term: "FIFO (First In, First Out)",
    unit: "Unit 1",
    simpleDefinition: "The first item added is the first one removed (like a line of people).",
    technicalDefinition: "An ordering policy where elements are serviced in the exact chronological sequence of their arrival.",
    example: "Enqueue 10, then 20; dequeue removes 10 first.",
    relatedTerms: ["Queue", "Circular Queue", "Enqueue", "Dequeue"]
  },
  {
    term: "Circular Queue",
    unit: "Unit 1",
    simpleDefinition: "A queue where the last position connects back to the first position, eliminating false overflow.",
    technicalDefinition: "A linear data structure in which the operations are performed based on FIFO principle and the last position is connected back to the first position to make a circle using modulo arithmetic.",
    example: "(rear + 1) % MAX == front indicates queue full.",
    relatedTerms: ["Queue", "Modulo Arithmetic", "Buffer"]
  },
  {
    term: "Doubly Linked List (DLL)",
    unit: "Unit 2",
    simpleDefinition: "A chain of nodes where each node has arrows pointing both forward and backward.",
    technicalDefinition: "A linked data structure consisting of a set of sequentially linked records called nodes. Each node contains three fields: two link fields (references to previous and next nodes) and one data field.",
    example: "struct node { struct node *prev; int data; struct node *next; };",
    relatedTerms: ["Singly Linked List", "Pointers", "Palindrome"]
  },
  {
    term: "Circular Linked List",
    unit: "Unit 2",
    simpleDefinition: "A linked list where the last node points back to the first node instead of NULL.",
    technicalDefinition: "A sequence of elements in which every node has a successor. The last node contains the pointer to the first node, meaning zero nodes contain NULL.",
    example: "Continuous loop music playlist where Next track after the last song is song #1.",
    relatedTerms: ["Music Playlist", "Singly Linked List"]
  },
  {
    term: "Binary Search Tree (BST)",
    unit: "Unit 3",
    simpleDefinition: "A tree where smaller items go to the left and larger items go to the right.",
    technicalDefinition: "A node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node's key. The right subtree contains only nodes with keys greater than the node's key.",
    example: "Inorder traversal of a BST always yields sorted order.",
    relatedTerms: ["Binary Tree", "Inorder Traversal", "AVL Tree"]
  },
  {
    term: "AVL Tree",
    unit: "Unit 3",
    simpleDefinition: "A self-balancing tree that rotates itself whenever one branch becomes too long.",
    technicalDefinition: "A self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one. Balance Factor = Height(Left) - Height(Right) in {-1, 0, +1}.",
    example: "LL, RR, LR, RL rotations restore balance in O(1) time.",
    relatedTerms: ["Balance Factor", "BST", "Rotations"]
  },
  {
    term: "Breadth-First Search (BFS)",
    unit: "Unit 4",
    simpleDefinition: "Exploring a graph layer-by-layer like ripples in a pond using a Queue.",
    technicalDefinition: "An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth prior to moving on to nodes at the next depth level using a FIFO Queue.",
    example: "Used for finding shortest path in unweighted graphs.",
    relatedTerms: ["Queue", "DFS", "Graph Traversal"]
  },
  {
    term: "Depth-First Search (DFS)",
    unit: "Unit 4",
    simpleDefinition: "Exploring as deep as possible down one path before backtracking using a Stack.",
    technicalDefinition: "An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node and explores as far as possible along each branch before backtracking using a LIFO Stack or recursion.",
    example: "Used for cycle detection and topological sorting.",
    relatedTerms: ["Stack", "Recursion", "Graph Traversal"]
  },
  {
    term: "Dijkstra's Algorithm",
    unit: "Unit 4",
    simpleDefinition: "A method to find the quickest route between locations in a weighted map.",
    technicalDefinition: "An algorithm for finding the shortest paths between nodes in a weighted graph with non-negative edge weights using greedy vertex selection and edge relaxation.",
    example: "SRM AP medical drone delivery from Node A to clinics B, C, D, E, F.",
    relatedTerms: ["Shortest Path", "Greedy Algorithm", "Relaxation"]
  },
  {
    term: "Quick Sort",
    unit: "Unit 5",
    simpleDefinition: "Picks a pivot number, moves smaller numbers left and larger numbers right, then repeats.",
    technicalDefinition: "A divide-and-conquer algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.",
    example: "Sorting [9, 3, 7, 1, 6] around pivot 6 partitions array into [3, 1, 6, 9, 7].",
    relatedTerms: ["Partitioning", "Divide and Conquer", "Merge Sort"]
  },
  {
    term: "Linear Probing",
    unit: "Unit 5",
    simpleDefinition: "When a locker is already occupied, you check the next locker (+1, +2...) until you find an empty one.",
    technicalDefinition: "A collision handling scheme in open addressed hash tables where each cell of a hash table is probed sequentially until an empty slot is found: (hash(key) + i) % M.",
    example: "If index 7 is full, check index 8, 9, 0...",
    relatedTerms: ["Hashing", "Division Method", "Collisions"]
  }
];

export const courseChallenges: Challenge[] = [
  {
    id: "ch-stack-build",
    title: "Stack Builder: LIFO Verification",
    visualizerId: "stack",
    description: "Build a stack containing values [10, 20, 30] from bottom to top, then inspect the top.",
    taskGoal: "Push 10, then 20, then 30 onto the stack.",
    instructions: [
      "Input 10 and click Push.",
      "Input 20 and click Push.",
      "Input 30 and click Push.",
      "Click 'Check Solution' once all 3 items are stacked."
    ],
    validationCheck: (_, state) => {
      const arr = state?.state || [];
      if (arr.length === 3 && arr[0] === 10 && arr[1] === 20 && arr[2] === 30) {
        return { success: true, feedback: "Awesome! You built a LIFO stack where 30 is at the top." };
      }
      return { success: false, feedback: `Current stack has ${arr.length} elements: [${arr.join(', ')}]. Goal is [10, 20, 30].` };
    },
    hint: "Remember: The first element pushed goes to the bottom of the stack.",
    xpReward: 50
  },
  {
    id: "ch-queue-circular-overflow",
    title: "Circular Queue: Trigger Wrap-around",
    visualizerId: "circular_queue",
    description: "Enqueue elements until full, dequeue twice, then enqueue another item to observe circular index wrap-around.",
    taskGoal: "Demonstrate that circular queues reuse vacant slots without false overflow.",
    instructions: [
      "Enqueue 10, 20, 30, 40, 50.",
      "Dequeue two elements (10 and 20).",
      "Enqueue 60 and observe rear wrapping around to index 0 or 1!"
    ],
    validationCheck: (history) => {
      const hasEnq = history.some(h => h.operation === 'enqueue');
      const hasDeq = history.some(h => h.operation === 'dequeue');
      const hasWrap = history.some(h => h.operation === 'enqueue' && h.rear < h.front);
      if (hasEnq && hasDeq && hasWrap) {
        return { success: true, feedback: "Excellent! You successfully triggered circular pointer wrap-around!" };
      }
      return { success: false, feedback: "Keep going: fill the queue, dequeue from front, and enqueue a new value to trigger wrap-around." };
    },
    hint: "Modulo arithmetic (rear + 1) % MAX allows the pointer to wrap from the end of the array back to 0.",
    xpReward: 60,
    examSource: "SRM AP Mid Sem 2025"
  },
  {
    id: "ch-bst-exam-sequence",
    title: "BST Constructor: Exam Sequence",
    visualizerId: "tree_bst",
    description: "Insert the first 5 numbers from the SRM-AP End Sem exam: 45, 36, 76, 23, 89 into the BST.",
    taskGoal: "Construct the exam BST structure.",
    instructions: [
      "Insert 45 as the root.",
      "Insert 36 (goes left of 45).",
      "Insert 76 (goes right of 45).",
      "Insert 23 (goes left of 36).",
      "Insert 89 (goes right of 76)."
    ],
    validationCheck: (history) => {
      const inserts = history.filter(h => h.operation === 'insert').map(h => Number(h.key));
      const needed = [45, 36, 76, 23, 89];
      const allPresent = needed.every(n => inserts.includes(n));
      if (allPresent) {
        return { success: true, feedback: "Terrific! You built the exact BST requested in Question 3 of the End Term exam!" };
      }
      return { success: false, feedback: `Inserted so far: [${inserts.join(', ')}]. You need: 45, 36, 76, 23, 89.` };
    },
    hint: "Values smaller than a node branch left; values greater branch right.",
    xpReward: 75,
    examSource: "SRM AP End Sem May 2025"
  },
  {
    id: "ch-dijkstra-drone",
    title: "Medical Drone Dispatch: Dijkstra Shortest Route",
    visualizerId: "graph",
    description: "Run Dijkstra's algorithm on the SRM-AP emergency medical drone network from Central Dispatch Hub A.",
    taskGoal: "Determine shortest flight times from Hub A to all clinics B, C, D, E, F.",
    instructions: [
      "Select Start Vertex 'A'.",
      "Click 'Run Dijkstra Shortest Path'.",
      "Observe step-by-step relaxation of corridors."
    ],
    validationCheck: (history) => {
      const ranDijkstra = history.some(h => h.algorithm?.includes("Dijkstra") || h.action?.includes("Dijkstra"));
      if (ranDijkstra) {
        return { success: true, feedback: "Mission accomplished! Drones dispatched with optimal shortest times (C=2m, B=4m, D=9m, E=11m, F=14m)!" };
      }
      return { success: false, feedback: "Click 'Run Dijkstra' starting at Node A." };
    },
    hint: "Dijkstra always picks the unvisited vertex with minimal cumulative travel cost.",
    xpReward: 80,
    examSource: "SRM AP End Sem May 2025 Q6"
  },
  {
    id: "ch-sorting-exam-array",
    title: "Quick Sort: Partitioning A = [9, 3, 7, 1, 6]",
    visualizerId: "sorting",
    description: "Sort the exact array from Question 7 of the End Term exam and observe pivot 6 partitioning elements.",
    taskGoal: "Execute Quick Sort on [9, 3, 7, 1, 6].",
    instructions: [
      "Select Quick Sort from the algorithm menu.",
      "Input or load the Exam Array: 9, 3, 7, 1, 6.",
      "Run the algorithm in step-by-step or play mode."
    ],
    validationCheck: (history) => {
      const sorted = history.some(h => h.algorithm === "Quick Sort" && h.swapped !== undefined);
      if (sorted) {
        return { success: true, feedback: "Splendid! You witnessed the exact partition and pivot placement from the End Sem exam!" };
      }
      return { success: false, feedback: "Select Quick Sort and run the simulation on [9, 3, 7, 1, 6]." };
    },
    hint: "Watch how elements < 6 move to the left and elements > 6 stay on the right.",
    xpReward: 70,
    examSource: "SRM AP End Sem May 2025 Q7"
  }
];
