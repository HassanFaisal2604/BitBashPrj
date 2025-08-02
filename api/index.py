import sys
import os

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'Backend'))

from flask import jsonify
from flask_cors import CORS

try:
    from Backend.run import create_app
    app = create_app()
    # Enable CORS for Vercel deployment
    CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'https://bitbash-project.vercel.app'], 
         supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
except Exception as e:
    # fallback minimal app to show error
    from flask import Flask
    app = Flask(__name__)
    # Enable CORS even for fallback app
    CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'https://bitbash-project.vercel.app'], 
         supports_credentials=True, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    @app.route('/api/health')
    def health_error():
        return jsonify({'status': 'error', 'message': str(e)}), 500
else:
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy'})

# For vercel
if __name__ == "__main__":
    app.run(debug=True) 