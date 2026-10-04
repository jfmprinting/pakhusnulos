-- SUPABASE SCHEMA FOR PAK HUSNUL MASTER CONTENT OPERATING SYSTEM
-- 90-DAY REVENUE OPERATING SYSTEM (START 5 OKTOBER 2026)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES IF NEEDED FOR CLEAN INITIALIZATION
DROP TABLE IF EXISTS daily_sales_logs CASCADE;
DROP TABLE IF EXISTS kpi_metrics CASCADE;
DROP TABLE IF EXISTS wa_distribution_playbook CASCADE;
DROP TABLE IF EXISTS youtube_schedule CASCADE;
DROP TABLE IF EXISTS sumber_belajar CASCADE;
DROP TABLE IF EXISTS daily_product_content CASCADE;
DROP TABLE IF EXISTS master_calendar CASCADE;
DROP TABLE IF EXISTS weekly_clusters CASCADE;
DROP TABLE IF EXISTS revenue_phases CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS hero_products CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;

-- 3. SYSTEM CONFIG & ASSUMPTIONS
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(50) UNIQUE NOT NULL DEFAULT 'default',
    target_net_per_day NUMERIC(12, 2) DEFAULT 500000.00,
    days_per_month INT DEFAULT 30,
    ai_sub_per_prod_per_month NUMERIC(12, 2) DEFAULT 350000.00,
    num_hero_products INT DEFAULT 2,
    domain_per_prod_per_year NUMERIC(12, 2) DEFAULT 250000.00,
    affiliate_commission_rate NUMERIC(4, 2) DEFAULT 0.40,
    affiliate_gross_share NUMERIC(4, 2) DEFAULT 0.25,
    control_date DATE DEFAULT '2026-10-04',
    start_date DATE DEFAULT '2026-10-05',
    end_date DATE DEFAULT '2027-01-03',
    wa_public_pool_name VARCHAR(100) DEFAULT 'Guru Mahir AI',
    wa_closed_pool_name VARCHAR(100) DEFAULT 'Aidukasi',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. HERO PRODUCTS & PRICING (MASTER PRODUK/JASA/LAYANAN)
CREATE TABLE hero_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) DEFAULT 'Produk',
    price NUMERIC(12, 2) NOT NULL,
    sales_mix NUMERIC(4, 2) NOT NULL,
    is_hero BOOLEAN DEFAULT TRUE,
    description TEXT DEFAULT '',
    cta_link TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4b. VARIAN PRODUK (PAKET/TIER BESERTA HARGANYA)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES hero_products(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    sales_mix NUMERIC(4, 2) DEFAULT 0.20,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_variant_product ON product_variants(product_id);

-- 5. REVENUE PHASES (Fase 1, 2, 3)
CREATE TABLE revenue_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_number INT UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    day_range VARCHAR(50) NOT NULL,
    start_day_index INT NOT NULL,
    end_day_index INT NOT NULL,
    target_net_per_day NUMERIC(12, 2) NOT NULL,
    target_net_30_days NUMERIC(12, 2) NOT NULL,
    target_gross_per_week NUMERIC(12, 2) NOT NULL,
    description TEXT
);

-- 6. WEEKLY CLUSTERS (13 WEEKS)
CREATE TABLE weekly_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fase_id INT REFERENCES revenue_phases(phase_number),
    revenue_focus VARCHAR(255) NOT NULL,
    primary_campaign VARCHAR(255) NOT NULL,
    youtube_focus VARCHAR(255) NOT NULL,
    yt_longform_1 VARCHAR(255),
    yt_longform_2 VARCHAR(255),
    yt_live VARCHAR(255),
    membership_cluster VARCHAR(255),
    sumber_belajar_outputs TEXT,
    primary_cta VARCHAR(255),
    wa_focus TEXT,
    audience_target TEXT,
    key_revenue_action TEXT,
    affiliate_action TEXT,
    coordination_rule TEXT,
    revenue_target_net NUMERIC(12, 2) DEFAULT 2450000.00,
    revenue_target_gross NUMERIC(12, 2) DEFAULT 2914506.00,
    status VARCHAR(50) DEFAULT 'Planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MASTER CALENDAR (91 DAYS)
CREATE TABLE master_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    week_number INT NOT NULL REFERENCES weekly_clusters(week_number),
    weekly_theme VARCHAR(255) NOT NULL,
    revenue_focus VARCHAR(255) NOT NULL,
    daily_product_content TEXT NOT NULL,
    youtube_content TEXT,
    sumber_belajar_repurpose TEXT,
    apps_content TEXT,
    wa_distribution TEXT NOT NULL,
    primary_cta VARCHAR(255) NOT NULL,
    priority VARCHAR(10) DEFAULT 'P0',
    status VARCHAR(50) DEFAULT 'Planned',
    notes TEXT,
    actual_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DAILY PRODUCT CONTENT (TIKTOK & THREADS)
CREATE TABLE daily_product_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL REFERENCES master_calendar(date),
    week_number INT NOT NULL REFERENCES weekly_clusters(week_number),
    campaign_focus VARCHAR(255) NOT NULL,
    recommended_product VARCHAR(255) NOT NULL,
    channel_minimum VARCHAR(50) DEFAULT '>= 1 post',
    content_angle VARCHAR(50) NOT NULL,
    cta VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planned',
    is_published BOOLEAN DEFAULT FALSE,
    published_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SUMBER BELAJAR ASSETS (50 ITEMS)
