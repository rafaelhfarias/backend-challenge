# API Documentation - Athlete Discovery System

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. GET /athletes
Main endpoint for athlete discovery with advanced filtering and pagination.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Text search (name, email, school) | `?search=duke` |
| `gender` | string | Filter by gender | `?gender=Female` |
| `grade` | string | Filter by grade level | `?grade=Graduate` |
| `isAlumni` | boolean | Alumni status | `?isAlumni=true` |
| `isActive` | boolean | Active status | `?isActive=true` |
| `sport` | number | Sport ID | `?sport=1` |
| `school` | number | School ID | `?school=3` |
| `conference` | string | Conference name | `?conference=SEC` |
| `scoreMin` | number | Minimum score | `?scoreMin=80` |
| `scoreMax` | number | Maximum score | `?scoreMax=95` |
| `totalFollowersMin` | number | Minimum followers | `?totalFollowersMin=10000` |
| `totalFollowersMax` | number | Maximum followers | `?totalFollowersMax=100000` |
| `engagementRateMin` | number | Minimum engagement rate | `?engagementRateMin=5` |
| `engagementRateMax` | number | Maximum engagement rate | `?engagementRateMax=10` |
| `ethnicityHispanicMin` | number | Minimum Hispanic audience % | `?ethnicityHispanicMin=40` |
| `ethnicityHispanicMax` | number | Maximum Hispanic audience % | `?ethnicityHispanicMax=60` |
| `ethnicityWhiteMin` | number | Minimum White audience % | `?ethnicityWhiteMin=30` |
| `ethnicityWhiteMax` | number | Maximum White audience % | `?ethnicityWhiteMax=50` |
| `ethnicityBlackMin` | number | Minimum Black audience % | `?ethnicityBlackMin=20` |
| `ethnicityBlackMax` | number | Maximum Black audience % | `?ethnicityBlackMax=40` |
| `ethnicityAsianMin` | number | Minimum Asian audience % | `?ethnicityAsianMin=10` |
| `ethnicityAsianMax` | number | Maximum Asian audience % | `?ethnicityAsianMax=30` |
| `audienceGenderMaleMin` | number | Minimum male audience % | `?audienceGenderMaleMin=50` |
| `audienceGenderMaleMax` | number | Maximum male audience % | `?audienceGenderMaleMax=70` |
| `audienceGenderFemaleMin` | number | Minimum female audience % | `?audienceGenderFemaleMin=30` |
| `audienceGenderFemaleMax` | number | Maximum female audience % | `?audienceGenderFemaleMax=50` |
| `instagramFollowersMin` | number | Minimum Instagram followers | `?instagramFollowersMin=5000` |
| `instagramFollowersMax` | number | Maximum Instagram followers | `?instagramFollowersMax=50000` |
| `tiktokFollowersMin` | number | Minimum TikTok followers | `?tiktokFollowersMin=2000` |
| `tiktokFollowersMax` | number | Maximum TikTok followers | `?tiktokFollowersMax=20000` |
| `page` | number | Current page (default: 1) | `?page=2` |
| `pageSize` | number | Items per page (default: 20) | `?pageSize=10` |
| `sortBy` | string | Sort field | `?sortBy=score` |
| `sortOrder` | string | Sort order (asc/desc) | `?sortOrder=desc` |

#### Available Sort Fields
- `name` - Athlete name
- `score` - Current score
- `totalFollowers` - Total followers
- `engagementRate` - Engagement rate
- `age` - Age

