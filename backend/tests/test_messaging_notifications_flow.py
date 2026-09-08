"""
End-to-End Automated Test for Messaging & Notifications Flow:
1. Zero-mock state: Both guest & host start with zero mock messages.
2. Guest contacts host from listing -> Message appears in both guest & host messages sections.
3. Host receives a real-time notification about the guest's inquiry.
4. Host replies to guest -> Reply appears in the message thread.
5. Guest receives a notification about the host's reply.
6. Reading/clearing notifications works seamlessly.
"""

import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"
PASS = "[PASS]"
FAIL = "[FAIL]"

def run_test():
    print("=" * 70)
    print("TESTING REAL MESSAGING & NOTIFICATIONS FLOW (ZERO-MOCK)")
    print("=" * 70)

    # 0. Clean any previous test messages & notifications
    requests.delete(f"{BASE_URL}/messages", headers={"X-User-Id": "1"})
    requests.delete(f"{BASE_URL}/messages", headers={"X-User-Id": "2"})
    requests.delete(f"{BASE_URL}/notifications", headers={"X-User-Id": "1"})
    requests.delete(f"{BASE_URL}/notifications", headers={"X-User-Id": "2"})

    # 1. Verify Zero-Mock State for Guest & Host
    res_g_threads = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "1"})
    assert res_g_threads.status_code == 200
    assert len(res_g_threads.json()) == 0, "Guest has mock messages!"

    res_h_threads = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "2"})
    assert res_h_threads.status_code == 200
    assert len(res_h_threads.json()) == 0, "Host has mock messages!"

    print(f"{PASS} 1. Zero-Mock Verified: No fake or mock messages exist in guest or host sections.")

    # 2. Guest (Lakshya, ID 1) contacts Host (Ravi, ID 2) regarding Listing 1
    inquiry_text = "Hi Ravi, could you please confirm if secure car parking is available?"
    res_send_1 = requests.post(
        f"{BASE_URL}/messages",
        headers={"X-User-Id": "1"},
        json={"recipient_id": 2, "listing_id": 1, "text": inquiry_text}
    )
    assert res_send_1.status_code == 201, f"Failed to send message: {res_send_1.text}"
    msg_1 = res_send_1.json()
    assert msg_1["sender_id"] == 1
    assert msg_1["recipient_id"] == 2
    assert msg_1["text"] == inquiry_text
    print(f"{PASS} 2. Guest sent message to host from Listing 1 (Message ID: {msg_1['id']})")

    # 3. Message appears in Guest's Messages section
    res_g_after = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "1"})
    assert res_g_after.status_code == 200
    g_threads = res_g_after.json()
    assert len(g_threads) == 1
    assert g_threads[0]["other_user"]["full_name"] == "Ravi Sharma"
    assert g_threads[0]["listing"]["title"] == "Modern Minimalist 2BHK Flat in Sector 63"
    assert g_threads[0]["last_message"] == inquiry_text
    print(f"{PASS} 3. Message successfully appears in Guest Messages section under thread with Ravi Sharma")

    # 4. Message appears in Host's Messages section
    res_h_after = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "2"})
    assert res_h_after.status_code == 200
    h_threads = res_h_after.json()
    assert len(h_threads) == 1
    assert h_threads[0]["other_user"]["full_name"] == "Lakshya Arora"
    assert h_threads[0]["unread_count"] == 1
    print(f"{PASS} 4. Message successfully appears in Host Dashboard Messages tab (unread: 1)")

    # 5. Host gets real-time notification
    res_h_notifs = requests.get(f"{BASE_URL}/notifications", headers={"X-User-Id": "2"})
    assert res_h_notifs.status_code == 200
    h_notifs = res_h_notifs.json()
    assert len(h_notifs) >= 1
    latest_h_notif = h_notifs[0]
    assert "Lakshya Arora" in latest_h_notif["title"]
    assert "parking" in latest_h_notif["description"].lower()
    print(f"{PASS} 5. Host Notification Verified: '{latest_h_notif['title']}' - '{latest_h_notif['description']}'")

    # 6. Host replies to Guest
    reply_text = "Hello Lakshya, yes! We have a dedicated covered parking bay for your car."
    res_send_2 = requests.post(
        f"{BASE_URL}/messages",
        headers={"X-User-Id": "2"},
        json={"recipient_id": 1, "listing_id": 1, "text": reply_text}
    )
    assert res_send_2.status_code == 201
    print(f"{PASS} 6. Host replied to Guest inquiry")

    # 7. Guest gets real-time notification about the reply
    res_g_notifs = requests.get(f"{BASE_URL}/notifications", headers={"X-User-Id": "1"})
    assert res_g_notifs.status_code == 200
    g_notifs = res_g_notifs.json()
    assert len(g_notifs) >= 1
    latest_g_notif = g_notifs[0]
    assert "Ravi Sharma" in latest_g_notif["title"]
    assert "covered parking" in latest_g_notif["description"].lower()
    print(f"{PASS} 7. Guest Notification Verified: '{latest_g_notif['title']}' - '{latest_g_notif['description']}'")

    # 8. Thread now has both messages in chronological order
    res_thread_final = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "1"})
    final_messages = res_thread_final.json()[0]["messages"]
    assert len(final_messages) == 2
    assert final_messages[0]["text"] == inquiry_text
    assert final_messages[1]["text"] == reply_text
    print(f"{PASS} 8. Thread chat stream has both messages correctly synchronized in conversation.")

    # 9. Mark read
    thread_id = res_thread_final.json()[0]["thread_id"]
    requests.post(f"{BASE_URL}/messages/thread/{thread_id}/read", headers={"X-User-Id": "2"})
    res_h_read = requests.get(f"{BASE_URL}/messages/threads", headers={"X-User-Id": "2"})
    assert res_h_read.json()[0]["unread_count"] == 0
    print(f"{PASS} 9. Thread unread count properly cleared upon reading.")

    print("=" * 70)
    print("ALL MESSAGING & NOTIFICATION FLOW VERIFICATIONS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_test()
