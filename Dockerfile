FROM algoux/nodebase:16

RUN apt-get update
RUN apt-get install -y telnet dnsutils
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app/

RUN npm install -g pnpm@8
COPY common /tmp/common
COPY server /tmp/server
RUN cd /tmp/server && pnpm i --frozen-lockfile && npm run build && mv /tmp/server/app / && mv /tmp/server/node_modules /app/ && rm -rf /tmp/common /tmp/server

ENV PATH="/app/node_modules/pm2/bin:${PATH}"
CMD npm run deploy:foreground
