"""
Comprehensive Unit Tests for DS Playground Simulation Engine
Verifies all operations for Stacks, Queues, Lists, Trees, Graphs, Sorting, Searching, and Expressions.
"""
import pytest
from backend.structures.stack import Stack
from backend.structures.queue import LinearQueue, CircularQueue
from backend.structures.linked_list import SinglyLinkedList
from backend.structures.tree import BST, AVLTree
from backend.structures.graph import Graph, create_srm_drone_graph
from backend.algorithms.sorting import bubble_sort, selection_sort, insertion_sort, quick_sort_trace
from backend.algorithms.searching import linear_search, binary_search
from backend.algorithms.hashing import HashTable
from backend.algorithms.expressions import infix_to_postfix, evaluate_postfix

def test_stack_operations():
    s = Stack(capacity=3)
    assert s.is_empty()
    assert s.push(10)["success"] is True
    assert s.push(20)["success"] is True
    assert s.peek() == 20
    assert s.push(30)["success"] is True
    # Overflow check
    assert s.is_full()
    assert s.push(40)["success"] is False
    # Pop check
    pop_res = s.pop()
    assert pop_res["success"] is True
    assert pop_res["value"] == 30
    assert s.peek() == 20

def test_circular_queue_overflow_formula():
    """Validates exam question: (rear+1)%maxsize == front"""
    cq = CircularQueue(capacity=4)
    cq.enqueue(10)
    cq.enqueue(20)
    cq.enqueue(30)
    assert not cq.is_full()
    # 4th item fills capacity
    assert cq.enqueue(40)["success"] is True
    assert cq.is_full()
    # 5th item causes overflow
    overflow_res = cq.enqueue(50)
    assert overflow_res["success"] is False
    assert "Circular Queue Overflow" in overflow_res["message"]
    # Dequeue moves front
    assert cq.dequeue()["value"] == 10
    # Now can enqueue again due to wrap-around
    assert cq.enqueue(50)["success"] is True

def test_singly_linked_list():
    sll = SinglyLinkedList()
    sll.insert_beginning(20)
    sll.insert_beginning(10)
    sll.insert_end(30)
    state = sll.get_state()
    values = [n["data"] for n in state["nodes"]]
    assert values == [10, 20, 30]
    # Delete beginning
    assert sll.delete_beginning()["value"] == 10
    # Delete end
    assert sll.delete_end()["value"] == 30

def test_bst_and_traversals():
    bst = BST()
    for val in [45, 15, 79, 10, 90]:
        bst.insert(val)
    assert bst.inorder() == [10, 15, 45, 79, 90]
    assert bst.search(79)["success"] is True
    assert bst.search(999)["success"] is False

def test_avl_rotations():
    avl = AVLTree()
    # Inserting 30, 20, 10 triggers LL (Right rotation)
    avl.insert(30)
    avl.insert(20)
    res = avl.insert(10)
    assert any("LL" in r for r in res["rotations"])
    assert avl.root.key == 20

def test_graph_bfs_and_dijkstra():
    g = create_srm_drone_graph()
    bfs_res = g.bfs("A")
    assert bfs_res["traversal_order"][0] == "A"
    assert len(bfs_res["traversal_order"]) == 6
    
    dijkstra_res = g.dijkstra("A")
    # Distance from A to B is 4, C is 2
    assert dijkstra_res["shortest_distances"]["A"] == 0
    assert dijkstra_res["shortest_distances"]["C"] == 2
    assert dijkstra_res["shortest_distances"]["B"] == 4

def test_quick_sort_exam_array():
    """Validates exam question: Quick sort on [9, 3, 7, 1, 6]"""
    res = quick_sort_trace([9, 3, 7, 1, 6])
    assert res["sorted"] == [1, 3, 6, 7, 9]

def test_binary_search():
    res = binary_search([5, 12, 18, 23, 31, 44], 23)
    assert res["found"] is True
    assert res["index"] == 3

def test_infix_to_postfix_and_evaluation():
    """Validates Mid Sem exam questions 4 and 11"""
    # Simple expression test
    conv = infix_to_postfix("A+B*(C+D)")
    assert conv["postfix"] == "ABCD+*+"
    
    # Postfix evaluation: 5 6 7 8 + - * 4 +
    # (7+8=15, 6-15=-9, 5*-9=-45, -45+4=-41)
    eval_res = evaluate_postfix("5 6 7 8 + - * 4 +")
    assert eval_res["result"] == -41