#### Response Example
```json
{
  "data": [
    {
      "id": 1,
      "name": "Samantha Morris",
      "email": "samantha.morris@duke.edu",
      "gender": "Female",
      "isAlumni": true,
      "grade": "Graduate",
      "isActive": true,
      "needsReview": false,
      "school": {
        "id": 3,
        "label": "Duke",
        "name": "Duke University",
        "state": "North Carolina",
        "conference": "ACC"
      },
      "sports": [
        {
          "id": 4,
          "label": "Baseball",
          "name": "Baseball"
        }
      ],
      "currentScore": {
        "score": 90.93,
        "totalFollowers": 89102,
        "engagementRate": 5.46,
        "audienceQualityScore": 68.18,
        "contentPerformanceScore": 84.1
      },
      "platforms": {
        "instagram": {
          "username": "samantham_baseball",
          "followers": 65044,
          "engagementRate": 5.37
        },
        "tiktok": {
          "username": "samanthabaseball",
          "followers": 24058,
          "engagementRate": 2.02
        }
      },
      "demographics": {
        "age": 19,
        "ageRange": "18-24",
        "ethnicity": {
          "hispanic": 43.94,
          "white": 31.03,
          "black": 33.39,
          "asian": 39.28,
          "other": 8.47
        },
        "audienceGender": {
          "male": 58.79,
          "female": 41.75
        }
      },
      "categories": [
        {
          "id": 2,
          "name": "Lifestyle",
          "confidenceScore": 86.79
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. GET /filters
Returns available filter options for the user interface.

#### Response
```json
{
  "schools": [
    {
      "id": 1,
      "label": "UCLA",
      "conference": "Pac-12"
    }
  ],
  "sports": [
    {
      "id": 1,
      "label": "Basketball"
    }
  ],
  "conferences": [
    "ACC",
    "Big 12",
    "Big Ten",
    "Pac-12",
    "SEC"
  ],
  "grades": [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Graduate"
  ]
}
```

### 3. GET /stats
Returns general athlete statistics.

#### Response
```json
{
  "totalAthletes": 100,
  "activeAthletes": 85,
  "alumniAthletes": 15,
  "avgScore": 75.2,
  "avgFollowers": 45000,
  "avgEngagement": 4.8
}
```

## Usage Examples

### Example 1: Female Basketball Players
```
GET /api/athletes?gender=Female&sport=1&totalFollowersMin=10000
```

### Example 2: SEC Athletes with Hispanic Audience
```
GET /api/athletes?conference=SEC&ethnicityHispanicMin=40
```

### Example 3: Complex Search with Multiple Filters
```
GET /api/athletes?search=duke&gender=Female&scoreMin=80&engagementRateMin=5&page=1&pageSize=10&sortBy=score&sortOrder=desc
```

### Example 4: Active Athletes with High Engagement
```
GET /api/athletes?isActive=true&engagementRateMin=8&sortBy=engagementRate&sortOrder=desc
```

### Example 5: Multi-Platform Athletes
```
GET /api/athletes?instagramFollowersMin=5000&tiktokFollowersMin=2000
```

## HTTP Status Codes

- `200` - Success
- `400` - Invalid parameters
- `500` - Internal server error

## Limitations

- Maximum 100 items per page
- Case-insensitive search
- Numeric filters accept decimal values
- Default sorting by score in descending order

## Performance

- Optimized responses for sub-200ms
- Database indexes for complex queries
- Efficient pagination
- Input validation with Zod
- Redis caching for improved performance

## Caching

The API implements Redis caching to improve response times and reduce database load.

### Cache Headers
- `X-Cache: HIT` - Response served from cache
- `X-Cache: MISS` - Response generated from database
- `Cache-Control: public, max-age=<seconds>` - Cache duration

### Cache TTL (Time To Live)
- Athletes data: 30 minutes (1800 seconds)
- Filter options: 1 hour (3600 seconds)
- Statistics: 30 minutes (1800 seconds)

### Cache Invalidation
```
POST /api/cache/invalidate
```

Query Parameters:
- `pattern` (optional) - Specific cache pattern to invalidate

Examples:
- `POST /api/cache/invalidate` - Invalidate all cache
- `POST /api/cache/invalidate?pattern=athletes:*` - Invalidate athlete cache only
