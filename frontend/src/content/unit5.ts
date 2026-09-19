import { UnitInfo } from '../types';

export const unit5Data: UnitInfo = {
  id: 5,
  title: "Unit V: Searching, Sorting & Hashing Techniques",
  badge: "Unit 5",
  accentColor: "from-pink-500 to-rose-500",
  description: "Linear & Binary Search, Bubble, Selection, Insertion, Quick Sort (pivot partitioning), Merge, Radix, Heap Sort, and Hashing with linear probing.",
  downloadFileName: "Unit_5_Searching_and_Sorting.pdf",
  lessons: [
    {
      id: "u5-searching",
      unitId: 5,
      unitTitle: "Unit V: Searching Techniques",
      title: "Searching: Linear Search vs. Binary Search",
      shortDescription: "Sequential scan O(n) vs. divide-and-conquer interval halving O(log n) on sorted arrays.",
      whatIsIt: "Searching is the algorithmic process of locating the position or existence of a specific target key within a data collection.",
      whyDoWeNeedIt: "Searching through a telephone book or customer database of 1,000,000 records takes 1,000,000 steps with Linear Search, but at most 20 comparisons with Binary Search!",
      realWorldAnalogy: {
        title: "Guessing a Secret Number Between 1 and 100",
        description: "If you guess 1, 2, 3... it takes up to 100 tries (Linear Search). If you guess 50 and hear 'Too High', you instantly eliminate 50 numbers at once, then test 25, cutting the search in half every step (Binary Search).",
        icon: "Search"
      },
      howDoesItWork: [
        "Linear Search: Evaluates `arr[i] == target` from index `0` to `n-1`. Works on unsorted data.",
        "Binary Search Pre-requisite: Array MUST be sorted!",
        "Binary Search Steps: Calculate `mid = (low + high) / 2`.",
        "- If `arr[mid] == target`: Found!",
        "- If `arr[mid] < target`: Search right half by setting `low = mid + 1`.",
        "- If `arr[mid] > target`: Search left half by setting `high = mid - 1`."
      ],
      visualizerId: "searching",
      operations: [
        {
          name: "Linear Search",
          description: "Scans one element at a time from start to finish.",
          timeComplexity: "O(n)",
          cCodeSnippet: "int linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}"
        },
        {
          name: "Binary Search",
          description: "Halves the active search window every comparison.",
          timeComplexity: "O(log n)",
          cCodeSnippet: "int binarySearch(int arr[], int low, int high, int target) {\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>

int binarySearch(int arr[], int low, int high, int target) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {5, 12, 18, 23, 31, 44};
    int n = 6;
    int target = 23;
    int idx = binarySearch(arr, 0, n - 1, target);
    printf("Target %d found at index %d\\n", target, idx);
    return 0;
}`,
      complexity: {
        timeBest: "O(1) if target is at mid",
        timeAverage: "O(log n)",
        timeWorst: "O(log n)",
        space: "O(1) iterative, O(log n) recursive",
        explanation: "Binary search cuts search space by factor of 2 in each iteration."
      },
      commonMistakes: [
        {
          mistake: "Running binary search on an unsorted array",
          whyItHappens: "Binary search logic fundamentally assumes ordering to eliminate halves.",
          solution: "Always sort the array first, or use Linear Search if sorting is not permitted."
        }
      ],
      quizzes: [
        {
          id: "q-u5-1",
          question: "What is the maximum number of comparisons required to search for an element in a sorted array of 1024 elements using Binary Search?",
          type: "complexity",
          options: ["10 comparisons (log2(1024) = 10)", "512 comparisons", "1024 comparisons", "1 comparison"],
          correctIndex: 0,
          explanationWhy: "Since 2^10 = 1024, Binary Search halves the array at most 10 times to either find the target or conclude it is absent.",
          examSource: "SRM AP CSE-102 Unit 5"
        }
      ],
      examQuestions: [
        {
          year: "Mid/End Sem CSE-102",
          marks: 5,
          question: "Compare Linear Search and Binary Search in terms of prerequisites, time complexity, and suitability.",
          solutionOutline: "Linear search: works on any array, O(n) time, best for small or unsorted data. Binary search: requires sorted array, O(log n) time, best for large sorted datasets."
        }
      ]
    },
    {
      id: "u5-sorting",
      unitId: 5,
      unitTitle: "Unit V: Sorting Techniques",
      title: "Sorting: Bubble, Selection, Insertion, Quick & Merge",
      shortDescription: "Visual comparison of sorting mechanisms, pivot partitioning, recursive divide-and-conquer, and End Sem question on A=[9, 3, 7, 1, 6].",
      whatIsIt: "Sorting is the algorithmic arrangement of elements into an ordered sequence (numerical or lexicographical). Internal sorting takes place entirely in RAM.",
      whyDoWeNeedIt: "Searching, database query optimization, graphics rendering, duplicate detection, and computational geometry all require sorted inputs to run efficiently.",
      realWorldAnalogy: {
        title: "Arranging a Hand of Playing Cards",
        description: "Insertion Sort is how people naturally sort playing cards in their hand: you pick the next card and slide it left until it fits between smaller and larger values.",
        icon: "ArrowUpDown"
      },
      howDoesItWork: [
        "Bubble Sort: Compares adjacent elements `A[j]` and `A[j+1]`, swapping if out of order. Largest unsorted element bubbles to end in each pass.",
        "Selection Sort: Finds the minimum element in unsorted portion and swaps it into current index.",
        "Insertion Sort: Inserts current key into already sorted prefix by shifting larger elements right.",
        "Quick Sort (Divide & Conquer): Pick a pivot, partition elements so `< pivot` is left and `> pivot` is right, then recursively sort partitions."
      ],
      visualizerId: "sorting",
      operations: [
        {
          name: "Bubble Sort Pass",
          description: "Compares adjacent pairs and swaps larger elements rightward.",
          timeComplexity: "O(n^2)",
          cCodeSnippet: "for (int i = 0; i < n - 1; i++) {\n    for (int j = 0; j < n - i - 1; j++) {\n        if (a[j] > a[j+1]) swap(&a[j], &a[j+1]);\n    }\n}"
        },
        {
          name: "Quick Sort Partition",
          description: "Rearranges array around pivot element.",
          timeComplexity: "O(n log n) avg",
          cCodeSnippet: "int partition(int a[], int low, int high) {\n    int pivot = a[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (a[j] < pivot) swap(&a[++i], &a[j]);\n    }\n    swap(&a[i+1], &a[high]);\n    return i + 1;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int a[], int low, int high) {
    int pivot = a[high];
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
    int examArray[] = {9, 3, 7, 1, 6};
    quickSort(examArray, 0, 4);
    printf("Sorted: ");
    for(int i = 0; i < 5; i++) printf("%d ", examArray[i]);
    printf("\\n");
    return 0;
}`,
      complexity: {
        timeBest: "O(n log n) for Quick & Merge Sort",
        timeAverage: "O(n log n)",
        timeWorst: "O(n^2) for Quick Sort with poor pivot",
        space: "O(log n) for Quick Sort recursion, O(n) for Merge Sort",
        explanation: "Quick sort averages O(n log n) with in-place swaps, making it exceptionally cache-efficient."
      },
      commonMistakes: [
        {
          mistake: "Assuming Quick Sort is always O(n log n)",
          whyItHappens: "When array is already sorted and first/last element is always chosen as pivot, partition is maximally unbalanced (0 and n-1 elements), resulting in O(n^2) worst case.",
          solution: "Pick randomized pivot or median-of-three to avoid worst-case O(n^2)."
        }
      ],
      quizzes: [
        {
          id: "q-u5-2",
          question: "When applying Quick Sort to array A = [9, 3, 7, 1, 6] with the last element (6) chosen as pivot, what is the state of the array after the first partition step?",
          type: "predict_output",
          options: ["[3, 1, 6, 9, 7]", "[1, 3, 6, 7, 9]", "[9, 7, 6, 3, 1]", "[3, 7, 1, 6, 9]"],
          correctIndex: 0,
          explanationWhy: "Elements smaller than pivot 6 are 3 and 1. They are moved to the left partition: [3, 1]. Pivot 6 is placed at index 2. Elements greater than 6 (9 and 7) stay on the right. Array becomes [3, 1, 6, 9, 7].",
          examSource: "SRM AP End Sem Exam May 2025, Q7b"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "a) Write pseudocode for Quick Sort. Explain pivot selection, partitioning, and best/worst/average time complexities. (5M)\nb) Apply Quick Sort to sort A = [9, 3, 7, 1, 6]. Show intermediate steps, pivot selection (assume last element is pivot), and final sorted array. (5M)",
          solutionOutline: "Pivot=6. Partition: compare 9>6, 3<6 (swap with 9 -> [3, 9, 7, 1]), 7>6, 1<6 (swap with 9 -> [3, 1, 7, 9]). Place pivot 6 at index 2 -> [3, 1, 6, 9, 7]. Recurse on left [3, 1] with pivot 1 -> [1, 3] and right [9, 7] with pivot 7 -> [7, 9]. Final: [1, 3, 6, 7, 9]."
        }
      ]
    },
    {
      id: "u5-hashing",
      unitId: 5,
      unitTitle: "Unit V: Hashing Techniques",
      title: "Hashing: Division Method & Collision Resolution",
      shortDescription: "Hash functions (Division x mod M, Mid-Square, Folding), Collisions, and Linear Probing open addressing.",
      whatIsIt: "Hashing is a technique that maps large keys into small fixed-size indices in a Hash Table using a Hash Function $h(k)$, enabling near-instant $O(1)$ average-case search and insertion.",
      whyDoWeNeedIt: "Even Binary Search requires $O(\log n)$ comparisons. Hashing allows direct $O(1)$ access without traversing or comparing other elements.",
      realWorldAnalogy: {
        title: "Assigned Mailboxes / Lockers with Keys",
        description: "Instead of searching every locker in the building, your badge number maps directly to locker #14. If someone else's coat is already in locker #14 (collision), you walk to the next available empty locker #15 (Linear Probing).",
        icon: "Hash"
      },
      howDoesItWork: [
        "Division Hash Function: `h(k) = k % M`, where `M` is a prime number close to the table size.",
        "Collision: Occurs when two distinct keys produce the same hash index: `h(k1) == h(k2)`.",
        "Linear Probing: If cell `h(k)` is occupied, check `(h(k) + 1) % M`, then `(h(k) + 2) % M`, until an empty slot is found.",
        "Quadratic Probing: Probes at `(h(k) + i^2) % M` to reduce primary clustering."
      ],
      visualizerId: "hashing",
      operations: [
        {
          name: "Hash Insertion with Linear Probing",
          description: "Computes initial hash and probes sequentially if collision occurs.",
          timeComplexity: "O(1) average, O(n) worst",
          cCodeSnippet: "int insert(int table[], int key, int M) {\n    int idx = key % M;\n    while (table[idx] != -1) idx = (idx + 1) % M;\n    table[idx] = key;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define SIZE 10

int table[SIZE];

void init() {
    for (int i = 0; i < SIZE; i++) table[i] = -1;
}

void insert(int key) {
    int idx = key % SIZE;
    int probes = 0;
    while (table[idx] != -1 && probes < SIZE) {
        idx = (idx + 1) % SIZE;
        probes++;
    }
    if (probes == SIZE) printf("Table is full!\\n");
    else {
        table[idx] = key;
        printf("Inserted %d at index %d\\n", key, idx);
    }
}

int main() {
    init();
    insert(12);
    insert(22); // Collision with 12! Probes to index 3
    insert(35);
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(1) when load factor < 0.7",
        timeWorst: "O(n) when severe clustering occurs",
        space: "O(M)",
        explanation: "Hashing provides O(1) constant time lookups assuming a uniform hash distribution."
      },
      commonMistakes: [
        {
          mistake: "Choosing an even number as table size M for Division hashing",
          whyItHappens: "When M is even, even keys always hash to even indices and odd keys to odd indices, causing severe clustering.",
          solution: "Always choose M to be a prime number not close to a power of 2."
        }
      ],
      quizzes: [
        {
          id: "q-u5-3",
          question: "Using the Division Hash function h(k) = k % 10, into which index is key 47 placed if index 7 is already occupied and Linear Probing is used?",
          type: "predict_output",
          options: ["Index 7", "Index 8 ((7 + 1) % 10 = 8)", "Index 0", "Index 4"],
          correctIndex: 1,
          explanationWhy: "h(47) = 47 % 10 = 7. Since index 7 is occupied, linear probing checks the very next slot: (7 + 1) % 10 = index 8.",
          examSource: "SRM AP CSE-102 Unit 5 Slide 45"
        }
      ],
      examQuestions: [
        {
          year: "Mid/End Sem CSE-102",
          marks: 5,
          question: "Explain the Division method of hashing and demonstrate collision resolution using Linear Probing for keys: 1234, 5462 with M = 97.",
          solutionOutline: "Division method: h(k) = k % M. h(1234) = 1234 % 97 = 70. h(5462) = 5462 % 97 = 30. If two keys map to same index, linear probing probes (h(k) + i) % M until an empty slot is located."
        }
      ]
    }
  ]
};
