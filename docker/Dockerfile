# ═══════════════════════════════════════════════════════════════
#  Wits Data Literacy Platform — Production Dockerfile
#  Base: nginx:alpine (~22 MB total image size)
#  Build: docker build -t wits-platform .
#  Run:   docker run -d -p 80:80 --name wits-platform wits-platform
# ═══════════════════════════════════════════════════════════════

FROM nginx:alpine

LABEL maintainer="Wits Business Intelligence Services <biso@wits.ac.za>"
LABEL description="Data Literacy for Data Champions Learning Platform"
LABEL version="4.0"

# Remove default nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy platform HTML (the entire app is one self-contained file)
COPY platform/index.html /usr/share/nginx/html/index.html

# Copy nginx configuration
COPY nginx/nginx.conf     /etc/nginx/nginx.conf
COPY nginx/default.conf   /etc/nginx/conf.d/default.conf

# Create non-root user for security hardening
RUN addgroup -g 1001 -S wits && \
    adduser  -u 1001 -S wits -G wits && \
    chown -R wits:wits /usr/share/nginx/html && \
    chown -R wits:wits /var/cache/nginx && \
    chown -R wits:wits /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown wits:wits /var/run/nginx.pid

# Expose HTTP (HTTPS handled by reverse proxy or Certbot)
EXPOSE 80

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

USER wits

CMD ["nginx", "-g", "daemon off;"]
