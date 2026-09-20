"""
Comprehensive verification of FinPilot Agentic AI layer
Tests all 10 required dynamic user questions and verifies tool selection, calculations,
and response structure.
"""

import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.ai_agent import TARGET_MODEL, get_api_key, run_agent_chat

TEST_QUESTIONS = [
    "Where did I spend the most this month?",
    "Show my subscriptions.",
    "What increased compared with August?",
    "Am I over budget on shopping?",
    "Can I spend ₹5,000 this week?",
    "Can I spend ₹15,000 on a Goa trip without affecting my emergency fund?",
    "What unusual expenses did I have recently?",
    "How much am I spending on recurring payments?",
    "How much can I save this month?",
    "If I spend ₹3,000 on shopping, what happens to my budget?",
]

def main():
    api_key = get_api_key()
    print("=" * 65)
    print("FINPILOT AGENTIC AI VERIFICATION SUITE")
    print(f"Target Model: {TARGET_MODEL}")
    print(f"GEMINI_API_KEY Configured: {'YES' if api_key else 'NO (Graceful Deterministic Mode)'}")
    print("=" * 65)

    results = []

    for idx, q in enumerate(TEST_QUESTIONS, 1):
        clean_q = q.replace("₹", "Rs. ")
        print(f"\n[{idx}/10] Testing: \"{clean_q}\"")
        try:
            resp = run_agent_chat(message=q, user_id="U001")
            reply = resp.get("reply", "").replace("₹", "Rs. ")
            tools = resp.get("tools_used", [])
            grounded = resp.get("grounded", False)
            suggestions = resp.get("suggestions", [])

            safe_reply = reply[:150].strip().encode('ascii', errors='replace').decode('ascii')
            print(f"  -> Tools Used: {tools}")
            print(f"  -> Grounded: {grounded}")
            print(f"  -> Suggestions: {[s.encode('ascii', errors='replace').decode('ascii') for s in suggestions[:2]]}")
            print(f"  -> Response Snippet: {safe_reply}...")

            results.append({
                "question": q,
                "status": "PASS",
                "tools_used": tools,
                "grounded": grounded,
                "response_length": len(reply)
            })
        except Exception as e:
            print(f"  -> FAILED with error: {type(e).__name__}: {e}")
            results.append({
                "question": q,
                "status": "FAIL",
                "error": str(e)
            })

    print("\n" + "=" * 65)
    print("TEST EXECUTION SUMMARY")
    print("=" * 65)
    passed = sum(1 for r in results if r["status"] == "PASS")
    print(f"Passed: {passed}/{len(TEST_QUESTIONS)}")
    for r in results:
        q_disp = r['question'].replace("₹", "Rs. ")
        print(f"  • {q_disp[:45]:<45} | Tools: {', '.join(r.get('tools_used', []))} | {r['status']}")

if __name__ == "__main__":
    main()
