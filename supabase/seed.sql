-- ========================================================
-- SANJION PRO PLATFORM - FULL DATABASE SCHEMA & SEED DATA
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tables Schema
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Code2',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    difficulty VARCHAR(50) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'EXPERT')),
    type VARCHAR(50) CHECK (type IN ('CODING_PRACTICE', 'MULTIPLE_CHOICE', 'THEORY')),
    content TEXT NOT NULL,
    explanation TEXT NOT NULL,
    options JSONB,
    starter_code TEXT,
    test_cases JSONB,
    points INT DEFAULT 10,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'USER',
    provider VARCHAR(50) DEFAULT 'email',
    streak_count INT DEFAULT 0,
    total_points INT DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    status VARCHAR(50) CHECK (status IN ('ATTEMPTED', 'SOLVED')),
    user_answer TEXT,
    score INT DEFAULT 0,
    solved_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow Public Access RLS Policies
DROP POLICY IF EXISTS "Allow public select categories" ON categories;
CREATE POLICY "Allow public select categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public select questions" ON questions;
CREATE POLICY "Allow public select questions" ON questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert questions" ON questions;
CREATE POLICY "Allow public insert questions" ON questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update questions" ON questions;
CREATE POLICY "Allow public update questions" ON questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public all profiles" ON user_profiles;
CREATE POLICY "Allow public all profiles" ON user_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public all progress" ON user_progress;
CREATE POLICY "Allow public all progress" ON user_progress FOR ALL USING (true);

-- 3. Initial Seed Categories
INSERT INTO categories (id, name, slug, description, icon_name, order_index) VALUES 
('10000000-0000-0000-0000-000000000001', 'JavaScript Core', 'javascript-core', 'Biến, Scope, Closure, Event Loop, Async/Await & ES6+', 'Code2', 1),
('10000000-0000-0000-0000-000000000002', 'ReactJS', 'reactjs', 'Virtual DOM, Hooks, Re-render, Fiber Tree & State Management', 'Atom', 2),
('10000000-0000-0000-0000-000000000003', 'HTML & CSS', 'html-css', 'Flexbox, Grid, Responsive, BEM & Modern CSS', 'Layout', 3),
('10000000-0000-0000-0000-000000000004', 'Web Performance & Security', 'web-performance-security', 'Lighthouse, Core Web Vitals, CORS, XSS, CSRF & Caching', 'Zap', 4),
('10000000-0000-0000-0000-000000000005', 'Frontend System Design', 'frontend-system-design', 'Kiến trúc ứng dụng Web lớn, Micro-frontends & Virtual Scroll', 'Layers', 5)
ON CONFLICT (id) DO NOTHING;

-- DIRECT AI GENERATED QUESTIONS --

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '[EASY] Sanjion AI JavaScript Core: Bài tập chuyên sâu #5793',
  'cli-easy-sanjion-ai-javascript-core-b-i-t-p-chuy-n-s-u-5793-7253',
  'EASY',
  'CODING_PRACTICE',
  'Phân tích và triển khai bài tập JavaScript Core cấp độ EASY.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập JavaScript Core.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  10
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000002',
  '[MEDIUM] Sanjion AI ReactJS: Bài tập chuyên sâu #5793',
  'cli-medium-sanjion-ai-reactjs-b-i-t-p-chuy-n-s-u-5793-5195',
  'MEDIUM',
  'MULTIPLE_CHOICE',
  'Phân tích và triển khai bài tập ReactJS cấp độ MEDIUM.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập ReactJS.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  15
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000003',
  '[HARD] Sanjion AI HTML & CSS: Bài tập chuyên sâu #5793',
  'cli-hard-sanjion-ai-html-css-b-i-t-p-chuy-n-s-u-5793-6012',
  'HARD',
  'THEORY',
  'Phân tích và triển khai bài tập HTML & CSS cấp độ HARD.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập HTML & CSS.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  25
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000004',
  '[EXPERT] Sanjion AI Web Performance & Security: Bài tập chuyên sâu #5794',
  'cli-expert-sanjion-ai-web-performance-security-b-i-t-p-chuy-n-s-u-5794-5559',
  'EXPERT',
  'CODING_PRACTICE',
  'Phân tích và triển khai bài tập Web Performance & Security cấp độ EXPERT.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập Web Performance & Security.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  35
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000005',
  '[EASY] Sanjion AI Frontend System Design: Bài tập chuyên sâu #5794',
  'cli-easy-sanjion-ai-frontend-system-design-b-i-t-p-chuy-n-s-u-5794-4928',
  'EASY',
  'MULTIPLE_CHOICE',
  'Phân tích và triển khai bài tập Frontend System Design cấp độ EASY.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập Frontend System Design.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  10
) ON CONFLICT (slug) DO NOTHING;

