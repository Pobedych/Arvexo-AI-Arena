import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models.entities import Lesson, LessonStep, Question, Track
from app.scripts.seed_math import seed_math


class MathSeedTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.db = sessionmaker(bind=self.engine)()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_seed_creates_published_interactive_track_and_is_idempotent(self):
        first = seed_math(self.db)
        self.db.commit()
        second = seed_math(self.db)

        self.assertEqual(first.id, second.id)
        self.assertEqual(self.db.query(Track).filter(Track.slug == "math").count(), 1)
        self.assertEqual(self.db.query(Lesson).count(), 6)
        self.assertEqual(self.db.query(LessonStep).count(), 7)
        self.assertEqual(self.db.query(Question).count(), 7)


if __name__ == "__main__":
    unittest.main()
