-- Restroom Finder Database Schema
-- Run this in your Supabase SQL Editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create restrooms table
CREATE TABLE IF NOT EXISTS restrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_accessible BOOLEAN DEFAULT false,
  is_gender_neutral BOOLEAN DEFAULT false,
  requires_purchase BOOLEAN DEFAULT false,
  hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Source tracking
  source TEXT DEFAULT 'user_submitted', -- 'user_submitted', 'refuge_api', etc.
  source_id TEXT, -- Original ID from external source
  -- Computed rating fields (updated by trigger)
  overall_rating DECIMAL(3, 2),
  cleanliness_rating DECIMAL(3, 2),
  privacy_rating DECIMAL(3, 2),
  availability_rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0
);

-- Create spatial index for fast location-based queries
-- Using a simpler geometry-based index instead of geography
CREATE INDEX idx_restrooms_location ON restrooms USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Create regular indexes
CREATE INDEX idx_restrooms_accessible ON restrooms(is_accessible);
CREATE INDEX idx_restrooms_gender_neutral ON restrooms(is_gender_neutral);
CREATE INDEX idx_restrooms_created_at ON restrooms(created_at DESC);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
  user_name TEXT DEFAULT 'Anonymous',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  privacy_rating INTEGER NOT NULL CHECK (privacy_rating >= 1 AND privacy_rating <= 5),
  availability_rating INTEGER NOT NULL CHECK (availability_rating >= 1 AND availability_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Optional: Add user_id if you implement authentication later
  user_id UUID,
  -- Helpful/not helpful votes
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0
);

-- Create indexes for reviews
CREATE INDEX idx_reviews_restroom_id ON reviews(restroom_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Create favorites table (for users to save favorite restrooms)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
  user_id UUID, -- Can be null for localStorage-based favorites
  user_device_id TEXT, -- For tracking favorites without authentication
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restroom_id, user_device_id)
);

-- Create index for favorites
CREATE INDEX idx_favorites_restroom_id ON favorites(restroom_id);
CREATE INDEX idx_favorites_user_device_id ON favorites(user_device_id);

-- Function to update restroom ratings after review insert/update/delete
CREATE OR REPLACE FUNCTION update_restroom_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restrooms
  SET
    overall_rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE restroom_id = COALESCE(NEW.restroom_id, OLD.restroom_id)
    ),
    cleanliness_rating = (
      SELECT AVG(cleanliness_rating)::DECIMAL(3,2)
      FROM reviews
      WHERE restroom_id = COALESCE(NEW.restroom_id, OLD.restroom_id)
    ),
    privacy_rating = (
      SELECT AVG(privacy_rating)::DECIMAL(3,2)
      FROM reviews
      WHERE restroom_id = COALESCE(NEW.restroom_id, OLD.restroom_id)
    ),
    availability_rating = (
      SELECT AVG(availability_rating)::DECIMAL(3,2)
      FROM reviews
      WHERE restroom_id = COALESCE(NEW.restroom_id, OLD.restroom_id)
    ),
    review_count = (
      SELECT COUNT(*)::INTEGER
      FROM reviews
      WHERE restroom_id = COALESCE(NEW.restroom_id, OLD.restroom_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.restroom_id, OLD.restroom_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update ratings
DROP TRIGGER IF EXISTS trigger_update_ratings_insert ON reviews;
CREATE TRIGGER trigger_update_ratings_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_ratings();

DROP TRIGGER IF EXISTS trigger_update_ratings_update ON reviews;
CREATE TRIGGER trigger_update_ratings_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_ratings();

DROP TRIGGER IF EXISTS trigger_update_ratings_delete ON reviews;
CREATE TRIGGER trigger_update_ratings_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_ratings();

-- Function to find nearby restrooms using PostGIS
CREATE OR REPLACE FUNCTION find_nearby_restrooms(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles DECIMAL DEFAULT 5,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  is_accessible BOOLEAN,
  is_gender_neutral BOOLEAN,
  requires_purchase BOOLEAN,
  hours TEXT,
  overall_rating DECIMAL,
  cleanliness_rating DECIMAL,
  privacy_rating DECIMAL,
  availability_rating DECIMAL,
  review_count INTEGER,
  distance_miles DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.address,
    r.latitude,
    r.longitude,
    r.is_accessible,
    r.is_gender_neutral,
    r.requires_purchase,
    r.hours,
    r.overall_rating,
    r.cleanliness_rating,
    r.privacy_rating,
    r.availability_rating,
    r.review_count,
    (ST_Distance(
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(r.longitude, r.latitude), 4326)::geography
    ) * 0.000621371)::DECIMAL(10,2) AS distance_miles,
    r.created_at
  FROM restrooms r
  WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(r.longitude, r.latitude), 4326)::geography,
    radius_miles * 1609.34  -- Convert miles to meters
  )
  ORDER BY distance_miles ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE restrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for restrooms"
  ON restrooms FOR SELECT
  USING (true);

CREATE POLICY "Public read access for reviews"
  ON reviews FOR SELECT
  USING (true);

-- Allow anyone to insert restrooms (user submissions)
CREATE POLICY "Anyone can submit restrooms"
  ON restrooms FOR INSERT
  WITH CHECK (true);

-- Allow anyone to insert reviews
CREATE POLICY "Anyone can submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Allow anyone to manage their favorites
CREATE POLICY "Anyone can manage favorites"
  ON favorites FOR ALL
  USING (true);

-- Create view for restroom details with ratings
CREATE OR REPLACE VIEW restroom_details AS
SELECT
  r.*,
  COALESCE(r.review_count, 0) as total_reviews,
  COALESCE(r.overall_rating, 0) as avg_rating
FROM restrooms r;

-- Sample data for testing (optional - remove in production)
-- INSERT INTO restrooms (name, address, latitude, longitude, is_accessible, is_gender_neutral, hours)
-- VALUES
--   ('Central Park Restroom', 'Central Park, New York, NY', 40.785091, -73.968285, true, false, '6am-10pm'),
--   ('Times Square Public Facility', '1560 Broadway, New York, NY', 40.758896, -73.985130, true, true, '24/7');

COMMENT ON TABLE restrooms IS 'Public restroom locations with amenities and ratings';
COMMENT ON TABLE reviews IS 'User reviews and ratings for restrooms';
COMMENT ON TABLE favorites IS 'User favorite restrooms';
COMMENT ON FUNCTION find_nearby_restrooms IS 'Find restrooms within a radius using PostGIS';
