import React from 'react';

const Blocks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Blocks Analytics</h1>
        <p className="text-gray-600">Analyze room blocks, group reservations and pickup rates by company</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Blocks Management</h3>
          <p className="text-gray-600 mb-4">
            Track room blocks, monitor pickup rates, and analyze group booking performance by tour operators.
          </p>
          <div className="text-sm text-gray-500">
            Page structure ready - blocks analytics coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocks;