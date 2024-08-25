#!/bin/bash

# Create necessary directories
mkdir -p /var/www/certbot /etc/nginx/ssl

# Check if SSL certificates does not already exist
if [ ! -f /etc/letsencrypt/live/mally.neumanf.com/fullchain.pem ]; then
    # Temporary Nginx configuration to allow Certbot to run
    cp /conf/certbot.conf /etc/nginx/conf.d/default.conf

    # Start Nginx in the background
    nginx &

    # Wait for Nginx to start
    sleep 5

    # Request a certificate for the domain
    certbot certonly --webroot --webroot-path=/var/www/certbot \
        --email fabricionewman@gmail.com --agree-tos --no-eff-email \
        -d mally.neumanf.com -d api.mally.neumanf.com -d auth.mally.neumanf.com

    # Replace Nginx configuration with the SSL version
    cp /conf/nginx.conf /etc/nginx/conf.d/default.conf

    # Reload Nginx to apply the new configuration
    nginx -s reload
else
    # Replace Nginx configuration with the SSL version
    cp /conf/nginx.conf /etc/nginx/conf.d/default.conf
fi

# Keep Nginx running in the foreground
nginx -g 'daemon off;'
