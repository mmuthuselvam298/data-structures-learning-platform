"""
Tree and AVL Implementations and Simulation Engine
Syllabus: Unit-III (Trees: Tree terminology, Binary tree, Binary search tree, AVL Tree, Rotations, Traversals)
"""
from typing import List, Optional, Dict, Any

class BSTNode:
    def __init__(self, key: int):
        self.key = key
        self.left: Optional['BSTNode'] = None
        self.right: Optional['BSTNode'] = None
        self.height: int = 1

    def to_dict(self) -> Dict[str, Any]:
        return {
            "key": self.key,
            "height": self.height,
            "balance_factor": self.get_balance(),
            "left": self.left.to_dict() if self.left else None,
            "right": self.right.to_dict() if self.right else None
        }

    def get_balance(self) -> int:
        lh = self.left.height if self.left else 0
        rh = self.right.height if self.right else 0
        return lh - rh

class BST:
    def __init__(self):
        self.root: Optional[BSTNode] = None

    def insert(self, key: int) -> Dict[str, Any]:
        path = []
        if not self.root:
            self.root = BSTNode(key)
            return {
                "operation": "insert",
                "success": True,
                "key": key,
                "path": [key],
                "message": f"Inserted {key} as Root node.",
                "tree": self.root.to_dict()
            }

        curr = self.root
        while True:
            path.append(curr.key)
            if key < curr.key:
                if curr.left is None:
                    curr.left = BSTNode(key)
                    path.append(key)
                    break
                curr = curr.left
            elif key > curr.key:
                if curr.right is None:
                    curr.right = BSTNode(key)
                    path.append(key)
                    break
                curr = curr.right
            else:
                return {
                    "operation": "insert",
                    "success": False,
                    "key": key,
                    "path": path,
                    "message": f"Key {key} already exists in BST! Duplicate keys not permitted.",
                    "tree": self.root.to_dict()
                }

        self._update_heights(self.root)
        return {
            "operation": "insert",
            "success": True,
            "key": key,
            "path": path,
            "message": f"Inserted {key}. Traversal path: {' -> '.join(map(str, path))}.",
            "tree": self.root.to_dict()
        }

    def search(self, key: int) -> Dict[str, Any]:
        path = []
        curr = self.root
        found = False
        while curr:
            path.append(curr.key)
            if curr.key == key:
                found = True
                break
            elif key < curr.key:
                curr = curr.left
            else:
                curr = curr.right

        return {
            "operation": "search",
            "success": found,
            "key": key,
            "path": path,
            "message": f"Key {key} found in BST! Path: {' -> '.join(map(str, path))}." if found else f"Key {key} not found in BST. Path searched: {' -> '.join(map(str, path))}.",
            "time_complexity": "O(log n) average, O(n) worst"
        }

    def _update_heights(self, node: Optional[BSTNode]) -> int:
        if not node:
            return 0
        node.height = 1 + max(self._update_heights(node.left), self._update_heights(node.right))
        return node.height

    def inorder(self) -> List[int]:
        res = []
        def _in(n):
            if n:
                _in(n.left)
                res.append(n.key)
                _in(n.right)
        _in(self.root)
        return res

    def preorder(self) -> List[int]:
        res = []
        def _pre(n):
            if n:
                res.append(n.key)
                _pre(n.left)
                _pre(n.right)
        _pre(self.root)
        return res

    def postorder(self) -> List[int]:
        res = []
        def _post(n):
            if n:
                _post(n.left)
                _post(n.right)
                res.append(n.key)
        _post(self.root)
        return res

    def level_order(self) -> List[int]:
        if not self.root:
            return []
        res = []
        queue = [self.root]
        while queue:
            curr = queue.pop(0)
            res.append(curr.key)
            if curr.left:
                queue.append(curr.left)
            if curr.right:
                queue.append(curr.right)
        return res


class AVLTree:
    def __init__(self):
        self.root: Optional[BSTNode] = None
        self.rotation_log: List[str] = []

    def height(self, node: Optional[BSTNode]) -> int:
        return node.height if node else 0

    def balance_factor(self, node: Optional[BSTNode]) -> int:
        return self.height(node.left) - self.height(node.right) if node else 0

    def right_rotate(self, y: BSTNode) -> BSTNode:
        x = y.left
        t2 = x.right
        x.right = y
        y.left = t2
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        self.rotation_log.append(f"LL Rotation (Right Rotate at {y.key})")
        return x

    def left_rotate(self, x: BSTNode) -> BSTNode:
        y = x.right
        t2 = y.left
        y.left = x
        x.right = t2
        x.height = 1 + max(self.height(x.left), self.height(x.right))
        y.height = 1 + max(self.height(y.left), self.height(y.right))
        self.rotation_log.append(f"RR Rotation (Left Rotate at {x.key})")
        return y

    def insert(self, key: int) -> Dict[str, Any]:
        self.rotation_log.clear()
        self.root = self._insert(self.root, key)
        return {
            "operation": "avl_insert",
            "key": key,
            "rotations": list(self.rotation_log),
            "message": f"Inserted {key}. " + ("Rotations performed: " + ", ".join(self.rotation_log) if self.rotation_log else "No rotation needed (Tree remains balanced)."),
            "tree": self.root.to_dict() if self.root else None
        }

    def _insert(self, node: Optional[BSTNode], key: int) -> BSTNode:
        if not node:
            return BSTNode(key)
        if key < node.key:
            node.left = self._insert(node.left, key)
        elif key > node.key:
            node.right = self._insert(node.right, key)
        else:
            return node

        node.height = 1 + max(self.height(node.left), self.height(node.right))
        balance = self.balance_factor(node)

        # 4 Rotation cases as taught in Unit 3 slides:
        # 1. Left Left (LL)
        if balance > 1 and key < node.left.key:
            return self.right_rotate(node)
        # 2. Right Right (RR)
        if balance < -1 and key > node.right.key:
            return self.left_rotate(node)
        # 3. Left Right (LR)
        if balance > 1 and key > node.left.key:
            node.left = self.left_rotate(node.left)
            self.rotation_log.append(f"LR Rotation (Left rotate {node.left.key}, then Right rotate {node.key})")
            return self.right_rotate(node)
        # 4. Right Left (RL)
        if balance < -1 and key < node.right.key:
            node.right = self.right_rotate(node.right)
            self.rotation_log.append(f"RL Rotation (Right rotate {node.right.key}, then Left rotate {node.key})")
            return self.left_rotate(node)

        return node
