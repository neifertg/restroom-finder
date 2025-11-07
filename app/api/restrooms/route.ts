import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance } from '@/lib/distance';

// Refuge Restrooms API endpoint
const REFUGE_API_URL = 'https://www.refugerestrooms.org/api/v1/restrooms/by_location';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5'; // Default 5 miles

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch from Refuge Restrooms API
    const apiUrl = `${REFUGE_API_URL}?lat=${lat}&lng=${lng}`;

    console.log('Fetching restrooms from:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Refuge API error:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch restrooms from Refuge API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Found ${data.length} restrooms from Refuge API`);

    // Calculate distance for each restroom and filter by radius
    const restroomsWithDistance = data
      .map((restroom: any) => ({
        id: restroom.id.toString(),
        name: restroom.name || 'Public Restroom',
        address: restroom.street ? `${restroom.street}, ${restroom.city}, ${restroom.state}` : `${restroom.city}, ${restroom.state}`,
        latitude: restroom.latitude,
        longitude: restroom.longitude,
        is_accessible: restroom.accessible || false,
        is_gender_neutral: restroom.unisex || false,
        requires_purchase: false, // Refuge API doesn't track this
        hours: restroom.comment || undefined,
        rating: undefined, // Refuge API doesn't have ratings
        distance: calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          restroom.latitude,
          restroom.longitude
        ),
        created_at: restroom.created_at,
        updated_at: restroom.updated_at,
      }))
      .filter((restroom: any) => restroom.distance <= parseFloat(radius))
      .sort((a: any, b: any) => a.distance - b.distance);

    return NextResponse.json({
      success: true,
      restrooms: restroomsWithDistance,
      count: restroomsWithDistance.length,
    });

  } catch (error) {
    console.error('Error fetching restrooms:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
