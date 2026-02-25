-- ============================================================
-- LIXIN CONSULTING - SUPABASE DATABASE SCHEMA
-- Công ty TNHH Dịch vụ và Tư vấn Lixin
-- ============================================================

-- ============================================================
-- 1. BẢNG TIN TỨC (NEWS / BLOG POSTS)
-- Lưu trữ bài viết đa ngôn ngữ, hỗ trợ Admin & AI Agent
-- ============================================================
CREATE TABLE news (
  -- === Khóa chính ===
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- === Thời gian ===
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,     -- Ngày tạo bài viết
  updated_at    TIMESTAMPTZ DEFAULT NOW(),               -- Ngày cập nhật gần nhất
  published_at  TIMESTAMPTZ,                             -- Ngày xuất bản (null = bản nháp)

  -- === Tác giả ===
  author        TEXT NOT NULL DEFAULT 'Lixin Admin',     -- Tên tác giả hiển thị
  author_role   TEXT NOT NULL DEFAULT 'admin'             -- 'admin' | 'ai_agent'
                CHECK (author_role IN ('admin', 'ai_agent')),

  -- === Trạng thái ===
  status        TEXT NOT NULL DEFAULT 'published'        -- Trạng thái bài viết
                CHECK (status IN ('draft', 'published', 'archived')),
  is_highlight  BOOLEAN DEFAULT FALSE,                   -- Hiển thị nổi bật trên trang chủ?

  -- === Hình ảnh ===
  cover_image   TEXT,                                    -- URL ảnh bìa
  thumbnail     TEXT,                                    -- URL ảnh thu nhỏ (cho danh sách)

  -- === Danh mục & Tags ===
  category      TEXT DEFAULT 'general'                   -- Phân loại bài viết
                CHECK (category IN ('general', 'tax_update', 'accounting', 'legal', 'ai_insight', 'company_news')),
  tags          TEXT[],                                  -- Mảng các tag, ví dụ: {'thuế 2026', 'GTGT', 'TNCN'}

  -- === Nội dung Tiếng Việt ===
  title_vi      TEXT NOT NULL,                           -- Tiêu đề (Việt)
  excerpt_vi    TEXT,                                    -- Tóm tắt ngắn (Việt)
  content_vi    TEXT,                                    -- Nội dung đầy đủ (Việt) - HTML hoặc Markdown

  -- === Nội dung Tiếng Anh ===
  title_en      TEXT,                                    -- Tiêu đề (Anh)
  excerpt_en    TEXT,                                    -- Tóm tắt ngắn (Anh)
  content_en    TEXT,                                    -- Nội dung đầy đủ (Anh)

  -- === Nội dung Tiếng Trung ===
  title_zh      TEXT,                                    -- Tiêu đề (Trung)
  excerpt_zh    TEXT,                                    -- Tóm tắt ngắn (Trung)
  content_zh    TEXT,                                    -- Nội dung đầy đủ (Trung)

  -- === SEO ===
  slug          TEXT UNIQUE,                             -- URL thân thiện, ví dụ: "tu-van-thue-2026"
  meta_desc_vi  TEXT,                                    -- Mô tả SEO (Việt)
  meta_desc_en  TEXT,                                    -- Mô tả SEO (Anh)
  meta_desc_zh  TEXT,                                    -- Mô tả SEO (Trung)

  -- === Thống kê ===
  view_count    INT DEFAULT 0,                           -- Số lượt xem
  like_count    INT DEFAULT 0                            -- Số lượt thích
);

-- Index cho truy vấn nhanh
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_highlight ON news(is_highlight) WHERE is_highlight = TRUE;
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(published_at DESC);
CREATE INDEX idx_news_slug ON news(slug);

-- Tự động cập nhật updated_at khi sửa bài
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();


