"""
Searching Algorithms Simulation Engine
Syllabus: Unit-V (Linear Search and Binary Search methods)
"""
from typing import List, Dict, Any

def linear_search(arr: List[int], target: int) -> Dict[str, Any]:
    steps = []
    found_idx = -1

    for i, val in enumerate(arr):
        is_match = (val == target)
        steps.append({
            "step": i + 1,
            "index": i,
            "value": val,
            "match": is_match,
            "action": f"Compare index {i} (value {val}) with target {target}: " + ("MATCH FOUND!" if is_match else "No match, move to next index.")
        })
        if is_match:
            found_idx = i
            break

    return {
        "algorithm": "Linear Search",
        "target": target,
        "found": found_idx != -1,
        "index": found_idx,
        "total_comparisons": len(steps),
        "steps": steps,
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    }

def binary_search(arr: List[int], target: int) -> Dict[str, Any]:
    # ensure sorted
    a = sorted(arr)
    low = 0
    high = len(a) - 1
    steps = []
    found_idx = -1

    while low <= high:
        mid = (low + high) // 2
        mid_val = a[mid]
        step_info = {
            "step": len(steps) + 1,
            "low": low,
            "mid": mid,
            "high": high,
            "mid_val": mid_val,
            "range": [low, high]
        }

        if mid_val == target:
            step_info["action"] = f"A[{mid}] = {mid_val} == target {target}. TARGET FOUND!"
            step_info["match"] = True
            steps.append(step_info)
            found_idx = mid
            break
        elif mid_val < target:
            step_info["action"] = f"A[{mid}] = {mid_val} < target {target}. Target is in right half. Set low = {mid + 1}."
            step_info["match"] = False
            steps.append(step_info)
            low = mid + 1
        else:
            step_info["action"] = f"A[{mid}] = {mid_val} > target {target}. Target is in left half. Set high = {mid - 1}."
            step_info["match"] = False
            steps.append(step_info)
            high = mid - 1

    return {
        "algorithm": "Binary Search",
        "array": a,
        "target": target,
        "found": found_idx != -1,
        "index": found_idx,
        "total_comparisons": len(steps),
        "steps": steps,
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    }
