import re
from urllib.parse import unquote
import jwt
from bson import ObjectId
from app.config import Config
from app.db import get_db

def parse_cookies_from_headers(headers):
    """
    Extracts cookies dictionary from raw HTTP/WS headers.
    Handles multiple variations of header casing.
    """
    cookie_str = ''
    if isinstance(headers, dict):
        cookie_str = headers.get('cookie') or headers.get('Cookie') or ''
    elif hasattr(headers, 'get'):
        cookie_str = headers.get('cookie') or headers.get('Cookie') or ''
    elif isinstance(headers, list):
        for k, v in headers:
            if k.lower() == 'cookie':
                cookie_str = v
                break

    cookies = {}
    if cookie_str:
        for item in cookie_str.split(';'):
            item = item.strip()
            if '=' in item:
                k, v = item.split('=', 1)
                cookies[k.strip()] = unquote(v.strip())
    return cookies

def authenticate_socket(environ):
    """
    Validates token cookie from the WebSocket / Engine.IO handshake environ.
    Returns (user_id: str, is_admin: bool) or raises ValueError('UNAUTHENTICATED').
    Matches backend/src/socket/socketAuth.ts exactly.
    """
    # In python-socketio / Flask-SocketIO, environ contains HTTP_COOKIE
    cookie_header = environ.get('HTTP_COOKIE', '')
    token_match = re.search(r'(?:^|;\s*)token=([^;]+)', cookie_header)
    token = token_match.group(1) if token_match else None

    if not token:
        # Also check query param or Authorization header fallback if present
        auth_header = environ.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1]

    if not token:
        raise ValueError('UNAUTHENTICATED')

    try:
        decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
    except Exception:
        raise ValueError('UNAUTHENTICATED')

    if decoded.get('admin') is True:
        return 'admin', True

    user_id = decoded.get('id')
    if not user_id:
        raise ValueError('UNAUTHENTICATED')

    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise ValueError('UNAUTHENTICATED')

    db = get_db()
    user = db.users.find_one({'_id': obj_id}, {'_id': 1})
    if not user:
        raise ValueError('UNAUTHENTICATED')

    return str(user['_id']), False
