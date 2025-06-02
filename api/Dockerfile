FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies and clean cache
# If you use npm ci (recommended if you have a package-lock.json and want exact reproducibility):
# RUN npm ci --omit=dev && npm cache clean --force
RUN npm install --omit=dev && npm cache clean --force

# Copy the rest of the application code
COPY . .

# .env file should NOT be copied into the image.
# Environment variables will be injected by Docker Compose or your deployment environment.

EXPOSE 5000

CMD ["npm", "start"]