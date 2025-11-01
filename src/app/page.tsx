import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Vote Based on Your Values,{' '}
            <span className="text-patriot-blue-700">Not Party Lines</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
            Discover which candidates align with your views on the issues that matter most to you.
          </p>

          <Link
            href="/onboarding/zip-code"
            className="inline-block bg-patriot-red-600 hover:bg-patriot-red-700 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            Takes about 5 minutes • No account required
          </p>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            How VoterEd Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-patriot-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-patriot-blue-700">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Take a Quick Quiz
              </h3>
              <p className="text-slate-600">
                Answer 10 questions about local and state issues that matter to you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-patriot-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-patriot-red-700">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                See Your Matches
              </h3>
              <p className="text-slate-600">
                Compare your views with candidates running in your area.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-patriot-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-patriot-blue-700">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Make Informed Decisions
              </h3>
              <p className="text-slate-600">
                Vote for candidates who align with your values, not just their party.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why VoterEd?
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-patriot-blue-100 flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-patriot-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Unbiased & Neutral</h3>
                <p className="text-slate-600">We present all viewpoints fairly, without partisan bias.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-patriot-blue-100 flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-patriot-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Transparent Sources</h3>
                <p className="text-slate-600">Every candidate position is cited with reputable sources.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-patriot-blue-100 flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-patriot-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Issue-Based, Not Party-Based</h3>
                <p className="text-slate-600">Focus on what candidates believe, not which party they belong to.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-patriot-blue-100 flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-patriot-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Local Focus</h3>
                <p className="text-slate-600">Currently serving Loudoun County, VA and Lincoln County, NC.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/onboarding/zip-code"
            className="inline-block bg-patriot-red-600 hover:bg-patriot-red-700 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Matching with Candidates
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>VoterEd is a non-partisan educational platform.</p>
          <p className="mt-2">We do not endorse candidates or political parties.</p>
        </div>
      </footer>
    </div>
  );
}
