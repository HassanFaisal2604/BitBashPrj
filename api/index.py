import sys
import os

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'Backend'))

from flask import jsonify

try:
    from Backend.run import create_app
    app = create_app()
except Exception as e:
    # fallback minimal app to show error
    from flask import Flask
    app = Flask(__name__)
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