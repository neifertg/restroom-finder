import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance } from '@/lib/distance';
import { supabase } from '@/lib/supabase';

// Refuge Restrooms API endpoint
const REFUGE_API_URL = 'https://www.refugerestrooms.org/api/v1/restrooms/by_location';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '5'; // Default 5 miles
    const limit = searchParams.get('limit') || '20';

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // First, try to fetch from Supabase using the geospatial function
    const { data: supabaseRestrooms, error: supabaseError } = await supabase
      .rpc('find_nearby_restrooms', {
        user_lat: parseFloat(lat),
        user_lng: parseFloat(lng),
        radius_miles: parseFloat(radius),
        limit_count: parseInt(limit)
      });

    if (supabaseError) {
      console.warn('Supabase query error:', supabaseError.message);
      // If error, we'll fall back to Refuge API below
    }

    // If we have restrooms from Supabase, return them
    if (supabaseRestrooms && supabaseRestrooms.length > 0) {
      console.log(`Found ${supabaseRestrooms.length} restrooms from Supabase`);

      // Format the distance field
      const formattedRestrooms = supabaseRestrooms.map((restroom: any) => ({
        ...restroom,
        distance: restroom.distance_miles,
      }));

      return NextResponse.json({
        success: true,
        restrooms: formattedRestrooms,
        count: formattedRestrooms.length,
        source: 'supabase',
      });
    }

    // Fallback: Fetch from Refuge Restrooms API and cache in Supabase
    console.log('Fetching from Refuge API as fallback...');
    const apiUrl = `${REFUGE_API_URL}?lat=${lat}&lng=${lng}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Refuge API error:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch restrooms' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Found ${data.length} restrooms from Refuge API`);

    // Calculate distance for each restroom and filter by radius
    const restroomsWithDistance = data
      .map((restroom: any) => ({
        id: `refuge_${restroom.id}`,
        name: restroom.name || 'Public Restroom',
        address: restroom.street ? `${restroom.street}, ${restroom.city}, ${restroom.state}` : `${restroom.city}, ${restroom.state}`,
        latitude: restroom.latitude,
        longitude: restroom.longitude,
        is_accessible: restroom.accessible || false,
        is_gender_neutral: restroom.unisex || false,
        requires_purchase: false,
        hours: restroom.comment || undefined,
        distance: calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          restroom.latitude,
          restroom.longitude
        ),
        source: 'refuge_api',
      }))
      .filter((restroom: any) => restroom.distance <= parseFloat(radius))
      .sort((a: any, b: any) => a.distance - b.distance)
      .slice(0, parseInt(limit));

    // Optionally cache these in Supabase for future queries
    if (restroomsWithDistance.length > 0) {
      const restroomsToInsert = restroomsWithDistance.map((r: any) => ({
        id: r.id,
        name: r.name,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        is_accessible: r.is_accessible,
        is_gender_neutral: r.is_gender_neutral,
        requires_purchase: r.requires_purchase,
        hours: r.hours,
        source: 'refuge_api',
      }));

      // Insert restrooms (ignore conflicts since they might already exist)
      const { error: insertError } = await supabase
        .from('restrooms')
        .upsert(restroomsToInsert, { onConflict: 'id', ignoreDuplicates: true });

      if (insertError) {
        console.warn('Failed to cache restrooms in Supabase:', insertError.message);
      } else {
        console.log(`Cached ${restroomsToInsert.length} restrooms in Supabase`);
      }
    }

    return NextResponse.json({
      success: true,
      restrooms: restroomsWithDistance,
      count: restroomsWithDistance.length,
      source: 'refuge_api',
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
