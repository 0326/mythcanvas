-- M7+: 真实账号体系（邮箱验证码 / Magic Link 登录）
-- 依赖: 0001-0010
--
-- 设计要点：
--   1. accounts 是稳定的真实身份（邮箱注册后不再变化），与 guest users 表解耦。
--   2. account_sessions 把 session 与账号解耦：一个账号可有多端 session。
--   3. 游客→注册的数据继承：注册时把旧 guest user_id 的 generation_jobs/favorites
--      批量改挂到 account.id，实现「登录即继承历史」。
--   4. login_nonce 记录待消费的验证码/magic-link token（也镜像存 KV 做热校验，DB 做持久/审计）。

PRAGMA foreign_keys = ON;

-- 1. 账号：邮箱唯一，支持邮箱验证码登录
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,                       -- acc_<uuid>，注册后稳定不变
  email TEXT NOT NULL COLLATE NOCASE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'email',    -- 预留：email | google | github | wechat ...
  provider_subject TEXT,                     -- OAuth 返回的 sub（阶段二）
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email),
  UNIQUE (provider, provider_subject)
);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);

-- 2. session 与账号解耦：多端共用一个账号
CREATE TABLE IF NOT EXISTS account_sessions (
  session_id TEXT PRIMARY KEY,               -- 即 KV 中的 sessionId（与现有 session 体系对齐）
  account_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_account_sessions_account ON account_sessions(account_id);

-- 3. 登录令牌：验证码 / magic link token 统一存这里（DB 持久层，KV 做热缓存）
CREATE TABLE IF NOT EXISTS login_nonces (
  id TEXT PRIMARY KEY,                       -- nonce_<uuid>
  email TEXT NOT NULL COLLATE NOCASE,
  channel TEXT NOT NULL CHECK (channel IN ('otp','magic')),  -- otp=验证码, magic=链接
  code_hash TEXT NOT NULL,                   -- OTP 明文哈希 / magic token 哈希（SHA-256）
  attempts INTEGER NOT NULL DEFAULT 0,       -- 已尝试次数（防爆破）
  consumed INTEGER NOT NULL DEFAULT 0,       -- 是否已消费
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL                   -- 绝对过期时间
);
CREATE INDEX IF NOT EXISTS idx_login_nonces_email ON login_nonces(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_nonces_expires ON login_nonces(expires_at);
