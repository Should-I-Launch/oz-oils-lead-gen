from sqlalchemy import text

from app.shared.database import engine


def get_health_status() -> dict:
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    return {"status": "ok", "database": "ok" if db_ok else "down"}
