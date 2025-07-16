import hashlib
from dotenv import load_dotenv
load_dotenv()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()