import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { restroom_id, rating, cleanliness_rating, privacy_rating, availability_rating, comment, user_name } = body;

    // Validation
    if (!restroom_id || !rating || !cleanliness_rating || !privacy_rating || !availability_rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5 || cleanliness_rating < 1 || cleanliness_rating > 5 ||
        privacy_rating < 1 || privacy_rating > 5 || availability_rating < 1 || availability_rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Ratings must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert review into Supabase
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        restroom_id,
        user_name: user_name || 'Anonymous',
        rating,
        cleanliness_rating,
        privacy_rating,
        availability_rating,
        comment: comment || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save review',
          details: error.message
        },
        { status: 500 }
      );
    }

    console.log('Review submitted:', review);

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully',
    });

  } catch (error) {
    console.error('Error submitting review:', error);
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restroomId = searchParams.get('restroom_id');

    if (!restroomId) {
      return NextResponse.json(
        { success: false, error: 'Restroom ID is required' },
        { status: 400 }
      );
    }

    // Fetch reviews from Supabase
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restroom_id', restroomId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch reviews',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      count: reviews?.length || 0,
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
