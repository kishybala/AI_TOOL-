#!/bin/bash

# Script to download face-api.js models
# Run this script from the client/public directory

echo "📥 Downloading face-api.js models..."

# Create models directory
mkdir -p models

# Download required models
echo "Downloading Tiny Face Detector..."
curl -L -o models/tiny_face_detector_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -L -o models/tiny_face_detector_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

echo "Downloading Face Expression Net..."
curl -L -o models/face_expression_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -L -o models/face_expression_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1

echo "Downloading Face Landmark 68 Net..."
curl -L -o models/face_landmark_68_model-weights_manifest.json https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -L -o models/face_landmark_68_model-shard1 https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

echo "✅ All models downloaded successfully!"
echo "Models are located in: $(pwd)/models"
