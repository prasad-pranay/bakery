from app import create_app, socketio
from app.config import Config

app = create_app()

if __name__ == '__main__':
    port = Config.PORT
    print(f"Flask Backend running on port {port}")
    # Run using socketio wrapper to support WebSocket & polling connections concurrently
    socketio.run(
        app,
        host='0.0.0.0',
        port=port,
        debug=False,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )
