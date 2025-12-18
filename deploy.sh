#!/bin/bash

# 9mm DEX Deployment Script
# Domain: dex.9mm.pro

set -e

echo "============================================"
echo "  9mm DEX Deployment"
echo "  Domain: dex.9mm.pro"
echo "============================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Parse arguments
ACTION=${1:-"start"}

case $ACTION in
    build)
        echo "[Building] Docker images..."
        docker compose build --no-cache
        echo "Build complete!"
        ;;
    
    start)
        echo "[Starting] 9mm DEX services..."
        docker compose up -d
        echo ""
        echo "Services started!"
        echo "  - Web:   http://localhost:3000"
        echo "  - HTTPS: https://dex.9mm.pro (requires DNS + SSL setup)"
        ;;
    
    stop)
        echo "[Stopping] 9mm DEX services..."
        docker compose down
        echo "Services stopped!"
        ;;
    
    restart)
        echo "[Restarting] 9mm DEX services..."
        docker compose restart
        echo "Services restarted!"
        ;;
    
    logs)
        echo "[Logs] Following container logs..."
        docker compose logs -f
        ;;
    
    status)
        echo "[Status] Container status..."
        docker compose ps
        ;;
    
    update)
        echo "[Updating] Pulling latest and rebuilding..."
        git pull
        docker compose build
        docker compose up -d
        echo "Update complete!"
        ;;
    
    ssl)
        echo "[SSL] Running SSL setup..."
        sudo ./init-ssl.sh
        ;;
    
    clean)
        echo "[Cleaning] Removing containers, images, and volumes..."
        docker compose down -v --rmi all
        echo "Clean complete!"
        ;;
    
    *)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build    - Build Docker images"
        echo "  start    - Start all services (default)"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - Follow container logs"
        echo "  status   - Show container status"
        echo "  update   - Pull latest code and rebuild"
        echo "  ssl      - Setup SSL certificates"
        echo "  clean    - Remove all containers and images"
        ;;
esac

