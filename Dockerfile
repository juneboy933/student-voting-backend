FROM denoland/deno:1.42.0

WORKDIR /app
USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .

CMD ["run", "--cached-only", "--allow-net", "--allow-write", "--allow-read", "server.ts"]
