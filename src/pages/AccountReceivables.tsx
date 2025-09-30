import React from 'react';

const AccountReceivables: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Account Receivables</h1>
        <p className="text-gray-600">Track outstanding payments and customer credit management</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Receivables Management</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive tracking of outstanding invoices, aging reports, and customer payment history.
          </p>
          <div className="text-sm text-gray-500">
            Page structure ready - receivables analytics coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountReceivables;