-- ============================================================
-- MIGRATION 001: MASTER PRODUK/JASA/LAYANAN + VARIAN & HARGA
-- PAK HUSNUL MASTER CONTENT OS
-- Jalankan SEKALI di Supabase Dashboard > SQL Editor > New query
-- Aman dijalankan berulang (idempotent).
-- ============================================================

-- 1. EXTEND hero_products: tipe katalog, deskripsi, link CTA
ALTER TABLE hero_products
  ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'Produk',
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_link TEXT DEFAULT '';

-- Validasi kolom type agar konsisten
UPDATE hero_products SET type = 'Produk' WHERE type IS NULL;

-- 2. TABEL VARIAN PRODUK (paket/tier beserta harganya)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES hero_products(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  sales_mix NUMERIC(4, 2) DEFAULT 0.20,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variant_product ON product_variants(product_id);

-- 3. RLS UNTUK TABEL BARU
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read product_variants" ON product_variants;
CREATE POLICY "Allow public read product_variants" ON product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all product_variants" ON product_variants;
CREATE POLICY "Allow public all product_variants" ON product_variants FOR ALL USING (true);

-- 4. SEED VARIAN AWAL dari produk existing (sekali saja)
--    Pola lama memakai nama "Produk - Paket" di hero_products.
--    Jika product_variants masih kosong, pecah otomatis jadi varian.
INSERT INTO product_variants (product_id, variant_name, price, sales_mix, is_default, sort_order)
SELECT
  hp.id,
  CASE WHEN hp.name LIKE '% - %'
       THEN TRIM(SPLIT_PART(hp.name, ' - ', 2))
       ELSE 'Standar' END,
  hp.price,
  COALESCE(hp.sales_mix, 0.20),
  TRUE,
  0
FROM hero_products hp
WHERE NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = hp.id);

-- ============================================================
-- SELESAI. Setelah menjalankan migration ini:
-- - Refresh web app, buka Pengaturan > Katalog Produk
-- - Setiap produk bisa diekspand untuk mengelola variannya
-- ============================================================
