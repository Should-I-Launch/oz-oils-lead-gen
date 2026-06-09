from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import importlib
import importlib.util
import pkgutil

from app.shared.config import settings

app = FastAPI(title="Boilerplate API", debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-mount all feature routers
import app.features as features_pkg

for _, name, ispkg in pkgutil.iter_modules(features_pkg.__path__):
    if not ispkg:
        continue
    module_name = f"app.features.{name}.router"
    if importlib.util.find_spec(module_name) is None:
        continue
    mod = importlib.import_module(module_name)
    if hasattr(mod, "router"):
        app.include_router(mod.router)


@app.get("/")
async def root():
    return {"service": "boilerplate-api", "status": "ok"}
