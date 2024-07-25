FROM node:20-alpine AS base
#RUN apk add --no-cache libc6-compat
#RUN apk update

############################
# dependencies
############################
FROM base as dependencies

WORKDIR /build

# copy all of the package.json files
COPY package.json .
COPY package-lock.json .

# install dependencies
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --no-fund --no-audit


############################
# builder
############################
FROM dependencies as builder

# Set these build args to enable remote caching
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_API_KEY=$VITE_SUPABASE_API_KEY

WORKDIR /build

# copy the whole repo
COPY . .

# build the app
# RUN  --mount=type=cache,id=turbo-cache,target=./.turbo-cache \
#     npx turbo build --cache-dir=./.turbo-cache
RUN npm run build:web

############################
# prod container
############################
FROM caddy:latest

ENV PORT=80

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /build/dist/web /www/html

HEALTHCHECK CMD wget --spider --quiet http://localhost:${PORT}
