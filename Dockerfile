# Use Deno official image
FROM denoland/deno:2.0.0

WORKDIR /app

# Copy dependency files
COPY deno.json ./

# Copy source code
COPY main.ts ./
COPY src ./src
COPY static ./static

# Cache dependencies
RUN deno install --entrypoint main.ts

# Expose port
EXPOSE 3000

# Start the server
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "main.ts"]
