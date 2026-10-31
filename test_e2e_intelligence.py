import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8080"
EVENT_ID = "evt-global-2026"

def post_json(url, data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        return e.code, err_body

def get_json(url, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        return e.code, err_body

def main():
    print(f"--- 1. Authenticating as manager@eventsphere.ai ---")
    status, login_res = post_json(f"{BASE_URL}/api/v1/auth/login", {
        "email": "manager@eventsphere.ai",
        "password": "Password123!"
    })
    print(f"Login Status: {status}")
    if status != 200:
        print("Login failed:", login_res)
        return

    token = login_res.get("data", {}).get("accessToken") or login_res.get("data", {}).get("token")
    print(f"Token obtained: {token[:20]}..." if token else "No token found")

    auth_headers = {
        "Authorization": f"Bearer {token}"
    }

    print(f"\n--- 2. Testing GET /api/v1/intelligence/events/{EVENT_ID}/dashboard ---")
    st, res = get_json(f"{BASE_URL}/api/v1/intelligence/events/{EVENT_ID}/dashboard", auth_headers)
    print(f"Dashboard Status: {st}")
    d = res.get("data", {})
    print(f"Event: {d.get('eventTitle')}")
    prog = d.get("progress", {})
    print(f"Progress: Actual {prog.get('actualProgress')}% vs Planned {prog.get('plannedProgress')}% (Gap: {prog.get('progressGap')}%)")
    delay = d.get("delayPrediction", {})
    print(f"Delay Risk: {delay.get('riskLevel')} (Probability: {delay.get('delayProbability')})")
    reg = d.get("registrationForecast", {})
    print(f"Registration Target: {reg.get('targetCapacity')}, Predicted: {reg.get('predictedFinalRegistrations')}")

    print("\n--- 3. Testing Proposal Extraction & Milestone Flow ---")
    st, res = post_json(f"{BASE_URL}/api/v1/intelligence/proposals", {
        "eventId": EVENT_ID,
        "title": "Global Tech Summit 2026 Executive Proposal",
        "fileName": "tech_summit_charter.txt",
        "content": """
        Event Operations Plan for Global Tech Summit 2026.
        Required Deliverables & Milestones:
        1. Audio/Visual and Main Stage Acoustic Rigging by 2026-11-01 (Weight: 25%, Deliverable: Signed vendor contract & sound check pass).
        2. Keynote Speakers Technical Dry-Run and Presentation Check by 2026-11-08 (Weight: 20%, Deliverable: Slidedecks verified).
        3. Catering Logistics, Banquet Menus and Dietary Allocations by 2026-11-10 (Weight: 15%, Deliverable: Confirmed headcount).
        4. RFID Badge Printing, Lanyard Assembly and Kiosk Setup by 2026-11-12 (Weight: 20%, Deliverable: 2500 passes printed).
        5. Live Stream CDN Broadcast Multi-camera Simulation by 2026-11-14 (Weight: 20%, Deliverable: 4K latency benchmark under 2s).
        """
    }, headers=auth_headers)
    print(f"Proposal Upload Status: {st}")
    if st in (200, 201):
        p = res.get("data", {})
        proposal_id = p.get("id")
        print(f"Uploaded Proposal ID: {proposal_id}, Status: {p.get('status')}")
        milestones = p.get("milestones", [])
        print(f"Extracted Milestones Count: {len(milestones)}")
        for m in milestones:
            print(f"  * [{m.get('id')}] {m.get('title')} (Weight: {m.get('weight')}, Matched Task: {m.get('matchedTaskId')})")

        if milestones:
            milestone_ids = [m.get("id") for m in milestones]
            print(f"\nApproving {len(milestone_ids)} extracted milestones into checklist...")
            approval_payload = {
                "approvedMilestoneIds": milestone_ids,
                "proposalStatus": "APPROVED"
            }
            app_st, app_res = post_json(f"{BASE_URL}/api/v1/intelligence/proposals/{proposal_id}/approve", approval_payload, headers=auth_headers)
            print(f"Approval Status: {app_st}")
            if app_st == 200:
                approved_p = app_res.get("data", {})
                print(f"Proposal Status: {approved_p.get('status')}")
                approved_milestones = approved_p.get("milestones", [])
                print(f"Approved Milestones: {sum(1 for m in approved_milestones if m.get('approved'))}/{len(approved_milestones)}")
            else:
                print(f"Approval failed: {app_res}")
    else:
        print("Proposal upload error:", res)

    print(f"\n--- 4. Re-checking Deterministic Progress after Milestones Promoted into Tasks ---")
    st, res = get_json(f"{BASE_URL}/api/v1/intelligence/events/{EVENT_ID}/progress", auth_headers)
    print(f"Progress Status: {st}")
    if st == 200:
        d = res.get("data", {})
        print(f"Actual Progress: {d.get('actualProgress')}%")
        print(f"Planned Progress: {d.get('plannedProgress')}%")
        print(f"Progress Gap: {d.get('progressGap')}%")
        print(f"Total Operational Tasks: {d.get('totalTasks')}")
        print(f"Approved Milestones: {d.get('approvedMilestonesCount')}")

    print("\n================ ALL CHECKS FINISHED ================")

if __name__ == "__main__":
    main()
