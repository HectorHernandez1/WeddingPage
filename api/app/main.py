from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr, Field, validator
from typing import Optional, Union
import re
from database import get_db
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create limiter instance
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Wedding RSVP API")

# Add rate limiter error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": {"message": str(exc.detail)}}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": {"message": str(exc)}}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": {"message": "Internal server error"}}
    )

# Add security middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Update with your domains
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Pydantic models for request/response
class RSVPRequest(BaseModel):
    fullName: constr(min_length=2, max_length=100, pattern=r'^[a-zA-ZÀ-ÿ0-9\s\'-]+$')
    phoneNumber: constr(min_length=10, max_length=20, pattern=r'^\d+$')
    countryCode: constr(pattern=r'^\+\d{1,4}$')
    guest_relationship: constr(pattern='^(bride|groom|friend)$')
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

def sanitize_phone(phone: str) -> str:
    """Remove any non-digit characters from phone number"""
    return re.sub(r'\D', '', phone)

@contextmanager
def get_db_cursor():
    """Context manager for database connections"""
    conn = None
    try:
        conn = get_db()
        cur = conn.cursor()
        logger.info("Successfully created database cursor")
        yield cur
        conn.commit()
        logger.info("Successfully committed transaction")
    except Exception as e:
        if conn:
            conn.rollback()
            logger.error(f"Rolling back transaction due to error: {str(e)}")
        raise
    finally:
        if conn:
            if cur:
                cur.close()
                logger.info("Successfully closed cursor")
            conn.close()
            logger.info("Successfully closed connection")

@app.post("/rsvp/", response_model=RSVPResponse)
@limiter.limit("5/minute")
async def create_rsvp(request: Request, rsvp_request: RSVPRequest):
    logger.info(f"Received RSVP request: {rsvp_request}")
    try:
        # Sanitize phone number
        clean_phone = sanitize_phone(rsvp_request.phoneNumber)
        full_phone = f"{rsvp_request.countryCode}{clean_phone}"
        logger.info(f"Processing RSVP for phone number: {full_phone}")
        
        with get_db_cursor() as cur:
            # Check if guest already exists by phone number
            cur.execute(
                "SELECT id FROM guests WHERE phone_number = %s",
                (full_phone,)
            )
            existing_guest = cur.fetchone()
            logger.info(f"Existing guest check result: {existing_guest}")

            if existing_guest:
                guest_id = existing_guest['id']
                logger.info(f"Found existing guest with ID: {guest_id}")
            else:
                # Create new guest
                cur.execute(
                    """
                    INSERT INTO guests (full_name, phone_number, country_code)
                    VALUES (%s, %s, %s)
                    RETURNING id, full_name, phone_number, country_code, created_at, updated_at
                    """,
                    (rsvp_request.fullName, full_phone, rsvp_request.countryCode)
                )
                guest = cur.fetchone()
                if not guest:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to create guest record"
                    )
                guest_id = guest['id']
                logger.info(f"Created new guest with ID: {guest_id}")

            # Check for existing RSVP
            cur.execute(
                "SELECT id FROM rsvp_responses WHERE guest_id = %s",
                (guest_id,)
            )
            existing_rsvp = cur.fetchone()
            was_updated = bool(existing_rsvp)
            logger.info(f"Existing RSVP check result: {existing_rsvp}")

            if existing_rsvp:
                # Update existing RSVP
                cur.execute(
                    """
                    UPDATE rsvp_responses
                    SET guest_relationship = %s,
                        household_count = %s,
                        food_allergies = %s,
                        is_visiting_venue = %s,
                        arrival_date = %s,
                        additional_notes = %s,
                        updated_at = NOW()
                    WHERE guest_id = %s
                    RETURNING id, guest_id, guest_relationship AS relationship, household_count, food_allergies,
                              is_visiting_venue, arrival_date, additional_notes, created_at, updated_at
                    """,
                    (
                        rsvp_request.relationship,
                        rsvp_request.householdCount,
                        rsvp_request.foodAllergies,
                        rsvp_request.isVisitingVenue,
                        rsvp_request.arrivalDate,
                        rsvp_request.additionalNotes,
                        guest_id
                    )
                )
            else:
                # Create new RSVP
                cur.execute(
                    """
                    INSERT INTO rsvp_responses (
                        guest_id, guest_relationship, household_count, food_allergies,
                        is_visiting_venue, arrival_date, additional_notes
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, guest_id, guest_relationship AS relationship, household_count, food_allergies,
                              is_visiting_venue, arrival_date, additional_notes, created_at, updated_at
                    """,
                    (
                        guest_id,
                        rsvp_request.relationship,
                        rsvp_request.householdCount,
                        rsvp_request.foodAllergies,
                        rsvp_request.isVisitingVenue,
                        rsvp_request.arrivalDate,
                        rsvp_request.additionalNotes
                    )
                )

            rsvp = cur.fetchone()
            if not rsvp:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create/update RSVP record"
                )

            # Get guest details for response
            cur.execute(
                """
                SELECT g.full_name, g.phone_number, g.country_code,
                       r.guest_relationship as relationship, r.household_count, r.food_allergies,
                       r.is_visiting_venue, r.arrival_date, r.additional_notes
                FROM guests g
                JOIN rsvp_responses r ON r.guest_id = g.id
                WHERE g.id = %s
                """,
                (guest_id,)
            )
            result = cur.fetchone()

            return RSVPResponse(
                id=rsvp['id'],
                fullName=result['full_name'],
                phoneNumber=result['phone_number'],
                countryCode=result['country_code'],
                guest_relationship=result['guest_relationship'],
                householdCount=result['household_count'],
                foodAllergies=result['food_allergies'],
                isVisitingVenue=result['is_visiting_venue'],
                arrivalDate=result['arrival_date'],
                additionalNotes=result['additional_notes'],
                wasUpdated=was_updated
            )

    except HTTPException as e:
        logger.error(f"HTTP error in RSVP creation: {str(e.detail)}")
        raise
    except Exception as e:
        logger.error(f"Error in RSVP creation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={"message": f"Internal server error: {str(e)}"}
        )

