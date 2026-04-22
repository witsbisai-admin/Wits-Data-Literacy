#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  Wits Data Literacy Platform — Deployment Script
#
#  Usage:
#    bash deploy.sh              → Docker (default)
#    bash deploy.sh --nginx      → Bare nginx (Ubuntu/Debian)
#    bash deploy.sh --update     → Hot-swap index.html only
#    bash deploy.sh --ssl DOMAIN → Add Let's Encrypt HTTPS
#    bash deploy.sh --stop       → Stop Docker containers
#    bash deploy.sh --status     → Show health and status
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
ok()      { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
die()     { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
header()  { echo -e "\n${BOLD}$1${NC}"; echo "$(printf '─%.0s' {1..50})"; }

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLATFORM="$DIR/platform/index.html"
MODE="${1:-docker}"

[ -f "$PLATFORM" ] || die "Platform file not found: $PLATFORM"

case "$MODE" in

# ── DOCKER ──────────────────────────────────────────────────────
docker|--docker|"")
  header "Docker Deployment"
  command -v docker &>/dev/null || die "Docker not installed. Run: curl -fsSL https://get.docker.com | bash"
  docker compose version &>/dev/null  || die "Docker Compose not found. Install via: apt install docker-compose-plugin"

  info "Building image..."
  cd "$DIR/docker"
  docker compose build --no-cache

  info "Starting container..."
  docker compose up -d

  sleep 3
  if curl -sf http://localhost/health &>/dev/null; then
    ok "Platform is live at http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
  else
    warn "Container started. Check logs: docker compose logs -f"
  fi
  docker compose ps
  ;;

# ── BARE NGINX ──────────────────────────────────────────────────
--nginx)
  header "Bare nginx Deployment (Ubuntu/Debian)"
  [ "$EUID" -eq 0 ] || die "Run as root: sudo bash deploy.sh --nginx"

  # Install nginx if missing
  if ! command -v nginx &>/dev/null; then
    info "Installing nginx..."
    apt-get update -qq && apt-get install -y -qq nginx
    ok "nginx installed"
  fi

  # Copy files
  info "Deploying platform files..."
  mkdir -p /var/www/wits-platform
  cp "$PLATFORM" /var/www/wits-platform/index.html
  chown -R www-data:www-data /var/www/wits-platform

  # Install configs
  cp "$DIR/nginx/nginx.conf" /etc/nginx/nginx.conf

  # Patch root path for bare nginx
  sed "s|root  /usr/share/nginx/html;|root /var/www/wits-platform;|g" \
      "$DIR/nginx/default.conf" > /etc/nginx/sites-available/wits-platform

  ln -sf /etc/nginx/sites-available/wits-platform /etc/nginx/sites-enabled/wits-platform
  rm -f /etc/nginx/sites-enabled/default

  nginx -t || die "nginx config test failed — check /etc/nginx/sites-available/wits-platform"
  systemctl enable nginx
  systemctl restart nginx

  ok "Deployed at http://$(hostname -I | awk '{print $1}')"
  ;;

# ── UPDATE HTML ONLY ────────────────────────────────────────────
--update)
  header "Hot-update Platform HTML"

  if docker ps --format '{{.Names}}' 2>/dev/null | grep -q wits_platform; then
    docker cp "$PLATFORM" wits_platform:/usr/share/nginx/html/index.html
    docker exec wits_platform nginx -s reload
    ok "Updated in Docker container"
  elif [ -f /var/www/wits-platform/index.html ]; then
    [ "$EUID" -eq 0 ] || die "Run as root for bare nginx update"
    cp "$PLATFORM" /var/www/wits-platform/index.html
    nginx -s reload
    ok "Updated on bare nginx"
  else
    die "No running deployment found. Run deploy.sh first."
  fi
  ;;

# ── SSL ─────────────────────────────────────────────────────────
--ssl)
  DOMAIN="${2:-}"
  [ -n "$DOMAIN" ] || die "Provide domain: bash deploy.sh --ssl your-domain.wits.ac.za"
  [ "$EUID" -eq 0 ] || die "Run as root: sudo bash deploy.sh --ssl $DOMAIN"

  header "SSL Setup for $DOMAIN"

  # Install certbot
  if ! command -v certbot &>/dev/null; then
    info "Installing certbot..."
    snap install --classic certbot 2>/dev/null || apt-get install -y certbot python3-certbot-nginx
    ln -sf /snap/bin/certbot /usr/bin/certbot 2>/dev/null || true
    ok "certbot installed"
  fi

  # Get certificate
  if docker ps --format '{{.Names}}' 2>/dev/null | grep -q wits_platform; then
    info "Getting certificate (standalone mode — stopping container briefly)..."
    cd "$DIR/docker" && docker compose down
    certbot certonly --standalone -d "$DOMAIN"
    info "Re-enable SSL lines in nginx/default.conf, then:"
    info "  Uncomment the HTTPS server block"
    info "  Uncomment: volumes: /etc/letsencrypt:/etc/letsencrypt:ro"
    info "  Uncomment: ports: 443:443"
    info "Then run: bash deploy.sh"
  else
    certbot --nginx -d "$DOMAIN"
    ok "SSL configured for $DOMAIN"
  fi

  # Test auto-renewal
  certbot renew --dry-run && ok "Auto-renewal working"
  ;;

# ── STATUS ──────────────────────────────────────────────────────
--status)
  header "Platform Status"
  if docker ps --format '{{.Names}}' 2>/dev/null | grep -q wits_platform; then
    echo "Mode: Docker"
    docker ps --filter "name=wits_platform" --format "Status: {{.Status}}"
    curl -sf http://localhost/health &>/dev/null && ok "Health: healthy" || warn "Health: unreachable"
  elif systemctl is-active nginx &>/dev/null 2>&1; then
    echo "Mode: Bare nginx"
    systemctl status nginx --no-pager -l | head -5
    curl -sf http://localhost/health &>/dev/null && ok "Health: healthy" || warn "Health: unreachable"
  else
    warn "No running deployment detected"
  fi
  ;;

# ── STOP ────────────────────────────────────────────────────────
--stop)
  header "Stopping"
  cd "$DIR/docker" && docker compose down
  ok "Containers stopped"
  ;;

*)
  echo "Usage: bash deploy.sh [--docker|--nginx|--update|--ssl DOMAIN|--status|--stop]"
  exit 1
  ;;
esac
