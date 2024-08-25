docker compose -f docker-compose.prod.yml run --rm nginx \
   certbot certonly --webroot --webroot-path /var/www/certbot/ \
   --email fabricionewman@gmail.com --agree-tos --no-eff-email \
   -d mally.neumanf.com -d api.mally.neumanf.com -d auth.mally.neumanf.com && \
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload