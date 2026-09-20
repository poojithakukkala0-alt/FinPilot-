"""
FinPilot Database Seeder (High Performance Bulk Operations)
Safely populates MongoDB Atlas finpilot database from data/ CSV files.
Avoids accidental duplicate seeding via idempotent bulk upserts by primary keys.
"""

import csv
import os
import sys

from pymongo import UpdateOne

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.db import (
    get_budgets_col,
    get_database,
    get_goals_col,
    get_recurring_col,
    get_transactions_col,
    get_users_col,
    init_indexes,
    test_connection,
)


def seed():
    if not test_connection():
        print("Failed to connect to MongoDB Atlas. Check MONGODB_URI in .env.")
        return

    db = get_database()
    init_indexes()

    users_col = get_users_col()
    transactions_col = get_transactions_col()
    recurring_col = get_recurring_col()
    budgets_col = get_budgets_col()
    goals_col = get_goals_col()

    # Clear demo collections to ensure clean rebuild while preserving indexes
    print("Clearing existing demo collection records...")
    users_col.delete_many({})
    transactions_col.delete_many({})
    recurring_col.delete_many({})
    budgets_col.delete_many({})
    goals_col.delete_many({})

    # 1. Seed Users (data/users.csv)
    if os.path.exists("data/users.csv"):
        with open("data/users.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            user_ops = [
                UpdateOne({"id": row["id"]}, {"$set": dict(row)}, upsert=True)
                for row in reader
            ]
            if user_ops:
                users_col.bulk_write(user_ops, ordered=False)

    # 2. Seed Recurring Payments (data/recurring_payments.csv)
    if os.path.exists("data/recurring_payments.csv"):
        with open("data/recurring_payments.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rec_ops = []
            for row in reader:
                rec_doc = dict(row)
                rec_doc["amount"] = float(rec_doc["amount"])
                rec_ops.append(
                    UpdateOne({"id": rec_doc["id"]}, {"$set": rec_doc}, upsert=True)
                )
            if rec_ops:
                recurring_col.bulk_write(rec_ops, ordered=False)

    # 3. Seed Budgets (data/budgets.csv)
    if os.path.exists("data/budgets.csv"):
        with open("data/budgets.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            b_ops = []
            for row in reader:
                b_doc = dict(row)
                b_doc["limit"] = float(b_doc["limit"])
                b_ops.append(
                    UpdateOne({"id": b_doc["id"]}, {"$set": b_doc}, upsert=True)
                )
            if b_ops:
                budgets_col.bulk_write(b_ops, ordered=False)

    # 4. Seed Goals (data/goals.csv)
    if os.path.exists("data/goals.csv"):
        with open("data/goals.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            g_ops = []
            for row in reader:
                g_doc = dict(row)
                g_doc["target"] = float(g_doc["target"])
                g_doc["current"] = float(g_doc["current"])
                g_doc["monthly_contribution"] = float(g_doc["monthly_contribution"])
                g_ops.append(
                    UpdateOne({"id": g_doc["id"]}, {"$set": g_doc}, upsert=True)
                )
            if g_ops:
                goals_col.bulk_write(g_ops, ordered=False)

    # 5. Seed Transactions (data/transactions.csv) in bulk batches of 1,000
    if os.path.exists("data/transactions.csv"):
        with open("data/transactions.csv", mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            tx_batch = []
            for row in reader:
                tx_doc = dict(row)
                tx_doc["amount"] = float(tx_doc["amount"])
                tx_batch.append(
                    UpdateOne(
                        {"transaction_id": tx_doc["transaction_id"]},
                        {"$set": tx_doc},
                        upsert=True,
                    )
                )
                if len(tx_batch) >= 1000:
                    transactions_col.bulk_write(tx_batch, ordered=False)
                    tx_batch = []
            if tx_batch:
                transactions_col.bulk_write(tx_batch, ordered=False)

    # Verification Counts
    u_count = users_col.count_documents({})
    t_count = transactions_col.count_documents({})
    r_count = recurring_col.count_documents({})
    b_count = budgets_col.count_documents({})
    g_count = goals_col.count_documents({})
    u001_count = transactions_col.count_documents({"user_id": "U001"})

    print("MongoDB connected")
    print(f"Database: {db.name}")
    print(f"users: {u_count}")
    print(f"transactions: {t_count}")
    print(f"recurring_payments: {r_count}")
    print(f"budgets: {b_count}")
    print(f"goals: {g_count}")
    print(f"U001 transactions: {u001_count}")

if __name__ == "__main__":
    seed()
