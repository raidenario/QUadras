# ==============================================================================
# QUADRAS - Dockerfile
# Multi-stage build for Elixir/Phoenix Application
# ==============================================================================

# ==============================================================================
# Stage 1: Build Environment
# ==============================================================================
FROM elixir:1.17-otp-27-alpine AS builder

# Build arguments
ARG MIX_ENV=prod
ENV MIX_ENV=${MIX_ENV}

# Install build dependencies
RUN apk add --no-cache \
    git \
    build-base \
    nodejs \
    npm

# Set work directory
WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy dependency files first (for better caching)
COPY mix.exs mix.lock ./
COPY config config

# Fetch dependencies
RUN mix deps.get --only $MIX_ENV
RUN mix deps.compile

# Copy assets and compile them
COPY assets assets
COPY priv priv
COPY lib lib

# Compile assets
RUN mix assets.deploy

# Compile the application
RUN mix compile

# Build the release
RUN mix release

# ==============================================================================
# Stage 2: Runtime Environment (Minimal)
# ==============================================================================
FROM alpine:3.20 AS runtime

ARG MIX_ENV=prod
ENV MIX_ENV=${MIX_ENV}

# Install runtime dependencies
RUN apk add --no-cache \
    libstdc++ \
    openssl \
    ncurses-libs \
    libgcc \
    ca-certificates \
    # PostGIS spatial libraries
    geos \
    proj

# Create non-root user for security
RUN addgroup -g 1000 quadras && \
    adduser -u 1000 -G quadras -s /bin/sh -D quadras

WORKDIR /app

# Copy the release from builder
COPY --from=builder --chown=quadras:quadras /app/_build/${MIX_ENV}/rel/quadras ./

# Switch to non-root user
USER quadras

# Expose Phoenix port
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Entrypoint
CMD ["bin/quadras", "start"]
