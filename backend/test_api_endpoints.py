import json

import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_all():
    results = {}
    
    # 1. Auth Login
    print("Testing 1: POST /api/auth/login")
    r = requests.post(f"{BASE_URL}/auth/login", json={"email": "demo@finpilot.com", "password": "password123"})
    if r.status_code == 200:
        data = r.json()
        print(f"Login success: user_id={data['user']['id']}, email={data['user']['email']}, name={data['user']['name']}")
        token = data['token']
        headers = {"Authorization": f"Bearer {token}"}
        results["login"] = {"status": "SUCCESS", "user_id": data['user']['id']}
    else:
        print(f"Login failed: {r.status_code} {r.text}")
        results["login"] = {"status": "FAILED", "code": r.status_code}
        headers = {}

    # Also test default 123456 demo password
    r_demo = requests.post(f"{BASE_URL}/auth/login", json={"email": "demo@finpilot.com", "password": "123456"})
    print(f"Demo password login (123456): status={r_demo.status_code}")

    # 2. Dashboard
    print("\nTesting 2: GET /api/dashboard")
    r = requests.get(f"{BASE_URL}/dashboard?user_id=U001&month=September%202026", headers=headers)
    if r.status_code == 200:
        dash = r.json()
        print(f"Dashboard month: {dash.get('month')}")
        print(f"Total income: {dash.get('total_income')}")
        print(f"Total expenses: {dash.get('total_expenses')}")
        print(f"Remaining balance: {dash.get('remaining_balance')}")
        print(f"Savings rate: {dash.get('savings_rate')}%")
        print(f"Categories count: {len(dash.get('category_spending', []))}")
        print(f"Monthly trends count: {len(dash.get('monthly_trends', []))}")
        results["dashboard"] = {"status": "SUCCESS", "income": dash.get('total_income'), "expenses": dash.get('total_expenses')}
    else:
        print(f"Dashboard failed: {r.status_code} {r.text}")
        results["dashboard"] = {"status": "FAILED"}

    # 3. Transactions
    print("\nTesting 3: GET /api/transactions")
    r = requests.get(f"{BASE_URL}/transactions?user_id=U001&page=1&limit=15", headers=headers)
    if r.status_code == 200:
        tx = r.json()
        print(f"Total transactions for U001: {tx.get('total')}")
        print(f"Returned transactions: {len(tx.get('transactions', []))}")
        print(f"Page: {tx.get('page')}/{tx.get('totalPages')}")
        if tx.get('transactions'):
            print(f"First transaction: {tx['transactions'][0]}")
        results["transactions"] = {"status": "SUCCESS", "total": tx.get('total')}
    else:
        print(f"Transactions failed: {r.status_code} {r.text}")
        results["transactions"] = {"status": "FAILED"}

    # 4. Recurring Payments
    print("\nTesting 4: GET /api/recurring-payments")
    r = requests.get(f"{BASE_URL}/recurring-payments?user_id=U001", headers=headers)
    if r.status_code == 200:
        recurr = r.json()
        print(f"Recurring payments count: {len(recurr)}")
        for rec in recurr[:3]:
            print(f"  - {rec.get('name')}: Rs. {rec.get('amount')} ({rec.get('frequency')})")
        results["recurring"] = {"status": "SUCCESS", "count": len(recurr)}
    else:
        print(f"Recurring payments failed: {r.status_code} {r.text}")
        results["recurring"] = {"status": "FAILED"}

    # 5. Budgets
    print("\nTesting 5: GET /api/budgets")
    r = requests.get(f"{BASE_URL}/budgets?user_id=U001", headers=headers)
    if r.status_code == 200:
        budgets = r.json()
        print(f"Budgets count: {len(budgets)}")
        for b in budgets[:3]:
            print(f"  - {b.get('category')}: Limit Rs. {b.get('limit')}, Spent Rs. {b.get('spent')}")
        results["budgets"] = {"status": "SUCCESS", "count": len(budgets)}
    else:
        print(f"Budgets failed: {r.status_code} {r.text}")
        results["budgets"] = {"status": "FAILED"}

    # 6. Goals
    print("\nTesting 6: GET /api/goals")
    r = requests.get(f"{BASE_URL}/goals?user_id=U001", headers=headers)
    if r.status_code == 200:
        goals = r.json()
        print(f"Goals count: {len(goals)}")
        for g in goals:
            print(f"  - {g.get('name')}: Current Rs. {g.get('current')} / Target Rs. {g.get('target')}")
        results["goals"] = {"status": "SUCCESS", "count": len(goals)}
    else:
        print(f"Goals failed: {r.status_code} {r.text}")
        results["goals"] = {"status": "FAILED"}

    # 7. Monthly Reports
    print("\nTesting 7: GET /api/reports/monthly")
    r = requests.get(f"{BASE_URL}/reports/monthly?user_id=U001", headers=headers)
    if r.status_code == 200:
        report = r.json()
        print(f"Reports returned: month={report.get('month')}, income={report.get('total_income')}, expenses={report.get('total_expenses')}")
        results["reports"] = {"status": "SUCCESS", "income": report.get('total_income')}
    else:
        print(f"Reports failed: {r.status_code} {r.text}")
        results["reports"] = {"status": "FAILED"}

    # 8. Insights
    print("\nTesting 8: GET /api/insights")
    r = requests.get(f"{BASE_URL}/insights?user_id=U001", headers=headers)
    if r.status_code == 200:
        ins = r.json()
        print(f"Insights count: {len(ins)}")
        for i in ins:
            print(f"  - [{i.get('severity')}] {i.get('title')}")
        results["insights"] = {"status": "SUCCESS", "count": len(ins)}
    else:
        print(f"Insights failed: {r.status_code} {r.text}")
        results["insights"] = {"status": "FAILED"}

    # 8b. AI Assistant Chat
    print("\nTesting 8b: POST /api/ai/chat")
    r = requests.post(f"{BASE_URL}/ai/chat", json={"message": "Can I afford a 15000 flight ticket to Goa?"}, headers=headers)
    if r.status_code == 200:
        chat_resp = r.json()
        clean_text = chat_resp.get('reply', '').replace('₹', 'Rs.')
        print(f"AI response: {clean_text[:100]}...")
        results["ai_chat"] = {"status": "SUCCESS"}
    else:
        print(f"AI chat failed: {r.status_code} {r.text}")
        results["ai_chat"] = {"status": "FAILED"}

    # 9. CSV Upload Test
    print("\nTesting 9: POST /api/upload")
    csv_sample = """transaction_id,user_id,date,description,amount,type,category,merchant,account
TXN99999,U001,2026-09-18,Test CSV Upload Verification,150.00,expense,Food & Dining,Cafe Bistro,HDFC Savings
"""
    files = {"file": ("test_upload.csv", io.StringIO(csv_sample).getvalue(), "text/csv")}
    r = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
    if r.status_code == 200:
        upload_resp = r.json()
        print(f"Upload result: {upload_resp}")
        results["upload"] = {"status": "SUCCESS", "processed": upload_resp.get("transactions_processed")}
    else:
        print(f"Upload failed: {r.status_code} {r.text}")
        results["upload"] = {"status": "FAILED"}

    print("\n--- Summary of Endpoint Tests ---")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    import io
    test_all()
