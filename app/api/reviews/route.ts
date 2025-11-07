import { NextRequest, NextResponse } from 'next/server';

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

    // For now, we'll return success without persisting to a database
    // In a real app, you would save this to your database here
    const review = {
      id: Date.now().toString(),
      restroom_id,
      user_name: user_name || 'Anonymous',
      rating,
      cleanliness_rating,
      privacy_rating,
      availability_rating,
      comment: comment || '',
      created_at: new Date().toISOString(),
    };

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

    // For now, return mock reviews
    // In a real app, you would fetch from your database
    const mockReviews = [
      {
        id: '1',
        restroom_id: restroomId,
        user_name: 'Sarah M.',
        rating: 5,
        cleanliness_rating: 5,
        privacy_rating: 4,
        availability_rating: 5,
        comment: 'Very clean and well-maintained. Easy to find.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: '2',
        restroom_id: restroomId,
        user_name: 'Anonymous',
        rating: 4,
        cleanliness_rating: 4,
        privacy_rating: 5,
        availability_rating: 3,
        comment: 'Good facilities, sometimes busy during peak hours.',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      reviews: mockReviews,
      count: mockReviews.length,
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
