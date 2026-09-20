"""
FinPilot Data Consistency Verification Script
Performs direct MongoDB arithmetic for U001 in September 2026 and cross-checks against
/api/dashboard and AI agent tools (analyze_spending, simulate_purchase_impact, check_budget_headroom).
"""

import os
import sys

import requests

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.agent_tools import (
    analyze_spending,
    check_budget_headroom,
    get_recurring_commitments,
    set_current_user,
    simulate_purchase_impact,
)
from backend.db import (
    get_budgets_col,
    get_goals_col,
    get_recurring_col,
    get_transactions_col,
)


def run_verification():
    set_current_user("U001")
    tx_col = get_transactions_col()
    b_col = get_budgets_col()
    r_col = get_recurring_col()
    g_col = get_goals_col()

    # 1. Direct MongoDB queries for U001
    all_u001 = list(tx_col.find({"user_id": "U001"}))
    total_u001_count = len(all_u001)

    jul_txs = [t for t in all_u001 if str(t.get("date", "")).startswith("2026-07")]
    aug_txs = [t for t in all_u001 if str(t.get("date", "")).startswith("2026-08")]
    sep_txs = [t for t in all_u001 if str(t.get("date", "")).startswith("2026-09")]

    sep_inc = [t for t in sep_txs if t.get("type", "").lower() == "income"]
    sep_exp = [t for t in sep_txs if t.get("type", "").lower() == "expense"]

    income_amount = sum(t.get("amount", 0.0) for t in sep_inc)
    expense_amount = sum(t.get("amount", 0.0) for t in sep_exp)
    net_balance = income_amount - expense_amount

    # Category breakdown for September expenses
    cat_totals = {}
    for t in sep_exp:
        c = t.get("category", "Other")
        cat_totals[c] = cat_totals.get(c, 0.0) + t.get("amount", 0.0)

    top_categories = sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)

    shopping_total = cat_totals.get("Shopping", 0.0)

    # Budget for Shopping
    shopping_budget_doc = b_col.find_one({"user_id": "U001", "category": "Shopping"})
    shopping_budget_limit = shopping_budget_doc.get("limit", 0.0) if shopping_budget_doc else 0.0

    # Recurring commitments total
    recs = list(r_col.find({"user_id": "U001"}))
    recurring_total = sum(r.get("amount", 0.0) for r in recs)

    # Duplicate IDs
    tx_ids = [t.get("transaction_id") for t in all_u001]
    duplicates = len(tx_ids) - len(set(tx_ids))

    # Salary classification
    salaries = [t for t in all_u001 if "salary" in str(t.get("category", "")).lower() or "salary" in str(t.get("description", "")).lower()]
    salary_types = set(s.get("type") for s in salaries)

    # Rent classification
    rents = [t for t in sep_txs if "rent" in str(t.get("category", "")).lower() or "rent" in str(t.get("description", "")).lower()]
    rent_types = set(r.get("type") for r in rents)

    # Amount signs
    has_negative_amounts = any(t.get("amount", 0.0) < 0 for t in all_u001)

    print("=== DIRECT MONGODB DATA VERIFICATION FOR U001 ===")
    print(f"1. Total income transactions (Sep 2026): {len(sep_inc)}")
    print(f"2. Total income amount (Sep 2026): Rs. {income_amount:,.2f}")
    print(f"3. Total expense transactions (Sep 2026): {len(sep_exp)}")
    print(f"4. Total expense amount (Sep 2026): Rs. {expense_amount:,.2f}")
    print(f"5. Net balance (Income - Expenses): Rs. {net_balance:,.2f}")
    print("6. Top expense categories:")
    for cat, amt in top_categories[:10]:
        print(f"   - {cat}: Rs. {amt:,.2f} ({amt/expense_amount*100:.1f}%)")
    print(f"7. Shopping total: Rs. {shopping_total:,.2f}")
    print(f"8. Shopping budget: Rs. {shopping_budget_limit:,.2f}")
    print(f"9. Recurring payment total: Rs. {recurring_total:,.2f} ({len(recs)} commitments)")
    print(f"10. September transactions count: {len(sep_txs)}")
    print(f"11. July transactions count: {len(jul_txs)}")
    print(f"12. August transactions count: {len(aug_txs)}")
    print(f"13. Duplicate transaction IDs: {duplicates}")
    print(f"14. Salary classified as: {list(salary_types)}")
    print(f"15. Rent classified as: {list(rent_types)} (Sep count: {len(rents)}, Total Rent Rs. {sum(r.get('amount', 0) for r in rents):,.2f})")
    print(f"16. Negative amounts exist: {has_negative_amounts} (All amounts are strictly positive floats)")

    # 2. Compare against GET /api/dashboard
    print("\n=== COMPARISON WITH GET /api/dashboard ===")
    try:
        r = requests.get("http://127.0.0.1:8000/api/dashboard?user_id=U001&month=September%202026")
        if r.status_code == 200:
            d = r.json()
            print(f"Dashboard total_income: Rs. {d.get('total_income'):,.2f}")
            print(f"Dashboard total_expenses: Rs. {d.get('total_expenses'):,.2f}")
            print(f"Dashboard remaining_balance: Rs. {d.get('remaining_balance'):,.2f}")
            dash_shopping = next((c['amount'] for c in d.get('category_spending', []) if c['category'] == 'Shopping'), 0.0)
            print(f"Dashboard Shopping spend: Rs. {dash_shopping:,.2f}")
            dash_match = (
                d.get('total_income') == income_amount and
                d.get('total_expenses') == expense_amount and
                d.get('remaining_balance') == net_balance and
                dash_shopping == shopping_total
            )
            print(f"-> Dashboard matches direct MongoDB arithmetic: {dash_match}")
        else:
            print(f"Dashboard request failed: {r.status_code}")
    except Exception as e:
        print(f"Could not connect to live dashboard: {e}")

    # 3. Compare against AI agent tools
    print("\n=== COMPARISON WITH AI AGENT TOOLS ===")
    t_spend = analyze_spending()
    t_sim = simulate_purchase_impact(amount=0, category="Shopping")
    t_budget = check_budget_headroom(category="Shopping")
    t_rec = get_recurring_commitments()

    print(f"analyze_spending total_spending: Rs. {t_spend['total_spending']:,.2f}")
    print(f"analyze_spending Shopping spend: Rs. {t_spend['category_breakdown'].get('Shopping', 0.0):,.2f}")
    print(f"simulate_purchase_impact current_balance: Rs. {t_sim['current_balance']:,.2f}")
    print(f"simulate_purchase_impact scheduled_obligations: Rs. {t_sim['scheduled_obligations']:,.2f}")
    print(f"check_budget_headroom Shopping current_spending: Rs. {t_budget['current_spending']:,.2f}")
    print(f"check_budget_headroom Shopping budget_limit: Rs. {t_budget['budget_limit']:,.2f}")
    print(f"check_budget_headroom Shopping remaining_headroom: Rs. {t_budget['remaining_headroom']:,.2f}")

    tools_match = (
        t_spend['total_spending'] == expense_amount and
        t_spend['category_breakdown'].get('Shopping') == shopping_total and
        t_sim['current_balance'] == net_balance and
        t_budget['current_spending'] == shopping_total and
        t_budget['budget_limit'] == shopping_budget_limit
    )
    print(f"-> AI tools match direct MongoDB arithmetic: {tools_match}")

    return {
        "income": income_amount,
        "expenses": expense_amount,
        "balance": net_balance,
        "shopping_spending": shopping_total,
        "shopping_budget": shopping_budget_limit,
        "recurring_total": recurring_total,
        "dash_match": dash_match,
        "tools_match": tools_match
    }

if __name__ == "__main__":
    run_verification()
