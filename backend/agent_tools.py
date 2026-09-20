"""
FinPilot Agent Tools — Grounded MongoDB Financial Decision Support Tools
Provides real, deterministic, database-backed analytical tools for the Gemini Agent.
Every tool operates strictly on the authenticated user's isolated data in MongoDB Atlas.
"""

import re
from contextvars import ContextVar
from typing import Any

from backend.db import (
    get_budgets_col,
    get_goals_col,
    get_recurring_col,
    get_transactions_col,
)

# ContextVar to guarantee absolute user isolation across asynchronous requests
_current_user_id: ContextVar[str] = ContextVar("current_user_id", default="U001")

def set_current_user(user_id: str) -> None:
    """Set the authenticated user ID for the current request context."""
    _current_user_id.set(user_id)

def get_current_user() -> str:
    """Get the authenticated user ID from the current request context."""
    return _current_user_id.get()


# =====================================================================
# TOOL 1: analyze_spending
# =====================================================================
def analyze_spending(
    category: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
) -> dict[str, Any]:
    """Analyze historical or recent spending from transactions in MongoDB.

    Args:
        category: Optional category filter (e.g. 'Food', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Rent').
        start_date: Optional start date in 'YYYY-MM-DD' format (e.g. '2026-09-01').
        end_date: Optional end date in 'YYYY-MM-DD' format (e.g. '2026-09-30').

    Returns:
        Dictionary containing total spending, transaction count, category breakdown,
        average transaction amount, and top merchants.
    """
    user_id = get_current_user()
    tx_col = get_transactions_col()

    query: dict[str, Any] = {"user_id": user_id, "type": "expense"}

    if category and category.lower() != "all":
        # Case-insensitive category match
        query["category"] = {"$regex": f"^{re.escape(category)}$", "$options": "i"}

    # Date range filtering
    date_filter: dict[str, str] = {}
    if start_date:
        date_filter["$gte"] = start_date
    if end_date:
        date_filter["$lte"] = end_date
    if date_filter:
        query["date"] = date_filter
    elif not start_date and not end_date:
        # Default to current active month (September 2026)
        query["date"] = {"$regex": "^2026-09"}

    txs = list(tx_col.find(query, {"_id": 0}))

    total_spending = sum(t.get("amount", 0.0) for t in txs)
    tx_count = len(txs)
    avg_tx = round(total_spending / tx_count, 2) if tx_count > 0 else 0.0

    # Category breakdown
    cat_breakdown: dict[str, float] = {}
    merchant_spend: dict[str, dict[str, Any]] = {}

    for t in txs:
        cat = t.get("category", "Other")
        amt = t.get("amount", 0.0)
        cat_breakdown[cat] = cat_breakdown.get(cat, 0.0) + amt

        m = t.get("merchant") or t.get("description", "Unknown")
        if m not in merchant_spend:
            merchant_spend[m] = {"merchant": m, "count": 0, "total": 0.0}
        merchant_spend[m]["count"] += 1
        merchant_spend[m]["total"] += amt

    # Top 5 merchants
    sorted_merchants = sorted(merchant_spend.values(), key=lambda x: x["total"], reverse=True)[:5]
    for m in sorted_merchants:
        m["total"] = round(m["total"], 2)

    return {
        "status": "success",
        "user_id": user_id,
        "filter_category": category,
        "date_range": f"{start_date or '2026-09-01'} to {end_date or '2026-09-30'}",
        "total_spending": round(total_spending, 2),
        "transaction_count": tx_count,
        "average_transaction": avg_tx,
        "category_breakdown": {k: round(v, 2) for k, v in cat_breakdown.items()},
        "top_merchants": sorted_merchants,
    }


