FROM denoland/deno:1.18.1

WORKDIR /app
USER deno

# Cache remote dependencies before adding rest of source
COPY deps.ts .
RUN deno cache deps.ts

# Now add the rest of the app
ADD . .

CMD ["run", "--cached-only", "--allow-net", "--allow-write", "--allow-read", "server.ts"]
