"""
Expression Evaluation and Infix to Postfix Conversion
Syllabus: Unit-I & Unit-III
Exact exam questions:
- Infix to Postfix: K+L-M*N + (O^P) * W/U/V *T+Q
- Postfix evaluation: 5 6 7 8 + - * 4 +
"""
from typing import List, Dict, Any

def precedence(op: str) -> int:
    if op in ('+', '-'):
        return 1
    if op in ('*', '/'):
        return 2
    if op == '^':
        return 3
    return 0

def infix_to_postfix(expression: str) -> Dict[str, Any]:
    stack = []
    output = []
    steps = []

    # Clean expression tokens
    tokens = []
    i = 0
    while i < len(expression):
        ch = expression[i]
        if ch.isalnum() or ch in "+-*/^()":
            tokens.append(ch)
        i += 1

    steps.append({
        "step": 0,
        "symbol": "START",
        "stack": [],
        "output": "",
        "action": f"Begin conversion for expression: {expression}"
    })

    for idx, token in enumerate(tokens):
        if token.isalnum():
            output.append(token)
            steps.append({
                "step": len(steps),
                "symbol": token,
                "stack": list(stack),
                "output": " ".join(output),
                "action": f"Operand '{token}' -> Added directly to output."
            })
        elif token == '(':
            stack.append(token)
            steps.append({
                "step": len(steps),
                "symbol": token,
                "stack": list(stack),
                "output": " ".join(output),
                "action": "Left parenthesis '(' -> Push onto stack."
            })
        elif token == ')':
            while stack and stack[-1] != '(':
                popped = stack.pop()
                output.append(popped)
            if stack and stack[-1] == '(':
                stack.pop() # pop '('
            steps.append({
                "step": len(steps),
                "symbol": token,
                "stack": list(stack),
                "output": " ".join(output),
                "action": "Right parenthesis ')' -> Pop stack to output until '('."
            })
        else: # operator
            while (stack and stack[-1] != '(' and 
                   (precedence(stack[-1]) > precedence(token) or 
                    (precedence(stack[-1]) == precedence(token) and token != '^'))):
                popped = stack.pop()
                output.append(popped)
            stack.append(token)
            steps.append({
                "step": len(steps),
                "symbol": token,
                "stack": list(stack),
                "output": " ".join(output),
                "action": f"Operator '{token}' -> Pop operators with >= precedence, then push '{token}'."
            })

    while stack:
        popped = stack.pop()
        output.append(popped)
        steps.append({
            "step": len(steps),
            "symbol": "END",
            "stack": list(stack),
            "output": " ".join(output),
            "action": f"End of input -> Pop remaining operator '{popped}' to output."
        })

    return {
        "infix": expression,
        "postfix": "".join(output),
        "steps": steps
    }

def evaluate_postfix(expression: str) -> Dict[str, Any]:
    tokens = expression.split() if ' ' in expression else list(expression)
    stack = []
    steps = []

    for idx, token in enumerate(tokens):
        if token.isdigit() or (token.startswith('-') and len(token) > 1 and token[1:].isdigit()):
            val = int(token)
            stack.append(val)
            steps.append({
                "step": len(steps) + 1,
                "token": token,
                "action": f"Operand {val} -> Push onto evaluation stack.",
                "stack": list(stack)
            })
        elif token in ('+', '-', '*', '/', '^'):
            if len(stack) < 2:
                return {"error": "Invalid postfix expression - not enough operands!"}
            b = stack.pop()
            a = stack.pop()
            res = 0
            if token == '+': res = a + b
            elif token == '-': res = a - b
            elif token == '*': res = a * b
            elif token == '/': res = a // b if b != 0 else 0
            elif token == '^': res = a ** b
            stack.append(res)
            steps.append({
                "step": len(steps) + 1,
                "token": token,
                "action": f"Operator '{token}' -> Pop {b} and {a}, compute {a} {token} {b} = {res}, push {res}.",
                "stack": list(stack)
            })

    final_result = stack[-1] if stack else 0
    return {
        "expression": expression,
        "result": final_result,
        "steps": steps
    }
