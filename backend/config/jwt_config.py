import os
from datetime import timedelta
class Settings():
    authjwt_secret_key: str = os.getenv('JWT_SECRET_KEY')
    authjwt_algorithm: str = "HS256"
    authjwt_access_token_expires: timedelta = timedelta(minutes=15)  
    authjwt_refresh_token_expires: timedelta = timedelta(minutes=384)
