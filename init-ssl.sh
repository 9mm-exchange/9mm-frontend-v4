#!/bin/bash

# 9mm DEX SSL Certificate Setup Script
# Domain: dex.9mm.pro

set -e

DOMAIN="dex.9mm.pro"
EMAIL="admin@9mm.pro"  # Change this to your email

echo "============================================"
echo "  9mm DEX SSL Certificate Setup"
echo "  Domain: ${DOMAIN}"
echo "============================================"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo: sudo ./init-ssl.sh"
    exit 1
fi

# Create required directories
echo "[1/6] Creating directories..."
mkdir -p certbot/conf certbot/www

# Start nginx with HTTP only config first
echo "[2/6] Starting nginx (HTTP only)..."
cp nginx/conf.d/default.conf nginx/conf.d/active.conf.bak 2>/dev/null || true

# Build and start services
echo "[3/6] Building Docker images..."
docker compose build

echo "[4/6] Starting web service..."
docker compose up -d web

echo "[5/6] Starting nginx (HTTP mode for certificate generation)..."
# Create temporary nginx config for certbot
cat > nginx/conf.d/temp-http.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name dex.9mm.pro www.dex.9mm.pro;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Temporarily move SSL config
mv nginx/conf.d/dex.9mm.pro.conf nginx/conf.d/dex.9mm.pro.conf.ssl 2>/dev/null || true

docker compose up -d nginx

# Wait for nginx to start
sleep 5

echo "[6/6] Obtaining SSL certificate..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    -d ${DOMAIN} \
    -d www.${DOMAIN}

# Restore SSL config
mv nginx/conf.d/dex.9mm.pro.conf.ssl nginx/conf.d/dex.9mm.pro.conf 2>/dev/null || true
rm nginx/conf.d/temp-http.conf 2>/dev/null || true

# Reload nginx with SSL config
echo "Reloading nginx with SSL configuration..."
docker compose exec nginx nginx -s reload

echo ""
echo "============================================"
echo "  SSL Setup Complete!"
echo "============================================"
echo ""
echo "Your site is now available at:"
echo "  https://${DOMAIN}"
echo ""
echo "To start all services:"
echo "  docker compose up -d"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""

