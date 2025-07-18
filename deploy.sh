#!/bin/bash

# Production Deployment Script for Wedding Page
# This script handles:
# 1. SSL certificate setup
# 2. Docker deployment
# 3. Environment validation

# Exit on error
set -e

echo "Starting production deployment for Wedding Page..."

# Function to check if required files exist
check_requirements() {
    if [ ! -f "docker-compose.prod.yml" ]; then
        echo "Error: docker-compose.prod.yml not found!"
        exit 1
    fi

    if [ ! -f ".env" ]; then
        echo "Error: .env file not found!"
        echo "Please create .env file with required environment variables."
        exit 1
    fi
}

# Function to setup SSL certificates
setup_ssl() {
    echo "Setting up SSL certificates..."
    
    # Check if certbot is installed
    if ! command -v certbot &> /dev/null; then
        echo "Installing certbot..."
        sudo apt-get update
        sudo apt-get install -y certbot
    fi

    # Check if certificates exist and are valid
    if [ -f "/etc/letsencrypt/live/heheartspear.com/fullchain.pem" ]; then
        echo "SSL certificates exist. Checking validity..."
        # Check certificate expiration
        if sudo certbot certificates | grep "VALID:"; then
            echo "Certificates are valid. Proceeding with deployment."
        else
            echo "Certificates exist but may be expired. Running renewal..."
            sudo certbot renew
        fi
    else
        echo "SSL certificates not found. Generating new certificates..."
        sudo certbot certonly --standalone -d heheartspear.com -d www.heheartspear.com
    fi

    # Ensure proper permissions for nginx
    sudo chmod -R 755 /etc/letsencrypt/live/
    sudo chmod -R 755 /etc/letsencrypt/archive/
}

# Function to deploy using Docker
deploy_application() {
    echo "Deploying application using docker-compose.prod.yml..."
    
    # Pull latest changes
    echo "Pulling latest changes from git..."
    git pull origin main

    # Stop and remove existing containers
    echo "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down

    # Build new images
    echo "Building new Docker images..."
    docker-compose -f docker-compose.prod.yml build

    # Start new containers
    echo "Starting production containers..."
    docker-compose -f docker-compose.prod.yml up -d

    echo "Waiting for services to start..."
    sleep 10

    # Check if containers are running
    if ! docker ps | grep -q wedding; then
        echo "Error: Containers failed to start properly!"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    check_requirements
    setup_ssl
    deploy_application
    echo "Deployment completed successfully!"
    echo "Your website should now be accessible at https://heheartspear.com"
}

# Run the deployment
main 