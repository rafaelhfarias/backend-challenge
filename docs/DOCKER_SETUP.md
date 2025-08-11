# Docker Setup - Athlete Discovery System

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Node.js 18+

## Quick Setup with Docker

### 1. Start PostgreSQL
```bash
# Start PostgreSQL with Docker
npm run db:setup
```

This command will:
- Verify Docker is running
- Start PostgreSQL container
- Wait for database to be ready
- Create .env file automatically

### 2. Configure Application
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Apply database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### 3. Start Application
```bash
npm run dev
```

## PostgreSQL Configuration

### Container
- **Image**: postgres:15
- **Container**: athlete_discovery_db
- **Port**: 5432
- **Volume**: postgres_data (persistent data)

### Database
- **Database**: athlete_discovery
- **Username**: postgres
- **Password**: postgres
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/athlete_discovery`

## Docker Commands

### Container Management
```bash
# Start PostgreSQL
npm run db:setup

# Stop PostgreSQL
npm run db:stop

# Complete reset (removes data)
npm run db:reset

# Check status
docker-compose ps

# View logs
docker-compose logs postgres
```

### Direct Docker Commands
```bash
# Start
docker-compose up -d postgres

# Stop
docker-compose down

# Stop and remove data
docker-compose down -v

# Rebuild
docker-compose up -d --build postgres
```

## Troubleshooting

### Docker not running
```bash
# Start Docker Desktop
# Or use SQLite as alternative
```

### Port 5432 in use
```bash
# Stop other PostgreSQL containers
docker-compose down

# Or change port in docker-compose.yml
ports:
  - "5433:5432"  # Use port 5433
```

### Container won't start
```bash
# Check logs
docker-compose logs postgres

# Remove container and recreate
docker-compose down -v
npm run db:setup
```

### Connection error
```bash
# Check if container is running
docker-compose ps

# Check if database is ready
docker-compose exec postgres pg_isready -U postgres
```

## Docker Files

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: athlete_discovery_db
    environment:
      POSTGRES_DB: athlete_discovery
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### env.example
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/athlete_discovery"
NODE_ENV=development
```

## Migration from SQLite to PostgreSQL

If you were using SQLite and want to migrate to PostgreSQL:

1. **Stop application**
   ```bash
   # Stop if running
   ```

2. **Setup PostgreSQL**
   ```bash
   npm run db:setup
   ```

3. **Apply schema**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Test**
   ```bash
   npm run dev
   ```

## PostgreSQL Advantages

- **Performance**: Better for complex queries
- **Scalability**: Support for large data volumes
- **Advanced Features**: Indexes, transactions, etc.
- **Production**: Closer to real environment
- **Backup**: Persistent data in Docker volume

## Next Steps

- [ ] Configure automatic backups
- [ ] Add Redis for caching
- [ ] Setup monitoring
- [ ] Production deployment
