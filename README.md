# Athlete Discovery System

A scalable backend API and frontend for advanced athlete discovery and filtering with complex query capabilities.

## Overview

This system provides a comprehensive athlete discovery platform with advanced filtering, sorting, and pagination capabilities. Built with Next.js 14, Prisma ORM, and PostgreSQL, it supports complex queries with sub-200ms response times.

## Features

- Advanced text search with highlighting for names, emails, and school names
- Comprehensive filtering by gender, grade, alumni status, active status, sport, school, conference
- Performance ranges for score, total followers, and engagement rate
- Demographics filtering including ethnicity percentages and audience gender distribution
- Date range filtering for created and updated timestamps
- Content category filtering with confidence scores
- Multi-platform filtering for Instagram and TikTok
- Complex demographics including audience age distribution
- Post performance metrics filtering
- Location-based audience filtering
- Pagination with configurable page sizes
- Multiple field sorting with ascending/descending order
- Rate limiting with IP-based tracking
- Redis caching for improved performance

## Technical Decisions

This section outlines the key architectural and technical decisions made during the development of the Athlete Discovery System, explaining the rationale behind each choice and the trade-offs considered.

### Database & ORM

**PostgreSQL**
- **Why**: Robust relational database with excellent JSON support for complex athlete data, ACID compliance, and mature ecosystem.
- **Trade-offs**: More complex setup than SQLite, but better performance and features for production use.

**Prisma ORM**
- **Why**: Type-safe database access, excellent migration system, and intuitive schema definition. Already have experience with this ORM.
- **Trade-offs**: Additional abstraction layer, but provides significant developer productivity benefits

### Caching Strategy

**Redis**
- **Why**: In-memory caching for frequently accessed data, reducing database load and improving response times
- **Trade-offs**: Additional infrastructure complexity, but essential for performance at scale

**Cache Invalidation Strategy**
- **Why**: Manual cache invalidation endpoints to ensure data consistency when records are updated
- **Trade-offs**: Requires careful management but provides control over cache freshness

### Performance & Scalability

**Query Optimization**
- **Why**: Implemented database indexes on frequently filtered fields and used efficient WHERE clauses
- **Trade-offs**: Slightly increased write overhead for significantly improved read performance

**Pagination & Sorting**
- **Why**: Server-side pagination to handle large datasets efficiently
- **Trade-offs**: More complex implementation but essential for user experience with large datasets

### Security & Validation

**Rate Limiting**
- **Why**: IP-based rate limiting to prevent abuse and ensure fair usage
- **Trade-offs**: May affect legitimate high-volume users but necessary for system stability

## Technology Stack

- Backend: Next.js 14 (App Router), Prisma ORM, PostgreSQL
- Frontend: React 18, TanStack Table, Tailwind CSS
- Validation: Zod
- Database: PostgreSQL (Docker) or SQLite
- Cache: Redis
- Language: TypeScript

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+

### Installation

1. Install dependencies
   ```bash
   npm install
   ```

2. Setup database and cache
   ```bash
   npm run db:setup
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. Start application
   ```bash
   npm run dev
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/athletes

## Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database and Cache
npm run db:setup     # Start PostgreSQL and Redis with Docker
npm run db:stop      # Stop PostgreSQL and Redis
npm run db:reset     # Complete database and cache reset
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema
npm run db:seed      # Seed data
npm run db:studio    # Open Prisma Studio

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## API Endpoints

### GET /api/athletes
Main endpoint for athlete discovery with advanced filtering.

**Rate Limiting:**
- General requests: 100 requests per 15 minutes
- Search requests: 30 requests per 5 minutes

**Query Parameters:**
- `search`: Text search (name, email, school, sports, categories) - max 100 characters
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
- `createdAfter/Before`: Date range for creation (YYYY-MM-DD)
- `updatedAfter/Before`: Date range for updates (YYYY-MM-DD)
- `categoryIds`: Category IDs (comma-separated)
- `categoryConfidenceMin/Max`: Category confidence range (0-100)
- `hasBothPlatforms`: Athletes on both Instagram and TikTok (true/false)
- `platformType`: Platform type (instagram/tiktok/both)
- `audienceAge13_17Min/Max`: 13-17 age group percentage (0-100)
- `audienceAge18_24Min/Max`: 18-24 age group percentage (0-100)
- `audienceAge25_34Min/Max`: 25-34 age group percentage (0-100)
- `audienceAge35_44Min/Max`: 35-44 age group percentage (0-100)
- `audienceAge45PlusMin/Max`: 45+ age group percentage (0-100)
- `instagramAvgLikesMin/Max`: Instagram average likes range
- `instagramAvgCommentsMin/Max`: Instagram average comments range
- `tiktokAvgLikesMin/Max`: TikTok average likes range
- `tiktokAvgCommentsMin/Max`: TikTok average comments range
- `locationUsMin/Max`: US audience percentage (0-100)
- `locationMexicoMin/Max`: Mexico audience percentage (0-100)
- `locationCanadaMin/Max`: Canada audience percentage (0-100)
- `page`: Current page (1-1000, default: 1)
- `pageSize`: Items per page (1-100, default: 20)
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc/desc, default: asc)

