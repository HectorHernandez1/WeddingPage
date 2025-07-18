-- Delete data from tables in the correct order to respect foreign key constraints
DELETE FROM rsvp_responses;
DELETE FROM guests;