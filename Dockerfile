FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY scripts ./scripts
COPY backend ./backend
COPY frontend ./frontend
COPY index.html ./index.html
COPY styles.css ./styles.css
COPY app.js ./app.js
COPY README.md ./README.md

RUN node scripts/sync-frontend.mjs

ENV HOST=0.0.0.0
ENV PORT=3000
ENV DATA_DIR=/data/projekt-vault

EXPOSE 3000

CMD ["node", "backend/src/server.js"]
