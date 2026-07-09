# Arvexo Arena Backend

FastAPI backend for Arvexo Olympiad Arena MVP.

## Local Run

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
python -m app.scripts.seed
```

SSO uses Arvexo Account authorization-code flow:

```text
GET /auth/start -> Account /sso/start -> /auth/callback -> local Arena session
```

For local Account integration, register an Account OAuth client:

```env
client_id=arvexo-arena
client_secret=dev_arena_secret
redirect_uri=http://localhost:8000/auth/callback
```

Arena stores only local educational state and `account_user_id`; passwords and Account refresh sessions stay in Arvexo Account.
