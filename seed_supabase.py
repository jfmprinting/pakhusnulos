import openpyxl
import json
import urllib.request
import datetime

SUPABASE_URL = "https://gaxjcaxvizhvqxxxzagq.supabase.co/rest/v1"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheGpjYXh2aXpodnF4eHh6YWdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEwMDU4NCwiZXhwIjoyMTA2Njc2NTg0fQ.1hlG4h5LDr5Hbg9wBLzWXhjQHLFOTfeo3L-nN_kO8nU"

def post_to_supabase(table, data):
    url = f"{SUPABASE_URL}/{table}"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    body = json.dumps(data, default=str).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        print(f"Error posting to {table}: HTTP {e.code} - {err_msg}")
        raise e

def clean_date(val):
    if val is None:
        return None
    if isinstance(val, datetime.datetime):
        return val.strftime("%Y-%m-%d")
    if isinstance(val, str):
        val = val.strip()
        if "/" in val:
            parts = val.split("/")
            if len(parts) == 3:
                # dd/mm/yyyy
                return f"{parts[2]}-{parts[1]}-{parts[0]}"
        return val[:10]
    return str(val)

def main():
    print("Loading workbook...")
    wb = openpyxl.load_workbook("PAK_HUSNUL_Master_Content_Operating_System_90_Hari_START_5_OKTOBER_2026.xlsx", data_only=True)

    # 1. System Config
    print("Seeding system_config...")
    system_config_data = [{
        "config_key": "default",
        "target_net_per_day": 500000.00,
        "days_per_month": 30,
        "ai_sub_per_prod_per_month": 350000.00,
        "num_hero_products": 2,
        "domain_per_prod_per_year": 250000.00,
        "affiliate_commission_rate": 0.40,
        "affiliate_gross_share": 0.25,
        "control_date": "2026-10-04",
        "start_date": "2026-10-05",
        "end_date": "2027-01-03",
        "wa_public_pool_name": "Guru Mahir AI",
        "wa_closed_pool_name": "Aidukasi"
    }]
    post_to_supabase("system_config", system_config_data)

    # 2. Hero Products
    print("Seeding hero_products...")
    hero_products_data = [
        {"name": "ModulAjar Online", "price": 149000.00, "sales_mix": 0.40, "is_hero": True},
        {"name": "BuatSoal Online Pro", "price": 149000.00, "sales_mix": 0.40, "is_hero": True},
        {"name": "BuatSoal Online Max", "price": 249000.00, "sales_mix": 0.20, "is_hero": True}
    ]
    post_to_supabase("hero_products", hero_products_data)

    # 3. Revenue Phases
    print("Seeding revenue_phases...")
    revenue_phases_data = [
        {
            "phase_number": 1,
            "name": "Fase 1: Reset & Positioning",
            "day_range": "Hari 1-30",
            "start_day_index": 1,
            "end_day_index": 30,
            "target_net_per_day": 350000.00,
            "target_net_30_days": 10500000.00,
            "target_gross_per_week": 2914506.00,
            "description": "Fokus reset customer existing, segmentasi ModulAjar vs BuatSoal, cross-sell awal, dan aktivasi lead magnet pertama."
        },
        {
            "phase_number": 2,
            "name": "Fase 2: Double Down & Affiliate",
            "day_range": "Hari 31-60",
            "start_day_index": 31,
            "end_day_index": 60,
            "target_net_per_day": 4250000.00,
            "target_net_30_days": 12750000.00,
            "target_gross_per_week": 3497840.00,
            "description": "Lead magnet engine 2 jalur, aktivasi affiliate aktif minimal 5-10 orang, dan kampanye normal price berbasis demo/testimonial."
        },
        {
            "phase_number": 3,
            "name": "Fase 3: Series Engine & Scale",
            "day_range": "Hari 61-90",
            "start_day_index": 61,
            "end_day_index": 90,
            "target_net_per_day": 500000.00,
            "target_net_30_days": 15000000.00,
            "target_gross_per_week": 4081173.00,
            "description": "Scale channel pemenang, reverse cross-sell, validasi membership recurring, dan evaluasi 90-day run rate 500K/hari."
        }
    ]
    post_to_supabase("revenue_phases", revenue_phases_data)

    # 4. Weekly Clusters & Source Revenue
    print("Seeding weekly_clusters...")
    ws_wc = wb["WEEKLY CLUSTERS"]
    wc_rows = list(ws_wc.iter_rows(values_only=True))[1:]
    
    ws_sr = wb["SOURCE REVENUE"]
    sr_rows = list(ws_sr.iter_rows(values_only=True))[4:]

    weekly_clusters_data = []
    for r in wc_rows:
        if not r or r[0] is None:
            continue
        week_num = int(r[0])
        # Find matching row in SOURCE REVENUE
        sr_match = None
        for sr in sr_rows:
            if sr and sr[0] and int(sr[0]) == week_num:
                sr_match = sr
                break

        fase_num = 1 if week_num <= 4 else (2 if week_num <= 8 else 3)
        gross_tgt = 2914506.00 if fase_num == 1 else (3497840.00 if fase_num == 2 else 4081173.00)

        item = {
            "week_number": week_num,
            "start_date": clean_date(r[1]),
            "end_date": clean_date(r[2]),
            "fase_id": fase_num,
            "revenue_focus": str(r[3] or ""),
            "primary_campaign": str(r[4] or ""),
            "youtube_focus": str(r[5] or ""),
            "yt_longform_1": str(r[6] or ""),
            "yt_longform_2": str(r[7] or ""),
            "yt_live": str(r[8] or ""),
            "membership_cluster": str(r[9] or ""),
            "sumber_belajar_outputs": str(r[10] or ""),
            "primary_cta": str(r[11] or ""),
            "wa_focus": str(r[12] or ""),
            "audience_target": str(sr_match[6] if sr_match else ""),
            "key_revenue_action": str(sr_match[7] if sr_match else ""),
            "affiliate_action": str(sr_match[8] if sr_match else ""),
            "coordination_rule": str(sr_match[10] if sr_match else ""),
            "revenue_target_net": float(r[13]) if r[13] else 2450000.00,
            "revenue_target_gross": gross_tgt,
            "status": "Planned"
        }
        weekly_clusters_data.append(item)
    post_to_supabase("weekly_clusters", weekly_clusters_data)

    # 5. Master Calendar
    print("Seeding master_calendar...")
    ws_mc = wb["MASTER CALENDAR"]
    mc_rows = list(ws_mc.iter_rows(values_only=True))[1:]
    master_calendar_data = []
    for r in mc_rows:
        if not r or r[0] is None:
            continue
        item = {
            "date": clean_date(r[0]),
            "day_name": str(r[1] or ""),
            "week_number": int(r[2]),
            "weekly_theme": str(r[3] or ""),
            "revenue_focus": str(r[4] or ""),
            "daily_product_content": str(r[5] or ""),
            "youtube_content": str(r[6] or ""),
            "sumber_belajar_repurpose": str(r[7] or ""),
            "apps_content": str(r[8] or ""),
            "wa_distribution": str(r[9] or ""),
            "primary_cta": str(r[10] or ""),
            "priority": str(r[11] or "P0"),
            "status": str(r[12] or "Planned"),
            "notes": str(r[13] or "")
        }
        master_calendar_data.append(item)
    post_to_supabase("master_calendar", master_calendar_data)

    # 6. Daily Product Content
    print("Seeding daily_product_content...")
    ws_dp = wb["DAILY PRODUCT"]
    dp_rows = list(ws_dp.iter_rows(values_only=True))[1:]
    daily_product_data = []
    for r in dp_rows:
        if not r or r[0] is None:
            continue
        item = {
            "date": clean_date(r[0]),
            "week_number": int(r[1]),
            "campaign_focus": str(r[2] or ""),
            "recommended_product": str(r[3] or ""),
            "channel_minimum": str(r[4] or ">= 1 post"),
            "content_angle": str(r[5] or ""),
            "cta": str(r[6] or ""),
            "status": str(r[7] or "Planned"),
            "is_published": bool(r[8] == "Yes" or r[8] is True),
            "published_url": str(r[9] or "") if r[9] else None,
            "notes": str(r[9] or "")
        }
        daily_product_data.append(item)
    post_to_supabase("daily_product_content", daily_product_data)

    # 7. Sumber Belajar
    print("Seeding sumber_belajar...")
    ws_sb = wb["SUMBER BELAJAR"]
    sb_rows = list(ws_sb.iter_rows(values_only=True))[1:]
    sumber_belajar_data = []
    for r in sb_rows:
        if not r or r[0] is None:
            continue
        item = {
            "id": str(r[0]),
            "week_number": int(r[1]),
            "target_date": clean_date(r[2]),
            "source_asset": str(r[3] or ""),
            "menu": str(r[4] or ""),
            "content_title": str(r[5] or ""),
            "tier": str(r[6] or "FREE"),
            "source_type": str(r[7] or "Repurpose"),
            "production_effort": str(r[8] or "Low"),
            "cta": str(r[9] or ""),
            "status": str(r[10] or "Planned"),
            "notes": str(r[11] or "")
        }
        sumber_belajar_data.append(item)
    post_to_supabase("sumber_belajar", sumber_belajar_data)

    # 8. YouTube Schedule
    print("Seeding youtube_schedule...")
    ws_yt = wb["YT ALIGNMENT"]
    yt_rows = list(ws_yt.iter_rows(values_only=True))[1:]
    
    ws_syt = wb["SOURCE YOUTUBE"]
    syt_rows = list(ws_syt.iter_rows(values_only=True))[1:]

    youtube_schedule_data = []
    for r in yt_rows:
        if not r or r[0] is None:
            continue
        week_num = int(r[0])
        syt_match = None
        for s in syt_rows:
            if s and s[0] and int(s[0]) == week_num:
                syt_match = s
                break

        item = {
            "week_number": week_num,
            "start_date": clean_date(r[1]),
            "end_date": clean_date(r[2]),
            "fase": str(syt_match[3] if syt_match else "Repositioning"),
            "focus": str(r[3] or ""),
            "longform_1": str(r[4] or ""),
            "longform_2": str(r[5] or ""),
            "live_session": str(r[6] or ""),
            "shorts_count": int(r[7]) if r[7] else 2,
            "watch_target": int(r[8]) if r[8] else 25,
            "review_notes": str(r[9] or ""),
            "integration_rule": str(r[10] or ""),
            "status": "Planned"
        }
        youtube_schedule_data.append(item)
    post_to_supabase("youtube_schedule", youtube_schedule_data)

    # 9. WA Distribution Playbook
    print("Seeding wa_distribution_playbook...")
    ws_wa = wb["WA DISTRIBUTION"]
    wa_rows = list(ws_wa.iter_rows(values_only=True))[1:]
    
    templates = {
        "Monday": {
            "public": "Selamat pagi rekan-rekan Guru Mahir AI! Berapa jam waktu yang dihabiskan pekan lalu untuk menyusun modul ajar dan kisi-kisi soal? Di pekan ini kita akan bahas bagaimana AI memangkas 80% beban tersebut.",
            "closed": "Halo rekan-rekan pendidik di Aidukasi. Menindaklanjuti kurikulum pekan ini, mari kita dalami problem utama administrasi guru semester ini dan bagaimana otomasi AI menyelesaikannya secara tuntas."
        },
        "Tuesday": {
            "public": "Halo Bapak/Ibu! Video YouTube terbaru kami sudah tayang: tonton studi kasus langsung bagaimana aplikasi guru dibuat tanpa coding.",
            "closed": "Video terbaru di YouTube sudah live! Khusus untuk member Aidukasi, ini rangkuman arsitektur prompt dan context template yang bisa langsung Anda pakai."
        },
        "Wednesday": {
            "public": "Kabar gembira! Hari ini kami membagikan 1 Resource / Prompt Gratis untuk merapikan modul ajar. Download gratis melalui link pakhusnul.id/free-resource.",
            "closed": "Akses materi baru di member vault Aidukasi: Prompt lanjutan + penjelasan mendalam mengapa teknik ini bekerja lebih optimal untuk soal kurikulum merdeka."
        },
        "Thursday": {
            "public": "Tutorial praktis hari Kamis: langkah demi langkah membuat kisi-kisi dan butir soal HOTS dalam 5 menit menggunakan BuatSoal Online.",
            "closed": "Deep workflow Kamis untuk member Aidukasi: integrasi BuatSoal Online Pro langsung ke lembar kerja siswa tanpa proses manual."
        },
        "Friday": {
            "public": "Video YouTube #2 pekan ini sudah siap: saksikan bagaimana studi kasus nyata implementasi AI di ruang kelas.",
            "closed": "Studi kasus Jumat untuk komunitas Aidukasi: bedah keberhasilan guru sekolah mitra yang berhasil menghemat 15 jam kerja per minggu."
        },
        "Saturday": {
            "public": "Checklist akhir pekan: 5 hal yang perlu disiapkan agar pembelajaran pekan depan lebih santai dan terencana.",
            "closed": "Resource & checklist akhir pekan khusus member: unduh template cheatsheet terintegrasi sebelum live session besok malam."
        },
        "Sunday": {
            "public": "Malam ini kita ada LIVE session YouTube! Bergabung bersama ratusan guru hebat lainnya untuk praktik langsung membuat web app edukasi.",
            "closed": "Pengingat sesi Live malam ini untuk member Aidukasi: siapkan pertanyaan spesifik di ruang member area untuk sesi Q&A prioritas."
        }
    }

    wa_playbook_data = []
    for r in wa_rows:
        if not r or r[0] is None:
            continue
        day_name = str(r[0])
        tpl = templates.get(day_name, {"public": "", "closed": ""})
        item = {
            "day_name": day_name,
            "public_pool_theme": str(r[1] or ""),
            "closed_pool_theme": str(r[2] or ""),
            "purpose": str(r[3] or ""),
            "typical_cta": str(r[4] or ""),
            "do_not_rule": str(r[5] or ""),
            "sample_template_public": tpl["public"],
            "sample_template_closed": tpl["closed"]
        }
        wa_playbook_data.append(item)
    post_to_supabase("wa_distribution_playbook", wa_playbook_data)

    # 10. KPI Metrics
    print("Seeding kpi_metrics...")
    ws_kpi = wb["KPI DASHBOARD"]
    kpi_rows = list(ws_kpi.iter_rows(values_only=True))[3:]
    kpi_metrics_data = []
    idx = 1
    for r in kpi_rows:
        if not r or r[0] is None:
            continue
        item = {
            "metric_name": str(r[0]),
            "target_rule": str(r[1] or ""),
            "actual_value": str(r[2] or "-"),
            "status": "On Track",
            "notes": str(r[4] or ""),
            "category": "Cross-Engine",
            "sort_order": idx
        }
        idx += 1
        kpi_metrics_data.append(item)
    post_to_supabase("kpi_metrics", kpi_metrics_data)

    print("ALL 11 TABLES SEEDED SUCCESSFULLY INTO SUPABASE!")

if __name__ == "__main__":
    main()
