import time
import json
from datetime import datetime
from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from app.db import get_db
from app.middleware.auth import authenticate_user, require_admin
from app.middleware.upload import save_uploaded_file
from app.utils.serializers import serialize_doc, to_object_id

product_bp = Blueprint('products', __name__)

@product_bp.route('', methods=['GET'])
def get_products():
    try:
        db = get_db()
        products = list(db.products.find({}))
        return jsonify({'success': True, 'data': serialize_doc(products)})
    except Exception as e:
        print("getProducts error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@product_bp.route('/<id>', methods=['GET'])
def get_product_by_id(id):
    try:
        db = get_db()
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        product = db.products.find_one({'_id': obj_id})
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        return jsonify({'success': True, 'data': serialize_doc(product)})
    except Exception as e:
        print("getProductById error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@product_bp.route('', methods=['POST'])
@require_admin
def create_product():
    try:
        # Handles both JSON body and multipart/form-data
        updates = {}
        if request.content_type and 'multipart/form-data' in request.content_type:
            updates = request.form.to_dict()
            # If tags or ingredients were passed as json strings or comma-separated
            if 'tags' in updates:
                try:
                    updates['tags'] = json.loads(updates['tags'])
                except Exception:
                    updates['tags'] = [t.strip() for t in updates['tags'].split(',') if t.strip()]
            if 'ingredients' in updates:
                try:
                    updates['ingredients'] = json.loads(updates['ingredients'])
                except Exception:
                    updates['ingredients'] = [i.strip() for i in updates['ingredients'].split(',') if i.strip()]
            if 'price' in updates:
                updates['price'] = float(updates['price'])
            if 'count' in updates:
                updates['count'] = int(updates['count'])
            if 'rating' in updates:
                updates['rating'] = float(updates['rating'])
        else:
            updates = request.get_json(silent=True) or {}

        # Handle file upload if present
        if 'image' in request.files:
            file_storage = request.files['image']
            if file_storage and file_storage.filename:
                saved_filename = save_uploaded_file(file_storage)
                updates['image'] = saved_filename

        now = datetime.utcnow()
        updates['createdAt'] = now
        updates['updatedAt'] = now
        if 'reviews' not in updates:
            updates['reviews'] = []
        if 'rating' not in updates:
            updates['rating'] = 0.0
        if 'reviewCount' not in updates:
            updates['reviewCount'] = 0

        db = get_db()
        res = db.products.insert_one(updates)
        updates['_id'] = res.inserted_id

        return jsonify({'success': True, 'data': serialize_doc(updates)}), 201
    except Exception as error:
        print("createProduct error:", error)
        return jsonify({'success': False, 'message': 'Invalid product data', 'error': str(error)}), 400

@product_bp.route('/<id>', methods=['PUT'])
@require_admin
def update_product(id):
    try:
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        updates = {}
        if request.content_type and 'multipart/form-data' in request.content_type:
            updates = request.form.to_dict()
            if 'tags' in updates:
                try:
                    updates['tags'] = json.loads(updates['tags'])
                except Exception:
                    updates['tags'] = [t.strip() for t in updates['tags'].split(',') if t.strip()]
            if 'ingredients' in updates:
                try:
                    updates['ingredients'] = json.loads(updates['ingredients'])
                except Exception:
                    updates['ingredients'] = [i.strip() for i in updates['ingredients'].split(',') if i.strip()]
            if 'price' in updates:
                updates['price'] = float(updates['price'])
            if 'count' in updates:
                updates['count'] = int(updates['count'])
            if 'rating' in updates:
                updates['rating'] = float(updates['rating'])
        else:
            updates = request.get_json(silent=True) or {}

        # If _id was passed inside body, don't attempt to update it
        updates.pop('_id', None)

        if 'image' in request.files:
            file_storage = request.files['image']
            if file_storage and file_storage.filename:
                saved_filename = save_uploaded_file(file_storage)
                updates['image'] = saved_filename

        updates['updatedAt'] = datetime.utcnow()

        db = get_db()
        product = db.products.find_one_and_update(
            {'_id': obj_id},
            {'$set': updates},
            return_document=True
        )

        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        return jsonify({'success': True, 'data': serialize_doc(product)})
    except Exception as error:
        print("Update product error:", error)
        return jsonify({'success': False, 'message': 'Invalid product data'}), 400

@product_bp.route('/<id>', methods=['DELETE'])
@require_admin
def delete_product(id):
    try:
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        db = get_db()
        result = db.products.delete_one({'_id': obj_id})
        if result.deleted_count == 0:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        return jsonify({'success': True, 'message': 'Product deleted'})
    except Exception as error:
        print("Delete product error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@product_bp.route('/<id>/reviews', methods=['POST'])
@authenticate_user
def add_review(id):
    try:
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        data = request.get_json(silent=True) or {}
        rating = float(data.get('rating', 5))
        text = data.get('text', '')

        db = get_db()
        product = db.products.find_one({'_id': obj_id})
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        reviews = product.get('reviews', [])
        new_review = {
            'id': int(time.time() * 1000),
            'name': g.user.get('name'),
            'rating': rating,
            'text': text,
            'date': datetime.utcnow().isoformat(),
            'userId': g.user.get('_id')
        }
        reviews.append(new_review)

        total_rating = sum(r.get('rating', 0) for r in reviews)
        new_avg = total_rating / len(reviews) if reviews else 0.0

        db.products.update_one(
            {'_id': obj_id},
            {
                '$set': {
                    'reviews': reviews,
                    'reviewCount': len(reviews),
                    'rating': new_avg,
                    'updatedAt': datetime.utcnow()
                }
            }
        )

        all_products = list(db.products.find({}))
        return jsonify({'success': True, 'data': serialize_doc(all_products)}), 201
    except Exception as error:
        print("addReview error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@product_bp.route('/<id>/reviews/<reviewId>', methods=['DELETE'])
@require_admin
def delete_review_admin(id, reviewId):
    try:
        obj_id = to_object_id(id)
        if not obj_id:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        db = get_db()
        product = db.products.find_one({'_id': obj_id})
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        reviews = [r for r in product.get('reviews', []) if str(r.get('id')) != str(reviewId)]
        total_rating = sum(r.get('rating', 0) for r in reviews)
        new_avg = (total_rating / len(reviews)) if reviews else 0.0

        updated_product = db.products.find_one_and_update(
            {'_id': obj_id},
            {
                '$set': {
                    'reviews': reviews,
                    'reviewCount': len(reviews),
                    'rating': new_avg,
                    'updatedAt': datetime.utcnow()
                }
            },
            return_document=True
        )

        return jsonify({'success': True, 'data': serialize_doc(updated_product)})
    except Exception as error:
        print("deleteReviewAdmin error:", error)
        return jsonify({'success': False, 'message': 'Server error'}), 500
