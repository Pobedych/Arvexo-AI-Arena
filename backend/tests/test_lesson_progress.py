import unittest
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

from app.models.entities import LessonStatus
from app.schemas.api import LessonProgressUpdate
from app.api.routes.learning import save_lesson_progress


class FakeQuery:
    def __init__(self, row):
        self.row = row

    def filter(self, *args):
        return self

    def one_or_none(self):
        return self.row


class FakeDb:
    def __init__(self, row=None):
        self.row = row
        self.added = None
        self.committed = False

    def query(self, *args):
        return FakeQuery(self.row)

    def add(self, row):
        self.added = row

    def commit(self):
        self.committed = True


class SaveLessonProgressTests(unittest.TestCase):
    @patch("app.api.routes.learning._accessible_lesson")
    def test_creates_in_progress_row(self, accessible_lesson):
        lesson_id = uuid4()
        user_id = uuid4()
        lesson = SimpleNamespace(id=lesson_id)
        accessible_lesson.return_value = (lesson, {})
        db = FakeDb()

        result = save_lesson_progress(
            lesson_id,
            LessonProgressUpdate(current_block=3),
            db,
            SimpleNamespace(id=user_id),
        )

        self.assertEqual(result, {"current_block": 3})
        self.assertEqual(db.added.current_block, 3)
        self.assertEqual(db.added.status, LessonStatus.in_progress)
        self.assertTrue(db.committed)

    @patch("app.api.routes.learning._accessible_lesson")
    def test_updates_existing_row_without_downgrading_completed_lesson(self, accessible_lesson):
        lesson_id = uuid4()
        progress = SimpleNamespace(current_block=1, status=LessonStatus.completed)
        lesson = SimpleNamespace(id=lesson_id)
        accessible_lesson.return_value = (lesson, {str(lesson_id): progress})
        db = FakeDb(progress)

        result = save_lesson_progress(
            lesson_id,
            LessonProgressUpdate(current_block=4),
            db,
            SimpleNamespace(id=uuid4()),
        )

        self.assertEqual(result, {"current_block": 4})
        self.assertEqual(progress.status, LessonStatus.completed)
        self.assertTrue(db.committed)


if __name__ == "__main__":
    unittest.main()
