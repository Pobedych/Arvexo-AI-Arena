from math import isclose
from typing import Any

from app.models.entities import Question, QuestionType


def normalize_text(value: Any) -> str:
    return " ".join(str(value or "").strip().lower().split())


def normalize_code(value: Any) -> str:
    lines = str(value or "").replace("\r\n", "\n").replace("\r", "\n").strip().split("\n")
    return "\n".join(line.rstrip() for line in lines)


def grade_question(question: Question, answer: dict | None) -> tuple[bool, int]:
    answer = answer or {}
    correct = question.correct_answer or {}

    is_correct = False
    if question.type == QuestionType.single_choice:
        is_correct = answer.get("option") == correct.get("option")
    elif question.type == QuestionType.multiple_choice:
        is_correct = sorted(answer.get("options") or []) == sorted(correct.get("options") or [])
    elif question.type == QuestionType.short_text:
        is_correct = normalize_text(answer.get("text")) == normalize_text(correct.get("text"))
    elif question.type == QuestionType.number:
        try:
            submitted = float(answer.get("number"))
            expected = float(correct.get("number"))
            tolerance = question.tolerance if question.tolerance is not None else 0.0
            is_correct = isclose(submitted, expected, abs_tol=tolerance)
        except (TypeError, ValueError):
            is_correct = False
    elif question.type == QuestionType.sequence:
        submitted = answer.get("order") or []
        expected = correct.get("order") or []
        is_correct = submitted == expected
    elif question.type == QuestionType.matching:
        submitted = answer.get("matches") or []
        expected = correct.get("matches") or []
        is_correct = submitted == expected
    elif question.type == QuestionType.code_text:
        submitted = normalize_code(answer.get("code"))
        accepted = correct.get("accepted_codes") or [correct.get("code")]
        is_correct = bool(submitted) and any(submitted == normalize_code(candidate) for candidate in accepted if candidate is not None)

    return is_correct, question.points if is_correct else 0
