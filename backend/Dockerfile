FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npx prisma generate

RUN npm run build && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /home/node

LABEL fly_launch_runtime="nodejs"

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/prisma/ ./prisma/

CMD ["node", "dist/main.js"]
