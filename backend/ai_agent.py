"""
FinPilot Agentic AI Orchestrator — Gemini 2.5 Flash + Tool-Calling Financial Agent
Grounded on real MongoDB Atlas financial data for the authenticated user.
"""

import logging
import os
import re
from typing import Any

import dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError

from backend.agent_tools import (
    analyze_spending,
    check_budget_headroom,
    compare_monthly_trends,
    detect_anomalies,
    get_goal_impact,
    get_recurring_commitments,
    set_current_user,
    simulate_purchase_impact,
)

# Load environment variables
dotenv.load_dotenv()

logger = logging.getLogger("finpilot.ai_agent")

TARGET_MODEL = "gemini-3.6-flash"

SYSTEM_INSTRUCTION = """You are FinPilot, a personal finance decision-support agent.
You help users understand their own financial data and evaluate everyday spending decisions.
Use the provided financial tools whenever factual calculations, spending history, budgets, subscriptions, or goals are required.
Never invent transaction data, balances, budgets, subscriptions, or goals.
All financial facts must come from the user's MongoDB data through tools.
You may explain spending, budgets, recurring commitments, cash-flow impact, savings goals, and hypothetical purchases.
Do not provide investment recommendations, stock recommendations, trading advice, tax advice, or speculative financial advice.

For purchase simulations or affordability questions, clearly evaluate:
• Current financial position & cash flow
• Proposed purchase amount
• Projected balance and safety buffer
• Relevant category budget impact (utilization, headroom)
• Effect on recurring obligations & emergency fund/goals
• Final clear decision grade (Recommended / Proceed with Caution / Not Recommended)

If data is insufficient, say so instead of inventing values.
Give concise, clear, and actionable answers formatted in clean Markdown with bullet points and bold amounts in INR (₹)."""


def get_api_key() -> str | None:
    """Retrieve GEMINI_API_KEY from environment without logging its value."""
    key = os.getenv("GEMINI_API_KEY", "").strip()
    return key if key else None


def get_gemini_client() -> genai.Client | None:
    """Initialize Google GenAI Client if GEMINI_API_KEY is available."""
    api_key = get_api_key()
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        logger.error(f"Failed to initialize Gemini Client: {type(e).__name__}")
        return None


