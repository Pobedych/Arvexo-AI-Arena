# Deploy Arvexo Olympiad Arena

This project is deployed as Docker Compose:

- `postgres` for Arena data;
- `backend` FastAPI;
- `frontend` Next.js;
- `nginx` as the internal HTTP entrypoint.

## 1. VPS setup

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker nginx
sudo mkdir -p /var/www/Arvexo-Arena
sudo chown -R "$USER":"$USER" /var/www/Arvexo-Arena
```

Upload or clone this repository to `/var/www/Arvexo-Arena`.

## 2. Arena environment

```bash
cd /var/www/Arvexo-Arena
cp backend/.env.example backend/.env
nano backend/.env
```

Production example:

```env
APP_ENV=production
DATABASE_URL=postgresql+psycopg://arvexo:CHANGE_ME@postgres:5432/arvexo_arena

FRONTEND_URL=https://arena.arvexo.ru
ACCOUNT_API_URL=https://api.account.arvexo.ru
ACCOUNT_SSO_START_URL=https://api.account.arvexo.ru/sso/start
ARENA_SSO_CLIENT_ID=arvexo-arena
ARENA_SSO_CLIENT_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
ARENA_SSO_REDIRECT_URI=https://arena.arvexo.ru/api/auth/callback

SESSION_COOKIE_NAME=arena_session
SESSION_TTL_DAYS=30
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
ADMIN_ACCOUNT_IDS=
ADMIN_EMAILS=your-admin-email@arvexo.ru
```

Set the same DB password in `docker-compose.yml` under `POSTGRES_PASSWORD`, or override it with a production compose/env setup.

## 3. Start Arena

```bash
cd /var/www/Arvexo-Arena
ARENA_HTTP_PORT=9200 docker compose up -d --build
docker compose exec backend python -m app.scripts.seed
curl http://127.0.0.1:9200/api/health
```

Database schema is managed by Alembic and applied automatically on every
container start (`backend/Dockerfile` runs `python -m app.scripts.migrate`
before `uvicorn`). New migrations just need to be committed to
`backend/alembic/versions/` — no manual SQL step required. To create a new
migration after changing a model:

```bash
cd backend && source .venv/bin/activate
DATABASE_URL=sqlite:///./arena_dev.db alembic revision --autogenerate -m "describe the change"
```

Always review the generated migration file before committing.

## 4. Public nginx reverse proxy

Create `/etc/nginx/sites-available/arena.arvexo.ru`:

```nginx
server {
    listen 80;
    server_name arena.arvexo.ru;

    location / {
        proxy_pass http://127.0.0.1:9200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/arena.arvexo.ru /etc/nginx/sites-enabled/arena.arvexo.ru
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d arena.arvexo.ru
```

## 5. Register Arena in Arvexo Account

On the Arvexo Account VPS/repository, add an OAuth client:

```bash
cd /var/www/Arvexo-Account
docker compose exec backend python - <<'PY'
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.oauth_client import OAuthClient

CLIENT_ID = "arvexo-arena"
CLIENT_SECRET = "REPLACE_WITH_THE_SAME_SECRET_AS_ARENA_ENV"
REDIRECT_URI = "https://arena.arvexo.ru/api/auth/callback"
ORIGIN = "https://arena.arvexo.ru"

with SessionLocal() as db:
    client = db.query(OAuthClient).filter(OAuthClient.client_id == CLIENT_ID).one_or_none()
    if client is None:
        client = OAuthClient(
            client_id=CLIENT_ID,
            client_secret_hash=hash_password(CLIENT_SECRET),
            name="Arvexo Olympiad Arena",
            allowed_redirect_uris=[REDIRECT_URI],
            allowed_origins=[ORIGIN],
            is_active=True,
        )
        db.add(client)
    else:
        client.client_secret_hash = hash_password(CLIENT_SECRET)
        client.allowed_redirect_uris = [REDIRECT_URI]
        client.allowed_origins = [ORIGIN]
        client.is_active = True
    db.commit()
    print("Arena SSO client is ready")
PY
```

The `CLIENT_SECRET` must exactly match `ARENA_SSO_CLIENT_SECRET` in `backend/.env`.

## 6. Test SSO

Open:

```text
https://arena.arvexo.ru/login
```

Click `Продолжить с Arvexo Account`.

Expected flow:

```text
Arena /api/auth/start
→ Account /sso/start
→ Account login or consent
→ Arena /api/auth/callback
→ /app/dashboard
```

Admin panel:

```text
https://arena.arvexo.ru/admin
```

Your Account email or Account ID must be listed in `ADMIN_EMAILS` or `ADMIN_ACCOUNT_IDS`.

## 7. GitHub Actions CI/CD

The repository includes `.github/workflows/deploy.yml`.

Add these GitHub Actions secrets:

```text
VPS_HOST=your.server.ip
VPS_USER=root
VPS_SSH_KEY=private SSH key with access to the server
```

`VPS_PROJECT_PATH=/var/www/Arvexo-Arena` and `ARENA_HTTP_PORT=9200` are not secrets; they are stored directly in `.github/workflows/deploy.yml`.

The matching public SSH key must be present on the VPS:

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

The workflow runs on pushes to `main`, `master`, and `feat/mvp`, and can also be started manually from GitHub Actions.

Deploy flow:

```text
checkout
frontend lint/build
backend compile
tar project
upload to VPS
extract into /var/www/Arvexo-Arena
keep backend/.env on server
docker compose up -d --build
seed AI Track
health check /api/health
```
