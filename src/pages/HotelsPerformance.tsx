import React from 'react';

const HotelsPerformance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Hotels Performance</h1>
        <p className="text-gray-600">Multi-hotel performance comparison and analysis</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Hotel Performance Dashboard</h3>
          <p className="text-gray-600 mb-4">
            Compare performance metrics across multiple hotels with side-by-side analysis and benchmarking.
          </p>
          <div className="text-sm text-gray-500">
            Page structure ready - hotel comparison coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsPerformance;