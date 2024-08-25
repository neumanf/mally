FROM nginx:1.27-alpine

# Install Certbot and openssl
RUN apk add --no-cache certbot openssl bash

# Copy Nginx configuration files
COPY ./infra/nginx/conf/ /conf
COPY ./infra/nginx/scripts/entrypoint.sh /entrypoint.sh

# Ensure the entrypoint script has execute permissions
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 80 443

# Set up the entrypoint script to handle SSL configuration
ENTRYPOINT ["/entrypoint.sh"]
