import unittest
from datetime import timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.routes.catalog import list_public_tournaments, list_public_tracks
from app.db.base import Base
from app.models.entities import Tournament, TournamentQuestion, TournamentStatus, now_utc
from app.scripts.seed_math import seed_math


class PublicCatalogTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.db = sessionmaker(bind=self.engine)()
        self.track = seed_math(self.db)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_tracks_are_available_without_user_context(self):
        rows = list_public_tracks(self.db)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["slug"], "math")
        self.assertEqual(rows[0]["lesson_count"], 6)
        self.assertEqual(rows[0]["section_count"], 2)

    def test_tournaments_expose_catalog_information_only(self):
        question = self.track.sections[0].lessons[0].questions[0]
        tournament = Tournament(
            track_id=self.track.id,
            title="Math Sprint",
            description="Открытый математический спринт",
            starts_at=now_utc() + timedelta(days=1),
            ends_at=now_utc() + timedelta(days=2),
            duration_minutes=45,
            status=TournamentStatus.published,
        )
        self.db.add(tournament)
        self.db.flush()
        self.db.add(TournamentQuestion(tournament_id=tournament.id, question_id=question.id, order=1))
        self.db.commit()

        rows = list_public_tournaments(self.db)

        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["status"], "upcoming")
        self.assertEqual(rows[0]["track_title"], "Math Track")
        self.assertEqual(rows[0]["question_count"], 1)
        self.assertNotIn("participation_status", rows[0])


if __name__ == "__main__":
    unittest.main()
