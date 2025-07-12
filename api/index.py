import sys
import os

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'Backend'))

from Backend.run import create_app

# Create the Flask app
app = create_app()

# For Vercel, we need to export the app directly
# Vercel will handle the WSGI interface automatically
if __name__ == "__main__":
    app.run(debug=True) 