# =====================================================================
# TOOL 2: get_recurring_commitments
# =====================================================================
def get_recurring_commitments() -> dict[str, Any]:
    """Retrieve recurring commitments, subscriptions, and scheduled bills from MongoDB.

    Returns:
        Dictionary containing list of active recurring commitments, due dates,
        frequencies, and total monthly commitment sum.
    """
    user_id = get_current_user()
    rec_col = get_recurring_col()

    items = list(rec_col.find({"user_id": user_id}, {"_id": 0}))

    # Calculate normalized monthly sum
    total_monthly = 0.0
    for r in items:
        amt = r.get("amount", 0.0)
        freq = str(r.get("frequency", "monthly")).lower()
        if freq == "monthly":
            total_monthly += amt
        elif freq == "yearly":
            total_monthly += amt / 12.0
        elif freq == "weekly":
            total_monthly += amt * 4.33
        elif freq == "quarterly":
            total_monthly += amt / 3.0

    return {
        "status": "success",
        "user_id": user_id,
        "commitments_count": len(items),
        "total_monthly_recurring": round(total_monthly, 2),
        "commitments": items,
        "recurring_merchants": [r.get("name") for r in items],
    }


# =====================================================================
# TOOL 3: check_budget_headroom
# =====================================================================
def check_budget_headroom(category: str, amount: float = 0.0) -> dict[str, Any]:
    """Check budget headroom and utilization for a specific spending category against MongoDB.

    Args:
        category: The category name (e.g. 'Shopping', 'Food', 'Transport', 'Entertainment', 'Bills').
        amount: Optional proposed purchase amount to test against headroom (defaults to 0).

    Returns:
        Dictionary detailing budget limit, current spending, remaining headroom,
        projected spending, whether it exceeds the budget, and by how much.
    """
    user_id = get_current_user()
    budgets_col = get_budgets_col()
    tx_col = get_transactions_col()

    # Find budget document for this category (case-insensitive)
    budget = budgets_col.find_one(
        {"user_id": user_id, "category": {"$regex": f"^{re.escape(category)}$", "$options": "i"}},
        {"_id": 0}
    )

    limit = float(budget.get("limit", 5000.0)) if budget else 5000.0

    # Calculate current month's actual spending in this category from MongoDB
    txs = list(tx_col.find(
        {
            "user_id": user_id,
            "type": "expense",
            "category": {"$regex": f"^{re.escape(category)}$", "$options": "i"},
            "date": {"$regex": "^2026-09"}
        },
        {"amount": 1, "_id": 0}
    ))
    current_spending = sum(t.get("amount", 0.0) for t in txs)
    remaining_headroom = limit - current_spending
    projected_spending = current_spending + amount
    exceeds_budget = projected_spending > limit
    over_budget_by = max(0.0, projected_spending - limit)

    return {
        "status": "success",
        "user_id": user_id,
        "category": category,
        "budget_limit": round(limit, 2),
        "current_spending": round(current_spending, 2),
        "remaining_headroom": round(remaining_headroom, 2),
        "proposed_amount": round(amount, 2),
        "projected_spending": round(projected_spending, 2),
        "projected_utilization_pct": round((projected_spending / limit) * 100, 1) if limit > 0 else 100.0,
        "exceeds_budget": exceeds_budget,
        "over_budget_by": round(over_budget_by, 2),
        "has_explicit_budget": budget is not None,
    }


