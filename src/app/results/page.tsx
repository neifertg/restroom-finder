'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserResponse {
  issueId: string;
  position: number;
  importance: number;
}

interface CandidateMatch {
  id: string;
  name: string;
  office: string;
  party: string;
  bio: string;
  matchPercentage: number;
  agreementDetails: {
    issueId: string;
    userPosition: number;
    candidatePosition: number;
    importance: number;
    difference: number;
  }[];
}

interface Issue {
  id: string;
  title: string;
}

export default function ResultsPage() {
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // Get user data from localStorage
      const zipCode = localStorage.getItem('votered_zip_code');
      const responsesData = localStorage.getItem('votered_complete_responses');

      if (!zipCode || !responsesData) {
        router.push('/onboarding/zip-code');
        return;
      }

      const responses: UserResponse[] = JSON.parse(responsesData);

      // Fetch issues for display
      const issuesResponse = await fetch('/api/issues');
      const issuesData = await issuesResponse.json();
      if (issuesData.success) {
        setIssues(issuesData.issues);
      }

      // Fetch candidate matches
      const matchResponse = await fetch('/api/match-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode, responses }),
      });

      const matchData = await matchResponse.json();

      if (matchData.success) {
        setMatches(matchData.matches);
      } else {
        setError(matchData.error || 'Failed to load matches');
      }
    } catch (err) {
      setError('Failed to load results. Please try again.');
      console.error('Error loading results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-patriot-blue-800 bg-patriot-blue-100';
    if (percentage >= 60) return 'text-patriot-blue-700 bg-patriot-blue-50';
    if (percentage >= 40) return 'text-slate-700 bg-slate-100';
    return 'text-slate-600 bg-slate-50';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Strong Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Moderate Match';
    return 'Weak Match';
  };

  const getPositionLabel = (position: number) => {
    const labels = ['Strongly Oppose', 'Oppose', 'Neutral', 'Support', 'Strongly Support'];
    return labels[position - 1] || 'Unknown';
  };

  const getAgreementIcon = (difference: number) => {
    if (difference === 0) return '✓';
    if (difference <= 1) return '≈';
    return '✗';
  };

  const getAgreementColor = (difference: number) => {
    if (difference === 0) return 'text-patriot-blue-700';
    if (difference <= 1) return 'text-slate-600';
    return 'text-patriot-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-patriot-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Calculating your matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <Link
            href="/onboarding/zip-code"
            className="inline-block bg-patriot-red-600 hover:bg-patriot-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-block mb-4 text-patriot-blue-700 hover:text-patriot-blue-800 font-semibold">
              ← VoterEd
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Your Candidate Matches
            </h1>
            <p className="text-lg text-slate-600">
              Based on your values and issue priorities
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {matches.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-lg text-slate-600 mb-4">
                No candidates found for your area yet. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block bg-patriot-red-600 hover:bg-patriot-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Return Home
              </Link>
            </div>
          ) : (
            <>
              {/* Candidate Cards */}
              <div className="space-y-6 mb-8">
                {matches.map((candidate) => {
                  const isExpanded = selectedCandidate === candidate.id;
                  const issueMap = new Map(issues.map((i) => [i.id, i.title]));

                  return (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        {/* Candidate Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">
                              {candidate.name}
                            </h2>
                            <p className="text-slate-600 mb-2">{candidate.office}</p>
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                              {candidate.party}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-2xl ${getMatchColor(candidate.matchPercentage)}`}>
                              {candidate.matchPercentage}%
                            </div>
                            <p className={`text-sm font-medium mt-1 ${getMatchColor(candidate.matchPercentage).split(' ')[0]}`}>
                              {getMatchLabel(candidate.matchPercentage)}
                            </p>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-slate-700 mb-4">{candidate.bio}</p>

                        {/* Toggle Details */}
                        <button
                          onClick={() => setSelectedCandidate(isExpanded ? null : candidate.id)}
                          className="text-patriot-blue-700 hover:text-patriot-blue-800 font-semibold flex items-center gap-2"
                        >
                          {isExpanded ? 'Hide' : 'Show'} detailed breakdown
                          <svg
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Detailed Breakdown */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4">
                              Issue-by-Issue Comparison
                            </h3>
                            <div className="space-y-3">
                              {candidate.agreementDetails.map((detail) => {
                                const issueTitle = issueMap.get(detail.issueId) || 'Unknown Issue';

                                return (
                                  <div key={detail.issueId} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className={`text-2xl ${getAgreementColor(detail.difference)}`}>
                                      {getAgreementIcon(detail.difference)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-slate-900 mb-1">{issueTitle}</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="text-slate-600">Your position:</span>
                                          <p className="font-medium text-slate-900">{getPositionLabel(detail.userPosition)}</p>
                                        </div>
                                        <div>
                                          <span className="text-slate-600">Candidate position:</span>
                                          <p className="font-medium text-slate-900">{getPositionLabel(detail.candidatePosition)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      localStorage.removeItem('votered_zip_code');
                      localStorage.removeItem('votered_quiz_responses');
                      localStorage.removeItem('votered_complete_responses');
                      router.push('/onboarding/zip-code');
                    }}
                    className="w-full px-6 py-3 border-2 border-patriot-blue-600 text-patriot-blue-700 hover:bg-patriot-blue-50 font-semibold rounded-lg transition-colors"
                  >
                    Retake Quiz
                  </button>
                  <Link
                    href="/"
                    className="block w-full px-6 py-3 text-center border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>VoterEd is a non-partisan educational platform.</p>
          <p className="mt-2">We do not endorse candidates or political parties.</p>
        </div>
      </footer>
    </div>
  );
}
