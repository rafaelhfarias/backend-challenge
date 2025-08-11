# Athlete Discovery System

A scalable backend API and frontend for advanced athlete discovery and filtering with complex query capabilities.

## Overview

This system provides a comprehensive athlete discovery platform with advanced filtering, sorting, and pagination capabilities. Built with Next.js 14, Prisma ORM, and PostgreSQL, it supports complex queries with sub-200ms response times.

## Features

### Core Functionality
- **Text Search**: Name, email, and school name search (case-insensitive)
- **Categorical Filters**: Gender, grade, alumni status, active status, sport, school, conference
- **Performance Ranges**: Score, total followers, engagement rate (min/max)
- **Demographics**: Ethnicity percentages, audience gender distribution
- **Pagination**: Page-based navigation with configurable page sizes
- **Sorting**: Multiple field sorting with ascending/descending order
- **Filter Combinations**: All filters work together in any combination

### Technical Features
- **Database Design**: Optimized schema with strategic indexing
- **API Performance**: Sub-200ms response times for complex queries
- **Type Safety**: Full TypeScript implementation
- **Validation**: Robust input validation with Zod
- **Frontend**: Modern React interface with TanStack Table

## Technology Stack

- **Backend**: Next.js 14 (App Router), Prisma ORM, PostgreSQL
- **Frontend**: React 18, TanStack Table, Tailwind CSS
- **Validation**: Zod
- **Database**: PostgreSQL (Docker) or SQLite
- **Language**: TypeScript

## Quick Start

### Option 1: PostgreSQL with Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Node.js 18+

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database**
   ```bash
   # Start PostgreSQL with Docker
   npm run db:setup
   
   # Generate Prisma client
   npm run db:generate
   
   # Apply database schema
   npm run db:push
   
   # Seed with sample data (100 athletes)
   npm run db:seed
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Access**
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:3000/api/athletes
   - **PostgreSQL**: localhost:5432

### Option 2: SQLite (Simpler Setup)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup SQLite Database**
   ```bash
   # Edit prisma/schema.prisma and change to:
   # provider = "sqlite"
   # url = "file:./dev.db"
   
   # Generate Prisma client
   npm run db:generate
   
   # Create database and apply schema
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

3. **Start Application**
   ```bash
   npm run dev
   ```

## Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database (PostgreSQL)
npm run db:setup     # Start PostgreSQL with Docker
npm run db:stop      # Stop PostgreSQL
npm run db:reset     # Complete database reset
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema
npm run db:seed      # Seed data
npm run db:studio    # Open Prisma Studio

# Docker
docker-compose up -d postgres    # Start PostgreSQL
docker-compose down              # Stop PostgreSQL
docker-compose down -v           # Stop and remove data

# Linting
npm run lint         # Check code
```

## API Endpoints

### GET /api/athletes
Main endpoint for athlete discovery with advanced filtering.

**Query Parameters:**
- `search`: Text search (name, email, school)
- `gender`: Filter by gender (Male/Female)
- `grade`: Filter by grade level
- `isAlumni`: Alumni status (true/false)
- `isActive`: Active status (true/false)
- `sport`: Sport ID
- `school`: School ID
- `conference`: Conference name
- `scoreMin/Max`: Score range
- `totalFollowersMin/Max`: Followers range
- `engagementRateMin/Max`: Engagement rate range
- `ethnicityHispanicMin/Max`: Hispanic audience percentage
- `page`: Current page (default: 1)
- `pageSize`: Items per page (default: 20)
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc/desc)

### GET /api/filters
Returns available filter options for the UI.

### GET /api/stats
Returns general athlete statistics.

## Example Queries

### Female Basketball Players
```
GET /api/athletes?gender=Female&sport=1&totalFollowersMin=10000
```

### SEC Athletes with Hispanic Audience
```
GET /api/athletes?conference=SEC&ethnicityHispanicMin=40
```

### Complex Search
```
GET /api/athletes?search=duke&gender=Female&scoreMin=80&engagementRateMin=5
```

## Quick Testing

### Via cURL
```bash
# Test basic search
curl "http://localhost:3000/api/athletes?pageSize=5"

