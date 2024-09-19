FROM algoux/nodebase:16

WORKDIR /app/

RUN npm install -g pnpm@8
COPY common /tmp/common
COPY server /tmp/server
RUN cd /tmp/server && pnpm i --frozen-lockfile && npm run build && mv /tmp/server/app / && mv /tmp/server/node_modules /app/ && rm -rf /tmp/{common,server}

ENV PATH="/app/node_modules/pm2/bin:${PATH}"
CMD npm run deploy:foreground
