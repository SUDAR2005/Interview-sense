import os
 
class Settings():
    authjwt_secret_key: str = os.getenv('JWT_SECRET_KEY')
    authjwt_algorithm: str = "HS256"
    authjwt_access_token_expires: int = 60 * 15  # 15 minutes
    authjwt_refresh_token_expires: int = 60 * 60 * 24  

