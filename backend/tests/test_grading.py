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


if __name__ == "__main__":
    unittest.main()
