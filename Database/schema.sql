-- Create tables
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    country_code VARCHAR(5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvp_responses (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id),
    guest_relationship VARCHAR(10) NOT NULL,
    household_count INTEGER NOT NULL,
    food_allergies TEXT,
    is_visiting_venue BOOLEAN DEFAULT FALSE,
    arrival_date VARCHAR(10),
    additional_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create view combining guests and rsvp information
CREATE OR REPLACE VIEW guest_rsvp_details AS
SELECT 
    g.id as guest_id,
    g.full_name,
    g.phone_number,
    g.country_code,
    r.guest_relationship,
    r.household_count,
    r.food_allergies,
    r.is_visiting_venue,
    r.arrival_date,
    r.additional_notes,
    g.created_at as guest_created_at,
    g.updated_at as guest_updated_at,
    r.created_at as rsvp_created_at,
    r.updated_at as rsvp_updated_at
FROM guests g
LEFT JOIN rsvp_responses r ON g.id = r.guest_id; 