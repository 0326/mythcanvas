-- M8: separate registration/login and password authentication.
-- The legacy users table was never used by the application; anonymous identity
-- remains session-only so existing generation/favorite data can still migrate.

PRAGMA foreign_keys = ON;

ALTER TABLE accounts ADD COLUMN password_hash TEXT;
ALTER TABLE accounts ADD COLUMN password_updated_at TEXT;

DROP TABLE IF EXISTS users;

CREATE INDEX IF NOT EXISTS idx_accounts_email_password ON accounts(email, password_hash);
