"""
Graph Implementations and Traversal Engines
Syllabus: Unit-IV (Graphs: Graph terminology, Representation, BFS, DFS, Shortest path Dijkstra)
Includes SRM AP End Sem Exam Question: Emergency Medical Drone Delivery from Node A
"""
from typing import List, Dict, Any, Tuple
import heapq

class Graph:
    def __init__(self, is_directed: bool = False):
        self.is_directed = is_directed
        self.nodes: List[str] = []
        self.adjacency_list: Dict[str, List[Tuple[str, int]]] = {}

    def add_node(self, node: str) -> bool:
        if node not in self.nodes:
            self.nodes.append(node)
            self.adjacency_list[node] = []
            return True
        return False

    def add_edge(self, u: str, v: str, weight: int = 1) -> None:
        self.add_node(u)
        self.add_node(v)
        self.adjacency_list[u].append((v, weight))
        if not self.is_directed:
            self.adjacency_list[v].append((u, weight))

    def get_adjacency_matrix(self) -> Dict[str, Any]:
        size = len(self.nodes)
        matrix = [[0] * size for _ in range(size)]
        node_to_idx = {n: i for i, n in enumerate(self.nodes)}

        for u in self.nodes:
            for v, w in self.adjacency_list[u]:
                matrix[node_to_idx[u]][node_to_idx[v]] = w

        return {
            "nodes": self.nodes,
            "matrix": matrix
        }

    def bfs(self, start_node: str) -> Dict[str, Any]:
        """Breadth First Search recording intermediate queue and visited states at each step"""
        if start_node not in self.nodes:
            return {"error": f"Node {start_node} not in graph"}

        visited = []
        queue = [start_node]
        steps = []

        steps.append({
            "step": 0,
            "current_node": start_node,
            "action": f"Initialize BFS. Enqueue start node {start_node}.",
            "queue": list(queue),
            "visited": list(visited)
        })

        while queue:
            curr = queue.pop(0)
            if curr not in visited:
                visited.append(curr)
                # get unvisited neighbors
                neighbors = [v for v, _ in sorted(self.adjacency_list[curr], key=lambda x: x[0])]
                enqueued_this_step = []
                for nbr in neighbors:
                    if nbr not in visited and nbr not in queue:
                        queue.append(nbr)
                        enqueued_this_step.append(nbr)

                steps.append({
                    "step": len(steps),
                    "current_node": curr,
                    "action": f"Dequeued {curr}. Visited. " + (f"Enqueued neighbors: {', '.join(enqueued_this_step)}" if enqueued_this_step else "No new neighbors to enqueue."),
                    "queue": list(queue),
                    "visited": list(visited)
                })

        return {
            "algorithm": "BFS",
            "start_node": start_node,
            "traversal_order": visited,
            "steps": steps,
            "data_structure_used": "Queue (FIFO)"
        }

    def dfs(self, start_node: str) -> Dict[str, Any]:
        """Depth First Search recording intermediate stack and visited states at each step"""
        if start_node not in self.nodes:
            return {"error": f"Node {start_node} not in graph"}

        visited = []
        stack = [start_node]
        steps = []

        steps.append({
            "step": 0,
            "current_node": start_node,
            "action": f"Initialize DFS. Push start node {start_node} onto call stack.",
            "stack": list(stack),
            "visited": list(visited)
        })

        while stack:
            curr = stack.pop()
            if curr not in visited:
                visited.append(curr)
                # push unvisited neighbors in reverse for lexicographic exploration
                neighbors = [v for v, _ in sorted(self.adjacency_list[curr], key=lambda x: x[0], reverse=True)]
                pushed = []
                for nbr in neighbors:
                    if nbr not in visited and nbr not in stack:
                        stack.append(nbr)
                        pushed.append(nbr)

                steps.append({
                    "step": len(steps),
                    "current_node": curr,
                    "action": f"Popped {curr} from stack. Visited. " + (f"Pushed unvisited neighbors: {', '.join(reversed(pushed))}" if pushed else "Backtracking..."),
                    "stack": list(stack),
                    "visited": list(visited)
                })

        return {
            "algorithm": "DFS",
            "start_node": start_node,
            "traversal_order": visited,
            "steps": steps,
            "data_structure_used": "Stack / Call-Stack (LIFO)"
        }

    def dijkstra(self, start_node: str) -> Dict[str, Any]:
        """Dijkstra's Algorithm - step by step calculation"""
        distances = {n: float('inf') for n in self.nodes}
        previous = {n: None for n in self.nodes}
        distances[start_node] = 0
        pq = [(0, start_node)]
        visited = set()
        steps = []

        while pq:
            d, u = heapq.heappop(pq)
            if u in visited:
                continue
            visited.add(u)

            steps.append({
                "step": len(steps) + 1,
                "selected_vertex": u,
                "current_cost": d,
                "distances": {k: (v if v != float('inf') else "∞") for k, v in distances.items()},
                "visited": list(visited),
                "action": f"Selected vertex {u} with minimum confirmed cost {d}."
            })

            for v, weight in self.adjacency_list[u]:
                if v not in visited:
                    new_dist = d + weight
                    if new_dist < distances[v]:
                        old_d = distances[v]
                        distances[v] = new_dist
                        previous[v] = u
                        heapq.heappush(pq, (new_dist, v))
                        steps.append({
                            "step": len(steps) + 1,
                            "selected_vertex": u,
                            "relaxing_edge": f"Edge ({u} -> {v}, weight {weight})",
                            "action": f"Relaxed edge ({u}->{v}). Updated distance to {v} from {old_d if old_d != float('inf') else '∞'} down to {new_dist}.",
                            "distances": {k: (val if val != float('inf') else "∞") for k, val in distances.items()},
                            "visited": list(visited)
                        })

        return {
            "algorithm": "Dijkstra's Shortest Path",
            "source": start_node,
            "shortest_distances": {k: (v if v != float('inf') else None) for k, v in distances.items()},
            "steps": steps
        }


def create_srm_drone_graph() -> Graph:
    """Creates the SRM AP Emergency Medical Drone Delivery graph from End Sem exam"""
    g = Graph(is_directed=True)
    g.add_edge("A", "B", 4)
    g.add_edge("A", "C", 2)
    g.add_edge("B", "C", 1)
    g.add_edge("B", "D", 5)
    g.add_edge("C", "D", 8)
    g.add_edge("C", "E", 10)
    g.add_edge("D", "E", 2)
    g.add_edge("D", "F", 6)
    g.add_edge("E", "F", 3)
    return g
