from datetime import datetime
from flask import Blueprint, request, jsonify
from bson import ObjectId
from app.db import get_db
from app.middleware.auth import require_admin
from app.utils.serializers import serialize_doc, to_object_id

coupon_bp = Blueprint('coupons', __name__)

@coupon_bp.route('/validate', methods=['POST'])
def validate_coupon():
    try:
        data = request.get_json(silent=True) or {}
        code = str(data.get('code', '')).upper()

        db = get_db()
        coupon = db.coupons.find_one({'code': code, 'isActive': True})

        if not coupon:
            return jsonify({'success': False, 'message': 'Invalid or inactive coupon'}), 404

        now = datetime.utcnow()
        expires_at = coupon.get('expiresAt')
        if expires_at and now > expires_at:
            return jsonify({'success': False, 'message': 'Coupon expired'}), 400

        used_count = coupon.get('usedCount', 0)
        usage_limit = coupon.get('usageLimit', 0)
        if used_count >= usage_limit:
            return jsonify({'success': False, 'message': 'Coupon usage limit reached'}), 400

        return jsonify({'success': True, 'data': serialize_doc(coupon)})
    except Exception as error:
        print("validateCoupon error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@coupon_bp.route('', methods=['GET'])
@require_admin
def get_coupons():
    try:
        db = get_db()
        coupons = list(db.coupons.find({}))
        return jsonify({'success': True, 'data': serialize_doc(coupons)})
    except Exception as error:
        print("getCoupons error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@coupon_bp.route('', methods=['POST'])
@require_admin
def create_coupon():
    try:
        data = request.get_json(silent=True) or {}
        if 'code' in data:
            data['code'] = str(data['code']).upper()
        if 'expiresAt' in data and isinstance(data['expiresAt'], str):
            try:
                data['expiresAt'] = datetime.fromisoformat(data['expiresAt'].replace('Z', '+00:00'))
            except Exception:
                pass

        now = datetime.utcnow()
        data['createdAt'] = now
        data['updatedAt'] = now
        if 'usedCount' not in data:
            data['usedCount'] = 0
        if 'isActive' not in data:
            data['isActive'] = True

        db = get_db()
        res = db.coupons.insert_one(data)
        data['_id'] = res.inserted_id

        return jsonify({'success': True, 'data': serialize_doc(data)}), 201
    except Exception as error:
        print("createCoupon error:", error)
        return jsonify({'success': False, 'message': 'Invalid coupon data'}), 400

@coupon_bp.route('/<id>', methods=['PUT'])
@require_admin
def update_coupon(id):
    try:
        data = request.get_json(silent=True) or {}
        data.pop('_id', None)
        if 'code' in data:
            data['code'] = str(data['code']).upper()
        if 'expiresAt' in data and isinstance(data['expiresAt'], str):
            try:
                data['expiresAt'] = datetime.fromisoformat(data['expiresAt'].replace('Z', '+00:00'))
            except Exception:
                pass

        data['updatedAt'] = datetime.utcnow()
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Coupon not found'}), 404

        db = get_db()
        coupon = db.coupons.find_one_and_update(
            {'_id': obj_id},
            {'$set': data},
            return_document=True
        )
        if not coupon:
            return jsonify({'success': False, 'message': 'Coupon not found'}), 404

        return jsonify({'success': True, 'data': serialize_doc(coupon)})
    except Exception as error:
        print("updateCoupon error:", error)
        return jsonify({'success': False, 'message': 'Invalid coupon data'}), 400

@coupon_bp.route('/<id>', methods=['DELETE'])
@require_admin
def delete_coupon(id):
    try:
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Coupon not found'}), 404

        db = get_db()
        result = db.coupons.delete_one({'_id': obj_id})
        if result.deleted_count == 0:
            return jsonify({'success': False, 'message': 'Coupon not found'}), 404

        return jsonify({'success': True, 'message': 'Coupon deleted'})
    except Exception as error:
        print("deleteCoupon error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500
