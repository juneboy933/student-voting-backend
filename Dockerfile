FROM denoland/deno:1.42.0

WORKDIR /app

# Switch to root user to set permissions for the data directory
USER root

# Ensure data directory exists and give permissions to the 'deno' user
RUN mkdir -p /app/data && chown -R deno:deno /app/data

# Copy the dependencies and cache them
COPY deps.ts .
RUN deno cache deps.ts

# Add application files
ADD . .

# Fix permissions for the data directory inside the container
RUN chmod -R 775 /app/data && chown -R deno:deno /app/data

# Switch to the 'deno' user
USER deno

# Run the server
CMD ["run", "--cached-only", "--allow-net", "--allow-write", "--allow-read", "server.ts"]