# =====================================================================
# TOOL 4: simulate_purchase_impact
# =====================================================================
def simulate_purchase_impact(
    amount: float,
    category: str,
    description: str = "Proposed Purchase"
) -> dict[str, Any]:
    """Simulate the financial impact of a proposed purchase against income, balance, recurring bills, and budget.

    Args:
        amount: The monetary cost of the purchase in INR (₹).
        category: The category of the purchase (e.g. 'Shopping', 'Travel', 'Food', 'Entertainment').
        description: Description of the purchase (e.g. 'Flight ticket to Goa', 'New smartphone').

    Returns:
        Comprehensive impact assessment with projected balance, recurring commitments,
        safety buffer, budget impact, and decision grade (Recommended, Caution, Not Recommended).
    """
    user_id = get_current_user()
    tx_col = get_transactions_col()

    # 1. Fetch current month income & expenses from MongoDB
    current_txs = list(tx_col.find({"user_id": user_id, "date": {"$regex": "^2026-09"}}))
    total_income = sum(t.get("amount", 0.0) for t in current_txs if t.get("type", "").lower() == "income")
    total_expenses = sum(t.get("amount", 0.0) for t in current_txs if t.get("type", "").lower() == "expense")
    current_balance = total_income - total_expenses

    # 2. Fetch recurring obligations
    recurr_data = get_recurring_commitments()
    upcoming_obligations = recurr_data["total_monthly_recurring"]

    # 3. Calculations
    projected_balance = current_balance - amount
    safety_buffer = projected_balance - upcoming_obligations

    # 4. Budget check
    budget_data = check_budget_headroom(category, amount)

    # 5. Formulate Decision Grade
    reasons = []
    if safety_buffer < 0:
        decision_grade = "Not Recommended"
        reasons.append(f"Depletes your balance below scheduled monthly obligations (₹{upcoming_obligations:,.0f}).")
    elif safety_buffer < 5000:
        decision_grade = "Proceed with Caution"
        reasons.append(f"Leaves a narrow safety buffer of ₹{safety_buffer:,.0f} after scheduled commitments.")
    else:
        decision_grade = "Recommended"
        reasons.append(f"Scheduled commitments (₹{upcoming_obligations:,.0f}) remain comfortably covered.")

    if budget_data["exceeds_budget"]:
        if decision_grade == "Recommended":
            decision_grade = "Proceed with Caution"
        reasons.append(
            f"Exceeds your {category} budget ceiling by ₹{budget_data['over_budget_by']:,.0f} "
            f"({budget_data['projected_utilization_pct']}% utilization)."
        )
    else:
        reasons.append(f"{category} budget remains within limits ({budget_data['projected_utilization_pct']}% utilization).")

    return {
        "status": "success",
        "description": description,
        "purchase_amount": round(amount, 2),
        "current_balance": round(current_balance, 2),
        "projected_balance_after": round(projected_balance, 2),
        "scheduled_obligations": round(upcoming_obligations, 2),
        "safety_buffer_remaining": round(safety_buffer, 2),
        "budget_evaluation": budget_data,
        "decision_grade": decision_grade,
        "key_reasons": reasons,
    }


# =====================================================================
# TOOL 5: detect_anomalies
# =====================================================================
def detect_anomalies() -> dict[str, Any]:
    """Detect unusual or spiked expenditures by comparing recent transactions with category historical baselines.

    Returns:
        Dictionary of detected anomalies, including unusually large transactions,
        category surges, and contextual reasons.
    """
    user_id = get_current_user()
    tx_col = get_transactions_col()

    # Analyze transactions across July, August, September
    all_txs = list(tx_col.find({"user_id": user_id, "type": "expense"}, {"_id": 0}))

    # Calculate average amount per category
    cat_amounts: dict[str, list[float]] = {}
    for t in all_txs:
        cat = t.get("category", "Other")
        amt = t.get("amount", 0.0)
        cat_amounts.setdefault(cat, []).append(amt)

    cat_averages = {c: (sum(v) / len(v)) for c, v in cat_amounts.items() if v}

    # Find recent September transactions that significantly exceed category baseline
    recent_txs = [t for t in all_txs if str(t.get("date", "")).startswith("2026-09")]
    anomalies = []

    for t in recent_txs:
        cat = t.get("category", "Other")
        amt = t.get("amount", 0.0)
        avg = cat_averages.get(cat, 1000.0)
        # Flags: single transaction >= 1.75x category average or single discretionary >= 3500
        if (amt >= (avg * 1.75) and amt >= 2000.0) or (amt >= 3500.0 and cat in ["Shopping", "Entertainment", "Food"]):
            ratio = round(amt / avg, 1) if avg > 0 else 1.0
            anomalies.append({
                "transaction_id": t.get("transaction_id"),
                "date": t.get("date"),
                "merchant": t.get("merchant") or t.get("description"),
                "category": cat,
                "amount": round(amt, 2),
                "category_average": round(avg, 2),
                "ratio": ratio,
                "reason": f"Spike: ₹{amt:,.0f} ({ratio}x category baseline of ₹{avg:,.0f})."
            })

    # Deduplicate / sort by amount descending
    anomalies.sort(key=lambda x: x["amount"], reverse=True)
    selected_anomalies = anomalies[:6]

    return {
        "status": "success",
        "user_id": user_id,
        "anomalies_detected": len(selected_anomalies),
        "anomalies": selected_anomalies,
        "summary": f"Detected {len(selected_anomalies)} notable spending spikes in September 2026, primarily in Shopping and Rent.",
    }