-- ============================================================
-- 2. BẢNG LIÊN HỆ KHÁCH HÀNG (CONTACTS / LEADS)
-- Lưu trữ thông tin khách hàng gửi form yêu cầu tư vấn
-- ============================================================
CREATE TABLE contacts (
  -- === Khóa chính ===
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- === Thời gian ===
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,      -- Ngày gửi yêu cầu
  updated_at    TIMESTAMPTZ DEFAULT NOW(),               -- Lần cập nhật gần nhất

  -- === Thông tin khách hàng ===
  name          TEXT NOT NULL,                            -- Họ tên khách hàng
  phone         TEXT NOT NULL,                            -- Số điện thoại
  email         TEXT,                                     -- Email (tùy chọn)
  company_name  TEXT,                                     -- Tên công ty (nếu có)
  tax_code      TEXT,                                     -- Mã số thuế doanh nghiệp
  
  -- === Chi tiết yêu cầu ===
  service_type  TEXT DEFAULT 'general'                    -- Loại dịch vụ quan tâm
                CHECK (service_type IN (
                  'general',           -- Tư vấn chung
                  'tax_report',        -- Báo cáo thuế trọn gói
                  'bookkeeping',       -- Khôi phục sổ sách
                  'tax_strategy',      -- Tư vấn chiến lược thuế
                  'company_setup',     -- Thành lập doanh nghiệp
                  'other'              -- Khác
                )),
  message       TEXT,                                     -- Nội dung tin nhắn / ghi chú thêm
  
  -- === Ngôn ngữ giao tiếp ===
  language      TEXT DEFAULT 'vi'                         -- Ngôn ngữ khách hàng đang dùng khi gửi
                CHECK (language IN ('vi', 'en', 'zh')),

  -- === Nguồn tiếp cận ===
  source        TEXT DEFAULT 'website'                    -- Nguồn khách hàng đến từ đâu
                CHECK (source IN (
                  'website',        -- Form trên trang web
                  'facebook',       -- Facebook
                  'zalo',           -- Zalo
                  'referral',       -- Giới thiệu
                  'google',         -- Google Ads / Search
                  'other'           -- Khác
                )),
  utm_source    TEXT,                                     -- UTM tracking source
  utm_medium    TEXT,                                     -- UTM tracking medium
  utm_campaign  TEXT,                                     -- UTM tracking campaign
  
  -- === Quản lý CRM nội bộ ===
  status        TEXT DEFAULT 'new'                        -- Trạng thái xử lý lead
                CHECK (status IN (
                  'new',            -- Mới nhận, chưa xử lý
                  'contacted',      -- Đã liên hệ lần đầu
                  'in_progress',    -- Đang trao đổi / chăm sóc
                  'quoted',         -- Đã gửi báo giá
                  'converted',      -- Đã trở thành khách hàng
                  'lost',           -- Không chuyển đổi
                  'spam'            -- Spam
                )),
  assigned_to   TEXT,                                     -- Nhân viên được phân công xử lý
  priority      TEXT DEFAULT 'normal'                     -- Mức độ ưu tiên
                CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  notes         TEXT,                                     -- Ghi chú nội bộ của nhân viên
  followed_up_at TIMESTAMPTZ,                             -- Thời điểm chăm sóc gần nhất

  -- === Thông tin bổ sung ===
  ip_address    TEXT,                                     -- IP khách truy cập (để chống spam)
  user_agent    TEXT                                      -- Trình duyệt / thiết bị
);

-- Index cho truy vấn nhanh
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX idx_contacts_priority ON contacts(priority) WHERE priority IN ('high', 'urgent');
CREATE INDEX idx_contacts_assigned ON contacts(assigned_to);

-- Trigger tự cập nhật updated_at
CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();


-- ============================================================
-- 3. (TÙY CHỌN) BẢNG QUẢN TRỊ VIÊN (ADMIN USERS)
-- Nếu bạn muốn phân quyền đăng nhập cho Admin Portal
-- ============================================================
CREATE TABLE admin_users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  email         TEXT UNIQUE NOT NULL,                     -- Email đăng nhập
  full_name     TEXT NOT NULL,                            -- Họ tên
  role          TEXT NOT NULL DEFAULT 'editor'            -- Vai trò
                CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  avatar_url    TEXT,                                     -- Ảnh đại diện
  is_active     BOOLEAN DEFAULT TRUE,                    -- Tài khoản còn hoạt động?
  last_login_at TIMESTAMPTZ                              -- Lần đăng nhập gần nhất
);


-- ============================================================
-- 4. (TÙY CHỌN) BẢNG LỊCH SỬ HOẠT ĐỘNG (AUDIT LOG)
-- Ghi lại mọi hành động của Admin và AI Agent
-- ============================================================
CREATE TABLE activity_log (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  actor         TEXT NOT NULL,                            -- Ai thực hiện: admin email hoặc 'ai_agent'
  action        TEXT NOT NULL,                            -- Hành động: 'create_post', 'delete_post', 
                                                         --            'update_status', 'reply_contact'...
  target_table  TEXT,                                     -- Bảng bị ảnh hưởng: 'news', 'contacts'
  target_id     BIGINT,                                   -- ID bản ghi bị ảnh hưởng
  details       JSONB,                                    -- Chi tiết bổ sung dưới dạng JSON
  ip_address    TEXT                                      -- IP người thực hiện
);

CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_activity_actor ON activity_log(actor);


-- ============================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- ============================================================
-- 1. Đăng nhập Supabase Dashboard > SQL Editor
-- 2. Paste toàn bộ file này vào và nhấn "Run"
-- 3. Kiểm tra tab "Table Editor" để thấy 4 bảng đã được tạo
-- 4. Cập nhật file src/supabase.js với URL và Anon Key
-- 5. Đổi USE_MOCK = false trong src/newsStorage.js
-- ============================================================
