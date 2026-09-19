"""
FastAPI Simulation API Routes
Provides interactive simulation execution for Stacks, Queues, Lists, Trees, Graphs, Sorting, Searching, and Expressions.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any

from backend.structures.stack import Stack
from backend.structures.queue import LinearQueue, CircularQueue
from backend.structures.linked_list import SinglyLinkedList
from backend.structures.tree import BST, AVLTree
from backend.structures.graph import Graph, create_srm_drone_graph
from backend.algorithms.sorting import bubble_sort, selection_sort, insertion_sort, quick_sort_trace
from backend.algorithms.searching import linear_search, binary_search
from backend.algorithms.hashing import HashTable
from backend.algorithms.expressions import infix_to_postfix, evaluate_postfix

router = APIRouter(prefix="/api")

# In-memory singletons for live session interaction
stack_instance = Stack(capacity=8)
linear_queue_instance = LinearQueue(capacity=6)
circular_queue_instance = CircularQueue(capacity=6)
singly_list_instance = SinglyLinkedList()
bst_instance = BST()
avl_instance = AVLTree()
hash_instance = HashTable(size=10)

class OperationRequest(BaseModel):
    value: Optional[Any] = None
    position: Optional[int] = None

class ExpressionRequest(BaseModel):
    expression: str

class SortRequest(BaseModel):
    array: List[int]

class SearchRequest(BaseModel):
    array: List[int]
    target: int

# Stack Routes
@router.post("/stack/push")
def stack_push(req: OperationRequest):
    return stack_instance.push(req.value)

@router.post("/stack/pop")
def stack_pop():
    return stack_instance.pop()

@router.get("/stack/state")
def stack_state():
    return stack_instance.get_state()

@router.post("/stack/clear")
def stack_clear():
    return stack_instance.clear()

# Circular Queue Routes
@router.post("/queue/circular/enqueue")
def cqueue_enqueue(req: OperationRequest):
    return circular_queue_instance.enqueue(req.value)

@router.post("/queue/circular/dequeue")
def cqueue_dequeue():
    return circular_queue_instance.dequeue()

@router.get("/queue/circular/state")
def cqueue_state():
    return circular_queue_instance.get_state()

# Linked List Routes
@router.post("/linked-list/insert-beginning")
def list_insert_beg(req: OperationRequest):
    return singly_list_instance.insert_beginning(req.value)

@router.post("/linked-list/insert-end")
def list_insert_end(req: OperationRequest):
    return singly_list_instance.insert_end(req.value)

@router.post("/linked-list/delete-beginning")
def list_del_beg():
    return singly_list_instance.delete_beginning()

@router.post("/linked-list/delete-end")
def list_del_end():
    return singly_list_instance.delete_end()

@router.get("/linked-list/state")
def list_state():
    return singly_list_instance.get_state()

# Tree & AVL Routes
@router.post("/tree/bst/insert")
def bst_insert(req: OperationRequest):
    return bst_instance.insert(int(req.value))

@router.post("/tree/bst/search")
def bst_search(req: OperationRequest):
    return bst_instance.search(int(req.value))

@router.post("/tree/avl/insert")
def avl_insert(req: OperationRequest):
    return avl_instance.insert(int(req.value))

# Graph Routes (SRM Medical Drone Delivery)
@router.get("/graph/drone-delivery")
def drone_delivery_dijkstra():
    g = create_srm_drone_graph()
    return g.dijkstra("A")

# Algorithms
@router.post("/sort/bubble")
def run_bubble_sort(req: SortRequest):
    return bubble_sort(req.array)

@router.post("/sort/quick")
def run_quick_sort(req: SortRequest):
    return quick_sort_trace(req.array)

@router.post("/search/binary")
def run_binary_search(req: SearchRequest):
    return binary_search(req.array, req.target)

@router.post("/expression/infix-to-postfix")
def run_infix_to_postfix(req: ExpressionRequest):
    return infix_to_postfix(req.expression)

@router.post("/expression/evaluate-postfix")
def run_evaluate_postfix(req: ExpressionRequest):
    return evaluate_postfix(req.expression)
