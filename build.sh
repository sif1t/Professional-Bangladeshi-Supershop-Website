#!/bin/bash
# Render Deployment Build Script
# This script ensures all dependencies are installed and the server can start

echo "🔧 Starting build process..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

echo "✅ Build complete!"
