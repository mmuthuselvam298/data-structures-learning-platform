import { UnitInfo } from '../types';

export const unit4Data: UnitInfo = {
  id: 4,
  title: "Unit IV: Graphs, Traversals & Shortest Path",
  badge: "Unit 4",
  accentColor: "from-orange-500 to-amber-500",
  description: "Graph terminology, Adjacency Matrix vs. Adjacency List, BFS (Queue-driven) vs. DFS (Stack-driven), Topological Sorting, and Dijkstra's Algorithm applied to Drone Delivery.",
  downloadFileName: "Unit_4_Graphs_and_Algorithms.pdf",
  lessons: [
    {
      id: "u4-graph-rep-traversals",
      unitId: 4,
      unitTitle: "Unit IV: Graphs & Traversals",
      title: "Graph Representations, BFS & DFS Traversals",
      shortDescription: "Vertices, edges, degree, Adjacency Matrix vs List, Breadth-First Search with Queue, and Depth-First Search with Call Stack.",
      whatIsIt: "A Graph G = (V, E) is a non-linear data structure consisting of a set of vertices (V) and edges (E) connecting pairs of vertices. Graphs can be directed/undirected and unweighted/weighted.",
      whyDoWeNeedIt: "Social networks (friend connections), Google Maps (road intersections and travel times), internet routing (routers forwarding packets), and task dependency management (compilers).",
      realWorldAnalogy: {
        title: "BFS Ripple in a Pond vs DFS Maze Explorer",
        description: "BFS is like a stone thrown in water: ripples expand uniformly outwards in concentric circles level-by-level (using a Queue). DFS is like a cave explorer walking down a tunnel as deep as possible until hitting a dead-end, then backtracking (using a Stack).",
        icon: "Network"
      },
      howDoesItWork: [
        "Adjacency Matrix: 2D array `adj[V][V]` where `adj[u][v] = weight` (or 1). Fast O(1) edge lookup, but uses O(V^2) space.",
        "Adjacency List: Array of linked lists where each vertex has a list of its neighbors. Space efficient O(V + E) for sparse graphs.",
        "BFS Algorithm: Uses a FIFO Queue. Start at root, enqueue start, mark visited. While queue not empty, dequeue front, visit, and enqueue all unvisited neighbors.",
        "DFS Algorithm: Uses a LIFO Stack (or recursion). Start at root, push onto stack, mark visited. Visit adjacent unvisited vertices deeply until dead end, then backtrack."
      ],
      visualizerId: "graph",
      operations: [
        {
          name: "BFS Traversal (Queue)",
          description: "Explores all neighbor vertices at current depth before moving deeper.",
          timeComplexity: "O(V + E)",
          cCodeSnippet: "void bfs(int adj[][MAX], int visited[], int start) {\n    int queue[MAX], front = -1, rear = -1;\n    visited[start] = 1;\n    queue[++rear] = start;\n    while (front != rear) {\n        int u = queue[++front];\n        printf(\"%c \", u + 'A');\n        for (int v = 0; v < MAX; v++) {\n            if (adj[u][v] && !visited[v]) {\n                visited[v] = 1;\n                queue[++rear] = v;\n            }\n        }\n    }\n}"
        },
        {
          name: "DFS Traversal (Stack)",
          description: "Explores as deep as possible along each branch before backtracking.",
          timeComplexity: "O(V + E)",
          cCodeSnippet: "void dfs(int adj[][MAX], int visited[], int u) {\n    visited[u] = 1;\n    printf(\"%c \", u + 'A');\n    for (int v = 0; v < MAX; v++) {\n        if (adj[u][v] && !visited[v]) dfs(adj, visited, v);\n    }\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define MAX 6

int adj[MAX][MAX] = {
    {0, 1, 1, 0, 0, 0},
    {1, 0, 0, 1, 0, 0},
    {1, 0, 0, 1, 1, 0},
    {0, 1, 1, 0, 0, 1},
    {0, 0, 1, 0, 0, 1},
    {0, 0, 0, 1, 1, 0}
};

void bfs(int start) {
    int visited[MAX] = {0};
    int queue[MAX], front = -1, rear = -1;
    visited[start] = 1;
    queue[++rear] = start;
    printf("BFS Traversal: ");
    while(front != rear) {
        int curr = queue[++front];
        printf("%c ", curr + 'A');
        for (int i = 0; i < MAX; i++) {
            if (adj[curr][i] && !visited[i]) {
                visited[i] = 1;
                queue[++rear] = i;
            }
        }
    }
    printf("\\n");
}

int main() {
    bfs(0);
    return 0;
}`,
      complexity: {
        timeBest: "O(V + E) with Adjacency List",
        timeAverage: "O(V + E) or O(V^2) with Matrix",
        space: "O(V) for visited array and queue/stack",
        explanation: "Every vertex and edge is examined at most once during traversal."
      },
      commonMistakes: [
        {
          mistake: "Marking visited when dequeuing instead of enqueuing in BFS",
          whyItHappens: "Causes the same node to be added to the queue multiple times from different neighbors.",
          solution: "Always mark `visited[node] = 1` immediately at the moment it is ENQUEUED into the queue."
        }
      ],
      quizzes: [
        {
          id: "q-u4-1",
          question: "Which data structure is fundamentally utilized to implement Breadth First Search (BFS) and Depth First Search (DFS), respectively?",
          type: "mcq",
          options: ["Queue and Stack", "Stack and Queue", "Priority Queue and Array", "Linked List and Hash Table"],
          correctIndex: 0,
          explanationWhy: "BFS traverses level-by-level using a FIFO Queue. DFS explores deep branches first using a LIFO Stack or recursive call stack.",
          examSource: "SRM AP End Sem Exam May 2025, Q5"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "Write pseudocode for BFS and DFS algorithms. Perform BFS and DFS traversals and explain each step in detail illustrating the contents of the queue (for BFS) and stack (for DFS). (10M)",
          solutionOutline: "Show BFS queue progression at each step [Start] -> [B, C] -> [D, E]... and DFS stack pushes/pops with backtracking details."
        }
      ]
    },
    {
      id: "u4-dijkstra-shortest-path",
      unitId: 4,
      unitTitle: "Unit IV: Shortest Path Algorithms",
      title: "Dijkstra's Algorithm & Medical Drone Delivery",
      shortDescription: "Greedy single-source shortest path, relaxation condition, priority queue, and real-world SRM-AP medical drone dispatch problem.",
      whatIsIt: "Dijkstra's Algorithm is a greedy graph algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.",
      whyDoWeNeedIt: "GPS navigation (finding fastest route in traffic), network packet routing protocols (OSPF), and emergency dispatch logistics.",
      realWorldAnalogy: {
        title: "SRM University-AP Emergency Medical Drone Dispatch",
        description: "A drone dispatch hub at Node A must deliver emergency antivenom/blood to health centers B through F in minimum total travel time. At each step, the dispatcher confirms the reachable clinic with lowest total flight time and relaxes connected corridors.",
        icon: "Send"
      },
      howDoesItWork: [
        "Initialize distances: `dist[source] = 0`, and `dist[v] = ∞` for all other vertices.",
        "Maintain set of unvisited nodes.",
        "Loop: Pick unvisited vertex `u` with minimum confirmed distance `dist[u]`.",
        "Mark `u` as visited.",
        "Relaxation Step: For each neighbor `v` of `u`: `if (dist[u] + weight(u, v) < dist[v]) { dist[v] = dist[u] + weight(u, v); }`",
        "Repeat until all reachable vertices are visited."
      ],
      operations: [
        {
          name: "Edge Relaxation",
          description: "Updates shortest path estimate to neighbor if a shorter path is discovered through u.",
          timeComplexity: "O(1)",
          cCodeSnippet: "if (dist[u] + cost[u][v] < dist[v]) {\n    dist[v] = dist[u] + cost[u][v];\n    parent[v] = u;\n}"
        }
      ],
      cImplementationFull: `#include <stdio.h>
#define INF 9999
#define V 6

int minDistance(int dist[], int visited[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V], visited[V] = {0};
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        if (u == -1) break;
        visited[u] = 1;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printf("SRM AP Drone Travel Times from Hub A:\\n");
    for (int i = 0; i < V; i++) printf("Node %c: %d mins\\n", i + 'A', dist[i]);
}

int main() {
    int graph[V][V] = {
        {0, 4, 2, 0, 0, 0},
        {0, 0, 1, 5, 0, 0},
        {0, 0, 0, 8, 10, 0},
        {0, 0, 0, 0, 2, 6},
        {0, 0, 0, 0, 0, 3},
        {0, 0, 0, 0, 0, 0}
    };
    dijkstra(graph, 0);
    return 0;
}`,
      complexity: {
        timeBest: "O((V + E) log V) with Min-Heap",
        timeAverage: "O(V^2) with simple array",
        space: "O(V) for distance and parent arrays",
        explanation: "Dijkstra visits each vertex and relaxes its incident edges."
      },
      commonMistakes: [
        {
          mistake: "Applying Dijkstra to graphs with negative edge weights",
          whyItHappens: "Dijkstra's greedy assumption assumes once a node is marked visited with min distance, no future path can reduce it. Negative edges violate this.",
          solution: "Use the Bellman-Ford algorithm when negative edge weights are present."
        }
      ],
      quizzes: [
        {
          id: "q-u4-2",
          question: "Under what condition does the Relaxation step in Dijkstra's algorithm update the distance to vertex v?",
          type: "mcq",
          options: [
            "if (dist[u] + weight(u, v) < dist[v])",
            "if (dist[u] + weight(u, v) > dist[v])",
            "if (dist[u] == dist[v])",
            "if (weight(u, v) < 0)"
          ],
          correctIndex: 0,
          explanationWhy: "Relaxation updates dist[v] only if traveling to u and taking edge (u, v) yields a strictly smaller total cost than the previously known shortest route to v.",
          examSource: "SRM AP End Sem May 2025"
        }
      ],
      examQuestions: [
        {
          year: "End Sem May 2025",
          marks: 10,
          question: "SRM University-AP has launched an emergency medical drone delivery system connecting health centers (Nodes A to F). Central dispatch hub is at Node A. Using Dijkstra's algorithm, find the shortest time from Node A to all remaining nodes. (10M)",
          solutionOutline: "Corridors: A->B (4), A->C (2), B->C (1), B->D (5), C->D (8), C->E (10), D->E (2), D->F (6), E->F (3). Start at A: dist[A]=0. Visit C (cost 2). Path to B is 4. Path to D via B is 4+5=9, etc. Final shortest times: A=0, B=4, C=2, D=9, E=11, F=14 mins."
        }
      ]
    }
  ]
};
