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
