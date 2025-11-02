import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getStateFromZip } from '@/lib/zipToState';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');

    let query = supabase
      .from('issues')
      .select(`
        *,
        explanations:issue_explanations(*)
      `)
      .order('created_at', { ascending: true });

    // If zip code provided, filter by location
    if (zipCode) {
      const state = getStateFromZip(zipCode);
      if (state) {
        // Get issues that include this state in their locations array OR have no location filter
        // Using cs (contains) operator with single element array to check if state is in the locations array
        query = query.or(`locations.cs.{${state}},locations.is.null`);
      }
    }

    const { data: issues, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      issues,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
