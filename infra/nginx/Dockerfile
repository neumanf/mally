ARG environment=production

FROM jonasal/nginx-certbot:5.4.0-nginx1.27.2-alpine AS base


FROM base AS build-development

COPY ./infra/nginx/conf/development.conf /etc/nginx/user_conf.d/default.conf


FROM base AS build-production

COPY ./infra/nginx/conf/production.conf /etc/nginx/user_conf.d/default.conf


FROM build-${environment} AS final
