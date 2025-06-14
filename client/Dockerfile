# ---- Build Stage ----
# Use alpine variant for a smaller base image
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install ALL dependencies (including devDependencies like vite)
# Then clean the cache
RUN npm install && npm cache clean --force
# Or, if you use npm ci and have a package-lock.json:
# RUN npm ci && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
# Use stable-alpine for nginx for a small and stable image
FROM nginx:stable-alpine

# Copy built assets from the build stage
# Ensure /app/dist is the correct output directory from your 'npm run build' command.
# If it's 'build' or something else, change '/app/dist' accordingly.
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: If you have a custom nginx.conf you want to bake into the image
# and it's located inside the 'client' directory, you can copy it.
# The volume mount in docker-compose.yml will override this at runtime.
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]