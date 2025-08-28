#!/bin/bash

echo "🚀 Starting NER Dataset Tagger Development Server..."
echo "📝 Hot reloading is enabled - changes will automatically reload!"
echo ""

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "🔧 Activating virtual environment..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "🔧 Activating virtual environment..."
    source .venv/bin/activate
fi

# Install/update dependencies
echo "📦 Installing/updating dependencies..."
pip install -r requirements.txt

# Start development server
echo "🔥 Starting Flask development server..."
python dev.py
