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

#### Advanced Filtering Parameters

##### Date Ranges
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `createdAfter` | string | Created after date (YYYY-MM-DD) | `?createdAfter=2024-01-01` |
| `createdBefore` | string | Created before date (YYYY-MM-DD) | `?createdBefore=2024-12-31` |
| `updatedAfter` | string | Updated after date (YYYY-MM-DD) | `?updatedAfter=2024-06-01` |
| `updatedBefore` | string | Updated before date (YYYY-MM-DD) | `?updatedBefore=2024-12-31` |

##### Content Categories
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `categoryIds` | number[] | Category IDs (comma-separated) | `?categoryIds=1,2,3` |
| `categoryConfidenceMin` | number | Minimum category confidence % | `?categoryConfidenceMin=80` |
| `categoryConfidenceMax` | number | Maximum category confidence % | `?categoryConfidenceMax=95` |

##### Multi-Platform
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `hasBothPlatforms` | boolean | Athletes on both Instagram and TikTok | `?hasBothPlatforms=true` |
| `platformType` | string | Platform type (instagram/tiktok/both) | `?platformType=both` |

##### Complex Demographics - Audience Age
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `audienceAge13_17Min` | number | Minimum 13-17 age group % | `?audienceAge13_17Min=10` |
| `audienceAge13_17Max` | number | Maximum 13-17 age group % | `?audienceAge13_17Max=30` |
| `audienceAge18_24Min` | number | Minimum 18-24 age group % | `?audienceAge18_24Min=40` |
| `audienceAge18_24Max` | number | Maximum 18-24 age group % | `?audienceAge18_24Max=60` |
| `audienceAge25_34Min` | number | Minimum 25-34 age group % | `?audienceAge25_34Min=20` |
| `audienceAge25_34Max` | number | Maximum 25-34 age group % | `?audienceAge25_34Max=40` |
| `audienceAge35_44Min` | number | Minimum 35-44 age group % | `?audienceAge35_44Min=10` |
| `audienceAge35_44Max` | number | Maximum 35-44 age group % | `?audienceAge35_44Max=25` |
| `audienceAge45PlusMin` | number | Minimum 45+ age group % | `?audienceAge45PlusMin=5` |
| `audienceAge45PlusMax` | number | Maximum 45+ age group % | `?audienceAge45PlusMax=15` |

##### Post Performance Metrics
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `instagramAvgLikesMin` | number | Minimum Instagram avg likes | `?instagramAvgLikesMin=1000` |
| `instagramAvgLikesMax` | number | Maximum Instagram avg likes | `?instagramAvgLikesMax=5000` |
| `instagramAvgCommentsMin` | number | Minimum Instagram avg comments | `?instagramAvgCommentsMin=100` |
| `instagramAvgCommentsMax` | number | Maximum Instagram avg comments | `?instagramAvgCommentsMax=500` |
| `tiktokAvgLikesMin` | number | Minimum TikTok avg likes | `?tiktokAvgLikesMin=500` |
| `tiktokAvgLikesMax` | number | Maximum TikTok avg likes | `?tiktokAvgLikesMax=2000` |
| `tiktokAvgCommentsMin` | number | Minimum TikTok avg comments | `?tiktokAvgCommentsMin=50` |
| `tiktokAvgCommentsMax` | number | Maximum TikTok avg comments | `?tiktokAvgCommentsMax=200` |

##### Location Demographics
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `locationUsMin` | number | Minimum US audience % | `?locationUsMin=70` |
| `locationUsMax` | number | Maximum US audience % | `?locationUsMax=90` |
| `locationMexicoMin` | number | Minimum Mexico audience % | `?locationMexicoMin=5` |
| `locationMexicoMax` | number | Maximum Mexico audience % | `?locationMexicoMax=15` |
| `locationCanadaMin` | number | Minimum Canada audience % | `?locationCanadaMin=2` |
| `locationCanadaMax` | number | Maximum Canada audience % | `?locationCanadaMax=8` |

##### Pagination
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
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
          "following": 1200,
          "posts": 245,
          "engagementRate": 5.37,
          "avgLikes": 3200,
          "avgComments": 180
        },
        "tiktok": {
          "username": "samanthabaseball",
          "followers": 24058,
          "following": 800,
          "posts": 156,
          "engagementRate": 2.02,
          "avgLikes": 1500,
          "avgComments": 95
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
        },
        "audienceAge": {
          "age13_17": 15.2,
          "age18_24": 45.8,
          "age25_34": 28.5,
          "age35_44": 8.2,
          "age45Plus": 2.3
        },
        "location": {
          "us": 78.5,
          "mexico": 12.3,
          "canada": 4.8,
          "other": 4.4
        },
        "topCities": "Los Angeles, New York, Miami, Chicago, Houston",
        "interests": "Sports, Fitness, Lifestyle, Fashion, Travel"
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
  ],
  "categories": [
    {
      "id": 1,
      "name": "Sports"
    },
    {
      "id": 2,
      "name": "Lifestyle"
    },
    {
      "id": 3,
      "name": "Fashion"
    }
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

### Example 6: Advanced Date Range Filtering
```
GET /api/athletes?createdAfter=2024-01-01&updatedAfter=2024-06-01
```

### Example 7: Content Category Filtering
```
GET /api/athletes?categoryIds=1,2&categoryConfidenceMin=80
```

### Example 8: Complex Demographics - Young Audience
```
GET /api/athletes?audienceAge18_24Min=50&audienceAge25_34Min=25
```

### Example 9: Post Performance Metrics
```
GET /api/athletes?instagramAvgLikesMin=2000&tiktokAvgLikesMin=1000
```

### Example 10: Location-Based Filtering
```
GET /api/athletes?locationUsMin=80&locationMexicoMin=5
```

### Example 11: Multi-Platform Athletes with High Performance
```
GET /api/athletes?hasBothPlatforms=true&instagramAvgLikesMin=3000&tiktokAvgLikesMin=1500
```

### Example 12: Recent Athletes with Specific Demographics
```
GET /api/athletes?createdAfter=2024-01-01&audienceAge18_24Min=40&locationUsMin=70
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
