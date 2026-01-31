# Docker Guide

## Build and Run

```bash
# Build the Docker image
docker build -t portfolio .

# Run the container
docker run -d --name portfolio -p 3000:3000 portfolio
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Rebuild (Zero Downtime)

When you need to rebuild after making changes:

```bash
# Build the new image first (website stays running)
docker build -t portfolio:new .

# Stop and remove the old container, then start the new one
docker rm -f portfolio || true
docker tag portfolio:new portfolio:latest
docker run -d --name portfolio -p 3000:3000 portfolio:latest

# Clean up old images
docker rmi portfolio:new 2>/dev/null || true
docker system prune -f
```

## Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs portfolio

# Stop the container
docker stop portfolio

# Start the container again
docker start portfolio

# Remove the container
docker rm portfolio

# Remove the image
docker rmi portfolio
```
