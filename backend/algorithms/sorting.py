"""
Sorting Algorithms with Step-by-Step State Tracking
Syllabus: Unit-V (Bubble sort, Selection sort, Insertion sort, Quick sort, Merge sort, Radix sort, Heap sort)
Includes End Sem exam question: Quick Sort on A = [9, 3, 7, 1, 6]
"""
from typing import List, Dict, Any

def bubble_sort(arr: List[int]) -> Dict[str, Any]:
    a = list(arr)
    n = len(a)
    steps = []
    comparisons = 0
    swaps = 0

    steps.append({
        "step": 0,
        "array": list(a),
        "comparing": [],
        "swapped": False,
        "action": f"Initial array: {a}",
        "pass_num": 0
    })

    for i in range(n):
        swapped_in_pass = False
        for j in range(0, n - i - 1):
            comparisons += 1
            is_swap = a[j] > a[j + 1]
            if is_swap:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
                swapped_in_pass = True

            steps.append({
                "step": len(steps),
                "array": list(a),
                "comparing": [j, j + 1],
                "swapped": is_swap,
                "action": f"Compare A[{j}] ({a[j+1] if is_swap else a[j]}) and A[{j+1}] ({a[j] if is_swap else a[j+1]}): " + 
                          (f"Swapped because {a[j+1]} > {a[j]}." if is_swap else "In order, no swap."),
                "pass_num": i + 1,
                "comparisons": comparisons,
                "swaps": swaps
            })
        if not swapped_in_pass:
            break

    steps.append({
        "step": len(steps),
        "array": list(a),
        "comparing": [],
        "swapped": False,
        "action": f"Array is fully sorted in {swaps} swaps and {comparisons} comparisons!",
        "pass_num": n
    })

    return {
        "algorithm": "Bubble Sort",
        "initial": list(arr),
        "sorted": a,
        "total_comparisons": comparisons,
        "total_swaps": swaps,
        "steps": steps,
        "time_complexity": {"best": "O(n)", "average": "O(n^2)", "worst": "O(n^2)"},
        "space_complexity": "O(1)"
    }


def selection_sort(arr: List[int]) -> Dict[str, Any]:
    a = list(arr)
    n = len(a)
    steps = []
    comparisons = 0
    swaps = 0

    steps.append({
        "step": 0,
        "array": list(a),
        "comparing": [],
        "min_index": None,
        "action": f"Initial array: {a}"
    })

    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if a[j] < a[min_idx]:
                min_idx = j
            steps.append({
                "step": len(steps),
                "array": list(a),
                "comparing": [i, j],
                "min_index": min_idx,
                "action": f"Pass {i+1}: Scanning index {j} (value {a[j]}). Current minimum is at index {min_idx} (value {a[min_idx]})."
            })

        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
            swaps += 1
            steps.append({
                "step": len(steps),
                "array": list(a),
                "comparing": [i, min_idx],
                "min_index": min_idx,
                "action": f"Swapped minimum element {a[i]} into position {i}."
            })

    return {
        "algorithm": "Selection Sort",
        "initial": list(arr),
        "sorted": a,
        "total_comparisons": comparisons,
        "total_swaps": swaps,
        "steps": steps,
        "time_complexity": {"best": "O(n^2)", "average": "O(n^2)", "worst": "O(n^2)"},
        "space_complexity": "O(1)"
    }


def insertion_sort(arr: List[int]) -> Dict[str, Any]:
    a = list(arr)
    n = len(a)
    steps = []
    comparisons = 0
    shifts = 0

    steps.append({
        "step": 0,
        "array": list(a),
        "key_index": 0,
        "action": f"Initial array: {a}"
    })

    for i in range(1, n):
        key = a[i]
        j = i - 1
        steps.append({
            "step": len(steps),
            "array": list(a),
            "key_index": i,
            "action": f"Pass {i}: Pick key = {key} at index {i}."
        })
        while j >= 0:
            comparisons += 1
            if a[j] > key:
                a[j + 1] = a[j]
                shifts += 1
                steps.append({
                    "step": len(steps),
                    "array": list(a),
                    "key_index": j,
                    "action": f"Shift {a[j]} right because {a[j]} > {key}."
                })
                j -= 1
            else:
                break
        a[j + 1] = key
        steps.append({
            "step": len(steps),
            "array": list(a),
            "key_index": j + 1,
            "action": f"Inserted key {key} at position {j + 1}."
        })

    return {
        "algorithm": "Insertion Sort",
        "initial": list(arr),
        "sorted": a,
        "steps": steps,
        "time_complexity": {"best": "O(n)", "average": "O(n^2)", "worst": "O(n^2)"},
        "space_complexity": "O(1)"
    }


def quick_sort_trace(arr: List[int]) -> Dict[str, Any]:
    """Quick Sort with step-by-step recording as asked in End Sem exam (pivot = last element)"""
    a = list(arr)
    steps = []

    def _quick_sort(low: int, high: int):
        if low < high:
            pivot_idx = _partition(low, high)
            _quick_sort(low, pivot_idx - 1)
            _quick_sort(pivot_idx + 1, high)

    def _partition(low: int, high: int) -> int:
        pivot = a[high]
        i = low - 1
        steps.append({
            "step": len(steps) + 1,
            "array": list(a),
            "pivot_index": high,
            "pivot_value": pivot,
            "range": [low, high],
            "action": f"Partition range [{low}..{high}]: Selected pivot {pivot} at index {high}."
        })

        for j in range(low, high):
            if a[j] < pivot:
                i += 1
                a[i], a[j] = a[j], a[i]
                steps.append({
                    "step": len(steps) + 1,
                    "array": list(a),
                    "pivot_index": high,
                    "comparing": [i, j],
                    "action": f"Element {a[i]} < pivot {pivot}. Swapped to lower partition at index {i}."
                })

        a[i + 1], a[high] = a[high], a[i + 1]
        steps.append({
            "step": len(steps) + 1,
            "array": list(a),
            "pivot_index": i + 1,
            "action": f"Placed pivot {pivot} into its sorted position at index {i + 1}."
        })
        return i + 1

    steps.append({
        "step": 0,
        "array": list(a),
        "action": f"Initial array: {a}"
    })
    _quick_sort(0, len(a) - 1)

    return {
        "algorithm": "Quick Sort",
        "initial": list(arr),
        "sorted": a,
        "steps": steps,
        "time_complexity": {"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n^2)"},
        "space_complexity": "O(log n)"
    }
