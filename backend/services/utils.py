import hashlib
from dotenv import load_dotenv
load_dotenv()
from fastapi_jwt import JwtAccessBearer
from fastapi_jwt.jwt import JwtAuthorizationCredentials
from config.jwt_config import Settings

jwt_settings = Settings()


authentication_bearer = JwtAccessBearer(
    secret_key=jwt_settings.authjwt_secret_key,
    algorithm=jwt_settings.authjwt_algorithm,
    access_expires_delta=jwt_settings.authjwt_access_token_expires
)

refresh_bearer = JwtAccessBearer (
    secret_key=jwt_settings.authjwt_secret_key,
    algorithm=jwt_settings.authjwt_algorithm,
    refresh_expires_delta=jwt_settings.authjwt_refresh_token_expires
)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()