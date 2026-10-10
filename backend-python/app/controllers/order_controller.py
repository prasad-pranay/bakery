import time
import random
from datetime import datetime
from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from app.config import Config
from app.db import get_db
from app.middleware.auth import authenticate_user, require_admin
from app.utils.email import send_email
from app.utils.serializers import serialize_doc, to_object_id

order_bp = Blueprint('orders', __name__)

@order_bp.route('', methods=['POST'])
@authenticate_user
def create_order():
    try:
        db = get_db()
        user_id = g.user['_id']
        user = db.users.find_one({'_id': user_id})

        if not user or not user.get('cart'):
            return jsonify({'success': False, 'message': 'Cart is empty or user not found'}), 400

        data = request.get_json(silent=True) or {}
        shipping_address = data.get('shippingAddress')
        payment_method = data.get('paymentMethod')

        subtotal = 0
        order_items = []

        # Check products and update stock
        for item in user['cart']:
            p_id = to_object_id(item.get('productId'))
            product = db.products.find_one({'_id': p_id})

            if not product:
                return jsonify({'success': False, 'message': f"Product {item.get('productId')} not found"}), 400

            quantity = item.get('quantity', 1)
            if product.get('count', 0) < quantity:
                return jsonify({'success': False, 'message': f"Insufficient stock for {product.get('name')}"}), 400

            new_count = product.get('count', 0) - quantity
            db.products.update_one({'_id': p_id}, {'$set': {'count': new_count, 'updatedAt': datetime.utcnow()}})

            subtotal += product.get('price', 0) * quantity
            order_items.append({
                'productId': product['_id'],
                'name': product.get('name'),
                'image': product.get('image'),
                'price': product.get('price'),
                'quantity': quantity
            })

        discount = 0
        delivery_fee = 5
        total = subtotal - discount + delivery_fee

        order_id = f"ORD-{int(time.time() * 1000)}{random.randint(0, 999)}"
        now = datetime.utcnow()

        order_doc = {
            'orderId': order_id,
            'userId': user['_id'],
            'items': order_items,
            'subtotal': subtotal,
            'discount': discount,
            'deliveryFee': delivery_fee,
            'total': total,
            'shippingAddress': shipping_address,
            'paymentMethod': payment_method,
            'paymentStatus': 'PENDING',
            'orderStatus': 'PENDING',
            'createdAt': now,
            'updatedAt': now
        }

        res = db.orders.insert_one(order_doc)
        order_doc['_id'] = res.inserted_id

        # Clear cart and add order to user's orders
        db.users.update_one(
            {'_id': user['_id']},
            {
                '$set': {'cart': []},
                '$push': {'orders': order_doc['_id']}
            }
        )

        # Send emails async / non-blocking
        send_email(
            user.get('email', ''),
            "Order Confirmation",
            f"<p>Your order {order_id} has been placed successfully.</p>"
        )

        send_email(
            Config.EMAIL_FROM,
            "New Order Received",
            f"<p>Order {order_id} was placed.</p>"
        )

        return jsonify({'success': True, 'data': serialize_doc(order_doc)}), 201
    except Exception as error:
        print("createOrder error:", error)
        return jsonify({'success': False, 'message': str(error)}), 400

@order_bp.route('', methods=['GET'])
@authenticate_user
def get_user_orders():
    try:
        db = get_db()
        orders = list(db.orders.find({'userId': g.user['_id']}).sort('createdAt', -1))
        return jsonify({'success': True, 'data': serialize_doc(orders)})
    except Exception as error:
        print("getUserOrders error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@order_bp.route('/<id>', methods=['GET'])
@authenticate_user
def get_order_by_id(id):
    try:
        db = get_db()
        obj_id = to_object_id(id)
        query = {'userId': g.user['_id']}
        if obj_id:
            query['_id'] = obj_id
        else:
            query['orderId'] = id

        order = db.orders.find_one(query)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404

        return jsonify({'success': True, 'data': serialize_doc(order)})
    except Exception as error:
        print("getOrderById error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@order_bp.route('/<id>/cancel', methods=['POST'])
@authenticate_user
def cancel_order(id):
    try:
        db = get_db()
        obj_id = to_object_id(id)
        query = {'userId': g.user['_id']}
        if obj_id:
            query['_id'] = obj_id
        else:
            query['orderId'] = id

        order = db.orders.find_one(query)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 400

        # Restore inventory
        for item in order.get('items', []):
            p_id = to_object_id(item.get('productId'))
            if p_id:
                db.products.update_one(
                    {'_id': p_id},
                    {'$inc': {'count': item.get('quantity', 0)}, '$set': {'updatedAt': datetime.utcnow()}}
                )

        db.orders.update_one(
            {'_id': order['_id']},
            {'$set': {'orderStatus': 'CANCELLED', 'updatedAt': datetime.utcnow()}}
        )

        all_orders = list(db.orders.find({'userId': g.user['_id']}).sort('createdAt', -1))
        return jsonify({
            'success': True,
            'message': 'Order cancelled successfully',
            'data': serialize_doc(all_orders)
        })
    except Exception as error:
        print("cancelOrder error:", error)
        return jsonify({'success': False, 'message': str(error)}), 400

@order_bp.route('/admin/<id>/cancel', methods=['POST'])
@require_admin
def admin_cancel_order(id):
    try:
        db = get_db()
        obj_id = to_object_id(id)
        query = {'_id': obj_id} if obj_id else {'orderId': id}

        order = db.orders.find_one(query)
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404

        # Restore inventory
        for item in order.get('items', []):
            p_id = to_object_id(item.get('productId'))
            if p_id:
                db.products.update_one(
                    {'_id': p_id},
                    {'$inc': {'count': item.get('quantity', 0)}, '$set': {'updatedAt': datetime.utcnow()}}
                )

        db.orders.update_one(
            {'_id': order['_id']},
            {'$set': {'orderStatus': 'CANCELLED', 'updatedAt': datetime.utcnow()}}
        )

        all_orders = list(db.orders.find({}).sort('createdAt', -1))
        return jsonify({
            'success': True,
            'message': 'Order cancelled successfully',
            'data': serialize_doc(all_orders)
        })
    except Exception as error:
        print("adminCancelOrder error:", error)
        return jsonify({'success': False, 'message': str(error)}), 400

@order_bp.route('/<id>/status', methods=['PATCH'])
@require_admin
def update_order_status_admin(id):
    try:
        data = request.get_json(silent=True) or {}
        status = data.get('status')

        db = get_db()
        obj_id = to_object_id(id)
        query = {'_id': obj_id} if obj_id else {'orderId': id}

        order = db.orders.find_one_and_update(
            query,
            {'$set': {'orderStatus': status, 'updatedAt': datetime.utcnow()}},
            return_document=True
        )
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404

        all_orders = list(db.orders.find({}).sort('createdAt', -1))
        return jsonify({'success': True, 'data': serialize_doc(all_orders)})
    except Exception as error:
        print("updateOrderStatusAdmin error:", error)
        return jsonify({'success': False, 'message': str(error)}), 500
