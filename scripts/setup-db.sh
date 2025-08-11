#!/bin/bash

echo "🐳 Setting up PostgreSQL with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from env.example"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🎉 Database setup complete!"
echo "📊 PostgreSQL is running on localhost:5432"
echo "🔗 Connection string: postgresql://postgres:postgres@localhost:5432/athlete_discovery"
echo ""
echo "Next steps:"
echo "1. Run: npm run db:generate"
echo "2. Run: npm run db:push"
echo "3. Run: npm run db:seed"
echo "4. Run: npm run dev"
