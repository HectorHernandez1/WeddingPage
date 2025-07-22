import re
import logging
from contextlib import contextmanager
from database import get_db

# Configure logging
logger = logging.getLogger(__name__)

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