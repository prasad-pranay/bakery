import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.environ.get('PORT', 5000))
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/bakery')
    JWT_SECRET = os.environ.get('JWT_SECRET', 'supersecretkey')
    JWT_EXPIRES_IN = os.environ.get('JWT_EXPIRES_IN', '30d')
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin4862')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'adminpassword')
    
    EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.example.com')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 2525))
    EMAIL_USER = os.environ.get('EMAIL_USER', '')
    EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')
    EMAIL_FROM = os.environ.get('EMAIL_FROM', 'noreply@bakery.com')
    CLIENT_URL = os.environ.get('CLIENT_URL', 'http://localhost:3000')
    
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://192.168.1.8:3000',
        'http://localhost:3001'
    ]
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'images')
