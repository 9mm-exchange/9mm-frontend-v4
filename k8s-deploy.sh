#!/bin/bash

# 9mm DEX Kubernetes Deployment Script
# Image: spiritmonkey/dex-main
# Domain: dex.9mm.pro

set -e

IMAGE_NAME="spiritmonkey/dex-main"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"

echo "============================================"
echo "  9mm DEX Kubernetes Deployment"
echo "  Image: ${FULL_IMAGE}"
echo "  Domain: dex.9mm.pro"
echo "============================================"
echo ""

ACTION="${2:-deploy}"

case $ACTION in
    build)
        echo "[1/2] Building Docker image..."
        docker build -t ${FULL_IMAGE} .
        
        echo "[2/2] Pushing to DockerHub..."
        docker push ${FULL_IMAGE}
        
        echo ""
        echo "✅ Build complete: ${FULL_IMAGE}"
        ;;
    
    deploy)
        echo "[1/1] Deploying to Kubernetes..."
        kubectl apply -k k8s/
        
        echo ""
        echo "Waiting for rollout..."
        kubectl rollout status deployment/dex-main -n ninemm-frontend --timeout=300s
        
        echo ""
        echo "✅ Deployment complete!"
        kubectl get pods -n ninemm-frontend -l app=dex-main
        ;;
    
    build-deploy)
        echo "[1/3] Building Docker image..."
        docker build -t ${FULL_IMAGE} .
        
        echo "[2/3] Pushing to DockerHub..."
        docker push ${FULL_IMAGE}
        
        echo "[3/3] Deploying to Kubernetes..."
        kubectl apply -k k8s/
        
        echo ""
        echo "Waiting for rollout..."
        kubectl rollout status deployment/dex-main -n ninemm-frontend --timeout=300s
        
        echo ""
        echo "✅ Build and deploy complete!"
        kubectl get pods -n ninemm-frontend -l app=dex-main
        ;;
    
    rollback)
        echo "Rolling back deployment..."
        kubectl rollout undo deployment/dex-main -n ninemm-frontend
        echo "✅ Rollback complete!"
        ;;
    
    status)
        echo "=== Pods ==="
        kubectl get pods -n ninemm-frontend -l app=dex-main
        echo ""
        echo "=== Service ==="
        kubectl get svc dex-main -n ninemm-frontend
        echo ""
        echo "=== Ingress ==="
        kubectl get ingress dex-main-ingress -n ninemm-frontend
        echo ""
        echo "=== HPA ==="
        kubectl get hpa dex-main-hpa -n ninemm-frontend
        ;;
    
    logs)
        kubectl logs -f -l app=dex-main -n ninemm-frontend --all-containers
        ;;
    
    delete)
        echo "⚠️  Deleting dex-main resources..."
        kubectl delete -k k8s/
        echo "✅ Deleted!"
        ;;
    
    *)
        echo "Usage: ./k8s-deploy.sh [tag] [command]"
        echo ""
        echo "Commands:"
        echo "  build         - Build and push Docker image"
        echo "  deploy        - Deploy to Kubernetes (default)"
        echo "  build-deploy  - Build, push, and deploy"
        echo "  rollback      - Rollback to previous version"
        echo "  status        - Show deployment status"
        echo "  logs          - Follow pod logs"
        echo "  delete        - Delete all resources"
        echo ""
        echo "Examples:"
        echo "  ./k8s-deploy.sh latest build        # Build with 'latest' tag"
        echo "  ./k8s-deploy.sh v1.0.0 build-deploy # Build v1.0.0 and deploy"
        echo "  ./k8s-deploy.sh latest deploy       # Deploy latest"
        ;;
esac

