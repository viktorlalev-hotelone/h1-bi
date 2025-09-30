import React from 'react';

const RoomsOutOfSales: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Rooms out of Sales</h1>
        <p className="text-gray-600">Monitor rooms unavailable for sale due to maintenance or other reasons</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Out of Order Room Management</h3>
          <p className="text-gray-600 mb-4">
            Track rooms that are temporarily unavailable for sale, maintenance schedules, and revenue impact analysis.
          </p>
          <div className="text-sm text-gray-500">
            Page structure ready - room availability tracking coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsOutOfSales;