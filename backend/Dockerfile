# Use an official Node.js runtime as base
FROM node:18-alpine

# Install necessary build tools for native dependencies
RUN apk add --no-cache python3 make g++ docker-cli

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the entire backend folder (including src)
COPY . .

# Expose the correct backend port
EXPOSE 3000

# Run the application
CMD ["node", "src/index.js"]
