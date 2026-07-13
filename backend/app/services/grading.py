from math import isclose
from typing import Any

from app.models.entities import Question, QuestionType


def normalize_text(value: Any) -> str:
    return " ".join(str(value or "").strip().lower().split())


def normalize_code(value: Any) -> str:
    lines = str(value or "").replace("\r\n", "\n").replace("\r", "\n").strip().split("\n")
    return "\n".join(line.rstrip() for line in lines)


def _numeric_answer(answer: dict, correct: dict, key: str, tolerance: float | None) -> bool:
    try:
        submitted = float(answer.get(key))
        expected = float(correct.get(key))
        return isclose(submitted, expected, abs_tol=tolerance or 0.0)
    except (TypeError, ValueError):
        return False


def _point_answer(answer: dict, correct: dict, tolerance: float | None) -> bool:
    submitted = answer.get("point") or []
    expected = correct.get("point") or []
    if not isinstance(submitted, list) or not isinstance(expected, list) or len(submitted) != 2 or len(expected) != 2:
        return False
    try:
        distance = ((float(submitted[0]) - float(expected[0])) ** 2 + (float(submitted[1]) - float(expected[1])) ** 2) ** 0.5
        return distance <= (tolerance or 0.0)
    except (TypeError, ValueError):
        return False


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
    elif question.type == QuestionType.group_sort:
        submitted = answer.get("groups") or []
        expected = correct.get("groups") or []
        is_correct = submitted == expected
    elif question.type == QuestionType.fill_blanks:
        submitted = [normalize_text(item) for item in (answer.get("blanks") or [])]
        expected = [normalize_text(item) for item in (correct.get("blanks") or [])]
        is_correct = bool(expected) and submitted == expected
    elif question.type == QuestionType.table_select:
        submitted = sorted(str(item) for item in (answer.get("cells") or []))
        expected = sorted(str(item) for item in (correct.get("cells") or []))
        is_correct = bool(expected) and submitted == expected
    elif question.type == QuestionType.code_order:
        is_correct = (answer.get("order") or []) == (correct.get("order") or [])
    elif question.type == QuestionType.code_output:
        is_correct = normalize_text(answer.get("text")) == normalize_text(correct.get("text"))
    elif question.type == QuestionType.code_fix:
        submitted = normalize_code(answer.get("code"))
        accepted = correct.get("accepted_codes") or [correct.get("code")]
        is_correct = bool(submitted) and any(submitted == normalize_code(candidate) for candidate in accepted if candidate is not None)
    elif question.type in (QuestionType.image_hotspot, QuestionType.graph_point):
        is_correct = _point_answer(answer, correct, question.tolerance)
    elif question.type in (QuestionType.number_line, QuestionType.slider_experiment):
        is_correct = _numeric_answer(answer, correct, "number", question.tolerance)
    elif question.type == QuestionType.code_text:
        submitted = normalize_code(answer.get("code"))
        accepted = correct.get("accepted_codes") or [correct.get("code")]
        is_correct = bool(submitted) and any(submitted == normalize_code(candidate) for candidate in accepted if candidate is not None)

    return is_correct, question.points if is_correct else 0
