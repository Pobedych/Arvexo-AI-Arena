import unittest
from unittest.mock import patch

from app.main import frontend_origins


class FrontendOriginTests(unittest.TestCase):
    def test_development_accepts_localhost_and_loopback_alias(self):
        with patch("app.main.settings") as settings:
            settings.frontend_url = "http://localhost:3000"
            settings.app_env = "development"
            self.assertEqual(
                frontend_origins(),
                {"http://localhost:3000", "http://127.0.0.1:3000"},
            )

    def test_production_accepts_only_configured_origin(self):
        with patch("app.main.settings") as settings:
            settings.frontend_url = "https://arena.arvexo.ru"
            settings.app_env = "production"
            self.assertEqual(frontend_origins(), {"https://arena.arvexo.ru"})


if __name__ == "__main__":
    unittest.main()
