import unittest
from types import SimpleNamespace
from unittest.mock import patch

from app.services import scheduler


class FakeDb:
    def __init__(self):
        self.committed = False
        self.rolled_back = False
        self.closed = False

    def get_bind(self):
        return SimpleNamespace(dialect=SimpleNamespace(name="sqlite"))

    def commit(self):
        self.committed = True

    def rollback(self):
        self.rolled_back = True

    def close(self):
        self.closed = True


class SchedulerTests(unittest.TestCase):
    @patch("app.api.routes.tournaments.finalize_due_attempts")
    @patch("app.api.routes.tournaments.sync_open_tournaments")
    @patch("app.services.scheduler.SessionLocal")
    def test_run_once_syncs_and_finalizes_in_one_transaction(self, session_local, sync, finalize):
        db = FakeDb()
        session_local.return_value = db

        scheduler.run_once()

        sync.assert_called_once_with(db)
        finalize.assert_called_once_with(db)
        self.assertTrue(db.committed)
        self.assertFalse(db.rolled_back)
        self.assertTrue(db.closed)


if __name__ == "__main__":
    unittest.main()
