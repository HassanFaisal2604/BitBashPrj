# Flask extensions
from flask import Flask, jsonify
# Only CORS needed; we use standalone SQLAlchemy engine in models
from flask_cors import CORS

# Local configuration
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # no Flask-SQLAlchemy integration; models manage their own session
    CORS(app) # Enable CORS

    # Ensure session is removed after request context ends
    from .api.models import session as orm_session

    @app.teardown_appcontext
    def remove_session(exception=None):  # noqa: WPS430
        try:
            if exception:
                orm_session.rollback()
            orm_session.close()
        except Exception:
            pass  # Ignore session cleanup errors

    @app.errorhandler(500)
    def handle_500(e):
        try:
            orm_session.rollback()
        except Exception:
            pass
        return jsonify({'error': 'Internal server error'}), 500

    # Import and register blueprints (placed after app & extensions init to avoid circular imports)
    from .api.routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app