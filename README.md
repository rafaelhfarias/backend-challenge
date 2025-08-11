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
- **Rate Limiting**: Configurable rate limiting with IP-based tracking
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

```

## API Endpoints

### GET /api/athletes
Main endpoint for athlete discovery with advanced filtering.

**Rate Limiting:**
- **General requests**: 100 requests per 15 minutes
- **Search requests**: 30 requests per 5 minutes
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**Query Parameters:**
- `search`: Text search (name, email, school) - max 100 characters
- `gender`: Filter by gender (Male/Female)
- `grade`: Filter by grade level (1-12)
- `isAlumni`: Alumni status (true/false)
- `isActive`: Active status (true/false)
- `sport`: Sport ID (positive integer)
- `school`: School ID (positive integer)
- `conference`: Conference name (max 50 characters)
- `scoreMin/Max`: Score range (0-100)
- `totalFollowersMin/Max`: Followers range (0-10,000,000)
- `engagementRateMin/Max`: Engagement rate range (0-100)
- `ethnicityHispanicMin/Max`: Hispanic audience percentage (0-100)
- `page`: Current page (1-1000, default: 1)
- `pageSize`: Items per page (1-100, default: 20)
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc/desc, default: asc)

### GET /api/filters
Returns available filter options for the UI.

**Rate Limiting:** 100 requests per 15 minutes

### GET /api/stats
Returns general athlete statistics.

**Rate Limiting:** 100 requests per 15 minutes

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

# Test rate limiting headers
curl -I "http://localhost:3000/api/athletes"

# Test validation (should return 400)
curl "http://localhost:3000/api/athletes?page=0"

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
- Rate limiting with IP-based tracking
- Request sanitization and parameter validation

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
│   ├── athlete-service.ts # Business logic
│   ├── rate-limiter.ts   # Rate limiting implementation
│   ├── validation.ts     # Request validation schemas
│   └── middleware.ts     # API middleware utilities
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
- Rate limiting with configurable thresholds
- IP-based client identification

### Frontend Architecture
- Modular and reusable components
- Local state management with React hooks
- Responsive UI with Tailwind CSS

## Rate Limiting and Validation

### Rate Limiting Implementation
The system implements a configurable rate limiting mechanism with the following features:

- **In-memory storage**: Simple and fast for development and small-scale deployments
- **IP-based tracking**: Identifies clients by IP address from headers
- **Configurable limits**: Different limits for different endpoint types
- **Sliding window**: Automatic cleanup of expired entries
- **Response headers**: Standard rate limit headers for client awareness

### Rate Limits
- **General API endpoints**: 100 requests per 15 minutes
- **Search endpoints**: 30 requests per 5 minutes (stricter due to higher computational cost)
- **Headers included**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Request Validation
Comprehensive validation ensures data integrity and security:

- **Parameter sanitization**: Automatic trimming and type coercion
- **Range validation**: Ensures min values are not greater than max values
- **Type safety**: Full TypeScript integration with Zod schemas
- **Error formatting**: Detailed error messages for debugging
- **Default values**: Sensible defaults for optional parameters

### Validation Rules
- **Search terms**: Maximum 100 characters, trimmed
- **Numeric ranges**: Validated min/max relationships
- **Enumerated values**: Strict validation for gender, sort order
- **Pagination**: Reasonable limits (page: 1-1000, pageSize: 1-100)
- **Performance metrics**: Realistic ranges for scores and follower counts
- **Boolean values**: String values are coerced to booleans (any non-empty string = true)

### Error Handling
- **429 Too Many Requests**: Rate limit exceeded
- **400 Bad Request**: Validation errors with detailed feedback
- **500 Internal Server Error**: Unexpected server errors
- **Consistent format**: All errors follow the same response structure
