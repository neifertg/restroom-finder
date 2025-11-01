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

  const TOTAL_POINTS = 100;
  const MAX_PER_ISSUE = 20;

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
        // Initialize all issues with equal points
        const initialMap = new Map<string, number>();
        const equalPoints = Math.floor(TOTAL_POINTS / data.issues.length);
        data.issues.forEach((issue: Issue) => {
          initialMap.set(issue.id, equalPoints);
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

  const getTotalAllocated = () => {
    return Array.from(importanceRatings.values()).reduce((sum, val) => sum + val, 0);
  };

  const handlePointChange = (issueId: string, change: number) => {
    const currentValue = importanceRatings.get(issueId) || 0;
    const newValue = Math.max(0, Math.min(MAX_PER_ISSUE, currentValue + change));
    const totalOthers = getTotalAllocated() - currentValue;

    // Only allow change if it doesn't exceed total budget
    if (totalOthers + newValue <= TOTAL_POINTS) {
      setImportanceRatings(new Map(importanceRatings.set(issueId, newValue)));
      setError('');
    } else {
      setError(`You only have ${TOTAL_POINTS - totalOthers} points remaining to allocate.`);
    }
  };

  const handleSubmit = () => {
    const totalAllocated = getTotalAllocated();

    // Recommend using most points
    if (totalAllocated < TOTAL_POINTS * 0.8) {
      setError(`You've only used ${totalAllocated} of ${TOTAL_POINTS} points. Consider allocating more points to issues that matter to you.`);
      return;
    }

    // Convert points to importance scale (1-5) based on allocation
    const completeResponses = responses.map((response) => {
      const points = importanceRatings.get(response.issueId) || 0;
      // Convert 0-20 points to 1-5 importance scale
      let importance = 1;
      if (points >= 16) importance = 5;
      else if (points >= 12) importance = 4;
      else if (points >= 8) importance = 3;
      else if (points >= 4) importance = 2;

      return {
        ...response,
        importance,
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

  const totalAllocated = getTotalAllocated();
  const remainingPoints = TOTAL_POINTS - totalAllocated;
  const progressPercentage = (totalAllocated / TOTAL_POINTS) * 100;

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
              You have <strong>{TOTAL_POINTS} points</strong> to allocate. Distribute them across issues based on how important each one is to your voting decision.
            </p>

            {/* Points Budget Display */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Points Allocated</span>
                <span className={`text-2xl font-bold ${remainingPoints === 0 ? 'text-patriot-blue-700' : 'text-slate-900'}`}>
                  {totalAllocated} / {TOTAL_POINTS}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPercentage > 100 ? 'bg-patriot-red-600' : 'bg-patriot-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                />
              </div>
              {remainingPoints > 0 && (
                <p className="text-sm text-patriot-blue-700 mt-2 font-medium">
                  {remainingPoints} points remaining
                </p>
              )}
            </div>

            <div className="bg-patriot-blue-50 border border-patriot-blue-200 rounded-lg p-4">
              <p className="text-sm text-patriot-blue-900">
                <strong>Understanding Trade-offs:</strong> In real life, governments have limited budgets and time. By allocating points, you're showing which issues you'd prioritize if candidates had to choose where to focus their efforts.
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
              const currentPoints = importanceRatings.get(issue.id) || 0;
              const barWidth = (currentPoints / MAX_PER_ISSUE) * 100;

              return (
                <div key={issue.id} className="bg-white rounded-xl shadow-md p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {issue.title}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                        {issue.category === 'local' ? 'Local' : 'State'}
                      </span>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-patriot-blue-700">
                        {currentPoints}
                      </div>
                      <div className="text-xs text-slate-600">points</div>
                    </div>
                  </div>

                  {/* Visual bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-patriot-red-600 transition-all duration-200"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* Point allocation buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePointChange(issue.id, -5)}
                      disabled={currentPoints === 0}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handlePointChange(issue.id, -1)}
                      disabled={currentPoints === 0}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                      -1
                    </button>
                    <div className="flex-1 text-center text-sm text-slate-600">
                      Max {MAX_PER_ISSUE} points
                    </div>
                    <button
                      onClick={() => handlePointChange(issue.id, 1)}
                      disabled={currentPoints >= MAX_PER_ISSUE || remainingPoints === 0}
                      className="px-4 py-2 bg-patriot-blue-100 hover:bg-patriot-blue-200 disabled:bg-slate-50 disabled:text-slate-300 text-patriot-blue-800 font-semibold rounded-lg transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePointChange(issue.id, 5)}
                      disabled={currentPoints >= MAX_PER_ISSUE || remainingPoints < 5}
                      className="px-4 py-2 bg-patriot-blue-100 hover:bg-patriot-blue-200 disabled:bg-slate-50 disabled:text-slate-300 text-patriot-blue-800 font-semibold rounded-lg transition-colors"
                    >
                      +5
                    </button>
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