def run_agent_chat(
    message: str,
    user_id: str = "U001",
    history: list[dict[str, Any]] | None = None
) -> dict[str, Any]:
    """Execute the agentic financial chat workflow with Gemini 2.5 Flash and tool calling.

    Args:
        message: The user's query or decision question.
        user_id: The authenticated user ID (strictly isolated).
        history: Optional previous chat message history.

    Returns:
        Frontend-compatible dict: {
            "reply": str,
            "suggestions": List[str],
            "tools_used": List[str],
            "grounded": bool
        }
    """
    # 1. Enforce user isolation in request context
    set_current_user(user_id)

    client = get_gemini_client()
    tools_used: list[str] = []

    # 2. Check if GEMINI_API_KEY is configured
    if not client:
        logger.warning("GEMINI_API_KEY is missing or not configured in .env.")
        return generate_graceful_fallback(
            message=message,
            user_id=user_id,
            reason="missing_api_key"
        )

    agent_steps: list[dict[str, Any]] = []

    def log_step(agent: str, tool: str, action: str):
        agent_steps.append({
            "agent": agent,
            "tool": tool,
            "action": action,
            "status": "completed",
            "order": len(agent_steps) + 1
        })

    # 3. Create tracking wrappers around tools for observability
    def tracked_analyze_spending(**kwargs):
        tools_used.append("analyze_spending")
        cat_desc = f" for category {kwargs.get('category')}" if kwargs.get("category") else ""
        log_step("Spending Analyst", "analyze_spending", f"Queried September transactions{cat_desc} in MongoDB")
        return analyze_spending(**kwargs)
    tracked_analyze_spending.__doc__ = analyze_spending.__doc__

    def tracked_get_recurring_commitments(**kwargs):
        tools_used.append("get_recurring_commitments")
        log_step("Recurring Monitor", "get_recurring_commitments", "Fetched active subscriptions and scheduled obligations")
        return get_recurring_commitments(**kwargs)
    tracked_get_recurring_commitments.__doc__ = get_recurring_commitments.__doc__

    def tracked_check_budget_headroom(**kwargs):
        tools_used.append("check_budget_headroom")
        cat = kwargs.get("category", "General")
        log_step("Budget Guardian", "check_budget_headroom", f"Evaluated budget limit and headroom for {cat}")
        return check_budget_headroom(**kwargs)
    tracked_check_budget_headroom.__doc__ = check_budget_headroom.__doc__

    def tracked_simulate_purchase_impact(**kwargs):
        tools_used.append("simulate_purchase_impact")
        amt = kwargs.get("amount", 0)
        log_step("Decision Simulator", "simulate_purchase_impact", f"Simulated impact of ₹{amt:,.0f} purchase on cash buffer")
        return simulate_purchase_impact(**kwargs)
    tracked_simulate_purchase_impact.__doc__ = simulate_purchase_impact.__doc__

    def tracked_detect_anomalies(**kwargs):
        tools_used.append("detect_anomalies")
        log_step("Anomaly Detective", "detect_anomalies", "Scanned September spending for anomalous spikes vs baselines")
        return detect_anomalies(**kwargs)
    tracked_detect_anomalies.__doc__ = detect_anomalies.__doc__

    def tracked_compare_monthly_trends(**kwargs):
        tools_used.append("compare_monthly_trends")
        log_step("Trend Analyst", "compare_monthly_trends", "Computed month-over-month variance between August and September")
        return compare_monthly_trends(**kwargs)
    tracked_compare_monthly_trends.__doc__ = compare_monthly_trends.__doc__

    def tracked_get_goal_impact(**kwargs):
        tools_used.append("get_goal_impact")
        log_step("Goal Planner", "get_goal_impact", "Calculated savings goal milestones and timeline disruption")
        return get_goal_impact(**kwargs)
    tracked_get_goal_impact.__doc__ = get_goal_impact.__doc__

    available_tools = [
        tracked_analyze_spending,
        tracked_get_recurring_commitments,
        tracked_check_budget_headroom,
        tracked_simulate_purchase_impact,
        tracked_detect_anomalies,
        tracked_compare_monthly_trends,
        tracked_get_goal_impact,
    ]

    # 4. Prepare chat contents
    # Format previous turns if present
    contents = []
    if history:
        for turn in history[-4:]:  # Limit context window to last 4 turns
            sender = turn.get("sender") or turn.get("role")
            text = turn.get("text") or turn.get("content") or turn.get("message")
            if sender == "user" and text:
                contents.append(types.Content(role="user", parts=[types.Part.from_text(text=text)]))
            elif sender in ("assistant", "model") and text:
                contents.append(types.Content(role="model", parts=[types.Part.from_text(text=text)]))

    # Add current user prompt
    contents.append(types.Content(role="user", parts=[types.Part.from_text(text=message)]))

    # 5. Invoke Gemini with automatic function calling
    try:
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            tools=available_tools,
            temperature=0.2,
        )

        response = client.models.generate_content(
            model=TARGET_MODEL,
            contents=contents,
            config=config,
        )

        reply_text = response.text or "I evaluated your financial data, but was unable to format a textual response. Please check your dashboard metrics."

        # Generate intelligent follow-up suggestions
        suggestions = generate_contextual_suggestions(message, reply_text, tools_used)

        return {
            "reply": reply_text,
            "suggestions": suggestions,
            "tools_used": list(dict.fromkeys(tools_used)),  # Deduplicated list of tools called
            "agent_steps": agent_steps,
            "grounded": True,
            "model": TARGET_MODEL
        }

    except APIError as e:
        logger.error(f"Gemini API error ({e.code}): {e.message}")
        return generate_graceful_fallback(message, user_id, reason="api_error")
    except Exception as e:
        logger.error(f"Unexpected agent error: {type(e).__name__} - {e!s}")
        return generate_graceful_fallback(message, user_id, reason="general_error")


def generate_graceful_fallback(message: str, user_id: str, reason: str = "missing_api_key") -> dict[str, Any]:
    """Provide a resilient, grounded fallback response using direct MongoDB tool calculations."""
    q = message.lower()
    tools_used = []

    # If GEMINI_API_KEY is not set, provide an informative explanation with real MongoDB calculations
    if "where did i spend" in q or "most" in q or "highest" in q:
        data = analyze_spending()
        tools_used.append("analyze_spending")
        top_cats = sorted(data["category_breakdown"].items(), key=lambda x: x[1], reverse=True)
        top_cat = top_cats[0][0] if top_cats else "Shopping"
        top_amt = top_cats[0][1] if top_cats else 0.0
        total_exp = data["total_spending"]
        top_pct = round((top_amt / total_exp * 100), 1) if total_exp > 0 else 0.0

        reply = (
            f"Based on your MongoDB ledger for September 2026, you spent the most on **{top_cat}**, "
            f"totaling **₹{top_amt:,.0f}** ({top_pct}% of your total spending of ₹{total_exp:,.0f}).\n\n"
            f"**Top Merchants in this period:**\n"
            + "\n".join([f"• **{m['merchant']}**: ₹{m['total']:,.0f} ({m['count']} transactions)" for m in data["top_merchants"][:3]])
        )
        suggestions = ["Show subscriptions", "Check my budget", "How much can I save?"]

    elif "subscription" in q or "recurring" in q:
        data = get_recurring_commitments()
        tools_used.append("get_recurring_commitments")
        recs = data["commitments"]
        items_str = "\n".join([f"• **{r['name']}**: ₹{r['amount']:,.0f} ({r['frequency'].capitalize()}, next due {r['next_due']})" for r in recs])
        reply = (
            f"You have **{len(recs)} active recurring commitments** totaling **₹{data['total_monthly_recurring']:,.0f}/month** in MongoDB:\n\n"
            f"{items_str}\n\n"
            f"All upcoming payments are scheduled through your configured payment methods."
        )
        suggestions = ["Analyze unusual expenses", "Check my budget", "Where did I spend the most?"]

    elif "budget" in q or "limit" in q:
        # Check shopping budget as default or extract category
        cat = "Shopping" if "shopping" in q else ("Food" if "food" in q else "Transport")
        amount_match = re.search(r'₹?\s*([0-9,]+)', q)
        amount = float(amount_match.group(1).replace(",", "")) if amount_match else 0.0

        data = check_budget_headroom(category=cat, amount=amount)
        tools_used.append("check_budget_headroom")

        reply = (
            f"**{cat} Budget Analysis (MongoDB):**\n\n"
            f"• **Budget Limit:** ₹{data['budget_limit']:,.0f}\n"
            f"• **Current Spending:** ₹{data['current_spending']:,.0f}\n"
            f"• **Remaining Headroom:** ₹{data['remaining_headroom']:,.0f}\n"
        )
        if amount > 0:
            status = "[EXCEEDS BUDGET]" if data["exceeds_budget"] else "[WITHIN BUDGET]"
            reply += (
                f"• **Proposed Purchase:** ₹{amount:,.0f}\n"
                f"• **Projected Spending:** ₹{data['projected_spending']:,.0f} ({data['projected_utilization_pct']}% utilization)\n"
                f"• **Verdict:** {status} (by ₹{data['over_budget_by']:,.0f})\n"
            )
        suggestions = ["Where did I spend the most?", "How much can I save?", "Show subscriptions"]

    elif "goa" in q or "trip" in q or "spend" in q or "can i" in q or "afford" in q:
        amount_match = re.search(r'₹?\s*([0-9,]+)', q)
        amount = float(amount_match.group(1).replace(",", "")) if amount_match else 15000.0
        cat = "Entertainment" if ("trip" in q or "goa" in q) else "Shopping"

        sim = simulate_purchase_impact(amount=amount, category=cat, description=message)
        goal = get_goal_impact(amount=amount)
        tools_used.extend(["simulate_purchase_impact", "get_goal_impact"])

        reply = (
            f"### Decision Simulation: Proposed Expense of ₹{amount:,.0f} ({cat})\n\n"
            f"**Decision Grade: {sim['decision_grade'].upper()}**\n\n"
            f"• **Current Month Balance:** ₹{sim['current_balance']:,.0f}\n"
            f"• **Projected Balance After Purchase:** ₹{sim['projected_balance_after']:,.0f}\n"
            f"• **Scheduled Monthly Obligations:** ₹{sim['scheduled_obligations']:,.0f}\n"
            f"• **Net Safety Buffer:** ₹{sim['safety_buffer_remaining']:,.0f}\n\n"
            f"**Goal Impact ({goal['goal_name']}):**\n"
            f"{goal['impact_summary']}\n\n"
            f"**Key Findings:**\n"
            + "\n".join([f"• {r}" for r in sim['key_reasons']])
        )
        suggestions = ["Check my budget", "Show subscriptions", "Where did I spend the most?"]

    elif "anomal" in q or "unusual" in q or "spike" in q:
        data = detect_anomalies()
        tools_used.append("detect_anomalies")
        anomalies_list = "\n".join([f"• **{a['date']} — {a['merchant']}**: ₹{a['amount']:,.0f} ({a['reason']})" for a in data["anomalies"]])
        reply = (
            f"### Unusual Expenses Detected (September 2026)\n\n"
            f"{data['summary']}\n\n"
            f"{anomalies_list}"
        )
        suggestions = ["Where did I spend the most?", "Check my budget", "Show subscriptions"]

    elif "trend" in q or "august" in q or "compar" in q or "increase" in q:
        data = compare_monthly_trends()
        tools_used.append("compare_monthly_trends")
        inc_str = "\n".join([f"• **{c['category']}**: ₹{c['month_a_amount']:,.0f} vs ₹{c['month_b_amount']:,.0f} (+₹{c['difference']:,.0f}, +{c['percentage_change']}%)" for c in data["significant_increases"]])
        reply = (
            f"### Monthly Comparison: September 2026 vs August 2026\n\n"
            f"• **Total Expenses:** ₹{data['expense_comparison']['month_a']:,.0f} vs ₹{data['expense_comparison']['month_b']:,.0f} ({data['expense_comparison']['pct_change']}%)\n"
            f"• **Total Income:** ₹{data['income_comparison']['month_a']:,.0f} vs ₹{data['income_comparison']['month_b']:,.0f}\n\n"
            f"**Categories with Notable Spending:**\n"
            f"{inc_str}"
        )
        suggestions = ["Where did I spend the most?", "Show subscriptions", "Check my budget"]

    else:
        # Default financial overview
        data = analyze_spending()
        recurr = get_recurring_commitments()
        tools_used.extend(["analyze_spending", "get_recurring_commitments"])
        reply = (
            f"FinPilot AI is active and grounded in your MongoDB ledger. For September 2026:\n\n"
            f"• **Recorded Outflows:** ₹{data['total_spending']:,.0f} across {data['transaction_count']} transactions\n"
            f"• **Scheduled Monthly Obligations:** ₹{recurr['total_monthly_recurring']:,.0f} ({recurr['commitments_count']} commitments)\n\n"
            f"Ask me about specific spending, hypothetical purchases (e.g. *'Can I afford ₹15,000 for Goa?'*), or budget headroom."
        )
        suggestions = ["Where did I spend the most?", "Which subscriptions am I paying for?", "What increased compared with last month?"]

    if reason == "missing_api_key":
        reply = (
            "> *[System Note: GEMINI_API_KEY is not configured in .env. Responding using deterministic MongoDB analytical tools.]*\n\n"
            + reply
        )
    elif reason == "api_error":
        reply = (
            "> *[System Note: Gemini API is temporarily unavailable. Reverting to direct MongoDB analytical tools.]*\n\n"
            + reply
        )

    tool_to_agent = {
        "analyze_spending": ("Spending Analyst", "Analyzed spending breakdown in MongoDB"),
        "get_recurring_commitments": ("Recurring Monitor", "Retrieved active subscriptions & commitments"),
        "check_budget_headroom": ("Budget Guardian", "Evaluated budget headroom and utilization"),
        "simulate_purchase_impact": ("Decision Simulator", "Simulated purchase cash impact"),
        "detect_anomalies": ("Anomaly Detective", "Detected category spending spikes"),
        "compare_monthly_trends": ("Trend Analyst", "Compared month-over-month trends"),
        "get_goal_impact": ("Goal Planner", "Evaluated impact on savings goals"),
    }
    fallback_steps = [
        {
            "agent": tool_to_agent.get(t, ("FinPilot AI", "Executed analytical tool"))[0],
            "tool": t,
            "action": tool_to_agent.get(t, ("FinPilot AI", "Executed analytical tool"))[1],
            "status": "completed",
            "order": idx + 1
        }
        for idx, t in enumerate(tools_used)
    ]

    return {
        "reply": reply,
        "suggestions": suggestions,
        "tools_used": list(dict.fromkeys(tools_used)),
        "agent_steps": fallback_steps,
        "grounded": True,
        "mode": "deterministic_tools"
    }


def generate_contextual_suggestions(message: str, reply: str, tools_used: list[str]) -> list[str]:
    """Produce contextual follow-up prompt chips for the frontend."""
    if "simulate_purchase_impact" in tools_used or "afford" in message.lower():
        return [
            "What if I spend ₹5,000 instead?",
            "Show my remaining budget headroom",
            "How does this affect my emergency fund?",
        ]
    elif "get_recurring_commitments" in tools_used:
        return [
            "Which subscriptions can I optimize?",
            "What is my total fixed overhead?",
            "Where did I spend the most this month?",
        ]
    elif "analyze_spending" in tools_used or "detect_anomalies" in tools_used:
        return [
            "Check my budget headroom",
            "Show my recurring subscriptions",
            "What increased compared with August?",
        ]
    return [
        "Where did I spend the most?",
        "Can I spend ₹5,000 on shopping this week?",
        "Show my subscriptions",
    ]
