#!/bin/bash

echo "Setting up PostgreSQL and Redis with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL and Redis containers
echo "Starting PostgreSQL and Redis containers..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "PostgreSQL is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis to be ready..."
until docker-compose exec -T redis redis-cli ping; do
    echo "Waiting for Redis..."
    sleep 2
done

echo "Redis is ready!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo ".env file created from env.example"
else
    echo ".env file already exists"
fi

echo ""
echo "Database and cache setup complete!"
echo "PostgreSQL is running on localhost:5432"
echo "PostgreSQL connection string: postgresql://postgres:postgres@localhost:5432/athlete_discovery"
echo "Redis is running on localhost:6379"
echo "Redis connection string: redis://localhost:6379"
echo ""
echo "Next steps:"
echo "1. Run: npm run db:generate"
echo "2. Run: npm run db:push"
echo "3. Run: npm run db:seed"
echo "4. Run: npm run dev"
