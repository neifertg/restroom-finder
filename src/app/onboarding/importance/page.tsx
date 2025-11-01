'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Issue {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
}

interface IssueResponse {
  issueId: string;
  position: number;
}

export default function ImportancePage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [responses, setResponses] = useState<IssueResponse[]>([]);
  const [importanceRatings, setImportanceRatings] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const MAX_PER_ISSUE = 10;

  useEffect(() => {
    // Check if user has completed previous steps
    const zipCode = localStorage.getItem('votered_zip_code');
    const quizResponses = localStorage.getItem('votered_quiz_responses');

    if (!zipCode) {
      router.push('/onboarding/zip-code');
      return;
    }

    if (!quizResponses) {
      router.push('/onboarding/quiz');
      return;
    }

    try {
      const parsedResponses = JSON.parse(quizResponses);
      setResponses(parsedResponses);
      fetchIssues();
    } catch (err) {
      setError('Failed to load your responses. Please try again.');
      console.error('Error parsing responses:', err);
      setIsLoading(false);
    }
  }, [router]);

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      const data = await response.json();

      if (data.success && data.issues) {
        setIssues(data.issues);
        // Initialize all issues with 0 points
        const initialMap = new Map<string, number>();
        data.issues.forEach((issue: Issue) => {
          initialMap.set(issue.id, 0);
        });
        setImportanceRatings(initialMap);
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

  const handleSliderChange = (issueId: string, value: number) => {
    setImportanceRatings(new Map(importanceRatings.set(issueId, value)));
    setError('');
  };

  const handleSubmit = () => {
    // Convert points (0-10) directly to importance scale
    const completeResponses = responses.map((response) => {
      const importance = importanceRatings.get(response.issueId) || 0;

      return {
        ...response,
        importance, // Use the slider value directly (0-10)
      };
    });

    // Save to localStorage
    localStorage.setItem('votered_complete_responses', JSON.stringify(completeResponses));

    // Navigate to results
    router.push('/results');
  };

  const handleBack = () => {
    router.push('/onboarding/quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-patriot-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-patriot-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                ✓
              </div>
              <span className="text-sm text-slate-600">Location</span>
            </div>
            <div className="flex-1 h-1 bg-patriot-blue-600 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-patriot-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                ✓
              </div>
              <span className="text-sm text-slate-600">Quiz</span>
            </div>
            <div className="flex-1 h-1 bg-patriot-blue-600 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-patriot-blue-700 text-white flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-medium text-slate-900">Priorities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Which issues matter most to you?
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Rate the importance of each issue on a scale from <strong>0 to 10</strong>, where 0 means not important at all and 10 means extremely important to your voting decision.
            </p>

            <div className="bg-patriot-blue-50 border border-patriot-blue-200 rounded-lg p-4">
              <p className="text-sm text-patriot-blue-900">
                <strong>Tip:</strong> You can rate multiple issues as highly important. This helps us match you with candidates who prioritize the same things you care about most.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {issues.map((issue) => {
              const currentValue = importanceRatings.get(issue.id) || 0;

              return (
                <div key={issue.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {issue.title}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                        {issue.category === 'local' ? 'Local' : 'State'}
                      </span>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-patriot-blue-700">
                        {currentValue}
                      </div>
                      <div className="text-xs text-slate-500">/ 10</div>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max={MAX_PER_ISSUE}
                      value={currentValue}
                      onChange={(e) => handleSliderChange(issue.id, parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-patriot-red-600"
                      style={{
                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentValue / MAX_PER_ISSUE) * 100}%, #e2e8f0 ${(currentValue / MAX_PER_ISSUE) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Not Important</span>
                    <span>Extremely Important</span>
                  </div>
                </div>
              );
            })}
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
              onClick={handleSubmit}
              className="flex-1 bg-patriot-red-600 hover:bg-patriot-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              See My Matches
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Almost done! Click "See My Matches" to view your results
          </p>
        </div>
      </main>
    </div>
  );
}
