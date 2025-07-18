import os
import json
from datetime import datetime
import sshtunnel
import pandas as pd
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables
load_dotenv()

# SSH Connection Details from environment variables
SSH_HOST = os.getenv('PROD_SSH_HOST')
SSH_USER = os.getenv('PROD_SSH_USER')
REMOTE_DB_HOST = os.getenv('PROD_DB_HOST')
REMOTE_DB_PORT = int(os.getenv('PROD_DB_PORT'))
DB_USER = os.getenv('POSTGRES_USER')
DB_PASS = os.getenv('POSTGRES_PASSWORD')
DB_NAME = os.getenv('POSTGRES_DB')

def backup_data():
    try:
        # Create SSH tunnel
        with sshtunnel.SSHTunnelForwarder(
            (SSH_HOST, 22),  # Remote SSH address and port
            ssh_username=SSH_USER,
            remote_bind_address=(REMOTE_DB_HOST, REMOTE_DB_PORT)
        ) as tunnel:
            print(f"SSH tunnel established on local port {tunnel.local_bind_port}")
            
            # Connect to PostgreSQL using psycopg2
            conn = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASS,
                host='127.0.0.1',
                port=tunnel.local_bind_port,
                cursor_factory=RealDictCursor
            )
            
            # Create a cursor
            cur = conn.cursor()

            # Check table structure
            print("\nChecking database structure:")
            cur.execute("""
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public'
                ORDER BY table_name, ordinal_position;
            """)
            for row in cur.fetchall():
                print(f"Table: {row['table_name']}, Column: {row['column_name']}, Type: {row['data_type']}")
            
            # Get all guests
            cur.execute("""
                SELECT id, full_name, phone_number, country_code, 
                       created_at, updated_at
                FROM guests
            """)
            guest_data = [dict(row) for row in cur.fetchall()]
            
            # Get all RSVPs
            cur.execute("""
                SELECT id, guest_id, guest_relationship, household_count,
                       food_allergies, is_visiting_venue, arrival_date,
                       additional_notes, created_at, updated_at
                FROM rsvp_responses
            """)
            rsvp_data = [dict(row) for row in cur.fetchall()]

            # Close database connection
            cur.close()
            conn.close()

            # Convert datetime objects to ISO format strings
            for guest in guest_data:
                guest['created_at'] = guest['created_at'].isoformat() if guest['created_at'] else None
                guest['updated_at'] = guest['updated_at'].isoformat() if guest['updated_at'] else None
            
            for rsvp in rsvp_data:
                rsvp['created_at'] = rsvp['created_at'].isoformat() if rsvp['created_at'] else None
                rsvp['updated_at'] = rsvp['updated_at'].isoformat() if rsvp['updated_at'] else None

            # Create backup directory if it doesn't exist
            backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
            os.makedirs(backup_dir, exist_ok=True)

            # Save as JSON
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            with open(os.path.join(backup_dir, f'backup_{timestamp}.json'), 'w') as f:
                json.dump({
                    'guests': guest_data,
                    'rsvps': rsvp_data
                }, f, indent=2)

            # Save as Excel (more readable for humans)
            guests_df = pd.DataFrame(guest_data)
            rsvps_df = pd.DataFrame(rsvp_data)
            
            with pd.ExcelWriter(os.path.join(backup_dir, f'backup_{timestamp}.xlsx')) as writer:
                guests_df.to_excel(writer, sheet_name='Guests', index=False)
                rsvps_df.to_excel(writer, sheet_name='RSVPs', index=False)

            print(f"\nBackup completed! Files saved in {backup_dir}")
            print(f"Total guests: {len(guest_data)}")
            print(f"Total RSVPs: {len(rsvp_data)}")

    except Exception as e:
        print(f"Error during backup: {str(e)}")

if __name__ == "__main__":
    backup_data() 