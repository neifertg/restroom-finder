# Restroom Finder

A modern, accessible web application that helps users find nearby public restrooms with detailed information about accessibility, gender-neutral facilities, and user reviews.

## Overview

Restroom Finder is a location-based service built with Next.js that helps people quickly locate public restrooms near their current location. The app combines data from the Refuge Restrooms API with a custom Supabase database to provide comprehensive, up-to-date information about restroom facilities.

## Features

### Current Features
- **Real-time Location Detection** - Automatically detect user's current location using browser geolocation API
- **Dual View Modes** - Switch between list and interactive Google Maps view
- **Smart Data Sourcing** - Hybrid approach using both cached database and Refuge Restrooms API
- **Geospatial Search** - PostGIS-powered distance calculations for accurate nearby results
- **Distance Display** - Shows distance in miles or feet from your current location
- **Accessibility Information** - Filter and identify ADA-compliant restrooms
- **Gender-Neutral Facilities** - Clear indicators for gender-neutral restrooms
- **Interactive Map** - Google Maps integration with custom markers and info windows
- **Restroom Details Modal** - Detailed view with all amenities and features
- **Google Maps Directions** - One-click directions to any restroom
- **Review System** - Rate restrooms on cleanliness, privacy, and availability
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Upcoming Features
- **Advanced Filters** - Filter by accessibility, gender-neutral, hours, ratings
- **User Contributions** - Allow users to add new restroom locations
- **Favorites System** - Save frequently used restrooms
- **Photo Uploads** - Add photos to restroom listings
- **Report Issues** - Flag outdated or incorrect information

## Tech Stack

- **Framework**: Next.js 16.0.1 with App Router and Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **Maps**: Google Maps JavaScript API with @react-google-maps/api
- **Database**: Supabase (PostgreSQL with PostGIS extension)
- **Geolocation**: Browser Geolocation API
- **External APIs**: Refuge Restrooms API
- **Deployment**: Vercel

## Data Sources

The app aggregates restroom data from multiple sources:
- **Refuge Restrooms API** - Primary data source with crowd-sourced database of gender-neutral and accessible restrooms
- **Supabase Database** - Caches API results and stores user-submitted locations
- **User Contributions** - Community-submitted locations (coming soon)

### Smart Caching Strategy
The app uses a hybrid approach:
1. First checks the Supabase database for cached nearby restrooms
2. If no results found, queries the Refuge Restrooms API
3. Automatically caches API results in Supabase for faster future queries
4. Uses PostGIS geospatial queries for accurate distance calculations

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Maps API key ([Get one here](https://console.cloud.google.com/google/maps-apis))
- Supabase account ([Sign up here](https://supabase.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/neifertg/restroom-finder.git
cd restroom-finder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project in [Supabase Dashboard](https://supabase.com/dashboard)
   - Go to the SQL Editor and run the contents of `supabase-schema.sql`
   - This will create all necessary tables, indexes, and functions

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
# Google Maps API Key
# Get from: https://console.cloud.google.com/google/maps-apis
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Supabase Configuration
# Get from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open the app**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Allow location permissions when prompted
   - Search for nearby restrooms

### Setting Up Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for future features)
4. Create credentials (API Key)
5. Restrict the key to your domain for production use

### Setting Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Wait for the project to initialize
3. Go to **SQL Editor** in the sidebar
4. Copy the contents of `supabase-schema.sql` and run it
5. Verify the tables were created in **Table Editor**
6. Copy your project URL and keys from **Settings > API**

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
