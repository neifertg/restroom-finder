# Database Setup Guide

## Supabase Database Setup for Restroom Finder

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard/project/yevltknwdqwekgnjbufo
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Schema

Copy and paste the entire contents of `supabase-schema.sql` into the SQL editor and click "Run".

This will create:
- **3 Tables**: `restrooms`, `reviews`, `favorites`
- **PostGIS Extension**: For efficient geospatial queries
- **Indexes**: For fast location-based searches
- **Triggers**: Auto-update ratings when reviews are added/updated/deleted
- **Function**: `find_nearby_restrooms()` for radius-based searches
- **RLS Policies**: Row Level Security for public access

### Step 3: Verify Tables

After running the schema, verify the tables were created:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check if PostGIS is enabled
SELECT PostGIS_Version();
```

## Database Schema Overview

### Restrooms Table
Stores restroom locations and amenities:
- `id`: UUID primary key
- `name`: Restroom name
- `address`: Full address
- `latitude`, `longitude`: GPS coordinates
- `is_accessible`: ADA-compliant
- `is_gender_neutral`: Gender-neutral facility
- `requires_purchase`: Requires purchase to use
- `hours`: Operating hours
- `overall_rating`, `cleanliness_rating`, `privacy_rating`, `availability_rating`: Auto-computed from reviews
- `review_count`: Total number of reviews
- `source`: Where the data came from ('user_submitted', 'refuge_api', etc.)

### Reviews Table
User reviews and ratings:
- `id`: UUID primary key
- `restroom_id`: FK to restrooms
- `user_name`: Optional name (defaults to 'Anonymous')
- `rating`: Overall rating (1-5)
- `cleanliness_rating`: Cleanliness rating (1-5)
- `privacy_rating`: Privacy rating (1-5)
- `availability_rating`: Availability rating (1-5)
- `comment`: Optional text review
- `helpful_count`, `not_helpful_count`: Vote tracking

### Favorites Table
User favorite restrooms (localStorage-based):
- `id`: UUID primary key
- `restroom_id`: FK to restrooms
- `user_device_id`: Device identifier for favorites
- Unique constraint prevents duplicate favorites

## Key Features

### 1. Geospatial Queries
Uses PostGIS for efficient location-based searches:
```sql
SELECT * FROM find_nearby_restrooms(39.0103, -77.5029, 5, 20);
-- Returns restrooms within 5 miles, sorted by distance
```

### 2. Auto-Updated Ratings
When a review is inserted/updated/deleted, the restroom's ratings automatically recalculate via triggers.

### 3. Row Level Security
Public read access for all data, allowing anyone to:
- View restrooms and reviews
- Submit new restrooms
- Add reviews
- Manage favorites

### 4. Spatial Indexing
GIST index on location for fast proximity searches.

## API Integration

The API routes in `app/api/` will:
1. Fetch restrooms from Refuge API
2. Store them in Supabase (if not already present)
3. Retrieve and display user reviews from the database
4. Allow users to submit new reviews
5. Enable favorite management

## Testing Queries

```sql
-- Find restrooms near a location
SELECT * FROM find_nearby_restrooms(39.0103, -77.5029, 5, 10);

-- Get all reviews for a restroom
SELECT * FROM reviews WHERE restroom_id = 'some-uuid' ORDER BY created_at DESC;

-- Get average ratings
SELECT
  name,
  overall_rating,
  review_count,
  ROUND(cleanliness_rating, 1) as cleanliness,
  ROUND(privacy_rating, 1) as privacy
FROM restrooms
WHERE review_count > 0
ORDER BY overall_rating DESC;

-- Find highly-rated accessible restrooms
SELECT * FROM restrooms
WHERE is_accessible = true
  AND overall_rating >= 4.0
ORDER BY overall_rating DESC;
```

## Next Steps

After running the schema:
1. The API routes will automatically use Supabase
2. User-submitted restrooms will be saved to the database
3. Reviews will be persisted and displayed
4. Ratings will auto-calculate as reviews come in

## Backup and Migration

To backup your data:
```bash
# From Supabase dashboard, go to Database > Backups
# Or use pg_dump if you have direct access
```

To reset and start fresh:
```sql
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restrooms CASCADE;
-- Then re-run the schema
```
