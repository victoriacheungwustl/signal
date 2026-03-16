CREATE TABLE IF NOT EXISTS feedback (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  source    TEXT NOT NULL,
  content   TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  theme     TEXT NOT NULL,
  urgency   TEXT NOT NULL
);