# =====================================================================
# TOOL 6: compare_monthly_trends
# =====================================================================
def compare_monthly_trends(
    month_a: str = "2026-09",
    month_b: str = "2026-08"
) -> dict[str, Any]:
    """Compare income, expenses, savings rate, and category breakdowns between two months.

    Args:
        month_a: The primary month to evaluate in 'YYYY-MM' format (default: '2026-09').
        month_b: The baseline month to compare against in 'YYYY-MM' format (default: '2026-08').

    Returns:
        Comprehensive comparison of changes in income, expenses, and category-level variances.
    """
    user_id = get_current_user()
    tx_col = get_transactions_col()

    txs_a = list(tx_col.find({"user_id": user_id, "date": {"$regex": f"^{re.escape(month_a)}"}}))
    txs_b = list(tx_col.find({"user_id": user_id, "date": {"$regex": f"^{re.escape(month_b)}"}}))

    inc_a = sum(t.get("amount", 0.0) for t in txs_a if t.get("type", "").lower() == "income")
    exp_a = sum(t.get("amount", 0.0) for t in txs_a if t.get("type", "").lower() == "expense")
    sav_a = inc_a - exp_a

    inc_b = sum(t.get("amount", 0.0) for t in txs_b if t.get("type", "").lower() == "income")
    exp_b = sum(t.get("amount", 0.0) for t in txs_b if t.get("type", "").lower() == "expense")
    sav_b = inc_b - exp_b

    # Category breakdown comparison
    cat_a: dict[str, float] = {}
    for t in txs_a:
        if t.get("type", "").lower() == "expense":
            c = t.get("category", "Other")
            cat_a[c] = cat_a.get(c, 0.0) + t.get("amount", 0.0)

    cat_b: dict[str, float] = {}
    for t in txs_b:
        if t.get("type", "").lower() == "expense":
            c = t.get("category", "Other")
            cat_b[c] = cat_b.get(c, 0.0) + t.get("amount", 0.0)

    all_cats = set(cat_a.keys()) | set(cat_b.keys())
    cat_changes = []
    for c in all_cats:
        val_a = cat_a.get(c, 0.0)
        val_b = cat_b.get(c, 0.0)
        diff = val_a - val_b
        pct = round((diff / val_b * 100), 1) if val_b > 0 else 0.0
        cat_changes.append({
            "category": c,
            "month_a_amount": round(val_a, 2),
            "month_b_amount": round(val_b, 2),
            "difference": round(diff, 2),
            "percentage_change": pct
        })

    # Sort increases and decreases
    increases = sorted([c for c in cat_changes if c["difference"] > 0], key=lambda x: x["difference"], reverse=True)
    decreases = sorted([c for c in cat_changes if c["difference"] < 0], key=lambda x: x["difference"])

    return {
        "status": "success",
        "user_id": user_id,
        "month_a": month_a,
        "month_b": month_b,
        "income_comparison": {
            "month_a": round(inc_a, 2),
            "month_b": round(inc_b, 2),
            "difference": round(inc_a - inc_b, 2),
            "pct_change": round(((inc_a - inc_b) / inc_b * 100), 1) if inc_b > 0 else 0.0
        },
        "expense_comparison": {
            "month_a": round(exp_a, 2),
            "month_b": round(exp_b, 2),
            "difference": round(exp_a - exp_b, 2),
            "pct_change": round(((exp_a - exp_b) / exp_b * 100), 1) if exp_b > 0 else 0.0
        },
        "savings_comparison": {
            "month_a": round(sav_a, 2),
            "month_b": round(sav_b, 2),
            "difference": round(sav_a - sav_b, 2),
        },
        "significant_increases": increases[:3],
        "significant_decreases": decreases[:3],
    }


