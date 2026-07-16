import unittest
from datetime import date, datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

from app.services.gamification import activity_history, current_streak_state, weekly_activity


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


class CurrentStreakStateTests(unittest.TestCase):
    def test_streak_is_colored_after_activity_today(self):
        db = FakeDb(
            [SimpleNamespace(activity_date=date(2026, 7, day)) for day in (10, 11, 12, 13)]
        )

        self.assertEqual(current_streak_state(db, SimpleNamespace(id="user-1"), date(2026, 7, 13)), (4, True))

    def test_streak_is_available_but_gray_before_activity_today(self):
        db = FakeDb(
            [SimpleNamespace(activity_date=date(2026, 7, day)) for day in (9, 10, 11, 12)]
        )

        self.assertEqual(current_streak_state(db, SimpleNamespace(id="user-1"), date(2026, 7, 13)), (4, False))

    def test_streak_expires_after_a_missed_day(self):
        db = FakeDb(
            [SimpleNamespace(activity_date=date(2026, 7, day)) for day in (8, 9, 10, 11)]
        )

        self.assertEqual(current_streak_state(db, SimpleNamespace(id="user-1"), date(2026, 7, 13)), (0, False))

    def test_new_user_has_gray_zero_streak(self):
        db = FakeDb([])

        self.assertEqual(current_streak_state(db, SimpleNamespace(id="user-1"), date(2026, 7, 13)), (0, False))

    def test_streak_ignores_stale_saved_value(self):
        db = FakeDb(
            [SimpleNamespace(activity_date=date(2026, 7, day)) for day in (11, 12, 13)]
        )
        user = SimpleNamespace(id="user-1", current_streak=4)

        self.assertEqual(current_streak_state(db, user, date(2026, 7, 13)), (3, True))


if __name__ == "__main__":
    unittest.main()
