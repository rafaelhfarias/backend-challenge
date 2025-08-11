#!/bin/bash

echo "🛑 Stopping PostgreSQL container..."

# Stop PostgreSQL container
docker-compose down

echo "✅ PostgreSQL container stopped!"
echo "💾 Data is preserved in Docker volume"
echo ""
echo "To start again, run: ./scripts/setup-db.sh"
echo "To remove all data, run: docker-compose down -v"