@app.get("/rsvp/{phone_number}", response_model=RSVPResponse)
@limiter.limit("10/minute")
async def get_rsvp(request: Request, phone_number: str):
    # Sanitize phone number
    clean_phone = sanitize_phone(phone_number)
    if not clean_phone:
        raise HTTPException(status_code=400, detail="Invalid phone number format")
    
    logger.info(f"Looking up RSVP for phone number: {clean_phone}")
    
    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT 
                r.id,
                g.full_name,
                g.phone_number,
                g.country_code,
                r.guest_relationship,
                r.household_count,
                r.food_allergies,
                r.is_visiting_venue,
                r.arrival_date,
                r.additional_notes
            FROM guests g
            JOIN rsvp_responses r ON g.id = r.guest_id
            WHERE g.phone_number = %s
            """,
            (clean_phone,)
        )
        result = cur.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="RSVP not found")
        
        return RSVPResponse(
            id=result['id'],
            fullName=result['full_name'],
            phoneNumber=clean_phone,
            countryCode=result['country_code'],
            relationship=result['guest_relationship'],
            householdCount=result['household_count'],
            foodAllergies=result['food_allergies'],
            isVisitingVenue=result['is_visiting_venue'],
            arrivalDate=result['arrival_date'],
            additionalNotes=result['additional_notes']
        )

@app.get("/guest-details/")
@limiter.limit("10/minute")
async def get_all_guest_details(request: Request):
    """Get all guest details from the view"""
    with get_db_cursor() as cur:
        try:
            cur.execute("SELECT * FROM guest_rsvp_details")
            results = cur.fetchall()
            # Convert results to list of dicts for JSON serialization
            return {"guests": [dict(row) for row in results]}
        except Exception as e:
            logger.error(f"Error fetching guest details: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/guest-details/{guest_id}")
@limiter.limit("10/minute")
async def get_guest_details(request: Request, guest_id: int):
    """Get guest details by ID from the view"""
    with get_db_cursor() as cur:
        try:
            cur.execute("SELECT * FROM guest_rsvp_details WHERE guest_id = %s", (guest_id,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Guest not found")
            return dict(result)
        except Exception as e:
            logger.error(f"Error fetching guest details: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 