-- DIRECT AI GENERATED QUESTIONS --

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '[EASY] Sanjion AI JavaScript Core: Bài tập chuyên sâu #8906',
  'cli-easy-sanjion-ai-javascript-core-b-i-t-p-chuy-n-s-u-8906-5381',
  'EASY',
  'CODING_PRACTICE',
  'Phân tích và triển khai bài tập JavaScript Core cấp độ EASY.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập JavaScript Core.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  10
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000002',
  '[MEDIUM] Sanjion AI ReactJS: Bài tập chuyên sâu #8906',
  'cli-medium-sanjion-ai-reactjs-b-i-t-p-chuy-n-s-u-8906-5696',
  'MEDIUM',
  'MULTIPLE_CHOICE',
  'Phân tích và triển khai bài tập ReactJS cấp độ MEDIUM.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập ReactJS.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  15
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000003',
  '[HARD] Sanjion AI HTML & CSS: Bài tập chuyên sâu #8906',
  'cli-hard-sanjion-ai-html-css-b-i-t-p-chuy-n-s-u-8906-3771',
  'HARD',
  'THEORY',
  'Phân tích và triển khai bài tập HTML & CSS cấp độ HARD.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập HTML & CSS.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  25
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000004',
  '[EXPERT] Sanjion AI Web Performance & Security: Bài tập chuyên sâu #8907',
  'cli-expert-sanjion-ai-web-performance-security-b-i-t-p-chuy-n-s-u-8907-9635',
  'EXPERT',
  'CODING_PRACTICE',
  'Phân tích và triển khai bài tập Web Performance & Security cấp độ EXPERT.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập Web Performance & Security.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  35
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '10000000-0000-0000-0000-000000000005',
  '[EASY] Sanjion AI Frontend System Design: Bài tập chuyên sâu #8907',
  'cli-easy-sanjion-ai-frontend-system-design-b-i-t-p-chuy-n-s-u-8907-1338',
  'EASY',
  'MULTIPLE_CHOICE',
  'Phân tích và triển khai bài tập Frontend System Design cấp độ EASY.',
  'Lời giải mẫu chuẩn Senior Sanjioner cho bài tập Frontend System Design.',
  NULL,
  'function solution() {
  // Code solution tại đây
}',
  '[{"input":"return true;","expected":true}]',
  10
) ON CONFLICT (slug) DO NOTHING;

-- ==========================================
-- SEED USER PROFILES WITH ROLES (OWNER, ADMIN, USER)
-- ==========================================
INSERT INTO user_profiles (id, username, full_name, avatar_url, role, streak_count, total_points, target_level, last_active_date) VALUES
(
  'usr-owner-supreme',
  'taicao_owner',
  'Cao Tải (Supreme Owner)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'OWNER',
  42,
  1250,
  'Senior',
  CURRENT_DATE
),
(
  'usr-admin-content',
  'minhanh_admin',
  'Minh Anh (Content Admin)',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'ADMIN',
  15,
  890,
  'Senior',
  CURRENT_DATE
) ON CONFLICT (id) DO NOTHING;