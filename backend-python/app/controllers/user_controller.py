import time
from datetime import datetime
from flask import Blueprint, request, jsonify, g
import bcrypt
from bson import ObjectId
from app.db import get_db
from app.middleware.auth import authenticate_user
from app.utils.serializers import serialize_doc

user_bp = Blueprint('users', __name__)

@user_bp.route('/me', methods=['PATCH'])
@authenticate_user
def update_profile():
    try:
        data = request.get_json(silent=True) or {}
        name = data.get('name')

        db = get_db()
        user = db.users.find_one_and_update(
            {'_id': g.user['_id']},
            {'$set': {'name': name, 'updatedAt': datetime.utcnow()}},
            projection={'password': 0},
            return_document=True
        )
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("updateProfile error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/change-password', methods=['POST'])
@authenticate_user
def change_password():
    try:
        data = request.get_json(silent=True) or {}
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')

        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user or not user.get('password'):
            return jsonify({'success': False, 'message': 'User not found'}), 404

        is_match = bcrypt.checkpw(old_password.encode('utf-8'), user['password'].encode('utf-8'))
        if not is_match:
            return jsonify({'success': False, 'message': 'Incorrect old password'}), 400

        salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

        db.users.update_one(
            {'_id': g.user['_id']},
            {'$set': {'password': hashed_password, 'updatedAt': datetime.utcnow()}}
        )

        return jsonify({'success': True, 'message': 'Password updated successfully'})
    except Exception as error:
        print("changePassword error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Address Management
@user_bp.route('/me/addresses', methods=['GET'])
@authenticate_user
def get_addresses():
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        addresses = user.get('savedAddresses', []) if user else []
        return jsonify({'success': True, 'data': serialize_doc(addresses)})
    except Exception as error:
        print("getAddresses error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/addresses', methods=['POST'])
@authenticate_user
def add_address():
    try:
        data = request.get_json(silent=True) or {}
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_addresses = user.get('savedAddresses', [])
        new_address = {**data, 'id': str(int(time.time() * 1000))}

        if new_address.get('isDefault') or len(saved_addresses) == 0:
            for addr in saved_addresses:
                addr['isDefault'] = False
            new_address['isDefault'] = True

        saved_addresses.append(new_address)
        user['savedAddresses'] = saved_addresses
        user['updatedAt'] = datetime.utcnow()

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedAddresses': saved_addresses, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)}), 201
    except Exception as error:
        print("addAddress error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/addresses/<id>', methods=['PUT'])
@authenticate_user
def update_address(id):
    try:
        data = request.get_json(silent=True) or {}
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_addresses = user.get('savedAddresses', [])
        index = next((i for i, a in enumerate(saved_addresses) if a.get('id') == id), -1)
        if index == -1:
            return jsonify({'success': False, 'message': 'Address not found'}), 404

        updated_addr = {**saved_addresses[index], **data, 'id': id}
        saved_addresses[index] = updated_addr

        if data.get('isDefault'):
            for i, a in enumerate(saved_addresses):
                if i != index:
                    a['isDefault'] = False

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedAddresses': saved_addresses, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(saved_addresses)})
    except Exception as error:
        print("updateAddress error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/addresses/<id>', methods=['DELETE'])
@authenticate_user
def delete_address(id):
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_addresses = [a for a in user.get('savedAddresses', []) if a.get('id') != id]
        user['savedAddresses'] = saved_addresses

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedAddresses': saved_addresses, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("deleteAddress error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/addresses/<id>/default', methods=['PATCH'])
@authenticate_user
def set_default_address(id):
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_addresses = user.get('savedAddresses', [])
        for a in saved_addresses:
            a['isDefault'] = (a.get('id') == id)

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedAddresses': saved_addresses, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("setDefaultAddress error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Payment Method Management
@user_bp.route('/me/payments', methods=['GET'])
@authenticate_user
def get_payment_methods():
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        payments = user.get('savedPaymentMethods', []) if user else []
        return jsonify({'success': True, 'data': serialize_doc(payments)})
    except Exception as error:
        print("getPaymentMethods error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/payments', methods=['POST'])
@authenticate_user
def add_payment_method():
    try:
        data = request.get_json(silent=True) or {}
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        new_method = {
            'provider': str(data.get('provider', '')),
            'paymentMethodId': str(int(time.time() * 1000)),
            'type': str(data.get('type', '')),
            'brand': str(data.get('brand', '')),
            'last4': str(data.get('last4', '')),
            'expiryMonth': int(data.get('expiryMonth', 1)),
            'expiryYear': int(data.get('expiryYear', 2026)),
            'isDefault': bool(data.get('isDefault', False))
        }

        saved_methods = user.get('savedPaymentMethods', [])
        if new_method['isDefault'] or len(saved_methods) == 0:
            for method in saved_methods:
                method['isDefault'] = False
            new_method['isDefault'] = True
        else:
            new_method['isDefault'] = False

        saved_methods.append(new_method)
        user['savedPaymentMethods'] = saved_methods

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedPaymentMethods': saved_methods, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)}), 201
    except Exception as error:
        print("PAYMENT ERROR:", error)
        return jsonify({'success': False, 'message': str(error)}), 500

@user_bp.route('/me/payments/<id>', methods=['PUT'])
@authenticate_user
def update_payment_method(id):
    try:
        data = request.get_json(silent=True) or {}
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_methods = user.get('savedPaymentMethods', [])
        index = next((i for i, m in enumerate(saved_methods) if m.get('paymentMethodId') == id), -1)
        if index == -1:
            return jsonify({'success': False, 'message': 'Payment method not found'}), 404

        updated_m = {**saved_methods[index], **data, 'paymentMethodId': id}
        saved_methods[index] = updated_m

        if data.get('isDefault'):
            for i, m in enumerate(saved_methods):
                if i != index:
                    m['isDefault'] = False

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedPaymentMethods': saved_methods, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("updatePaymentMethod error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/payments/<id>', methods=['DELETE'])
@authenticate_user
def delete_payment_method(id):
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_methods = [m for m in user.get('savedPaymentMethods', []) if m.get('paymentMethodId') != id]
        user['savedPaymentMethods'] = saved_methods

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedPaymentMethods': saved_methods, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("deletePaymentMethod error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@user_bp.route('/me/payments/<id>/default', methods=['PATCH'])
@authenticate_user
def set_default_payment_method(id):
    try:
        db = get_db()
        user = db.users.find_one({'_id': g.user['_id']})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        saved_methods = user.get('savedPaymentMethods', [])
        exists = any(m.get('paymentMethodId') == id for m in saved_methods)
        if not exists:
            return jsonify({'success': False, 'message': 'Payment method not found'}), 404

        for m in saved_methods:
            m['isDefault'] = (m.get('paymentMethodId') == id)

        db.users.update_one({'_id': g.user['_id']}, {'$set': {'savedPaymentMethods': saved_methods, 'updatedAt': datetime.utcnow()}})
        return jsonify({'success': True, 'data': serialize_doc(user)})
    except Exception as error:
        print("setDefaultPaymentMethod error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500
