#!/bin/bash

set -e

echo "Building new Docker image..."
docker build --no-cache -t portfolio:new .

echo "Stopping and removing old container..."
docker rm -f portfolio || true

echo "Tagging new image as latest..."
docker tag portfolio:new portfolio:latest

echo "Starting new container (with restart policy)..."
docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 3000:3000 \
  portfolio:latest

echo "Cleaning up..."
docker rmi portfolio:new 2>/dev/null || true
docker system prune -f

echo "Done! Portfolio is running at http://localhost:3000"