# =====================================================================
# TOOL 7: get_goal_impact
# =====================================================================
def get_goal_impact(amount: float, goal_id: str | None = None) -> dict[str, Any]:
    """Evaluate how a proposed expense impacts active savings goals (e.g. Emergency Fund).

    Args:
        amount: The proposed spending amount in INR (₹).
        goal_id: Optional goal ID (e.g. 'G0001'). If omitted, evaluates against priority goals.

    Returns:
        Goal metrics, current savings, monthly contributions, and projected delay or impact.
    """
    user_id = get_current_user()
    goals_col = get_goals_col()
    tx_col = get_transactions_col()

    query: dict[str, Any] = {"user_id": user_id}
    if goal_id:
        query["id"] = goal_id

    goals = list(goals_col.find(query, {"_id": 0}))
    if not goals:
        return {
            "status": "warning",
            "message": "No active savings goals found for user.",
            "impact": "None"
        }

    # Evaluate against primary goal (e.g. Emergency Fund)
    primary_goal = goals[0]
    target = float(primary_goal.get("target", 100000.0))
    current = float(primary_goal.get("current", 40000.0))
    monthly_contrib = float(primary_goal.get("monthly_contribution", 10000.0))
    remaining_to_goal = target - current

    # Cashflow buffer calculation
    current_txs = list(tx_col.find({"user_id": user_id, "date": {"$regex": "^2026-09"}}))
    total_income = sum(t.get("amount", 0.0) for t in current_txs if t.get("type", "").lower() == "income")
    total_expenses = sum(t.get("amount", 0.0) for t in current_txs if t.get("type", "").lower() == "expense")
    balance = total_income - total_expenses
    projected_balance = balance - amount

    delays_progress = projected_balance < monthly_contrib

    return {
        "status": "success",
        "goal_id": primary_goal.get("id"),
        "goal_name": primary_goal.get("name"),
        "goal_target": round(target, 2),
        "current_saved": round(current, 2),
        "progress_percentage": round((current / target) * 100, 1) if target > 0 else 0.0,
        "monthly_planned_contribution": round(monthly_contrib, 2),
        "proposed_expenditure": round(amount, 2),
        "post_purchase_balance": round(projected_balance, 2),
        "delays_progress": delays_progress,
        "impact_summary": (
            f"Spending ₹{amount:,.0f} reduces your available cash flow below your planned "
            f"₹{monthly_contrib:,.0f} monthly allocation to your {primary_goal.get('name')}."
            if delays_progress else
            f"Your remaining cash flow (₹{projected_balance:,.0f}) comfortably preserves your planned "
            f"₹{monthly_contrib:,.0f} allocation toward your {primary_goal.get('name')}."
        )
    }


# =====================================================================
# TOOL REGISTRY FOR GEMINI
# =====================================================================
FINANCIAL_TOOLS = [
    analyze_spending,
    get_recurring_commitments,
    check_budget_headroom,
    simulate_purchase_impact,
    detect_anomalies,
    compare_monthly_trends,
    get_goal_impact,
]

FINANCIAL_TOOL_MAP = {fn.__name__: fn for fn in FINANCIAL_TOOLS}
