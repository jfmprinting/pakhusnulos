import csv
import json
import os
import urllib.request

SUPABASE_URL = "https://gaxjcaxvizhvqxxxzagq.supabase.co/rest/v1"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdheGpjYXh2aXpodnF4eHh6YWdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEwMDU4NCwiZXhwIjoyMTA2Njc2NTg0fQ.1hlG4h5LDr5Hbg9wBLzWXhjQHLFOTfeo3L-nN_kO8nU"

APP_PATH = r"D:\1. MIZTERGOOD\04 - Keuangan dan Bisnis\your-awesome-app-main"

def post_batch(table, items):
    url = f"{SUPABASE_URL}/{table}"
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    # post in batches of 50
    for i in range(0, len(items), 50):
        batch = items[i:i+50]
        body = json.dumps(batch, default=str).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                pass
        except urllib.error.HTTPError as e:
            print(f"Error {table}: {e.code} - {e.read().decode()[:300]}")
            raise e

def read_csv(filename):
    path = os.path.join(APP_PATH, filename)
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        return list(reader)

def main():
    print("Migrating Post & Cuan CSV data to Supabase...")

    # 1. Platforms
    print("1. Migrating platforms...")
    platforms_csv = [f for f in os.listdir(APP_PATH) if f.startswith("platforms-export")][0]
    p_rows = read_csv(platforms_csv)
    p_data = []
    for r in p_rows:
        p_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "name": r["name"],
            "icon": r["icon"],
            "daily_target": int(r["daily_target"]) if r["daily_target"] else 1,
            "frequency": r.get("frequency", "daily"),
            "created_at": r["created_at"]
        })
    post_batch("platforms", p_data)
    print(f"   Imported {len(p_data)} platforms.")

    # 2. User Settings
    print("2. Migrating user_settings...")
    settings_csv = [f for f in os.listdir(APP_PATH) if f.startswith("user_settings-export")][0]
    s_rows = read_csv(settings_csv)
    s_data = []
    for r in s_rows:
        s_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "lock_hour": int(r["lock_hour"]) if r["lock_hour"] else 20,
            "daily_net_target": float(r.get("daily_net_target", 500000)),
            "monthly_net_target": float(r.get("monthly_net_target", 15000000)),
            "affiliate_rate": float(r.get("affiliate_rate", 0.40)),
            "monthly_fixed_cost": float(r.get("monthly_fixed_cost", 742000)),
            "weekly_gross_target": float(r.get("weekly_gross_target", 0)),
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })
    post_batch("user_settings", s_data)
    print(f"   Imported {len(s_data)} user_settings.")

    # 3. User XP
    print("3. Migrating user_xp...")
    xp_csv = [f for f in os.listdir(APP_PATH) if f.startswith("user_xp-export")][0]
    xp_rows = read_csv(xp_csv)
    xp_data = []
    for r in xp_rows:
        xp_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "total_xp": int(r["total_xp"]) if r["total_xp"] else 0,
            "level": int(r["level"]) if r["level"] else 1,
            "updated_at": r["updated_at"]
        })
    post_batch("user_xp", xp_data)
    print(f"   Imported {len(xp_data)} user_xp (Level {xp_data[0]['level']}, XP {xp_data[0]['total_xp']}).")

    # 4. User Badges
    print("4. Migrating user_badges...")
    badges_csv = [f for f in os.listdir(APP_PATH) if f.startswith("user_badges-export")][0]
    b_rows = read_csv(badges_csv)
    b_data = []
    for r in b_rows:
        b_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "badge_id": r["badge_id"],
            "unlocked_at": r["unlocked_at"]
        })
    post_batch("user_badges", b_data)
    print(f"   Imported {len(b_data)} user_badges.")

    # 5. Revenue Sources
    print("5. Migrating revenue_sources...")
    rev_csv = [f for f in os.listdir(APP_PATH) if f.startswith("revenue_sources-export")][0]
    rev_rows = read_csv(rev_csv)
    rev_data = []
    for r in rev_rows:
        rev_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "name": r["name"],
            "emoji": r["emoji"],
            "color": r["color"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })
    post_batch("revenue_sources", rev_data)
    print(f"   Imported {len(rev_data)} revenue_sources.")

    # 6. Daily Logs
    print("6. Migrating daily_logs...")
    daily_csv = [f for f in os.listdir(APP_PATH) if f.startswith("daily_logs-export")][0]
    dl_rows = read_csv(daily_csv)
    dl_data = []
    for r in dl_rows:
        posts_val = {}
        if r.get("posts"):
            try:
                posts_val = json.loads(r["posts"])
            except:
                posts_val = {}
        rev_entries_val = []
        if r.get("revenue_entries"):
            try:
                rev_entries_val = json.loads(r["revenue_entries"])
            except:
                rev_entries_val = []

        dl_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "date": r["date"],
            "posts": posts_val,
            "revenue": float(r["revenue"]) if r["revenue"] else 0,
            "revenue_entries": rev_entries_val,
            "missed": bool(r.get("missed") == "true"),
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })
    post_batch("daily_logs", dl_data)
    print(f"   Imported {len(dl_data)} daily_logs.")

    # 7. Focus Sessions
    print("7. Migrating focus_sessions...")
    focus_csv = [f for f in os.listdir(APP_PATH) if f.startswith("focus_sessions-export")][0]
    f_rows = read_csv(focus_csv)
    f_data = []
    for r in f_rows:
        f_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "duration_minutes": int(r["duration_minutes"]) if r["duration_minutes"] else 25,
            "theme": r.get("theme", "deep_focus"),
            "goal_id": r["goal_id"] if r.get("goal_id") else None,
            "started_at": r["started_at"],
            "completed": bool(r.get("completed") == "true"),
            "xp_earned": int(r["xp_earned"]) if r.get("xp_earned") else 5,
            "created_at": r["created_at"]
        })
    if f_data:
        post_batch("focus_sessions", f_data)
    print(f"   Imported {len(f_data)} focus_sessions.")

    # 8. Content Calendar
    print("8. Migrating content_calendar...")
    cal_csv = [f for f in os.listdir(APP_PATH) if f.startswith("content_calendar-export")][0]
    cc_rows = read_csv(cal_csv)
    cc_data = []
    for r in cc_rows:
        cc_data.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "scheduled_date": r["scheduled_date"],
            "platform_id": r["platform_id"] if r.get("platform_id") else None,
            "caption": r.get("caption", ""),
            "notes": r.get("notes", ""),
            "posted": bool(r.get("posted") == "true"),
            "posted_at": r["posted_at"] if r.get("posted_at") else None,
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })
    post_batch("content_calendar", cc_data)
    print(f"   Imported {len(cc_data)} content_calendar posts.")

    print("\nALL POST & CUAN TABLES SUCCESSFULLY IMPORTED TO SUPABASE!")

if __name__ == "__main__":
    main()
