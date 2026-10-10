import time
import random
import string
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, make_response, g
import bcrypt
import jwt
from bson import ObjectId
from app.config import Config
from app.db import get_db
from app.middleware.auth import authenticate_user
from app.utils.email import send_email
from app.emails.login_mail import login_mail_content
from app.utils.serializers import serialize_doc

auth_bp = Blueprint('auth', __name__)

def generate_random_token(length=13):
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(silent=True) or {}
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password or not name:
            return jsonify({'success': False, 'message': 'Missing fields'}), 400

        db = get_db()
        if db.users.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'Email already exists'}), 400

        salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        verification_token = generate_random_token()
        now = datetime.utcnow()
        expires_at = now + timedelta(hours=24)

        user_doc = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'cart': [],
            'orders': [],
            'savedAddresses': [],
            'savedPaymentMethods': [],
            'usedCoupons': [],
            'emailVerified': False,
            'emailVerificationToken': verification_token,
            'emailVerificationExpires': expires_at,
            'createdAt': now,
            'updatedAt': now
        }
        db.users.insert_one(user_doc)

        send_email(
            email,
            'Welcome to Bakery! Please verify your email',
            f'<p>Hi {name},</p><p>Please verify your email using this token: {verification_token}</p>'
        )

        return jsonify({'success': True, 'message': 'User registered. Please verify your email.'}), 201
    except Exception as e:
        print("Register error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email')
        password = data.get('password')

        print(email, password)
        db = get_db()
        user = db.users.find_one({'email': email})

        if not user:
            print('1')
            return jsonify({'success': False, 'message': 'User Not Found'}), 401
        elif not user.get('password'):
            print('2')
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

        is_match = bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8'))
        if not is_match:
            print('3')
            return jsonify({'success': False, 'message': 'Password is wrong'}), 401

        now_str = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
        mail_content = login_mail_content(user.get('name', ''), now_str, email)
        send_email(email, 'New login detected', mail_content)

        token = jwt.encode(
            {
                'id': str(user['_id']),
                'admin': False,
                'exp': int(time.time()) + (30 * 24 * 60 * 60)
            },
            Config.JWT_SECRET,
            algorithm='HS256'
        )

        resp = make_response(jsonify({
            'success': True,
            'message': 'Welcome back!',
            'data': {'name': user.get('name'), 'email': user.get('email')}
        }))

        # Set cookie matching Express:
        # httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000
        resp.set_cookie(
            'token',
            token,
            max_age=7 * 24 * 60 * 60,
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        return resp
    except Exception as e:
        print("Login error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'success': True, 'message': 'Logged out successfully'}))
    resp.delete_cookie('token', httponly=True, samesite='Lax')
    return resp

@auth_bp.route('/me', methods=['GET'])
@authenticate_user
def get_me():
    user = serialize_doc(g.user)
    return jsonify({'success': True, 'data': user, 'admin': g.admin})

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD:
        token = jwt.encode(
            {
                'admin': True,
                'exp': int(time.time()) + (24 * 60 * 60)
            },
            Config.JWT_SECRET,
            algorithm='HS256'
        )
        resp = make_response(jsonify({'success': True, 'message': 'Admin logged in'}))
        resp.set_cookie(
            'token',
            token,
            max_age=24 * 60 * 60,
            httponly=True,
            secure=False,
            samesite='Lax'
        )
        return resp

    return jsonify({'success': False, 'message': 'Invalid admin credentials'}), 401

@auth_bp.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        db = get_db()
        now = datetime.utcnow()
        user = db.users.find_one({
            'emailVerificationToken': token,
            'emailVerificationExpires': {'$gt': now}
        })
        if not user:
            return jsonify({'success': False, 'message': 'Invalid or expired token'}), 400

        db.users.update_one(
            {'_id': user['_id']},
            {
                '$set': {'emailVerified': True},
                '$unset': {
                    'emailVerificationToken': "",
                    'emailVerificationExpires': ""
                }
            }
        )
        return jsonify({'success': True, 'message': 'Email verified successfully'})
    except Exception as e:
        print("Verify email error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email')
        db = get_db()
        user = db.users.find_one({'email': email})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        reset_token = generate_random_token()
        expires = datetime.utcnow() + timedelta(hours=1)

        db.users.update_one(
            {'_id': user['_id']},
            {
                '$set': {
                    'passwordResetToken': reset_token,
                    'passwordResetExpires': expires
                }
            }
        )

        send_email(
            email,
            'Password Reset',
            f'<p>Use this token to reset your password: {reset_token}</p>'
        )
        return jsonify({'success': True, 'message': 'Password reset email sent'})
    except Exception as e:
        print("Forgot password error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json(silent=True) or {}
        token = data.get('token')
        new_password = data.get('newPassword')

        db = get_db()
        now = datetime.utcnow()
        user = db.users.find_one({
            'passwordResetToken': token,
            'passwordResetExpires': {'$gt': now}
        })
        if not user:
            return jsonify({'success': False, 'message': 'Invalid or expired token'}), 400

        salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

        db.users.update_one(
            {'_id': user['_id']},
            {
                '$set': {'password': hashed_password},
                '$unset': {
                    'passwordResetToken': "",
                    'passwordResetExpires': ""
                }
            }
        )
        return jsonify({'success': True, 'message': 'Password reset successful'})
    except Exception as e:
        print("Reset password error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500
