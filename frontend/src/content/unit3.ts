import { UnitInfo } from '../types';

export const unit3Data: UnitInfo = {
  id: 3,
  title: "Unit III: Trees, Binary Search Trees & AVL Trees",
  badge: "Unit 3",
  accentColor: "from-purple-500 to-pink-500",
  description: "Hierarchical data structures, Tree terminology, Binary Trees, Binary Search Trees (BST), AVL self-balancing rotations, Expression Trees, and Array representations of Complete Binary Trees.",
  downloadFileName: "Unit_3_Trees_and_AVL.pdf",
  lessons: [
    {
      id: "u3-tree-bst",
      unitId: 3,
      unitTitle: "Unit III: Trees & BST",
      title: "Trees Terminology & Binary Search Tree (BST)",
      shortDescription: "Root, internal, leaf, height, depth, BST property, insertion, search, deletion, and 4 traversal orders (Pre, In, Post, Level).",
      whatIsIt: "A Tree is a non-linear hierarchical data structure consisting of nodes connected by directed or undirected edges. A Binary Search Tree (BST) is a binary tree where for every node X: all keys in X's left subtree are strictly smaller than X.key, and all keys in X's right subtree are strictly greater than X.key.",
      whyDoWeNeedIt: "Arrays offer O(1) access but O(n) insertion. Linked lists offer O(1) insertion but O(n) search. A balanced BST gives the best of both worlds: O(log n) search, insertion, and deletion!",
      realWorldAnalogy: {
        title: "A Company Organization Chart or File Folder Hierarchy",
        description: "The CEO (Root) oversees Vice Presidents (Internal Nodes), who supervise Team Leads, who manage Individual Contributors (Leaves). Each file directory branches out into subfolders.",
        icon: "FolderTree"
      },
      howDoesItWork: [
        "Inorder Traversal (Left, Root, Right): Always outputs BST keys in strictly ASCENDING sorted order!",
        "Preorder Traversal (Root, Left, Right): Useful for copying or cloning a tree hierarchy.",
        "Postorder Traversal (Left, Right, Root): Useful for bottom-up node deletion or expression evaluation.",
        "Level Order Traversal: Breadth-first visit level-by-level using a FIFO Queue."
      ],
      visualizerId: "tree_bst",
      operations: [
        {
          name: "BST Insert",
          description: "Compares key with current node and moves left if smaller, right if larger.",
          timeComplexity: "O(log n) avg, O(n) worst",
          cCodeSnippet: "struct Node* insert(struct Node* root, int key) {\n    if (root == NULL) return createNode(key);\n    if (key < root->data) root->left = insert(root->left, key);\n    else if (key > root->data) root->right = insert(root->right, key);\n    return root;\n}"
        },
        {
          name: "Inorder Traversal",
          description: "Visits Left subtree, Root, then Right subtree.",
          timeComplexity: "O(n)",
          cCodeSnippet: "void inorder(struct Node* root) {\n    if (root != NULL) {\n        inorder(root->left);\n        printf(\"%d \", root->data);\n        inorder(root->right);\n    }\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node* createNode(int key) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = key;
    n->left = n->right = NULL;
    return n;
}

struct Node* insert(struct Node* root, int key) {
    if (root == NULL) return createNode(key);
    if (key < root->data) root->left = insert(root->left, key);
    else if (key > root->data) root->right = insert(root->right, key);
    return root;
}

void inorder(struct Node* root) {
    if (root) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node* root = NULL;
    int examKeys[] = {45, 36, 76, 23, 89, 115, 98, 39, 41, 56, 69, 48};
    for(int i = 0; i < 12; i++) root = insert(root, examKeys[i]);
    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
      complexity: {
        timeBest: "O(log n) when tree is balanced",
        timeAverage: "O(log n)",
        timeWorst: "O(n) skewed degenerate tree (like a linked list)",
        space: "O(h) where h is tree height",
        explanation: "In balanced trees, height is log2(n). In degenerate trees, height is n."
      },
      commonMistakes: [
        {
          mistake: "Inserting sorted numbers into a naive BST",
          whyItHappens: "Inserting 1, 2, 3, 4, 5 creates a right-skewed tree of height 5, degrading search to O(n).",
          solution: "Use self-balancing AVL trees or Red-Black trees to guarantee O(log n) height."
        }
      ],
      quizzes: [
        {
          id: "q-u3-1",
          question: "Which tree traversal of a Binary Search Tree always produces the keys in non-decreasing sorted order?",
          type: "mcq",
          options: ["Preorder", "Inorder", "Postorder", "Level-order"],
          correctIndex: 1,
          explanationWhy: "Inorder traversal visits Left subtree (keys < root), then the Root, then the Right subtree (keys > root). By definition of BST, this produces strictly sorted output.",
          examSource: "SRM AP CSE-102 Unit 3"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "What is a Binary Search Tree (BST)? Make a BST for the following sequence of numbers: 45, 36, 76, 23, 89, 115, 98, 39, 41, 56, 69, 48. Traverse the tree in Pre-order, In-order and Post-order. (10M)",
          solutionOutline: "Root is 45. 36<45 goes left; 76>45 goes right; 23<36 goes left; 89>76 goes right, etc. Inorder yields sorted array: 23, 36, 39, 41, 45, 48, 56, 69, 76, 89, 98, 115."
        }
      ]
    },
    {
      id: "u3-avl-tree",
      unitId: 3,
      unitTitle: "Unit III: AVL Trees",
      title: "AVL Trees: Balance Factors & 4 Rotations",
      shortDescription: "Self-balancing binary search trees, Balance Factor calculation (Height Left - Height Right), and LL, RR, LR, RL rotations.",
      whatIsIt: "An AVL Tree (named after inventors Adelson-Velsky and Landis) is a self-balancing Binary Search Tree where the difference between heights of left and right subtrees for ANY node (Balance Factor = Height(Left) - Height(Right)) is strictly within {-1, 0, +1}.",
      whyDoWeNeedIt: "Standard BSTs degrade to O(n) linked lists when data is inserted in sorted order. AVL trees guarantee height is always bounded by ~1.44 * log2(n), ensuring strict O(log n) worst-case time for search, insertion, and deletion.",
      realWorldAnalogy: {
        title: "A Two-Pan Weight Balance Scale",
        description: "If one pan gets too heavy by more than 1 unit, the scale tilts precariously. You immediately redistribute weights (perform a rotation) to bring the scales back to harmony.",
        icon: "Scale"
      },
      howDoesItWork: [
        "Balance Factor: `BF(node) = Height(left_subtree) - Height(right_subtree)`.",
        "Imbalance occurs when BF becomes +2 or -2.",
        "1. LL Imbalance (BF=+2, insertion in Left of Left): Solved by Single Right Rotation.",
        "2. RR Imbalance (BF=-2, insertion in Right of Right): Solved by Single Left Rotation.",
        "3. LR Imbalance (BF=+2, insertion in Right of Left): Solved by Double Rotation (Left rotate child, then Right rotate node).",
        "4. RL Imbalance (BF=-2, insertion in Left of Right): Solved by Double Rotation (Right rotate child, then Left rotate node)."
      ],
      visualizerId: "tree_avl",
      operations: [
        {
          name: "Single Right Rotation (LL)",
          description: "Right rotates root around its left child.",
          timeComplexity: "O(1)",
          cCodeSnippet: "struct Node* rightRotate(struct Node* y) {\n    struct Node* x = y->left;\n    struct Node* T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}"
        },
        {
          name: "Single Left Rotation (RR)",
          description: "Left rotates root around its right child.",
          timeComplexity: "O(1)",
          cCodeSnippet: "struct Node* leftRotate(struct Node* x) {\n    struct Node* y = x->right;\n    struct Node* T2 = y->left;\n    y->left = x;\n    x->right = T2;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    return y;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left, *right;
    int height;
};

int height(struct Node *N) {
    if (N == NULL) return 0;
    return N->height;
}

int max(int a, int b) { return (a > b) ? a : b; }

int getBalance(struct Node *N) {
    if (N == NULL) return 0;
    return height(N->left) - height(N->right);
}

int main() {
    printf("AVL Self-Balancing Engine initialized.\\n");
    return 0;
}`,
      complexity: {
        timeBest: "O(log n)",
        timeAverage: "O(log n)",
        timeWorst: "O(log n) guaranteed!",
        space: "O(n)",
        explanation: "Rotations take O(1) pointer updates. Traversal along height is O(log n), so all operations are guaranteed O(log n)."
      },
      commonMistakes: [
        {
          mistake: "Computing balance factor as right minus left instead of left minus right",
          whyItHappens: "Different textbooks use opposite sign conventions.",
          solution: "In the SRM AP CSE-102 curriculum, `Balance Factor = Height(Left) - Height(Right)`. BF > +1 means Left-heavy, BF < -1 means Right-heavy."
        }
      ],
      quizzes: [
        {
          id: "q-u3-2",
          question: "When inserting keys 30, 20, 10 into an empty AVL tree in that order, what type of rotation is required to restore balance?",
          type: "mcq",
          options: ["Left-Left (Single Right Rotation at 30)", "Right-Right (Single Left Rotation at 30)", "Left-Right Rotation", "Right-Left Rotation"],
          correctIndex: 0,
          explanationWhy: "20 is inserted as left child of 30, and 10 is inserted as left child of 20. Node 30 gets BF = +2, and child 20 has BF = +1 (LL case). A single Right Rotation at 30 lifts 20 as root with children 10 and 30.",
          examSource: "SRM AP End Sem May 2025"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "Give an example where AVL performs better than regular BST. Construct AVL tree for: 21, 26, 30, 9, 4, 14, 28, 18, 15, 10, 2, 3, 7. Delete node 28 and reconstruct. Compare time complexities.",
          solutionOutline: "AVL tree keeps height bounded to O(log n) even for sorted inputs where BST degrades to O(n). Inserting 21, 26, 30 triggers RR rotation (left rotate 21). Delete 28 and rebalance with rotations."
        }
      ]
    },
    {
      id: "u3-complete-tree-array",
      unitId: 3,
      unitTitle: "Unit III: Complete Binary Trees & Array Representation",
      title: "Complete Binary Tree & Array Mapping (2k+1, 2k+2)",
      shortDescription: "Zero-pointer tree storage in sequential arrays, parent/child index arithmetic, and introduction to Binary Heaps.",
      whatIsIt: "A Complete Binary Tree is a binary tree where all levels except possibly the last are completely filled, and all leaf nodes in the last level are as far left as possible. This property allows storing the tree directly in an array without any pointer overhead.",
      whyDoWeNeedIt: "Pointers consume 8 bytes each on 64-bit systems. An array representation of a complete binary tree uses zero pointer memory and provides blazing fast cache-friendly traversal via pure arithmetic.",
      realWorldAnalogy: {
        title: "House Numbers on a Planned Street Grid",
        description: "Instead of following GPS directions from house to house, you use a simple formula: House #k's left neighbour is at #2k+1, right neighbour at #2k+2, and parent at #(k-1)/2.",
        icon: "Binary"
      },
      howDoesItWork: [
        "Root node is placed at array index 0.",
        "For any node stored at index `k`:",
        "- Left Child Index = `2 * k + 1`",
        "- Right Child Index = `2 * k + 2`",
        "- Parent Node Index = `(k - 1) / 2` (integer division)"
      ],
      operations: [
        {
          name: "Find Left Child",
          description: "Calculates array index using index arithmetic.",
          timeComplexity: "O(1)",
          cCodeSnippet: "int leftChildIdx = 2 * k + 1;"
        },
        {
          name: "Find Parent",
          description: "Calculates array index of parent.",
          timeComplexity: "O(1)",
          cCodeSnippet: "int parentIdx = (k - 1) / 2;"
        }
      ],
      cImplementationFull: `#include <stdio.h>

int main() {
    // Complete Binary Tree array: [Root: 10, Left: 20, Right: 30, LL: 40, LR: 50]
    int tree[] = {10, 20, 30, 40, 50};
    int n = 5;
    for (int k = 0; k < n; k++) {
        int left = 2 * k + 1;
        int right = 2 * k + 2;
        printf("Node [%d]: Left=%s, Right=%s\\n", 
            tree[k], 
            (left < n) ? "exists" : "NULL", 
            (right < n) ? "exists" : "NULL");
    }
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(1)",
        space: "O(n) contiguous array with 0 pointer overhead",
        explanation: "Finding parents and children is O(1) bitwise/arithmetic operations."
      },
      commonMistakes: [
        {
          mistake: "Using 1-based indexing formula for 0-based array in C",
          whyItHappens: "Some math textbooks use index 1 (where left=2k, right=2k+1).",
          solution: "In C, arrays start at index 0, so left child is ALWAYS `2*k + 1` and right child is `2*k + 2`."
        }
      ],
      quizzes: [
        {
          id: "q-u3-3",
          question: "If a node in a 0-indexed complete binary tree array is at index 4, at what index is its left child located?",
          type: "mcq",
          options: ["8", "9 (2 * 4 + 1)", "10", "11"],
          correctIndex: 1,
          explanationWhy: "Left child index = 2 * k + 1 = 2 * 4 + 1 = 9.",
          examSource: "SRM AP CSE-102 Unit 3 Slide 39"
        }
      ],
      examQuestions: [
        {
          year: "Mid/End Sem CSE-102",
          marks: 5,
          question: "Explain the array representation of a Complete Binary Tree with formulas for parent, left child, and right child.",
          solutionOutline: "Root at index 0. For node at index k: Left child = 2k+1, Right child = 2k+2, Parent = (k-1)/2. Traversal corresponds to Level Order."
        }
      ]
    }
  ]
};
