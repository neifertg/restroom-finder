export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Welcome to VoterEd
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your comprehensive voter education platform
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600">
              Learn about candidates, issues, and make informed decisions for your community.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
