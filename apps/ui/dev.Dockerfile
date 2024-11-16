FROM node:22-alpine AS build

WORKDIR /dist/src/app

COPY ./apps/ui/package*.json ./
RUN npm install

COPY ./apps/ui/ .
RUN npm run build:dev

FROM nginx:1.27.1 AS runner

COPY --from=build /dist/src/app/dist/mally/browser /usr/share/nginx/html
COPY ./apps/ui/nginx.conf  /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]