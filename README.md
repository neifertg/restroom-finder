# Restroom Finder

A modern web application to help users find the nearest public restroom based on their current location.

## Overview

Restroom Finder is a location-based service that helps people quickly locate nearby public restrooms. The app uses geolocation to pinpoint the user's current position and displays the closest restroom facilities on an interactive map.

## Features

### Core Features (MVP)
- **Real-time Location Detection** - Automatically detect user's current location using browser geolocation API
- **Nearest Restroom Search** - Find and display the closest public restrooms
- **Interactive Map View** - Show restrooms on an interactive map with markers
- **Distance Calculation** - Display distance from user to each restroom
- **Restroom Details** - Show basic information (name, address, hours)

### Future Features
- **User Ratings & Reviews** - Allow users to rate and review restroom facilities
- **Accessibility Information** - Filter for ADA-compliant restrooms
- **Real-time Availability** - Show if restroom is currently open/closed
- **User Contributions** - Allow users to add new restroom locations
- **Directions** - Provide navigation directions to selected restroom
- **Filters** - Filter by gender-neutral, family-friendly, cleanliness ratings, etc.
- **Offline Mode** - Cache nearby restrooms for offline access

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Geolocation**: Browser Geolocation API
- **Maps**: Google Maps API (or Mapbox/Leaflet)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Data Sources

The app will aggregate restroom data from multiple sources:
- **Refuge Restrooms API** - Crowd-sourced database of gender-neutral and accessible restrooms
- **Google Places API** - Commercial establishments with public restrooms
- **Public Toilet API** - International public toilet database
- **User Contributions** - Community-submitted locations

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Refuge Restrooms API
REFUGE_RESTROOMS_API_KEY=your_key_here
```

## Project Structure

```
restroom-finder/
├── app/
│   ├── api/              # API routes
│   │   ├── restrooms/    # Restroom data endpoints
│   │   └── location/     # Location services
│   ├── map/              # Map view page
│   ├── list/             # List view page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Map/             # Map components
│   ├── RestroomCard/    # Restroom display card
│   └── SearchBar/       # Location search
├── lib/                 # Utility functions
│   ├── geolocation.ts   # Location utilities
│   ├── distance.ts      # Distance calculations
│   └── supabase.ts      # Database client
├── types/               # TypeScript types
└── public/              # Static assets
```

## Database Schema

### Restrooms Table
```sql
CREATE TABLE restrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_accessible BOOLEAN DEFAULT false,
  is_gender_neutral BOOLEAN DEFAULT false,
  requires_purchase BOOLEAN DEFAULT false,
  hours TEXT,
  rating DECIMAL(2, 1),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index for location queries
CREATE INDEX idx_restrooms_location ON restrooms USING GIST (
  ll_to_earth(latitude, longitude)
);
```

## API Endpoints

### GET /api/restrooms
Find restrooms near a location
```
Query params:
  - lat: latitude
  - lng: longitude
  - radius: search radius in miles (default: 1)
  - limit: max results (default: 10)
```

### GET /api/restrooms/[id]
Get details for a specific restroom

### POST /api/restrooms
Add a new restroom (authenticated users only)

## Development Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Set up project structure
- [ ] Implement geolocation detection
- [ ] Create basic map view with markers
- [ ] Integrate Refuge Restrooms API
- [ ] Display nearest restrooms in list view
- [ ] Calculate and display distances

### Phase 2: Enhanced Features (Week 3-4)
- [ ] Add Supabase database
- [ ] Implement filtering options
- [ ] Add restroom details page
- [ ] Implement user ratings system
- [ ] Add search by address/zip code

### Phase 3: Community Features (Week 5+)
- [ ] User authentication
- [ ] Allow user submissions
- [ ] Add reviews and photos
- [ ] Implement reporting/flagging system
- [ ] Add directions integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Privacy & Data

This app collects location data only to provide the core service of finding nearby restrooms. Location data is:
- Used only to calculate distances to restrooms
- Never stored on our servers
- Never shared with third parties
- Processed entirely in the browser when possible

## Support

For questions or support, please open an issue on GitHub.

---

Built with Next.js and Tailwind CSS
