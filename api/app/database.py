import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

logger.info(f"Connecting to database...")

def get_db():
    try:
        # Parse DATABASE_URL
        url = urlparse(DATABASE_URL)
        conn = psycopg2.connect(
            dbname=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            cursor_factory=RealDictCursor
        )
        logger.info("Successfully connected to the database")
        return conn
    except psycopg2.OperationalError as e:
        logger.error(f"Could not connect to database: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")
        raise 