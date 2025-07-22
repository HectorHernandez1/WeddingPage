from pydantic import BaseModel, Field, validator
from typing import Annotated, Optional, Union

class RSVPRequest(BaseModel):
    fullName: Annotated[str, Field(min_length=2, max_length=100, pattern=r'^[a-zA-ZÀ-ÿ0-9\s\'-]+$')]
    phoneNumber: Annotated[str, Field(min_length=10, max_length=20, pattern=r'^\d+$')]
    countryCode: Annotated[str, Field(pattern=r'^\+\d{1,4}$')]
    guest_relationship: Annotated[str, Field(pattern='^(bride|groom|friend)$')]
    householdCount: Union[str, int]  # Accept either string or integer
    foodAllergies: Optional[str] = None
    isVisitingVenue: bool = False
    arrivalDate: Optional[str] = None
    additionalNotes: Optional[str] = None

    @validator('householdCount')
    def validate_household_count(cls, v):
        if isinstance(v, str):
            try:
                v = int(v)
            except ValueError:
                raise ValueError('Must be a valid integer between 1 and 10')
        if not isinstance(v, int) or v < 1 or v > 10:
            raise ValueError('Must be a valid integer between 1 and 10')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "fullName": "John Doe",
                "phoneNumber": "1234567890",
                "countryCode": "+1",
                "guest_relationship": "friend",
                "householdCount": 2,
                "foodAllergies": "None",
                "isVisitingVenue": True,
                "arrivalDate": "2024-08-01",
                "additionalNotes": "Looking forward to it!"
            }
        }

class RSVPResponse(BaseModel):
    id: int
    fullName: str
    phoneNumber: str
    countryCode: str
    guest_relationship: str
    householdCount: int
    foodAllergies: Optional[str]
    isVisitingVenue: bool
    arrivalDate: Optional[str]
    additionalNotes: Optional[str]
    wasUpdated: bool = False

    class Config:
        from_attributes = True