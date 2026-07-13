import unittest

from fastapi import HTTPException

from app.api.routes.admin import _validate_question_configuration
from app.models.entities import QuestionType


class InteractiveQuestionConfigurationTests(unittest.TestCase):
    def test_valid_extended_configurations(self) -> None:
        cases = [
            (QuestionType.fill_blanks, None, {"template": "Train: ___; test: ___."}, {"blanks": ["A", "B"]}),
            (QuestionType.table_select, None, {"columns": ["A", "B"], "rows": [["1", "2"], ["3", "4"]]}, {"cells": ["0:1"]}),
            (QuestionType.code_order, ["first()", "second()"], None, {"order": [0, 1]}),
            (QuestionType.code_output, None, {"code": "print(4)"}, {"text": "4"}),
            (QuestionType.code_fix, None, {"code": "if ready\n run()"}, {"code": "if ready:\n    run()"}),
            (QuestionType.image_hotspot, None, {"image_url": "https://example.com/map.png"}, {"point": [0.4, 0.6]}),
            (QuestionType.graph_point, None, {"x_min": -5, "x_max": 5, "y_min": -5, "y_max": 5}, {"point": [2, 3]}),
            (QuestionType.number_line, None, {"min": -10, "max": 10, "step": 1}, {"number": 4}),
            (QuestionType.slider_experiment, None, {"min": 0, "max": 100, "step": 5}, {"number": 75}),
        ]
        for question_type, options, configuration, answer in cases:
            with self.subTest(question_type=question_type):
                _validate_question_configuration(question_type, options, configuration, answer)

    def test_rejects_incomplete_fill_blanks_answer(self) -> None:
        with self.assertRaises(HTTPException):
            _validate_question_configuration(
                QuestionType.fill_blanks,
                None,
                {"template": "___ and ___"},
                {"blanks": ["only one"]},
            )

    def test_rejects_out_of_range_table_cell(self) -> None:
        with self.assertRaises(HTTPException):
            _validate_question_configuration(
                QuestionType.table_select,
                None,
                {"columns": ["A"], "rows": [["1"]]},
                {"cells": ["4:4"]},
            )


if __name__ == "__main__":
    unittest.main()
