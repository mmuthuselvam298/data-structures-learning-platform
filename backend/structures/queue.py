"""
Queue Implementation and Simulation Engine
Syllabus: Unit-I (Queues: Representation and application, implementation of queue operations, Circular Queue)
Follows FIFO: First In, First Out
"""
from typing import List, Optional, Dict, Any

class LinearQueue:
    def __init__(self, capacity: int = 6):
        self.capacity = capacity
        self.items: List[Optional[Any]] = [None] * capacity
        self.front: int = -1
        self.rear: int = -1
        self.history: List[Dict[str, Any]] = []

    def is_empty(self) -> bool:
        return self.front == -1 or self.front > self.rear

    def is_full(self) -> bool:
        return self.rear == self.capacity - 1

    def enqueue(self, value: Any) -> Dict[str, Any]:
        if self.is_full():
            # Linear queue false overflow limitation explained in syllabus slide 55!
            is_false_overflow = self.front > 0
            res = {
                "operation": "enqueue",
                "success": False,
                "value": value,
                "message": "Linear Queue Overflow! Rear has reached MAX - 1." + 
                           (" (Note: This is false overflow because empty slots exist at front! Circular queue solves this)." if is_false_overflow else ""),
                "state": [x for x in self.items if x is not None],
                "raw_array": list(self.items),
                "front": self.front,
                "rear": self.rear,
                "time_complexity": "O(1)",
                "c_code": "if (rear == MAX - 1) {\n    printf(\"Queue Overflow\\n\");\n} else {\n    if (front == -1) front = 0;\n    queue[++rear] = value;\n}"
            }
            self.history.append(res)
            return res

        if self.front == -1:
            self.front = 0
        self.rear += 1
        self.items[self.rear] = value

        res = {
            "operation": "enqueue",
            "success": True,
            "value": value,
            "message": f"Enqueued {value} at rear index {self.rear}.",
            "state": [self.items[i] for i in range(self.front, self.rear + 1) if self.items[i] is not None],
            "raw_array": list(self.items),
            "front": self.front,
            "rear": self.rear,
            "time_complexity": "O(1)",
            "c_code": f"queue[++rear] = {value};"
        }
        self.history.append(res)
        return res

    def dequeue(self) -> Dict[str, Any]:
        if self.is_empty():
            res = {
                "operation": "dequeue",
                "success": False,
                "value": None,
                "message": "Queue Underflow! Queue is currently empty.",
                "state": [],
                "raw_array": list(self.items),
                "front": self.front,
                "rear": self.rear,
                "time_complexity": "O(1)",
                "c_code": "if (front == -1 || front > rear) {\n    printf(\"Queue Underflow\\n\");\n}"
            }
            self.history.append(res)
            return res

        val = self.items[self.front]
        self.items[self.front] = None
        old_front = self.front
        self.front += 1

        if self.front > self.rear:
            # reset
            self.front = -1
            self.rear = -1

        res = {
            "operation": "dequeue",
            "success": True,
            "value": val,
            "message": f"Dequeued {val} from front index {old_front}.",
            "state": [self.items[i] for i in range(self.front, self.rear + 1)] if self.front != -1 else [],
            "raw_array": list(self.items),
            "front": self.front,
            "rear": self.rear,
            "time_complexity": "O(1)",
            "c_code": f"val = queue[front++]; // dequeued {val}"
        }
        self.history.append(res)
        return res


class CircularQueue:
    def __init__(self, capacity: int = 6):
        self.capacity = capacity
        self.items: List[Optional[Any]] = [None] * capacity
        self.front: int = -1
        self.rear: int = -1
        self.history: List[Dict[str, Any]] = []

    def is_empty(self) -> bool:
        return self.front == -1

    def is_full(self) -> bool:
        # Condition from exam paper: (rear + 1) % MAX == front
        return (self.rear + 1) % self.capacity == self.front

    def enqueue(self, value: Any) -> Dict[str, Any]:
        if self.is_full():
            res = {
                "operation": "enqueue",
                "success": False,
                "value": value,
                "message": f"Circular Queue Overflow! Condition (rear + 1) % MAX == front is met (front={self.front}, rear={self.rear}).",
                "raw_array": list(self.items),
                "front": self.front,
                "rear": self.rear,
                "time_complexity": "O(1)",
                "c_code": "if ((rear + 1) % MAX == front) {\n    printf(\"Circular Queue is Full!\\n\");\n}"
            }
            self.history.append(res)
            return res

        if self.front == -1:
            self.front = 0
            self.rear = 0
        else:
            self.rear = (self.rear + 1) % self.capacity

        self.items[self.rear] = value

        res = {
            "operation": "enqueue",
            "success": True,
            "value": value,
            "message": f"Enqueued {value} at index {self.rear}. (rear updated via (rear + 1) % {self.capacity} = {self.rear})",
            "raw_array": list(self.items),
            "front": self.front,
            "rear": self.rear,
            "time_complexity": "O(1)",
            "c_code": f"rear = (rear + 1) % MAX;\nqueue[rear] = {value};"
        }
        self.history.append(res)
        return res

    def dequeue(self) -> Dict[str, Any]:
        if self.is_empty():
            res = {
                "operation": "dequeue",
                "success": False,
                "value": None,
                "message": "Circular Queue Underflow! Queue is currently empty.",
                "raw_array": list(self.items),
                "front": self.front,
                "rear": self.rear,
                "time_complexity": "O(1)",
                "c_code": "if (front == -1) {\n    printf(\"Circular Queue is Empty!\\n\");\n}"
            }
            self.history.append(res)
            return res

        val = self.items[self.front]
        self.items[self.front] = None
        old_front = self.front

        if self.front == self.rear:
            self.front = -1
            self.rear = -1
        else:
            self.front = (self.front + 1) % self.capacity

        res = {
            "operation": "dequeue",
            "success": True,
            "value": val,
            "message": f"Dequeued {val} from index {old_front}. (front updated via (front + 1) % {self.capacity} = {self.front})",
            "raw_array": list(self.items),
            "front": self.front,
            "rear": self.rear,
            "time_complexity": "O(1)",
            "c_code": f"val = queue[front];\nfront = (front + 1) % MAX;"
        }
        self.history.append(res)
        return res

    def get_state(self) -> Dict[str, Any]:
        return {
            "capacity": self.capacity,
            "raw_array": list(self.items),
            "front": self.front,
            "rear": self.rear,
            "is_empty": self.is_empty(),
            "is_full": self.is_full(),
            "history": self.history[-20:]
        }
