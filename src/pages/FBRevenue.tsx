import React from 'react';

const FBRevenue: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">F&B Revenue</h1>
        <p className="text-gray-600">Food & Beverage revenue analysis and performance metrics</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H17M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Food & Beverage Analytics</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive analysis of restaurant, bar, and catering revenue streams with detailed performance metrics.
          </p>
          <div className="text-sm text-gray-500">
            Page structure ready - F&B analytics coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default FBRevenue;