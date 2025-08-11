# Quick Start Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn

## Quick Setup (3 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Create database and apply schema
npm run db:push

# Seed with sample data (100 athletes)
npm run db:seed
```

### 3. Start Application
```bash
npm run dev
```

### 4. Access
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/athletes

## Testing the API

### Example 1: Search for female basketball players
```bash
curl "http://localhost:3000/api/athletes?gender=Female&sport=1&totalFollowersMin=10000"
```

### Example 2: SEC athletes with Hispanic audience
```bash
curl "http://localhost:3000/api/athletes?conference=SEC&ethnicityHispanicMin=40"
```

### Example 3: Complex search
```bash
curl "http://localhost:3000/api/athletes?search=duke&gender=Female&scoreMin=80&engagementRateMin=5"
```

## Sample Data

The system includes:
- **100 athletes** with complete data
- **30 schools** (UCLA, Duke, Alabama, etc.)
- **30 sports** (Basketball, Football, Soccer, etc.)
- **40 categories** (Sports, Lifestyle, Entertainment, etc.)

## Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Apply schema
npm run db:seed      # Seed data
npm run db:studio    # Open Prisma Studio

# Linting
npm run lint         # Check code
```

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

## Project Structure

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

## Next Steps

1. **Explore the interface** - Use filters to test different combinations
2. **Test the API** - Make direct requests to endpoints
3. **Check performance** - Test complex queries
4. **Customize** - Add new filters or features

## Complete Documentation

- [README.md](../README.md) - Main documentation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API documentation
- [prisma/schema.prisma](../prisma/schema.prisma) - Database schema
