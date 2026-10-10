from functools import wraps
from flask import request, jsonify, g
import jwt
from bson import ObjectId
from app.config import Config
from app.db import get_db

def authenticate_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            elif auth_header:
                token = auth_header

        if not token:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401

        try:
            decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401

        if decoded.get('admin'):
            g.admin = True
            g.user = {'_id': 'admin', 'name': 'Admin', 'email': 'admin'}
            return f(*args, **kwargs)

        db = get_db()
        try:
            user_id = ObjectId(decoded.get('id'))
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401

        user = db.users.find_one({'_id': user_id}, {'password': 0})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 401

        g.user = user
        g.admin = False
        return f(*args, **kwargs)

    return decorated_function

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            elif auth_header:
                token = auth_header

        if not token:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401

        try:
            decoded = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401

        if not decoded.get('admin'):
            return jsonify({'success': False, 'message': 'Admin access required'}), 403

        g.admin = True
        return f(*args, **kwargs)

    return decorated_function
