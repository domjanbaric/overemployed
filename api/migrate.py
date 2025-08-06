"""Utility script to bootstrap the database schema for PostgreSQL.

This module can be executed directly or imported. When run, it will create
all tables defined in the SQLAlchemy models. For safety, it skips execution if
`DATABASE_URL` points to a SQLite database, as SQLite is handled automatically
on application startup.
"""

from sqlalchemy.exc import SQLAlchemyError

from .database import Base, engine, SQLALCHEMY_DATABASE_URL


def run() -> None:
    """Create database tables using SQLAlchemy metadata."""
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        # SQLite databases are created automatically when the app starts.
        print("SQLite environment detected; skipping explicit migration run.")
        return

    print(f"Running migrations on {SQLALCHEMY_DATABASE_URL}...")
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError as exc:  # pragma: no cover - error path
        raise SystemExit(f"Migration failed: {exc}") from exc
    else:
        print("Database schema is up to date.")


if __name__ == "__main__":
    run()