### GET /api/filters
Returns available filter options for the UI.

### GET /api/stats
Returns general athlete statistics.

### POST /api/cache/invalidate
Invalidates cache entries.

## Example Queries

### Female Basketball Players
```
GET /api/athletes?gender=Female&sport=1&totalFollowersMin=10000
```

### SEC Athletes with Hispanic Audience
```
GET /api/athletes?conference=SEC&ethnicityHispanicMin=40
```

### Advanced Search with Multiple Filters
```
GET /api/athletes?search=duke&gender=Female&scoreMin=80&engagementRateMin=5&hasBothPlatforms=true
```

### Complex Demographics Filtering
```
GET /api/athletes?audienceAge18_24Min=50&locationUsMin=80&instagramAvgLikesMin=2000
```

## Testing

### Via cURL
```bash
# Test basic search
curl "http://localhost:3000/api/athletes?pageSize=5"

# Test advanced search with highlighting
curl "http://localhost:3000/api/athletes?search=john&pageSize=3"

# Test filters
curl "http://localhost:3000/api/athletes?gender=Female&sport=1"

# Test statistics
curl "http://localhost:3000/api/stats"

# Test filter options
curl "http://localhost:3000/api/filters"
```

### Via Browser
- Frontend: http://localhost:3000
- API Athletes: http://localhost:3000/api/athletes
- API Stats: http://localhost:3000/api/stats
- API Filters: http://localhost:3000/api/filters

## Environment Configuration

Create a `.env` file based on `env.example`:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/athlete_discovery"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Environment
NODE_ENV=development
```

## Database Schema

### Main Tables
- Athlete: Core athlete data with performance metrics
- School: Universities and colleges
- Sport: Athletic disciplines
- Category: Content categories
- AthleteCategory: Many-to-many relationship

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
- Fuzzy search with Fuse.js integration
- Search result highlighting
- Redis caching for improved performance

### Frontend
- Debounced text filters
- Client-side pagination
- Optimized React components
- Search highlighting components
- Real-time search feedback

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
│   ├── cache.ts          # Redis cache service
│   ├── cache-middleware.ts # Cache middleware
│   ├── rate-limiter.ts   # Rate limiting implementation
│   ├── validation.ts     # Request validation schemas
│   ├── middleware.ts     # API middleware utilities
│   └── search-utils.ts   # Fuzzy search and highlighting
├── prisma/               # Database configuration
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── sample-data/          # Sample JSON data
```

## Sample Data

The system includes:
- 100 athletes with complete data
- 30 schools (UCLA, Duke, Alabama, etc.)
- 30 sports (Basketball, Football, Soccer, etc.)
- 40 categories (Sports, Lifestyle, Entertainment, etc.)

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
npm run dev -- -p 3001
```

### Connection refused (PostgreSQL)
```bash
npm run db:setup
```

### Connection refused (Redis)
```bash
docker-compose up -d redis
```

## Rate Limiting and Validation

### Rate Limiting Implementation
- In-memory storage for development and small-scale deployments
- IP-based tracking for client identification
- Configurable limits for different endpoint types
- Sliding window with automatic cleanup
- Standard rate limit headers for client awareness

### Rate Limits
- General API endpoints: 100 requests per 15 minutes
- Search endpoints: 30 requests per 5 minutes
- Headers included: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

### Request Validation
- Parameter sanitization with automatic trimming and type coercion
- Range validation ensuring min values are not greater than max values
- Type safety with full TypeScript integration and Zod schemas
- Detailed error messages for debugging
- Sensible defaults for optional parameters

### Error Handling
- 429 Too Many Requests: Rate limit exceeded
- 400 Bad Request: Validation errors with detailed feedback
- 500 Internal Server Error: Unexpected server errors
- Consistent format for all error responses

## Advanced Search Features

### Fuzzy Search Implementation
- Multi-field search across names, emails, school names, sports, and categories
- Fuzzy matching handling typos, partial matches, and approximate text matching
- Configurable threshold for search accuracy
- Weighted results for different field types

### Search Highlighting
- Real-time highlighting of search matches in the UI
- Visual feedback with highlighted terms
- Multiple match handling
- Case insensitive highlighting
- Field-specific highlighting for names, emails, and school names

## Caching

The API implements Redis caching to improve response times and reduce database load.

### Cache Headers
- X-Cache: HIT - Response served from cache
- X-Cache: MISS - Response generated from database
- Cache-Control: public, max-age=<seconds> - Cache duration

### Cache TTL
- Athletes data: 30 minutes (1800 seconds)
- Filter options: 1 hour (3600 seconds)
- Statistics: 30 minutes (1800 seconds)

### Cache Invalidation
```
POST /api/cache/invalidate
```

Query Parameters:
- pattern (optional) - Specific cache pattern to invalidate

Examples:
- POST /api/cache/invalidate - Invalidate all cache
- POST /api/cache/invalidate?pattern=athletes:* - Invalidate athlete cache only
