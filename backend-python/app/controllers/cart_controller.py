from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from app.db import get_db
from app.middleware.auth import authenticate_user
from app.utils.serializers import serialize_doc, to_object_id

cart_bp = Blueprint('cart', __name__)

@cart_bp.before_request
def before_request_hook():
    # authenticate_user on all cart routes
    return authenticate_user(lambda: None)()

@cart_bp.route('', methods=['GET'])
def get_cart():
    try:
        db = get_db()
        user_id = g.user['_id']
        user = db.users.find_one({'_id': user_id})
        cart = user.get('cart', []) if user else []

        # Populate cart items with productId matching Mongoose:
        # const result = user?.cart.map((item) => ({ productId: item.productId._id, quantity: item.quantity }));
        # However if item.productId is an ObjectId, item.productId._id in JS or ObjectId in Mongo:
        result = []
        for item in cart:
            p_id = item.get('productId')
            # If item.productId is stored as ObjectId:
            result.append({
                'productId': str(p_id) if p_id else None,
                'quantity': item.get('quantity', 1)
            })

        return jsonify({'success': True, 'data': result})
    except Exception as error:
        print("getCart error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@cart_bp.route('', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json(silent=True) or {}
        product_id = data.get('productId')
        quantity = int(data.get('quantity', 1))

        db = get_db()
        obj_product_id = to_object_id(product_id)
        if not obj_product_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        product = db.products.find_one({'_id': obj_product_id})
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        if product.get('count', 0) < quantity:
            return jsonify({'success': False, 'message': 'Not enough inventory'}), 400

        user_id = g.user['_id']
        user = db.users.find_one({'_id': user_id})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        cart = user.get('cart', [])
        found_index = -1
        for idx, item in enumerate(cart):
            if str(item.get('productId')) == str(product_id):
                found_index = idx
                break

        if found_index > -1:
            new_qty = cart[found_index].get('quantity', 0) + quantity
            if product.get('count', 0) < new_qty:
                return jsonify({'success': False, 'message': 'Not enough inventory to add more'}), 400
            cart[found_index]['quantity'] = new_qty
        else:
            cart.append({
                'productId': obj_product_id,
                'quantity': quantity
            })

        db.users.update_one({'_id': user_id}, {'$set': {'cart': cart}})
        return jsonify({'success': True, 'data': serialize_doc(cart)})
    except Exception as error:
        print("addToCart error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@cart_bp.route('/<productId>', methods=['PATCH'])
def update_cart_item(productId):
    try:
        data = request.get_json(silent=True) or {}
        quantity = int(data.get('quantity', 0))

        if quantity <= 0:
            return jsonify({'success': False, 'message': 'Quantity must be > 0'}), 400

        db = get_db()
        obj_product_id = to_object_id(productId)
        if not obj_product_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        product = db.products.find_one({'_id': obj_product_id})
        if not product or product.get('count', 0) < quantity:
            return jsonify({'success': False, 'message': 'Not enough inventory'}), 400

        user_id = g.user['_id']
        user = db.users.find_one({'_id': user_id})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        cart = user.get('cart', [])
        found = False
        for item in cart:
            if str(item.get('productId')) == str(productId):
                item['quantity'] = quantity
                found = True
                break

        if found:
            db.users.update_one({'_id': user_id}, {'$set': {'cart': cart}})
            return jsonify({'success': True, 'data': serialize_doc(cart)})

        return jsonify({'success': False, 'message': 'Product not in cart'}), 404
    except Exception as error:
        print("updateCartItem error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@cart_bp.route('/<productId>', methods=['DELETE'])
def remove_from_cart(productId):
    try:
        db = get_db()
        user_id = g.user['_id']
        user = db.users.find_one({'_id': user_id})
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        cart = [item for item in user.get('cart', []) if str(item.get('productId')) != str(productId)]
        db.users.update_one({'_id': user_id}, {'$set': {'cart': cart}})

        return jsonify({'success': True, 'data': serialize_doc(cart)})
    except Exception as error:
        print("removeFromCart error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@cart_bp.route('', methods=['DELETE'])
def clear_cart():
    try:
        db = get_db()
        user_id = g.user['_id']
        db.users.update_one({'_id': user_id}, {'$set': {'cart': []}})
        return jsonify({'success': True, 'message': 'Cart cleared'})
    except Exception as error:
        print("clearCart error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500
