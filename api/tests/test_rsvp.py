import os
import sys
from pathlib import Path
from contextlib import contextmanager

from fastapi.testclient import TestClient

# Ensure the application code can be imported
APP_DIR = Path(__file__).resolve().parents[1] / "app"
sys.path.append(str(APP_DIR))

# Provide a dummy DATABASE_URL so the module import succeeds
os.environ.setdefault("DATABASE_URL", "postgresql://user:pass@localhost/db")

import main  # type: ignore

client = TestClient(main.app)

class DummyCursor:
    def __init__(self):
        self.call = 0
    def execute(self, *args, **kwargs):
        pass
    def fetchone(self):
        self.call += 1
        if self.call == 1:
            return None
        elif self.call == 2:
            return {"id": 1, "full_name": "John Doe", "phone_number": "+11234567890", "country_code": "+1"}
        elif self.call == 3:
            return None
        elif self.call == 4:
            return {"id": 10}
        elif self.call == 5:
            return {
                "full_name": "John Doe",
                "phone_number": "+11234567890",
                "country_code": "+1",
                "guest_relationship": "friend",
                "household_count": 2,
                "food_allergies": None,
                "is_visiting_venue": True,
                "arrival_date": "2024-08-01",
                "additional_notes": "Looking forward to it!"
            }
        return None
    def close(self):
        pass

@contextmanager
def dummy_get_db_cursor():
    yield DummyCursor()

def test_create_rsvp_success(monkeypatch):
    monkeypatch.setattr(main, "get_db_cursor", dummy_get_db_cursor)
    if not hasattr(main.RSVPRequest, "relationship"):
        setattr(main.RSVPRequest, "relationship", property(lambda self: self.guest_relationship))

    payload = {
        "fullName": "John Doe",
        "phoneNumber": "1234567890",
        "countryCode": "+1",
        "guest_relationship": "friend",
        "householdCount": 2,
        "foodAllergies": None,
        "isVisitingVenue": True,
        "arrivalDate": "2024-08-01",
        "additionalNotes": "Looking forward to it!"
    }
    response = client.post("/rsvp/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["fullName"] == "John Doe"
    assert data["phoneNumber"] == "+11234567890"
    assert data["wasUpdated"] is False

def test_create_rsvp_invalid_phone():
    payload = {
        "fullName": "Jane Doe",
        "phoneNumber": "invalid",
        "countryCode": "+1",
        "guest_relationship": "friend",
        "householdCount": 1
    }
    response = client.post("/rsvp/", json=payload)
    assert response.status_code == 422
