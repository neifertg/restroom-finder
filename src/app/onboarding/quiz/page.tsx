'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Issue {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
}

interface IssueResponse {
  issueId: string;
  position: number; // 1-5 scale
}

export default function QuizPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<IssueResponse[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user has entered zip code
    const zipCode = localStorage.getItem('votered_zip_code');
    if (!zipCode) {
      router.push('/onboarding/zip-code');
      return;
    }

    // Fetch issues
    fetchIssues();
  }, [router]);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      const data = await response.json();

      if (data.success && data.issues) {
        setIssues(data.issues);
      } else {
        setError('Failed to load issues. Please try again.');
      }
    } catch (err) {
      setError('Failed to load issues. Please try again.');
      console.error('Error fetching issues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePositionSelect = (position: number) => {
    setSelectedPosition(position);
  };

  const handleNext = () => {
    if (selectedPosition === null) return;

    const currentIssue = issues[currentQuestionIndex];
    const newResponse: IssueResponse = {
      issueId: currentIssue.id,
      position: selectedPosition,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    if (currentQuestionIndex < issues.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedPosition(null);
    } else {
      // Quiz complete, save responses and move to importance ranking
      localStorage.setItem('votered_quiz_responses', JSON.stringify(updatedResponses));
      router.push('/onboarding/importance');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Restore previous response
      const previousResponse = responses[currentQuestionIndex - 1];
      setSelectedPosition(previousResponse?.position ?? null);
      // Remove last response
      setResponses(responses.slice(0, -1));
    } else {
      router.push('/onboarding/zip-code');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error || issues.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800">{error || 'No issues found.'}</p>
          </div>
          <Link
            href="/onboarding/zip-code"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const currentIssue = issues[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / issues.length) * 100;

  const positionLabels = [
    { value: 1, label: 'Strongly Oppose' },
    { value: 2, label: 'Oppose' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Support' },
    { value: 5, label: 'Strongly Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">
                Question {currentQuestionIndex + 1} of {issues.length}
              </span>
              <span className="text-sm text-slate-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-patriot-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-patriot-blue-100 text-patriot-blue-800 text-sm font-medium rounded-full">
                {currentIssue.category === 'local' ? 'Local Issue' : 'State Issue'}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {currentIssue.title}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              {currentIssue.description}
            </p>

            {/* Position Options */}
            <div className="space-y-3 mb-8">
              {positionLabels.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePositionSelect(option.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedPosition === option.value
                      ? 'border-patriot-blue-600 bg-patriot-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-patriot-blue-300 hover:bg-patriot-blue-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        selectedPosition === option.value
                          ? 'text-patriot-blue-900'
                          : 'text-slate-900'
                      }`}
                    >
                      {option.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPosition === option.value
                          ? 'border-patriot-blue-600 bg-patriot-blue-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPosition === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedPosition === null}
                className="flex-1 bg-patriot-red-600 hover:bg-patriot-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {currentQuestionIndex < issues.length - 1 ? 'Next Question' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Your responses are private and stored locally on your device
          </p>
        </div>
      </main>
    </div>
  );
}
