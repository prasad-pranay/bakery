import os
from flask import Flask, jsonify, send_from_directory, request, make_response
from flask_cors import CORS
from flask_socketio import SocketIO

from app.config import Config
from app.db import init_db, get_db
from app.controllers.auth_controller import auth_bp
from app.controllers.product_controller import product_bp
from app.controllers.cart_controller import cart_bp
from app.controllers.order_controller import order_bp
from app.controllers.coupon_controller import coupon_bp
from app.controllers.admin_controller import admin_bp
from app.controllers.user_controller import user_bp
from app.socket.support_socket import register_support_handlers
from app.utils.serializers import serialize_doc

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS matching Express config
    CORS(
        app,
        origins=Config.CORS_ORIGINS,
        supports_credentials=True,
        expose_headers=["set-cookie"],
        allow_headers=["Content-Type", "Authorization", "Cookie"]
    )

    # Cross-Origin Resource Policy header matching helmet
    @app.after_request
    def set_security_headers(response):
        response.headers['Cross-Origin-Resource-Policy'] = 'cross-origin'
        return response

    # Initialize MongoDB connection & indexes
    with app.app_context():
        init_db(app)

    # Register blueprints under /api/*
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(coupon_bp, url_prefix='/api/coupons')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    # Top-level direct routes matching Express app.ts:
    # app.get('/api/all-orders', getAllOrders)
    @app.route('/api/all-orders', methods=['GET'])
    def get_all_orders():
        try:
            db = get_db()
            orders = list(db.orders.find().sort('createdAt', -1))
            return jsonify({'success': True, 'data': serialize_doc(orders)})
        except Exception as error:
            print("getAllOrders error:", error)
            return jsonify({'success': False, 'message': 'Server error', 'yse': 'no'}), 500

    # app.get('/api/all-users', getAllUsers)
    @app.route('/api/all-users', methods=['GET'])
    def get_all_users():
        try:
            db = get_db()
            all_users = list(db.users.find())
            return jsonify({'success': True, 'data': serialize_doc(all_users)})
        except Exception as error:
            print("getAllUsers error:", error)
            return jsonify({'success': False, 'message': 'Server error', 'yes': 'no'}), 500

    # app.get('/items', getProducts)
    @app.route('/items', methods=['GET'])
    def get_items():
        try:
            db = get_db()
            products = list(db.products.find({}))
            return jsonify({'success': True, 'data': serialize_doc(products)})
        except Exception as error:
            print("getItems error:", error)
            return jsonify({'success': False, 'message': 'Server error'}), 500

    # app.post("/logout", logout)
    @app.route('/logout', methods=['POST'])
    def global_logout():
        resp = make_response(jsonify({'success': True, 'message': 'Logged out successfully'}))
        resp.delete_cookie('token', httponly=True, samesite='Lax')
        return resp

    # Serve static images: app.use("/images", express.static("images"))
    @app.route('/images/<path:filename>', methods=['GET'])
    def serve_image(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    # Root route: app.get('/', (req, res) => res.send({ message: 'Bakery API is running' }))
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({'message': 'Bakery API is running'})

    # Global Error Handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        print(f"Global exception: {e}")
        status_code = getattr(e, 'code', 500)
        message = getattr(e, 'description', str(e) or 'Internal Server Error')
        return jsonify({
            'success': False,
            'message': message
        }), status_code

    # Attach SocketIO
    socketio.init_app(
        app,
        cors_allowed_origins=Config.CORS_ORIGINS,
        manage_session=False,
        async_mode='threading'
    )
    register_support_handlers(socketio)

    return app