# Test filters
curl "http://localhost:3000/api/athletes?gender=Female&sport=1"

# Test statistics
curl "http://localhost:3000/api/stats"

# Test filter options
curl "http://localhost:3000/api/filters"
```

### Via Browser
- **Frontend**: http://localhost:3000
- **API Athletes**: http://localhost:3000/api/athletes
- **API Stats**: http://localhost:3000/api/stats
- **API Filters**: http://localhost:3000/api/filters

## Environment Configuration

### Environment Variables
The `env.example` file contains default configurations:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/athlete_discovery"

# Environment
NODE_ENV=development
```

### Create .env file
```bash
# Copy default configuration
cp env.example .env

# Or create manually with your settings
```

### PostgreSQL Configuration
- **Host**: localhost
- **Port**: 5432
- **Database**: athlete_discovery
- **Username**: postgres
- **Password**: postgres

## Troubleshooting

### Database not found
```bash
npm run db:push
```

### Prisma client not generated
```bash
npm run db:generate
```

### No data showing
```bash
npm run db:seed
```

### Module not found
```bash
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Docker not running
```bash
# Start Docker Desktop
# Or use SQLite as alternative
```

### Connection refused (PostgreSQL)
```bash
# Check if PostgreSQL is running
npm run db:setup

# Or check manually
docker-compose ps
```

### Port 5432 already in use
```bash
# Stop other PostgreSQL containers
docker-compose down

# Or use different port in docker-compose.yml
```

## Database Schema

### Main Tables
- **Athlete**: Core athlete data with performance metrics
- **School**: Universities and colleges
- **Sport**: Athletic disciplines
- **Category**: Content categories
- **AthleteCategory**: Many-to-many relationship

### Optimized Indexes
- Name, email, gender, status fields
- Score, followers, engagement metrics
- Demographics (ethnicity, audience gender)
- Relationships (school, sports)

## Performance Optimizations

### Database
- Strategic indexes for frequent queries
- Optimized relationships with Prisma
- Efficient pagination with LIMIT/OFFSET

### API
- Input validation with Zod
- Robust error handling
- Typed responses

### Frontend
- Debounced text filters
- Client-side pagination
- Optimized React components

## Architecture

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── athletes/      # GET /api/athletes
│   │   ├── filters/       # GET /api/filters
│   │   └── stats/         # GET /api/stats
│   ├── page.tsx           # Main page
│   └── layout.tsx         # App layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── athlete-table.tsx # Main table
│   ├── athlete-filters.tsx # Filters
│   └── athlete-stats.tsx # Statistics
├── lib/                  # Utilities and services
│   ├── prisma.ts         # Prisma client
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   └── athlete-service.ts # Business logic
├── prisma/               # Database configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── sample-data/          # Sample JSON data
```

## Sample Data

The system includes:
- **100 athletes** with complete data
- **30 schools** (UCLA, Duke, Alabama, etc.)
- **30 sports** (Basketball, Football, Soccer, etc.)
- **40 categories** (Sports, Lifestyle, Entertainment, etc.)

## Design Decisions

### Database Schema
- Proper normalization to avoid redundancy
- JSON fields for complex data (cities, interests)
- Many-to-many relationships for sports and categories

### API Design
- RESTful with query parameters
- Robust validation with Zod
- Consistent paginated responses

### Frontend Architecture
- Modular and reusable components
- Local state management with React hooks
- Responsive UI with Tailwind CSS

## Next Steps

### Suggested Improvements
- [ ] Redis caching
- [ ] Unit and integration tests
- [ ] Authentication and authorization
- [ ] Logging and monitoring
- [ ] Production deployment
- [ ] Advanced filters (dates, content)
- [ ] Data export functionality
- [ ] Analytics dashboard

## License

This project was developed as part of a technical challenge.