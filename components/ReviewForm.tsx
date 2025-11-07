'use client';

import { useState } from 'react';
import { ReviewFormData } from '@/types';

interface ReviewFormProps {
  restroomId: string;
  onSubmit: (review: ReviewFormData) => Promise<void>;
  onCancel: () => void;
}

const StarRating = ({
  rating,
  onRatingChange,
  label
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors hover:scale-110 transform"
          >
            <svg
              className={`w-8 h-8 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
              fill={star <= rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 self-center">{rating}/5</span>
      </div>
    </div>
  );
};

export default function ReviewForm({ restroomId, onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    cleanliness_rating: 0,
    privacy_rating: 0,
    availability_rating: 0,
    comment: '',
    user_name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('Please provide an overall rating');
      return;
    }
    if (formData.cleanliness_rating === 0 || formData.privacy_rating === 0 || formData.availability_rating === 0) {
      setError('Please rate all categories');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Experience</h3>

        {/* Overall Rating */}
        <StarRating
          label="Overall Rating *"
          rating={formData.rating}
          onRatingChange={(rating) => setFormData({ ...formData, rating })}
        />
      </div>

      {/* Category Ratings */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium text-gray-900">Detailed Ratings *</h4>

        <StarRating
          label="Cleanliness"
          rating={formData.cleanliness_rating}
          onRatingChange={(cleanliness_rating) => setFormData({ ...formData, cleanliness_rating })}
        />

        <StarRating
          label="Privacy"
          rating={formData.privacy_rating}
          onRatingChange={(privacy_rating) => setFormData({ ...formData, privacy_rating })}
        />

        <StarRating
          label="Availability"
          rating={formData.availability_rating}
          onRatingChange={(availability_rating) => setFormData({ ...formData, availability_rating })}
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Share your experience to help others..."
        />
      </div>

      {/* Name (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Anonymous"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
