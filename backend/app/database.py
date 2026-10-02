import sqlite3
from pathlib import Path

from app.config import settings


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(settings.database_path)
    connection.row_factory = sqlite3.Row
    return connection


def init_database() -> None:
    connection = get_connection()

    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_sub TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            picture TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            university TEXT NOT NULL,
            degree TEXT NOT NULL,
            academic_year INTEGER NOT NULL,
            skills TEXT NOT NULL DEFAULT '[]',
            projects TEXT NOT NULL DEFAULT '[]',
            interests TEXT NOT NULL DEFAULT '[]',
            preferred_locations TEXT NOT NULL DEFAULT '[]',
            preferred_work_modes TEXT NOT NULL DEFAULT '[]',
            availability TEXT NOT NULL,
            internship_duration TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        """
    )

    connection.commit()
    connection.close()