"""
FinPilot CSV Dataset Generator
Creates data/ directory with the exact specified dataset:
- data/users.csv (5 users)
- data/transactions.csv (5,000 transactions, 1,000 per user, July-Sept 2026, 0 nulls)
- data/recurring_payments.csv (20 recurring payments)
- data/budgets.csv (40 budgets)
- data/goals.csv (10 goals)
"""

import csv
import os
import random
from datetime import date, timedelta

os.makedirs("data", exist_ok=True)

# 1. USERS (5 users)
users_data = [
    {
        "id": "U001",
        "email": "demo@finpilot.com",
        "name": "Demo User",
        "password": "password123",  # Demo credentials also support 123456 in auth
        "currency": "INR",
        "currency_symbol": "₹",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "created_at": "2026-06-01"
    },
    {
        "id": "U002",
        "email": "aarav.sharma@finpilot.com",
        "name": "Aarav Sharma",
        "password": "password123",
        "currency": "INR",
        "currency_symbol": "₹",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "created_at": "2026-06-05"
    },
    {
        "id": "U003",
        "email": "priya.patel@finpilot.com",
        "name": "Priya Patel",
        "password": "password123",
        "currency": "INR",
        "currency_symbol": "₹",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "created_at": "2026-06-10"
    },
    {
        "id": "U004",
        "email": "rohit.verma@finpilot.com",
        "name": "Rohit Verma",
        "password": "password123",
        "currency": "INR",
        "currency_symbol": "₹",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        "created_at": "2026-06-15"
    },
    {
        "id": "U005",
        "email": "ananya.iyer@finpilot.com",
        "name": "Ananya Iyer",
        "password": "password123",
        "currency": "INR",
        "currency_symbol": "₹",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "created_at": "2026-06-20"
    }
]

