"""
Stack Implementation and Simulation Engine
Syllabus: Unit-I (Stacks: Representation and application, implementation of stack operations)
Follows LIFO: Last In, First Out
"""
from typing import List, Optional, Dict, Any

class Stack:
    def __init__(self, capacity: int = 8):
        self.capacity = capacity
        self.items: List[Any] = []
        self.history: List[Dict[str, Any]] = []

    def is_empty(self) -> bool:
        return len(self.items) == 0

    def is_full(self) -> bool:
        return len(self.items) >= self.capacity

    def push(self, value: Any) -> Dict[str, Any]:
        if self.is_full():
            res = {
                "operation": "push",
                "success": False,
                "value": value,
                "message": f"Stack Overflow! Cannot push {value}. Maximum capacity is {self.capacity}.",
                "state": list(self.items),
                "top_index": len(self.items) - 1,
                "top_value": self.peek(),
                "time_complexity": "O(1)",
                "space_complexity": "O(1)",
                "c_code": f"if (top == MAX - 1) {{\n    printf(\"Stack Overflow\\n\");\n}} else {{\n    stack[++top] = {value};\n}}"
            }
            self.history.append(res)
            return res

        self.items.append(value)
        res = {
            "operation": "push",
            "success": True,
            "value": value,
            "message": f"Successfully pushed {value} onto top of the stack.",
            "state": list(self.items),
            "top_index": len(self.items) - 1,
            "top_value": value,
            "time_complexity": "O(1)",
            "space_complexity": "O(1)",
            "c_code": f"stack[++top] = {value};"
        }
        self.history.append(res)
        return res

    def pop(self) -> Dict[str, Any]:
        if self.is_empty():
            res = {
                "operation": "pop",
                "success": False,
                "value": None,
                "message": "Stack Underflow! Cannot pop from an empty stack.",
                "state": [],
                "top_index": -1,
                "top_value": None,
                "time_complexity": "O(1)",
                "space_complexity": "O(1)",
                "c_code": "if (top == -1) {\n    printf(\"Stack Underflow\\n\");\n} else {\n    item = stack[top--];\n}"
            }
            self.history.append(res)
            return res

        val = self.items.pop()
        res = {
            "operation": "pop",
            "success": True,
            "value": val,
            "message": f"Popped element {val} from top of the stack.",
            "state": list(self.items),
            "top_index": len(self.items) - 1,
            "top_value": self.peek(),
            "time_complexity": "O(1)",
            "space_complexity": "O(1)",
            "c_code": f"item = stack[top--]; // popped {val}"
        }
        self.history.append(res)
        return res

    def peek(self) -> Optional[Any]:
        if self.is_empty():
            return None
        return self.items[-1]

    def peek_info(self) -> Dict[str, Any]:
        val = self.peek()
        return {
            "operation": "peek",
            "success": not self.is_empty(),
            "value": val,
            "message": f"Current top element is {val}" if val is not None else "Stack is empty, no top element.",
            "state": list(self.items),
            "top_index": len(self.items) - 1,
            "top_value": val,
            "time_complexity": "O(1)",
            "space_complexity": "O(1)",
            "c_code": "return stack[top];"
        }

    def clear(self) -> Dict[str, Any]:
        self.items.clear()
        self.history.clear()
        return {
            "operation": "clear",
            "success": True,
            "message": "Stack reset to empty state.",
            "state": [],
            "top_index": -1,
            "top_value": None
        }

    def get_state(self) -> Dict[str, Any]:
        return {
            "state": list(self.items),
            "capacity": self.capacity,
            "size": len(self.items),
            "top_index": len(self.items) - 1,
            "top_value": self.peek(),
            "is_empty": self.is_empty(),
            "is_full": self.is_full(),
            "history": self.history[-20:]
        }
