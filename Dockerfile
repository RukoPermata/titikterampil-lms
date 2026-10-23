FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /tmp/install
COPY package.json bun.lock /tmp/install
RUN cd /tmp/install && bun install --frozen-lockfile --production

FROM base AS build
RUN mkdir -p /tmp/build
COPY --from=install /tmp/install/node_modules node_modules
COPY package.json bun.lock /tmp/build
RUN cd /tmp/build && bun install --frozen-lockfile
COPY . /tmp/build
RUN cd /tmp/build && bun run build

FROM base AS release
COPY --from=install /tmp/install/node_modules node_modules
COPY --from=build /tmp/build/.next .next
COPY --from=build /tmp/build/public public
COPY --from=build /tmp/build/next.config.mjs .
COPY package.json .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "start"]