with open("data/users.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(users_data[0].keys()))
    writer.writeheader()
    writer.writerows(users_data)

# 2. RECURRING PAYMENTS (20 rows, 4 per user)
recurring_templates = [
    ("Apartment Rent", "Rent", 10000.0, "monthly", "2026-10-01", "active", "NetBanking"),
    ("Netflix Premium", "Subscriptions", 649.0, "monthly", "2026-09-30", "due_soon", "Credit Card"),
    ("Cult.Fit Gym Membership", "Healthcare", 1600.0, "monthly", "2026-10-10", "active", "Debit Card"),
    ("Airtel Fiber Broadband", "Bills", 1200.0, "monthly", "2026-10-05", "active", "UPI AutoPay"),
]

recurring_rows = []
rec_id = 1
for u in users_data:
    u_id = u["id"]
    for tmpl in recurring_templates:
        recurring_rows.append({
            "id": f"R{rec_id:04d}",
            "user_id": u_id,
            "name": tmpl[0],
            "category": tmpl[1],
            "amount": tmpl[2],
            "frequency": tmpl[3],
            "next_due": tmpl[4],
            "status": tmpl[5],
            "payment_method": tmpl[6]
        })
        rec_id += 1

with open("data/recurring_payments.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(recurring_rows[0].keys()))
    writer.writeheader()
    writer.writerows(recurring_rows)

# 3. BUDGETS (40 rows, 8 per user)
budget_categories = [
    ("Food", 5000.0),
    ("Shopping", 7000.0),
    ("Transport", 5000.0),
    ("Bills", 5000.0),
    ("Entertainment", 3000.0),
    ("Subscriptions", 2500.0),
    ("Healthcare", 2000.0),
    ("Education", 3000.0)
]

budget_rows = []
b_id = 1
for u in users_data:
    u_id = u["id"]
    for cat, limit in budget_categories:
        budget_rows.append({
            "id": f"B{b_id:04d}",
            "user_id": u_id,
            "category": cat,
            "limit": limit,
            "period": "monthly"
        })
        b_id += 1

with open("data/budgets.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(budget_rows[0].keys()))
    writer.writeheader()
    writer.writerows(budget_rows)

# 4. GOALS (10 rows, 2 per user)
goals_templates = [
    ("Emergency Fund", 100000.0, 40000.0, 10000.0, "Safety Net"),
    ("New Laptop", 60000.0, 25000.0, 5000.0, "Technology")
]

goal_rows = []
g_id = 1
for u in users_data:
    u_id = u["id"]
    for name, tgt, cur, monthly, cat in goals_templates:
        goal_rows.append({
            "id": f"G{g_id:04d}",
            "user_id": u_id,
            "name": name,
            "target": tgt,
            "current": cur,
            "monthly_contribution": monthly,
            "category": cat
        })
        g_id += 1

with open("data/goals.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(goal_rows[0].keys()))
    writer.writeheader()
    writer.writerows(goal_rows)

# 5. TRANSACTIONS (5,000 rows, exactly 1,000 per user, 0 nulls, July-Sept 2026)
random.seed(42)

start_date = date(2026, 7, 1)
end_date = date(2026, 9, 30)

# Calibrated micro-catalog for everyday Indian urban transactions
# (Rent is explicitly excluded; recurring commitments are scheduled separately)
micro_catalog = [
    # Food (chai, bakery, local tiffin, street food, small delivery)
    ('CHAI POINT', 'Food', 'expense', [10, 15, 20, 30], 'UPI'),
    ('LOCAL TEA & COFFEE', 'Food', 'expense', [10, 12, 15, 20], 'UPI'),
    ('LOCAL BAKERY', 'Food', 'expense', [15, 20, 25, 35], 'UPI'),
    ('STREET TIFFIN', 'Food', 'expense', [20, 25, 35, 50], 'UPI'),
    ('ZEPTO QUICK ESSENTIALS', 'Food', 'expense', [25, 35, 50, 75], 'UPI'),
    ('BLINKIT DAILY', 'Food', 'expense', [30, 40, 60, 80], 'UPI'),
    ('SWIGGY QUICK BITE', 'Food', 'expense', [40, 60, 85, 110], 'UPI'),

    # Transport (Metro, Rapido, Auto)
    ('NAMMA METRO', 'Transport', 'expense', [15, 20, 25, 35], 'UPI'),
    ('RAPIDO BIKE', 'Transport', 'expense', [15, 22, 30, 42], 'UPI'),
    ('AUTO RICKSHAW', 'Transport', 'expense', [20, 30, 40, 55], 'UPI'),
    ('UBER AUTO', 'Transport', 'expense', [28, 42, 60, 75], 'UPI'),

    # Shopping (small convenience store, stationery, toiletries)
    ('KIRANA STORE', 'Shopping', 'expense', [15, 25, 35, 55], 'UPI'),
    ('STATIONERY SHOP', 'Shopping', 'expense', [12, 20, 30, 45], 'UPI'),
    ('LOCAL PHARMACY STORE', 'Healthcare', 'expense', [18, 28, 45, 65], 'UPI'),

    # Education (photocopy, study material)
    ('CAMPUS PHOTOCOPY & NOTES', 'Education', 'expense', [10, 20, 35, 50], 'UPI'),

    # Small utilities, digital & snacks
    ('MOBILE TOP-UP', 'Bills', 'expense', [19, 29, 49], 'UPI'),
    ('COFFEE & CHAT', 'Entertainment', 'expense', [20, 30, 45, 65], 'UPI'),
    ('PARKING FEE', 'Other', 'expense', [10, 15, 20], 'UPI'),
    ('QUICK UPI TRANSFER', 'Other', 'expense', [10, 15, 20, 30], 'UPI'),
    ('COMMUNITY CHARITY UPI', 'Other', 'expense', [11, 21, 51], 'UPI'),
]

weights = [
    12, 10, 8, 8, 6, 6, 4,   # Food (~54%)
    8, 8, 6, 4,              # Transport (~26%)
    4, 3, 3,                 # Shopping & Healthcare (~10%)
    2,                       # Education (~2%)
    2, 3, 3, 3, 2            # Bills, Ent, Other (~8%)
]

transaction_rows = []

for u in users_data:
    u_id = u["id"]
    user_txs = []

    # 1. Salary credits: Exactly 1 per user per month on 26th (July 26, Aug 26, Sep 26)
    salary_dates = ["2026-07-26", "2026-08-26", "2026-09-26"]
    for s_date in salary_dates:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": s_date,
            "description": "SALARY CREDIT - TECH CORP",
            "amount": 50000.0,
            "type": "income",
            "category": "Salary",
            "merchant": "TechCorp Solutions",
            "payment_method": "NEFT"
        })

    # 2. Key recurring rent payments: Exactly ONE per user per month on 1st of month
    for r_date in ["2026-07-01", "2026-08-01", "2026-09-01"]:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": r_date,
            "description": "HOUSE RENT",
            "amount": 10000.0,
            "type": "expense",
            "category": "Rent",
            "merchant": "Landlord Transfer",
            "payment_method": "UPI"
        })

    # 3. Scheduled recurring commitments: Netflix (21st), Cult.Fit (6th), Airtel Broadband (12th)
    for sub_date in ["2026-07-21", "2026-08-21", "2026-09-21"]:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": sub_date,
            "description": "NETFLIX PREMIUM",
            "amount": 649.0,
            "type": "expense",
            "category": "Subscriptions",
            "merchant": "Netflix",
            "payment_method": "Credit Card"
        })

    for gym_date in ["2026-07-06", "2026-08-06", "2026-09-06"]:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": gym_date,
            "description": "CULT.FIT GYM MEMBERSHIP",
            "amount": 1600.0,
            "type": "expense",
            "category": "Healthcare",
            "merchant": "Cult.Fit",
            "payment_method": "Auto Debit"
        })

    for bb_date in ["2026-07-12", "2026-08-12", "2026-09-12"]:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": bb_date,
            "description": "AIRTEL FIBER BROADBAND",
            "amount": 1200.0,
            "type": "expense",
            "category": "Bills",
            "merchant": "Airtel",
            "payment_method": "UPI AutoPay"
        })

    # 4. Realistic monthly benchmarks for category variance and anomaly detection
    # September: Shopping budget overshot (Amazon ₹4,500 + Myntra ₹2,400)
    sep_benchmarks = [
        ("2026-09-27", "AMAZON ELECTRONICS", 4500.0, "expense", "Shopping", "Amazon India", "Credit Card"),
        ("2026-09-23", "MYNTRA FASHION", 2400.0, "expense", "Shopping", "Myntra", "UPI"),
        ("2026-09-20", "BESCOM ELECTRICITY", 1600.0, "expense", "Bills", "BESCOM", "NetBanking"),
        ("2026-09-17", "PVR INOX CINEMAS", 1100.0, "expense", "Entertainment", "PVR", "Credit Card"),
        ("2026-09-16", "UDEMY AI COURSE", 1299.0, "expense", "Education", "Udemy", "Debit Card"),
        ("2026-09-18", "APOLLO PHARMACY", 950.0, "expense", "Healthcare", "Apollo", "UPI"),
        ("2026-09-28", "SWIGGY GOURMET", 450.0, "expense", "Food", "Swiggy", "UPI"),
        ("2026-09-24", "ZOMATO DINING", 1280.0, "expense", "Food", "Zomato", "Credit Card"),
        ("2026-09-25", "UBER PREMIER", 620.0, "expense", "Transport", "Uber", "UPI"),
        ("2026-09-11", "SPOTIFY FAMILY", 119.0, "expense", "Subscriptions", "Spotify", "UPI"),
    ]
    for b in sep_benchmarks:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": b[0],
            "description": b[1],
            "amount": b[2],
            "type": b[3],
            "category": b[4],
            "merchant": b[5],
            "payment_method": b[6]
        })

    # August benchmarks
    aug_benchmarks = [
        ("2026-08-24", "AMAZON HOME ESSENTIALS", 2200.0, "expense", "Shopping", "Amazon India", "Credit Card"),
        ("2026-08-14", "MYNTRA ACCESSORIES", 1500.0, "expense", "Shopping", "Myntra", "UPI"),
        ("2026-08-20", "BESCOM ELECTRICITY", 1450.0, "expense", "Bills", "BESCOM", "NetBanking"),
        ("2026-08-15", "BOOKMYSHOW MOVIE", 800.0, "expense", "Entertainment", "BookMyShow", "Debit Card"),
        ("2026-08-10", "COURSERA PYTHON COURSE", 799.0, "expense", "Education", "Coursera", "Debit Card"),
        ("2026-08-18", "MEDPLUS PHARMACY", 850.0, "expense", "Healthcare", "MedPlus", "UPI"),
        ("2026-08-25", "UBER INTERCITY", 520.0, "expense", "Transport", "Uber", "UPI"),
        ("2026-08-28", "BARBEQUE NATION", 850.0, "expense", "Food", "Barbeque Nation", "Credit Card"),
        ("2026-08-11", "SPOTIFY FAMILY", 119.0, "expense", "Subscriptions", "Spotify", "UPI"),
    ]
    for b in aug_benchmarks:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": b[0],
            "description": b[1],
            "amount": b[2],
            "type": b[3],
            "category": b[4],
            "merchant": b[5],
            "payment_method": b[6]
        })

    # July benchmarks
    jul_benchmarks = [
        ("2026-07-20", "AMAZON MONSOON GEAR", 1800.0, "expense", "Shopping", "Amazon India", "Credit Card"),
        ("2026-07-12", "FABINDIA CLOTHING", 1200.0, "expense", "Shopping", "FabIndia", "UPI"),
        ("2026-07-18", "BESCOM ELECTRICITY", 1400.0, "expense", "Bills", "BESCOM", "NetBanking"),
        ("2026-07-14", "PVR CINEMAS", 600.0, "expense", "Entertainment", "PVR", "Credit Card"),
        ("2026-07-16", "APOLLO HEALTH CHECK", 700.0, "expense", "Healthcare", "Apollo", "UPI"),
        ("2026-07-10", "SAPNA BOOK HOUSE", 450.0, "expense", "Education", "Sapna Book House", "UPI"),
        ("2026-07-22", "INDIAN OIL PETROL", 480.0, "expense", "Transport", "Indian Oil", "Credit Card"),
        ("2026-07-25", "MAINLAND CHINA DINING", 750.0, "expense", "Food", "Mainland China", "Credit Card"),
        ("2026-07-11", "SPOTIFY FAMILY", 119.0, "expense", "Subscriptions", "Spotify", "UPI"),
    ]
    for b in jul_benchmarks:
        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": b[0],
            "description": b[1],
            "amount": b[2],
            "type": b[3],
            "category": b[4],
            "merchant": b[5],
            "payment_method": b[6]
        })

    # 5. Fill remaining transactions up to EXACTLY 1,000 with realistic micro-transactions
    while len(user_txs) < 1000:
        day_offset = random.randint(0, 91)
        d = (start_date + timedelta(days=day_offset)).isoformat()
        chosen = random.choices(micro_catalog, weights=weights, k=1)[0]
        m_name, m_cat, m_type, m_amounts, m_pay = chosen
        amount = float(random.choice(m_amounts))

        user_txs.append({
            "transaction_id": f"{u_id}-T{len(user_txs)+1:05d}",
            "user_id": u_id,
            "date": d,
            "description": f"{m_name} PAYMENT",
            "amount": amount,
            "type": m_type,
            "category": m_cat,
            "merchant": m_name,
            "payment_method": m_pay
        })

    transaction_rows.extend(user_txs)

with open("data/transactions.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(transaction_rows[0].keys()))
    writer.writeheader()
    writer.writerows(transaction_rows)

print("Dataset prepared successfully in data/")
print(f"  users.csv: {len(users_data)}")
print(f"  transactions.csv: {len(transaction_rows)}")
print(f"  recurring_payments.csv: {len(recurring_rows)}")
print(f"  budgets.csv: {len(budget_rows)}")
print(f"  goals.csv: {len(goal_rows)}")