CREATE TABLE sumber_belajar (
    id VARCHAR(50) PRIMARY KEY,
    week_number INT NOT NULL REFERENCES weekly_clusters(week_number),
    target_date DATE NOT NULL,
    source_asset VARCHAR(255) NOT NULL,
    menu VARCHAR(50) NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    production_effort VARCHAR(50) NOT NULL,
    cta VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planned',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. YOUTUBE SCHEDULE & ALIGNMENT
CREATE TABLE youtube_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_number INT UNIQUE NOT NULL REFERENCES weekly_clusters(week_number),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fase VARCHAR(50) DEFAULT 'Repositioning',
    focus VARCHAR(255) NOT NULL,
    longform_1 VARCHAR(255) NOT NULL,
    longform_2 VARCHAR(255) NOT NULL,
    live_session VARCHAR(255) NOT NULL,
    shorts_count INT DEFAULT 2,
    watch_target INT DEFAULT 25,
    review_notes TEXT,
    integration_rule TEXT,
    status VARCHAR(50) DEFAULT 'Planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. WA DISTRIBUTION PLAYBOOK (7 DAYS)
CREATE TABLE wa_distribution_playbook (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_name VARCHAR(20) UNIQUE NOT NULL,
    public_pool_theme VARCHAR(255) NOT NULL,
    closed_pool_theme VARCHAR(255) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    typical_cta VARCHAR(255) NOT NULL,
    do_not_rule TEXT NOT NULL,
    sample_template_public TEXT,
    sample_template_closed TEXT
);

-- 12. KPI METRICS & TRACKING (11 METRICS)
CREATE TABLE kpi_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) UNIQUE NOT NULL,
    target_rule VARCHAR(100) NOT NULL,
    actual_value VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Normal',
    notes TEXT,
    category VARCHAR(50) DEFAULT 'Operational',
    sort_order INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. DAILY SALES & PERFORMANCE LOGS
CREATE TABLE daily_sales_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_date DATE UNIQUE NOT NULL,
    modulajar_qty INT DEFAULT 0,
    buatsoal_pro_qty INT DEFAULT 0,
    buatsoal_max_qty INT DEFAULT 0,
    other_products_amount NUMERIC(12, 2) DEFAULT 0.00,
    affiliate_commission_paid NUMERIC(12, 2) DEFAULT 0.00,
    gross_revenue NUMERIC(12, 2) DEFAULT 0.00,
    net_revenue NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_master_cal_date ON master_calendar(date);
CREATE INDEX idx_master_cal_week ON master_calendar(week_number);
CREATE INDEX idx_master_cal_status ON master_calendar(status);
CREATE INDEX idx_daily_prod_date ON daily_product_content(date);
CREATE INDEX idx_sumber_week ON sumber_belajar(week_number);
CREATE INDEX idx_sumber_tier ON sumber_belajar(tier);
CREATE INDEX idx_sumber_menu ON sumber_belajar(menu);

-- ENABLE ROW LEVEL SECURITY AND PERMISSIVE POLICIES FOR ANON
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_product_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE sumber_belajar ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_distribution_playbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sales_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read system_config" ON system_config FOR SELECT USING (true);
CREATE POLICY "Allow public update system_config" ON system_config FOR ALL USING (true);

CREATE POLICY "Allow public read hero_products" ON hero_products FOR SELECT USING (true);
CREATE POLICY "Allow public all hero_products" ON hero_products FOR ALL USING (true);

CREATE POLICY "Allow public read product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public all product_variants" ON product_variants FOR ALL USING (true);

CREATE POLICY "Allow public read revenue_phases" ON revenue_phases FOR SELECT USING (true);
CREATE POLICY "Allow public all revenue_phases" ON revenue_phases FOR ALL USING (true);

CREATE POLICY "Allow public read weekly_clusters" ON weekly_clusters FOR SELECT USING (true);
CREATE POLICY "Allow public all weekly_clusters" ON weekly_clusters FOR ALL USING (true);

CREATE POLICY "Allow public read master_calendar" ON master_calendar FOR SELECT USING (true);
CREATE POLICY "Allow public all master_calendar" ON master_calendar FOR ALL USING (true);

CREATE POLICY "Allow public read daily_product_content" ON daily_product_content FOR SELECT USING (true);
CREATE POLICY "Allow public all daily_product_content" ON daily_product_content FOR ALL USING (true);

CREATE POLICY "Allow public read sumber_belajar" ON sumber_belajar FOR SELECT USING (true);
CREATE POLICY "Allow public all sumber_belajar" ON sumber_belajar FOR ALL USING (true);

CREATE POLICY "Allow public read youtube_schedule" ON youtube_schedule FOR SELECT USING (true);
CREATE POLICY "Allow public all youtube_schedule" ON youtube_schedule FOR ALL USING (true);

CREATE POLICY "Allow public read wa_distribution_playbook" ON wa_distribution_playbook FOR SELECT USING (true);
CREATE POLICY "Allow public all wa_distribution_playbook" ON wa_distribution_playbook FOR ALL USING (true);

CREATE POLICY "Allow public read kpi_metrics" ON kpi_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public all kpi_metrics" ON kpi_metrics FOR ALL USING (true);

CREATE POLICY "Allow public read daily_sales_logs" ON daily_sales_logs FOR SELECT USING (true);
CREATE POLICY "Allow public all daily_sales_logs" ON daily_sales_logs FOR ALL USING (true);
