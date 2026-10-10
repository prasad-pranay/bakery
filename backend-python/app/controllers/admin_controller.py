from flask import Blueprint, jsonify
from app.db import get_db
from app.middleware.auth import require_admin

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@require_admin
def get_dashboard_stats():
    try:
        db = get_db()
        total_users = db.users.count_documents({})
        total_products = db.products.count_documents({})

        low_stock_threshold = 5
        low_stock_products = db.products.count_documents({
            'count': {'$lte': low_stock_threshold, '$gt': 0}
        })
        sold_out_products = db.products.count_documents({'count': 0})

        total_orders = db.orders.count_documents({})
        pending_orders = db.orders.count_documents({'orderStatus': 'PENDING'})
        completed_orders = db.orders.count_documents({'orderStatus': 'DELIVERED'})
        cancelled_orders = db.orders.count_documents({'orderStatus': 'CANCELLED'})

        revenue_pipeline = [
            {'$match': {'orderStatus': {'$nin': ['CANCELLED', 'REFUNDED']}}},
            {'$group': {'_id': None, 'totalRevenue': {'$sum': '$total'}}}
        ]
        revenue_aggregation = list(db.orders.aggregate(revenue_pipeline))
        revenue = revenue_aggregation[0]['totalRevenue'] if revenue_aggregation else 0

        return jsonify({
            'success': True,
            'data': {
                'totalUsers': total_users,
                'totalProducts': total_products,
                'lowStockProducts': low_stock_products,
                'soldOutProducts': sold_out_products,
                'totalOrders': total_orders,
                'pendingOrders': pending_orders,
                'completedOrders': completed_orders,
                'cancelledOrders': cancelled_orders,
                'revenue': revenue
            }
        })
    except Exception as error:
        print("getDashboardStats error:", error)
        return jsonify({'success': False, 'message': 'Server error retrieving stats'}), 500
