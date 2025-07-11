# Flask extensions
from flask import Flask
# Only CORS needed; we use standalone SQLAlchemy engine in models
from flask_cors import CORS
from flask_migrate import Migrate

# Local configuration
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)  # Assuming db is Flask-SQLAlchemy instance; adjust if needed

    # no Flask-SQLAlchemy integration; models manage their own session
    CORS(app) # Enable CORS

    # Ensure session is removed after request context ends
    from .api.models import session as orm_session

    @app.teardown_appcontext
    def remove_session(exception=None):  # noqa: WPS430
        orm_session.close()

    # Import and register blueprints (placed after app & extensions init to avoid circular imports)
    from .api.routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app