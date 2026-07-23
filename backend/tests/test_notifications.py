import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models.entities import ArenaUser, Lesson, Notification, NotificationKind, Section, Tournament, Track
from app.services.notifications import (
    create_notification,
    dispatch_streak_reminders,
    notify_lesson_published,
    notify_tournament_published,
)


class NotificationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        self.db = sessionmaker(bind=self.engine)()
        self.now = datetime(2026, 7, 23, 17, tzinfo=timezone.utc)
        self.user = ArenaUser(
            account_user_id="notification-user",
            display_name="Ученик",
            current_streak=4,
            longest_streak=4,
            last_active_date=(self.now - timedelta(days=1)).date(),
        )
        self.db.add(self.user)
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_create_notification_deduplicates_per_user(self):
        for _ in range(2):
            create_notification(
                self.db,
                user_id=self.user.id,
                kind=NotificationKind.lesson,
                title="Новый урок",
                body="Урок доступен.",
                href="/app/track",
                dedupe_key="lesson:1",
            )
        self.db.commit()

        self.assertEqual(self.db.query(Notification).count(), 1)

    def test_published_content_notifies_users_on_the_selected_track(self):
        track = Track(slug="ai", title="AI Track", description="")
        self.db.add(track)
        self.db.flush()
        section = Section(track_id=track.id, title="Основы", order=1)
        self.db.add(section)
        self.db.flush()
        lesson = Lesson(section_id=section.id, title="Нейросети", summary="", theory="Теория", order=1)
        tournament = Tournament(
            track_id=track.id,
            title="AI Sprint",
            description="Турнир по основам AI",
            starts_at=self.now + timedelta(days=1),
            ends_at=self.now + timedelta(days=2),
        )
        self.user.selected_track_id = track.id
        self.db.add_all([lesson, tournament])
        self.db.commit()

        self.assertEqual(notify_lesson_published(self.db, lesson), 1)
        self.assertEqual(notify_tournament_published(self.db, tournament), 1)
        self.db.commit()

        rows = self.db.query(Notification).order_by(Notification.created_at).all()
        self.assertEqual([row.kind for row in rows], [NotificationKind.lesson, NotificationKind.tournament])
        self.assertEqual(rows[0].href, "/app/track")
        self.assertEqual(rows[1].href, "/app/tournament")

    @patch("app.services.notifications._send_push", return_value=True)
    def test_streak_reminder_is_sent_only_once_per_day(self, send_push):
        first = dispatch_streak_reminders(self.db, self.now)
        second = dispatch_streak_reminders(self.db, self.now + timedelta(minutes=10))
        self.db.commit()

        self.assertEqual(first, 1)
        self.assertEqual(second, 0)
        self.assertEqual(self.db.query(Notification).count(), 1)
        send_push.assert_called_once()

    @patch("app.services.notifications._send_push", return_value=True)
    def test_streak_reminder_skips_user_active_today(self, send_push):
        self.user.last_active_date = self.now.date()
        self.db.commit()

        self.assertEqual(dispatch_streak_reminders(self.db, self.now), 0)
        send_push.assert_not_called()


if __name__ == "__main__":
    unittest.main()
