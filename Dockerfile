FROM navikt/node-express:12.2.0-alpine
ENV NODE_ENV production

WORKDIR /app
COPY server ./server
COPY build/ ./build

EXPOSE 3000

CMD ["node", "server/server.js"]
