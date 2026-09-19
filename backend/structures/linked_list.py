"""
Linked List Implementations and Simulation Engine
Syllabus: Unit-II (Linked lists: Single linked lists, implementation and operations, Double linked list and circular list)
"""
from typing import List, Optional, Dict, Any

class SinglyNode:
    def __init__(self, data: Any, node_id: int):
        self.id = node_id
        self.data = data
        self.next: Optional['SinglyNode'] = None

class SinglyLinkedList:
    def __init__(self):
        self.head: Optional[SinglyNode] = None
        self._next_id = 1
        self.history: List[Dict[str, Any]] = []

    def _to_list(self) -> List[Dict[str, Any]]:
        nodes = []
        curr = self.head
        while curr:
            nodes.append({
                "id": curr.id,
                "data": curr.data,
                "next_id": curr.next.id if curr.next else None
            })
            curr = curr.next
        return nodes

    def insert_beginning(self, data: Any) -> Dict[str, Any]:
        node = SinglyNode(data, self._next_id)
        self._next_id += 1
        node.next = self.head
        self.head = node
        res = {
            "operation": "insert_beginning",
            "success": True,
            "value": data,
            "message": f"Created new node [{data}] and set its next pointer to old head, updating head to new node.",
            "nodes": self._to_list(),
            "time_complexity": "O(1)",
            "c_code": "newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = value;\nnewNode->next = head;\nhead = newNode;"
        }
        self.history.append(res)
        return res

    def insert_end(self, data: Any) -> Dict[str, Any]:
        node = SinglyNode(data, self._next_id)
        self._next_id += 1
        if not self.head:
            self.head = node
            msg = f"List was empty. Head now points to new node [{data}]."
        else:
            curr = self.head
            while curr.next:
                curr = curr.next
            curr.next = node
            msg = f"Traversed to last node and linked its next pointer to new node [{data}]."

        res = {
            "operation": "insert_end",
            "success": True,
            "value": data,
            "message": msg,
            "nodes": self._to_list(),
            "time_complexity": "O(n)",
            "c_code": "newNode = (struct Node*)malloc(sizeof(struct Node));\nnewNode->data = value;\nnewNode->next = NULL;\nif (head == NULL) head = newNode;\nelse {\n    struct Node* temp = head;\n    while (temp->next != NULL) temp = temp->next;\n    temp->next = newNode;\n}"
        }
        self.history.append(res)
        return res

    def insert_position(self, position: int, data: Any) -> Dict[str, Any]:
        if position <= 0 or not self.head:
            return self.insert_beginning(data)

        curr = self.head
        count = 0
        while curr.next and count < position - 1:
            curr = curr.next
            count += 1

        node = SinglyNode(data, self._next_id)
        self._next_id += 1
        node.next = curr.next
        curr.next = node

        res = {
            "operation": "insert_position",
            "success": True,
            "value": data,
            "position": position,
            "message": f"Inserted node [{data}] at position {position} by updating pointers.",
            "nodes": self._to_list(),
            "time_complexity": "O(n)",
            "c_code": "newNode->next = curr->next;\ncurr->next = newNode;"
        }
        self.history.append(res)
        return res

    def delete_beginning(self) -> Dict[str, Any]:
        if not self.head:
            return {
                "operation": "delete_beginning",
                "success": False,
                "message": "List is empty, nothing to delete.",
                "nodes": [],
                "time_complexity": "O(1)"
            }

        val = self.head.data
        self.head = self.head.next
        res = {
            "operation": "delete_beginning",
            "success": True,
            "value": val,
            "message": f"Deleted head node [{val}]. New head is its next node.",
            "nodes": self._to_list(),
            "time_complexity": "O(1)",
            "c_code": "struct Node* temp = head;\nhead = head->next;\nfree(temp);"
        }
        self.history.append(res)
        return res

    def delete_end(self) -> Dict[str, Any]:
        if not self.head:
            return {
                "operation": "delete_end",
                "success": False,
                "message": "List is empty, nothing to delete.",
                "nodes": [],
                "time_complexity": "O(1)"
            }

        if not self.head.next:
            val = self.head.data
            self.head = None
            res = {
                "operation": "delete_end",
                "success": True,
                "value": val,
                "message": f"Deleted only node [{val}]. List is now empty.",
                "nodes": [],
                "time_complexity": "O(1)"
            }
            self.history.append(res)
            return res

        curr = self.head
        while curr.next and curr.next.next:
            curr = curr.next

        val = curr.next.data
        curr.next = None
        res = {
            "operation": "delete_end",
            "success": True,
            "value": val,
            "message": f"Traversed to second-to-last node and freed last node [{val}].",
            "nodes": self._to_list(),
            "time_complexity": "O(n)",
            "c_code": "while (temp->next->next != NULL) temp = temp->next;\nfree(temp->next);\ntemp->next = NULL;"
        }
        self.history.append(res)
        return res

    def get_state(self) -> Dict[str, Any]:
        return {
            "type": "singly",
            "nodes": self._to_list(),
            "count": len(self._to_list()),
            "history": self.history[-20:]
        }
