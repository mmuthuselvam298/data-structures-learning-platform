import { UnitInfo } from '../types';

export const unit2Data: UnitInfo = {
  id: 2,
  title: "Unit II: Linked Lists (Singly, Doubly & Circular)",
  badge: "Unit 2",
  accentColor: "from-teal-500 to-emerald-500",
  description: "Dynamic memory allocation, Singly Linked Lists, Doubly Linked Lists with bidirectional pointers, and Circular Linked Lists with real-world Music Playlist loops.",
  downloadFileName: "Unit_2_Linked_Lists.pdf",
  lessons: [
    {
      id: "u2-singly-linked-list",
      unitId: 2,
      unitTitle: "Unit II: Linked Lists",
      title: "Singly Linked List: Pointers & Operations",
      shortDescription: "Dynamic node allocation with malloc, pointer linking, insertion & deletion at beginning, middle, and end.",
      whatIsIt: "A Singly Linked List is a linear data structure consisting of nodes where each node contains two fields: `data` (stores the element) and `next` (a pointer storing the memory address of the subsequent node).",
      whyDoWeNeedIt: "Arrays suffer from fixed static size (wasted space if too large, overflow if too small) and expensive O(n) element shifting on insertions/deletions. Linked lists grow and shrink dynamically with O(1) head insertions and deletions.",
      realWorldAnalogy: {
        title: "A Scavenger Hunt / Treasure Trail",
        description: "Each clue (node) gives you a prize (data) and a note with the exact address of the next clue (pointer). You cannot jump straight to clue 5 without reading through clues 1 to 4 first.",
        icon: "Link"
      },
      howDoesItWork: [
        "Head Pointer: Points to first node. If `head == NULL`, list is empty.",
        "Last Node: `next` pointer of the final node is always `NULL`.",
        "Insert Beginning: `newNode->next = head; head = newNode;` (O(1)).",
        "Insert End: Traverse to node with `next == NULL`, then `curr->next = newNode;` (O(n))."
      ],
      visualizerId: "linked_list",
      operations: [
        {
          name: "Insert at Beginning",
          description: "Allocates node and updates head pointer in constant time.",
          timeComplexity: "O(1)",
          cCodeSnippet: "struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = val;\nnewNode->next = head;\nhead = newNode;"
        },
        {
          name: "Insert at End",
          description: "Traverses to tail and links new node.",
          timeComplexity: "O(n)",
          cCodeSnippet: "struct Node* temp = head;\nwhile (temp->next != NULL) temp = temp->next;\ntemp->next = newNode;"
        },
        {
          name: "Delete at Beginning",
          description: "Moves head to head->next and frees old node.",
          timeComplexity: "O(1)",
          cCodeSnippet: "struct Node* temp = head;\nhead = head->next;\nfree(temp);"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* insertAtBeginning(struct Node* head, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = head;
    return newNode;
}

void printList(struct Node* head) {
    struct Node* curr = head;
    while (curr != NULL) {
        printf("[%d | •] -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    head = insertAtBeginning(head, 30);
    head = insertAtBeginning(head, 20);
    head = insertAtBeginning(head, 10);
    printList(head);
    return 0;
}`,
      complexity: {
        timeBest: "O(1) insert/delete at head",
        timeWorst: "O(n) insert/delete at end / search",
        space: "O(n)",
        explanation: "Operations at the head are O(1). Accessing arbitrary indices requires linear traversal O(n)."
      },
      commonMistakes: [
        {
          mistake: "Memory leak from not calling free()",
          whyItHappens: "Reassigning head pointer without freeing deleted nodes leaves orphan memory.",
          solution: "Always store `temp = head`, update `head = head->next`, and call `free(temp)`."
        },
        {
          mistake: "Losing list reference on insertion",
          whyItHappens: "Writing `head = newNode` before doing `newNode->next = head` breaks the list.",
          solution: "Always link the new node to the existing chain first, THEN update the head pointer."
        }
      ],
      quizzes: [
        {
          id: "q-u2-1",
          question: "Consider an unsorted singly linked list with only a head pointer. Which of the following operations can be implemented in O(1) time?\nI) Insertion at beginning\nII) Insertion at end\nIII) Deletion of beginning node\nIV) Deletion of last node",
          type: "mcq",
          options: ["I and II", "I and III", "I, II and III", "I, II and IV"],
          correctIndex: 1,
          explanationWhy: "Without a tail pointer, insertion/deletion at the end requires traversing all n nodes to find the last (or second-to-last) node (O(n)). Only operations at the beginning (I and III) are O(1).",
          examSource: "SRM AP Mid-Term Exam March 2025, Q6"
        },
        {
          id: "q-u2-2",
          question: "Consider the recursive function f(p):\nint f(struct item *p) {\n  return ((p == NULL) || (p->next == NULL) || ((p->data <= p->next->data) && f(p->next)));\n}\nWhat does f(p) return 1 for?",
          type: "mcq",
          options: [
            "Not all elements in the list have the same value",
            "The elements in the list are sorted in non-decreasing order of data value",
            "The elements in the list are sorted in non-increasing order of data value",
            "The list contains a cycle"
          ],
          correctIndex: 1,
          explanationWhy: "The condition `p->data <= p->next->data` verifies that each node is less than or equal to its successor, and recurses down the entire list, ensuring non-decreasing sorted order.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q9"
        }
      ],
      examQuestions: [
        {
          year: "Mid Sem 2025",
          marks: 5,
          question: "Write a pseudocode that modifies a singly linked list by moving the last element to the front.",
          solutionOutline: "Traverse to second-to-last node `secLast`. Set `last = secLast->next`. Disconnect by `secLast->next = NULL`. Connect `last->next = head`, and update `head = last`."
        }
      ]
    },
    {
      id: "u2-doubly-linked-list",
      unitId: 2,
      unitTitle: "Unit II: Doubly Linked Lists",
      title: "Doubly Linked List (DLL) & Palindrome Check",
      shortDescription: "Bidirectional traversal with prev and next pointers, node anatomy, palindrome verification, and node counting.",
      whatIsIt: "A Doubly Linked List (DLL) contains nodes with three fields: `prev` pointer (points to previous node), `data`, and `next` pointer (points to following node).",
      whyDoWeNeedIt: "Singly linked lists only allow forward traversal. A DLL allows backward traversal, constant-time deletion if a node pointer is given, and simple palindrome verification.",
      realWorldAnalogy: {
        title: "A Two-Way Metro / Subway Train",
        description: "Each train compartment connects to both the coach ahead and the coach behind. Passengers can walk forward or backward between coaches freely.",
        icon: "ArrowLeftRight"
      },
      howDoesItWork: [
        "Node Anatomy in C: `struct Node { struct Node *prev; int data; struct Node *next; };`",
        "Head node: `prev` is `NULL`.",
        "Tail node: `next` is `NULL`.",
        "Palindrome Check: Set `left = head`, `right = tail`. Compare `left->data == right->data` while moving `left = left->next` and `right = right->prev`."
      ],
      operations: [
        {
          name: "Bidirectional Linking",
          description: "Both next and prev pointers are maintained.",
          timeComplexity: "O(1)",
          cCodeSnippet: "newNode->next = head;\nnewNode->prev = NULL;\nif (head != NULL) head->prev = newNode;\nhead = newNode;"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    struct Node *prev;
    int data;
    struct Node *next;
};

int isPalindrome(struct Node *head) {
    if (!head) return 1;
    struct Node *right = head;
    while (right->next != NULL) right = right->next;
    
    struct Node *left = head;
    while (left != right && left->prev != right) {
        if (left->data != right->data) return 0;
        left = left->next;
        right = right->prev;
    }
    return 1;
}

int main() {
    printf("DLL Palindrome Checker compiled successfully.\\n");
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(n)",
        space: "O(n)",
        explanation: "DLL uses 2 pointers per node, consuming slightly more memory than Singly Linked List, but enables bidirectional traversal."
      },
      commonMistakes: [
        {
          mistake: "Forgetting to update the `prev` pointer of the successor node",
          whyItHappens: "Updating only `next` links leaves the `prev` chain broken.",
          solution: "Whenever doing `curr->next = newNode`, remember `if (newNode->next) newNode->next->prev = newNode`."
        }
      ],
      quizzes: [
        {
          id: "q-u2-3",
          question: "Which of the following is the valid C structure declaration for a Doubly Linked List node?",
          type: "mcq",
          options: [
            "struct node { struct node prev; int data; struct node next; };",
            "struct node* { struct node *prev; int* data; struct node *next; };",
            "struct node { struct node *prev; int data; struct node *next; };",
            "struct node { struct node *prev; struct node *data; struct node *next; };"
          ],
          correctIndex: 2,
          explanationWhy: "Nodes must use self-referential pointers (`struct node *prev` and `struct node *next`) because a struct cannot contain full instances of itself by value in C.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q8"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "Write an algorithm to: a) check whether a doubly linked list is palindrome or not (5M), b) count the number of nodes in a doubly linked list (5M).",
          solutionOutline: "a) Find tail node. Move left pointer from head forward, right pointer from tail backward comparing data. If match until left meets or crosses right, it is a palindrome. b) Count nodes by starting count=0 and looping while curr != NULL."
        }
      ]
    },
    {
      id: "u2-circular-linked-list",
      unitId: 2,
      unitTitle: "Unit II: Circular Linked Lists",
      title: "Circular Linked List (CLL) & Music Playlist",
      shortDescription: "Tail points to head, zero NULL pointers, continuous looping, and playlist music loop implementation.",
      whatIsIt: "In a Circular Linked List (CLL), the last node's `next` pointer does NOT point to NULL; instead, it points back to the first node (`head`), forming a continuous cycle.",
      whyDoWeNeedIt: "Round-robin CPU scheduling, turn-taking multiplayer games, and continuous music/video playlists where the next song after the last track is the first track.",
      realWorldAnalogy: {
        title: "A Carousel / Merry-Go-Round",
        description: "Horses are connected in a continuous circle. There is no 'dead end'. Keep walking forward and you will smoothly return to where you started.",
        icon: "Repeat"
      },
      howDoesItWork: [
        "No NULL: Exactly 0 nodes contain NULL as their next address in a circular linked list!",
        "Traversal condition: Loop continues until `ptr->next == head` rather than `ptr == NULL`.",
        "Music Playlist: Songs are nodes. User can click 'Next' infinitely without encountering a crash or end of list."
      ],
      operations: [
        {
          name: "Continuous Traversal",
          description: "Loops seamlessly from last node back to head.",
          timeComplexity: "O(n)",
          cCodeSnippet: "struct Node *ptr = head;\ndo {\n    printf(\"%d \", ptr->data);\n    ptr = ptr->next;\n} while (ptr != head);"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct SongNode {
    char title[50];
    struct SongNode *next;
};

// Insert song after a given song in a circular playlist
void insertAfterSong(struct SongNode *target, const char* newSongTitle) {
    if (!target) return;
    struct SongNode *newNode = (struct SongNode*)malloc(sizeof(struct SongNode));
    strcpy(newNode->title, newSongTitle);
    newNode->next = target->next;
    target->next = newNode;
}

int main() {
    printf("Circular Music Playlist Engine Ready.\\n");
    return 0;
}`,
      complexity: {
        timeBest: "O(1)",
        timeAverage: "O(n)",
        space: "O(n)",
        explanation: "Insertion after a known node is O(1). Finding a node requires O(n)."
      },
      commonMistakes: [
        {
          mistake: "Infinite loop while traversing circular linked list",
          whyItHappens: "Using `while (curr != NULL)` as termination condition.",
          solution: "Since circular lists have NO NULL pointers, check `while (curr->next != head)` or use a do-while loop."
        }
      ],
      quizzes: [
        {
          id: "q-u2-4",
          question: "In a standard circular linked list of N nodes, how many nodes contain NULL as their address pointer?",
          type: "mcq",
          options: ["0 nodes", "1 node (the head)", "1 node (the tail)", "N nodes"],
          correctIndex: 0,
          explanationWhy: "By definition, the tail node in a circular linked list points back to the head node. Therefore, zero (0) nodes contain NULL.",
          examSource: "SRM AP Mid-Term Exam March 2025, Q10"
        }
      ],
      examQuestions: [
        {
          year: "Mid Sem March 2025",
          marks: 5,
          question: "A single circular linked list is used in a music playlist application. Explain why CLL is better than SLL for playlists, and write pseudocode to insert a new song after a given song.",
          solutionOutline: "CLL enables endless looping without special end-of-list branch checks. Insert: allocate newNode, newNode->next = target->next, target->next = newNode."
        }
      ]
    }
  ]
};
