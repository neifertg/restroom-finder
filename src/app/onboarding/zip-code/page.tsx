'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ZipCodePage() {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const trimmedZipCode = zipCode.trim();

    if (!trimmedZipCode) {
      setError('Please enter your zip code');
      setIsLoading(false);
      return;
    }

    // Validate zip code format
    if (!/^\d{5}$/.test(trimmedZipCode)) {
      setError('Please enter a valid 5-digit zip code');
      setIsLoading(false);
      return;
    }

    // Store zip code for backward compatibility
    localStorage.setItem('votered_zip_code', trimmedZipCode);
    localStorage.setItem('votered_address', trimmedZipCode);

    // Navigate to quiz
    router.push('/onboarding/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-patriot-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-sm font-medium text-slate-900">Your Location</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-sm text-slate-600">Issue Quiz</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm text-slate-600">Your Matches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What's your zip code?
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              We'll use your zip code to show you relevant candidates and ballot measures.
              Your information is never stored or shared.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-slate-900 mb-2"
                >
                  Your Zip Code
                </label>
                <div className="relative">
                  <input
                    id="zipCode"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="e.g., 20148"
                    maxLength={5}
                    className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-patriot-blue-500 focus:border-patriot-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Enter your 5-digit zip code
                </p>
              </div>

              {error && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm font-medium text-amber-900">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !zipCode.trim()}
                className="w-full bg-patriot-red-600 hover:bg-patriot-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-lg px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? 'Validating...' : 'Continue to Quiz'}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-slate-500">Your zip code is used only to find your ballot and is not stored</span>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">
                Currently Available In:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 text-sm">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Loudoun County, Virginia
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lincoln County, North Carolina
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lehi, Utah
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Katy, Texas
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cape May County, New Jersey
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Andover, Kansas
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-patriot-blue-700 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bear Lake, Michigan
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Takes about 5 minutes • No account required
          </p>
        </div>
      </main>
    </div>
  );
}
