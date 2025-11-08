'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Restroom } from '@/types';
import { formatDistance } from '@/lib/distance';
import GoogleMapComponent from '@/components/Map/GoogleMap';

type ViewMode = 'list' | 'map';

function MapPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    if (!lat || !lng) {
      setError('Location not provided');
      setLoading(false);
      return;
    }

    fetchRestrooms();
  }, [lat, lng]);

  const fetchRestrooms = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/restrooms?lat=${lat}&lng=${lng}&radius=5`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch restrooms');
      }

      setRestrooms(data.restrooms);

      if (data.restrooms.length === 0) {
        setError('No restrooms found within 5 miles of your location');
      }
    } catch (err) {
      console.error('Error fetching restrooms:', err);
      setError(err instanceof Error ? err.message : 'Failed to load restrooms');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (restroom: Restroom) => {
    // Open Google Maps directions in a new tab
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restroom.latitude},${restroom.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Nearby Restrooms</h1>
            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Finding restrooms near you...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Unable to Load Restrooms</h3>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={fetchRestrooms}
                    className="mt-4 text-sm font-medium text-red-700 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map View */}
        {!loading && !error && restrooms.length > 0 && viewMode === 'map' && lat && lng && (
          <div className="h-[calc(100vh-10rem)]">
            <GoogleMapComponent
              center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
              restrooms={restrooms}
              selectedRestroom={selectedRestroom}
              onMarkerClick={setSelectedRestroom}
              onInfoWindowClose={() => setSelectedRestroom(null)}
            />
          </div>
        )}

        {/* Restrooms List */}
        {!loading && !error && restrooms.length > 0 && viewMode === 'list' && (
          <div className="max-w-4xl mx-auto">
            {/* Results Count */}
            <div className="mb-4 text-gray-600">
              Found <span className="font-semibold text-gray-900">{restrooms.length}</span> restroom{restrooms.length !== 1 ? 's' : ''} nearby
            </div>

            {/* Restroom Cards */}
            <div className="space-y-4">
              {restrooms.map((restroom) => (
                <div
                  key={restroom.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {restroom.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{restroom.address}</p>

                        {/* Tags/Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {restroom.is_accessible && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Accessible
                            </span>
                          )}
                          {restroom.is_gender_neutral && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              Gender Neutral
                            </span>
                          )}
                          {restroom.distance !== undefined && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {formatDistance(restroom.distance)}
                            </span>
                          )}
                        </div>

                        {/* Additional Info */}
                        {restroom.hours && (
                          <p className="text-sm text-gray-500 mb-3">
                            <span className="font-medium">Note:</span> {restroom.hours}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleGetDirections(restroom)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Get Directions
                      </button>
                      <button
                        onClick={() => setSelectedRestroom(restroom)}
                        className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRestroom && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedRestroom(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedRestroom.name}</h2>
              <button
                onClick={() => setSelectedRestroom(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                <p className="text-gray-900">{selectedRestroom.address}</p>
              </div>

              {selectedRestroom.distance !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Distance</h3>
                  <p className="text-gray-900">{formatDistance(selectedRestroom.distance)} away</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRestroom.is_accessible && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Accessible
                    </span>
                  )}
                  {selectedRestroom.is_gender_neutral && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      Gender Neutral
                    </span>
                  )}
                  {!selectedRestroom.is_accessible && !selectedRestroom.is_gender_neutral && (
                    <span className="text-gray-500 text-sm">No additional features listed</span>
                  )}
                </div>
              </div>

              {selectedRestroom.hours && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Additional Information</h3>
                  <p className="text-gray-900">{selectedRestroom.hours}</p>
                </div>
              )}

              <button
                onClick={() => handleGetDirections(selectedRestroom)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions in Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
