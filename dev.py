#!/usr/bin/env python3
"""
Development server script with hot reloading enabled.
This script automatically enables debug mode and hot reloading for development.
"""

import os
import sys

# Set development environment
os.environ['FLASK_ENV'] = 'development'
os.environ['FLASK_DEBUG'] = '1'

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    print("🔥 Starting development server with hot reloading...")
    print("📝 Make changes to your Python files and they will automatically reload!")
    print("🌐 Server will be available at: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        use_reloader=True
    )
