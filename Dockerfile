FROM node:20-alpine

# Install Python 3 and dependencies
RUN apk add --no-cache python3 py3-pip make g++ && \
    npm install -g n8n@2.4.8 && \
    echo "n8n version: $(n8n --version)"

# Set working directory
WORKDIR /data

# Copy package files
COPY package*.json ./
RUN npm install --force

# Copy application
COPY . .

# Expose port
EXPOSE 5678

# Set environment variables for n8n database connection
ENV N8N_DATABASE_TYPE=postgresdb

# Start n8n - it will use environment variables for DB connection
CMD ["n8n", "start"]
