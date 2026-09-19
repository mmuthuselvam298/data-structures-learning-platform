"""
Hashing and Collision Resolution Simulation Engine
Syllabus: Unit-V (Hashing techniques and hash functions: Division method, collision resolution via linear probing)
"""
from typing import List, Optional, Dict, Any

class HashTable:
    def __init__(self, size: int = 10):
        self.size = size
        self.table: List[Optional[int]] = [None] * size
        self.history: List[Dict[str, Any]] = []

    def hash_func(self, key: int) -> int:
        return key % self.size

    def insert(self, key: int) -> Dict[str, Any]:
        initial_idx = self.hash_func(key)
        idx = initial_idx
        probes = 0
        collision = False

        while self.table[idx] is not None and self.table[idx] != key:
            collision = True
            probes += 1
            idx = (idx + 1) % self.size
            if probes >= self.size:
                res = {
                    "operation": "insert",
                    "success": False,
                    "key": key,
                    "message": "Hash Table is Full! Cannot insert.",
                    "table": list(self.table)
                }
                self.history.append(res)
                return res

        self.table[idx] = key
        res = {
            "operation": "insert",
            "success": True,
            "key": key,
            "initial_hash": initial_idx,
            "final_index": idx,
            "collisions": probes,
            "message": f"Key {key} hashed to {initial_idx} (h(k) = {key} % {self.size}). " + 
                       (f"Collision resolved via {probes} linear probe(s) to index {idx}." if collision else f"Directly placed at index {idx} with 0 collisions."),
            "table": list(self.table)
        }
        self.history.append(res)
        return res

    def search(self, key: int) -> Dict[str, Any]:
        initial_idx = self.hash_func(key)
        idx = initial_idx
        probes = 0

        while self.table[idx] is not None:
            if self.table[idx] == key:
                return {
                    "found": True,
                    "key": key,
                    "index": idx,
                    "probes": probes + 1,
                    "message": f"Found key {key} at index {idx} after {probes + 1} probe(s)."
                }
            probes += 1
            idx = (idx + 1) % self.size
            if probes >= self.size:
                break

        return {
            "found": False,
            "key": key,
            "probes": probes,
            "message": f"Key {key} not found in hash table."
        }
