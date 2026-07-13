import unittest
from datetime import date, datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

from app.services.gamification import activity_history, weekly_activity


class FakeQuery:
    def __init__(self, rows):
        self.rows = rows

    def filter(self, *args):
        return self

    def all(self):
        return self.rows


class FakeDb:
    def __init__(self, activity_rows, progress_rows=None):
        self.activity_rows = activity_rows
        self.progress_rows = progress_rows or []

    def query(self, *args):
        first_column = getattr(args[0], "key", "")
        return FakeQuery(self.activity_rows if first_column == "activity_date" else self.progress_rows)


class ActivityHistoryTests(unittest.TestCase):
    @patch("app.services.gamification.now_utc", return_value=datetime(2026, 7, 13, tzinfo=timezone.utc))
    def test_activity_history_fills_missing_days(self, _now_utc):
        db = FakeDb(
            [SimpleNamespace(activity_date=date(2026, 7, 12), action_count=3)],
            [SimpleNamespace(completed_at=datetime(2026, 7, 12, 10, tzinfo=timezone.utc), best_score=8)],
        )
        user = SimpleNamespace(id="user-1")

        self.assertEqual(
            activity_history(db, user, 3),
            [
                {"date": "2026-07-11", "count": 0, "xp": 0},
                {"date": "2026-07-12", "count": 3, "xp": 8},
                {"date": "2026-07-13", "count": 0, "xp": 0},
            ],
        )

    @patch("app.services.gamification.now_utc", return_value=datetime(2026, 7, 13, tzinfo=timezone.utc))
    def test_weekly_activity_returns_seven_days(self, _now_utc):
        result = weekly_activity(FakeDb([]), SimpleNamespace(id="user-1"))

        self.assertEqual(len(result), 7)
        self.assertEqual(result[0]["date"], "2026-07-07")
        self.assertEqual(result[-1]["date"], "2026-07-13")


if __name__ == "__main__":
    unittest.main()
