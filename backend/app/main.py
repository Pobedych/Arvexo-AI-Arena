from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import admin, auth, health, learning, tournaments
from app.core.config import settings, validate_production_settings
from app.services import scheduler

app = FastAPI(title="Arvexo Olympiad Arena API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(settings.frontend_url).rstrip("/")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


@app.middleware("http")
async def csrf_origin_guard(request: Request, call_next):
    if request.method not in SAFE_METHODS:
        allowed = str(settings.frontend_url).rstrip("/")
        origin = request.headers.get("origin")
        referer = request.headers.get("referer")
        if origin and origin.rstrip("/") != allowed:
            return JSONResponse(status_code=403, content={"detail": "Invalid request origin"})
        if not origin and referer and not referer.startswith(allowed + "/"):
            return JSONResponse(status_code=403, content={"detail": "Invalid request referer"})
    return await call_next(request)


@app.on_event("startup")
def on_startup() -> None:
    validate_production_settings(settings)
    scheduler.start()


@app.on_event("shutdown")
def on_shutdown() -> None:
    scheduler.stop()


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(learning.router)
app.include_router(tournaments.router)
app.include_router(admin.router)
