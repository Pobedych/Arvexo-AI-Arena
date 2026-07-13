import unittest
from types import SimpleNamespace

from app.models.entities import QuestionType
from app.services.grading import grade_question


class SequenceGradingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.question = SimpleNamespace(
            type=QuestionType.sequence,
            correct_answer={"order": [0, 1, 2]},
            points=5,
            tolerance=None,
        )

    def test_exact_sequence_receives_full_score(self) -> None:
        self.assertEqual(grade_question(self.question, {"order": [0, 1, 2]}), (True, 5))

    def test_wrong_sequence_receives_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"order": [0, 2, 1]}), (False, 0))

    def test_incomplete_sequence_receives_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"order": [0, 1]}), (False, 0))


class MatchingGradingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.question = SimpleNamespace(
            type=QuestionType.matching,
            correct_answer={"matches": [0, 1, 2]},
            points=4,
            tolerance=None,
        )

    def test_exact_matches_receive_full_score(self) -> None:
        self.assertEqual(grade_question(self.question, {"matches": [0, 1, 2]}), (True, 4))

    def test_wrong_matches_receive_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"matches": [1, 0, 2]}), (False, 0))


class GroupSortGradingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.question = SimpleNamespace(
            type=QuestionType.group_sort,
            correct_answer={"groups": [0, 1, 0, 1]},
            points=5,
            tolerance=None,
        )

    def test_exact_groups_receive_full_score(self) -> None:
        self.assertEqual(grade_question(self.question, {"groups": [0, 1, 0, 1]}), (True, 5))

    def test_wrong_group_receives_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"groups": [0, 1, 1, 1]}), (False, 0))

    def test_incomplete_groups_receive_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"groups": [0, 1]}), (False, 0))


class ExtendedInteractiveGradingTests(unittest.TestCase):
    def question(self, question_type: QuestionType, correct_answer: dict, tolerance: float | None = None):
        return SimpleNamespace(type=question_type, correct_answer=correct_answer, points=7, tolerance=tolerance)

    def test_fill_blanks_normalizes_text(self) -> None:
        question = self.question(QuestionType.fill_blanks, {"blanks": ["Обучающая", "Тестовая"]})
        self.assertEqual(grade_question(question, {"blanks": [" обучающая ", "ТЕСТОВАЯ"]}), (True, 7))

    def test_table_select_ignores_selection_order(self) -> None:
        question = self.question(QuestionType.table_select, {"cells": ["0:1", "1:0"]})
        self.assertEqual(grade_question(question, {"cells": ["1:0", "0:1"]}), (True, 7))

    def test_code_order_requires_exact_order(self) -> None:
        question = self.question(QuestionType.code_order, {"order": [0, 1, 2]})
        self.assertEqual(grade_question(question, {"order": [0, 2, 1]}), (False, 0))

    def test_code_output_normalizes_text(self) -> None:
        question = self.question(QuestionType.code_output, {"text": "Hello, Arena!"})
        self.assertEqual(grade_question(question, {"text": "  hello, arena!  "}), (True, 7))

    def test_code_fix_normalizes_line_endings(self) -> None:
        question = self.question(QuestionType.code_fix, {"code": "if ready:\n    start()"})
        self.assertEqual(grade_question(question, {"code": "if ready:   \r\n    start()\n"}), (True, 7))

    def test_image_hotspot_uses_radius(self) -> None:
        question = self.question(QuestionType.image_hotspot, {"point": [0.5, 0.5]}, tolerance=0.1)
        self.assertEqual(grade_question(question, {"point": [0.56, 0.56]}), (True, 7))

    def test_graph_point_rejects_distant_point(self) -> None:
        question = self.question(QuestionType.graph_point, {"point": [2, 3]}, tolerance=0.2)
        self.assertEqual(grade_question(question, {"point": [2.5, 3]}), (False, 0))

    def test_number_line_uses_tolerance(self) -> None:
        question = self.question(QuestionType.number_line, {"number": 4.5}, tolerance=0.1)
        self.assertEqual(grade_question(question, {"number": 4.55}), (True, 7))

    def test_slider_experiment_requires_expected_value(self) -> None:
        question = self.question(QuestionType.slider_experiment, {"number": 75}, tolerance=0)
        self.assertEqual(grade_question(question, {"number": 70}), (False, 0))


class CodeTextGradingTests(unittest.TestCase):
    def setUp(self) -> None:
        self.question = SimpleNamespace(
            type=QuestionType.code_text,
            correct_answer={"code": "def answer():\n    return 42"},
            points=6,
            tolerance=None,
        )

    def test_trailing_whitespace_is_ignored(self) -> None:
        submitted = {"code": "def answer():   \r\n    return 42\n"}
        self.assertEqual(grade_question(self.question, submitted), (True, 6))

    def test_different_code_receives_zero(self) -> None:
        self.assertEqual(grade_question(self.question, {"code": "return 0"}), (False, 0))


if __name__ == "__main__":
    unittest.main()
