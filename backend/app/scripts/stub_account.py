"""Minimal local stand-in for Arvexo Account SSO, for manual/browser end-to-end verification only.

Not part of the product; never imported by the real app.
"""

import secrets
from urllib.parse import urlencode

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

app = FastAPI(title="Stub Arvexo Account")

DEMO_USER = {"id": "demo-account-1", "email": "demo.student@arvexo.ru", "name": "Демо Ученик", "avatar_url": None}

_codes: dict[str, dict] = {}


@app.get("/sso/start")
def sso_start(client_id: str, redirect_uri: str, state: str):
    code = secrets.token_urlsafe(16)
    _codes[code] = DEMO_USER
    params = {"code": code, "state": state}
    return RedirectResponse(f"{redirect_uri}?{urlencode(params)}", status_code=302)


class ExchangeIn(BaseModel):
    client_id: str
    client_secret: str
    code: str
    redirect_uri: str


@app.post("/sso/exchange")
def sso_exchange(payload: ExchangeIn):
    account_user = _codes.pop(payload.code, None)
    if not account_user:
        return {"detail": "invalid code"}, 401
    return {"account_user": account_user}
