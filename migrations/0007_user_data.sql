-- M6: 用户数据关联
-- 依赖: 0006_review_workflow.sql

-- 生成任务关联创建者（用于"我的绘神"）
ALTER TABLE generation_jobs ADD COLUMN user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id, created_at DESC);