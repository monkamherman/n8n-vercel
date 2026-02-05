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

# Start n8n with PostgreSQL using environment variables
# The start script will display config and launch n8n
CMD ["./start-n8n.sh"]
