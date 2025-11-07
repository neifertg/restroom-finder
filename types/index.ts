// Core types for the Restroom Finder application

export interface Restroom {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_accessible: boolean;
  is_gender_neutral: boolean;
  requires_purchase: boolean;
  hours?: string;
  rating?: number;
  distance?: number; // Distance from user in miles
  created_at: string;
  updated_at: string;
  // Review ratings
  cleanliness_rating?: number;
  privacy_rating?: number;
  availability_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  restroom_id: string;
  user_name?: string;
  rating: number; // Overall rating 1-5
  cleanliness_rating: number; // 1-5
  privacy_rating: number; // 1-5
  availability_rating: number; // 1-5
  comment?: string;
  created_at: string;
}

export interface ReviewFormData {
  rating: number;
  cleanliness_rating: number;
  privacy_rating: number;
  availability_rating: number;
  comment: string;
  user_name: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface RestroomFilters {
  accessible?: boolean;
  genderNeutral?: boolean;
  noPurchaseRequired?: boolean;
  maxDistance?: number; // in miles
  minRating?: number;
}

export interface RestroomSearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // search radius in miles
  limit?: number; // max number of results
  filters?: RestroomFilters;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RestroomListResponse {
  restrooms: Restroom[];
  count: number;
}
