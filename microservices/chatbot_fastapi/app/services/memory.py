import json
import sqlite3
from pathlib import Path
from typing import Dict, Any, List, Tuple
from datetime import datetime

from ..config.settings import settings

DB_PATH = str(settings.sqlite_path)

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS students (
  student_id TEXT PRIMARY KEY,
  profile_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(student_id) REFERENCES students(student_id)
);
"""


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_db():
    # Ensure directory exists
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    with _connect() as conn:
        conn.executescript(SCHEMA_SQL)
        conn.commit()


def get_student_profile(student_id: str) -> Dict[str, Any]:
    ensure_db()
    with _connect() as conn:
        cur = conn.execute("SELECT profile_json FROM students WHERE student_id = ?", (student_id,))
        row = cur.fetchone()
        if row:
            return json.loads(row["profile_json"]) or {}
        return {}


def upsert_student_profile(student_id: str, profile: Dict[str, Any]) -> None:
    ensure_db()
    with _connect() as conn:
        profile_json = json.dumps(profile)
        conn.execute(
            "INSERT INTO students(student_id, profile_json) VALUES(?, ?) ON CONFLICT(student_id) DO UPDATE SET profile_json = excluded.profile_json",
            (student_id, profile_json),
        )
        conn.commit()


def add_message(student_id: str, role: str, content: str) -> None:
    ensure_db()
    with _connect() as conn:
        conn.execute(
            "INSERT INTO messages(student_id, role, content, created_at) VALUES(?, ?, ?, ?)",
            (student_id, role, content, datetime.utcnow().isoformat()),
        )
        conn.commit()
        print(f"DEBUG: Stored message for {student_id}: {role}={content[:50]}...")


def get_history(student_id: str, limit: int = 20) -> List[Tuple[str, str]]:
    ensure_db()
    with _connect() as conn:
        cur = conn.execute(
            "SELECT role, content FROM messages WHERE student_id = ? ORDER BY id DESC LIMIT ?",
            (student_id, limit),
        )
        rows = cur.fetchall()
        # Return in chronological order
        result = [(r["role"], r["content"]) for r in rows][::-1]
        print(f"DEBUG: Retrieved {len(result)} messages for {student_id}")
        return result
