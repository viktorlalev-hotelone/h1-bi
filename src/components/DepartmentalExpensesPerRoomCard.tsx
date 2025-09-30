import React, { useState } from 'react';
import ExpenseKPICard from './ExpenseKPICard';
import Modal from './Modal';
import { Lock, X } from 'lucide-react';
import { parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';

interface ComparisonData {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface DepartmentalExpensesPerRoomCardProps {
  onHelpClick?: () => void;
}

const DepartmentalExpensesPerRoomCard: React.FC<DepartmentalExpensesPerRoomCardProps> = ({ onHelpClick }) => {
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showLockMonthsModal, setShowLockMonthsModal] = useState(false);

  // Lock months data
  const lockMonths = [
    { month: 'January', locked: true },
    { month: 'February', locked: true },
    { month: 'March', locked: true },
    { month: 'April', locked: true },
    { month: 'May', locked: true },
    { month: 'June', locked: true },
    { month: 'July', locked: false },
    { month: 'August', locked: false },
    { month: 'September', locked: false },
    { month: 'October', locked: false },
    { month: 'November', locked: false },
    { month: 'December', locked: false }
  ];

  // Generate tooltip string for all lock months
  const allLockMonthsTooltipString = lockMonths
    .map(m => `${m.month}: ${m.locked ? 'Locked' : 'Unlocked'}`)
    .join('\\n');

  // Mock data for main Departmental Expenses per Room card
  const mainExpenseData = {
    yesterday: {
      hadLockedUpdateYesterday: true, // New month was locked yesterday
      yesterdayDeltaLocked: 2.15,
      vsPrior: { value: 6.8, type: 'negative' as const },
      vsBudget: { value: -1.2, type: 'positive' as const },
      vsForecast: { value: 3.4, type: 'negative' as const }
    },
    lock: {
      current: 89.45,
      vsPrior: { value: 5.2, type: 'negative' as const },
      vsBudget: { value: -0.8, type: 'positive' as const },
      vsForecast: { value: 2.1, type: 'negative' as const }
    },
    unlck: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    },
    total: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    }
  };

  // Mock data for breakdown cards
  const undistributedExpensesPerRoomData = {
    yesterday: {
      hadLockedUpdateYesterday: false, // No new month was locked yesterday
      yesterdayDeltaLocked: 0,
      vsPrior: { value: 4.2, type: 'negative' as const },
      vsBudget: { value: -1.1, type: 'positive' as const },
      vsForecast: { value: 2.3, type: 'negative' as const }
    },
    lock: {
      current: 28.50,
      vsPrior: { value: 3.8, type: 'negative' as const },
      vsBudget: { value: -0.5, type: 'positive' as const },
      vsForecast: { value: 1.7, type: 'negative' as const }
    },
    unlck: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    },
    total: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    }
  };

  const payrollExpensesPerRoomData = {
    yesterday: {
      hadLockedUpdateYesterday: true, // New month was locked yesterday
      yesterdayDeltaLocked: 0.95,
      vsPrior: { value: 5.8, type: 'negative' as const },
      vsBudget: { value: -0.3, type: 'positive' as const },
      vsForecast: { value: 2.9, type: 'negative' as const }
    },
    lock: {
      current: 35.20,
      vsPrior: { value: 4.5, type: 'negative' as const },
      vsBudget: { value: -0.7, type: 'positive' as const },
      vsForecast: { value: 1.9, type: 'negative' as const }
    },
    unlck: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    },
    total: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    }
  };

  const fbExpensesPerRoomData = {
    yesterday: {
      hadLockedUpdateYesterday: true, // New month was locked yesterday
      yesterdayDeltaLocked: 0.25,
      vsPrior: { value: 3.1, type: 'negative' as const },
      vsBudget: { value: -1.8, type: 'positive' as const },
      vsForecast: { value: 1.2, type: 'negative' as const }
    },
    lock: {
      current: 15.75,
      vsPrior: { value: 2.8, type: 'negative' as const },
      vsBudget: { value: -1.2, type: 'positive' as const },
      vsForecast: { value: 0.9, type: 'negative' as const }
    },
    unlck: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    },
    total: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    }
  };

  const utilitiesExpensesPerRoomData = {
    yesterday: {
      hadLockedUpdateYesterday: false, // No new month was locked yesterday
      yesterdayDeltaLocked: 0,
      vsPrior: { value: 7.2, type: 'negative' as const },
      vsBudget: { value: -2.1, type: 'positive' as const },
      vsForecast: { value: 4.1, type: 'negative' as const }
    },
    lock: {
      current: 10.00,
      vsPrior: { value: 6.1, type: 'negative' as const },
      vsBudget: { value: -1.5, type: 'positive' as const },
      vsForecast: { value: 2.8, type: 'negative' as const }
    },
    unlck: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    },
    total: {
      current: null,
      vsPrior: { value: 0, type: 'neutral' as const },
      vsBudget: { value: 0, type: 'neutral' as const },
      vsForecast: { value: 0, type: 'neutral' as const }
    }
  };

  return (
    <>
      <ExpenseKPICard
        title="Departmental Expenses per Room"
        yesterdayData={mainExpenseData.yesterday}
        lockData={mainExpenseData.lock}
        unlckData={mainExpenseData.unlck}
        totalData={mainExpenseData.total}
        onHelpClick={onHelpClick}
        hasDropdown={true}
        onDropdownClick={() => setShowBreakdownModal(true)}
        showLockIconForUnlck={true}
        onShowLockMonthsDetails={() => setShowLockMonthsModal(true)}
        allLockMonthsTooltip={allLockMonthsTooltipString}
      />

      {/* Expense Breakdown Modal */}
      <Modal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        title="Departmental Expenses per Room Breakdown"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          <ExpenseKPICard
            title="Undistributed Expenses per Room"
            yesterdayData={undistributedExpensesPerRoomData.yesterday}
            lockData={undistributedExpensesPerRoomData.lock}
            unlckData={undistributedExpensesPerRoomData.unlck}
            totalData={undistributedExpensesPerRoomData.total}
            showLockIconForUnlck={true}
            onShowLockMonthsDetails={() => setShowLockMonthsModal(true)}
            allLockMonthsTooltip={allLockMonthsTooltipString}
          />
          <ExpenseKPICard
            title="Payroll Expenses per Room"
            yesterdayData={payrollExpensesPerRoomData.yesterday}
            lockData={payrollExpensesPerRoomData.lock}
            unlckData={payrollExpensesPerRoomData.unlck}
            totalData={payrollExpensesPerRoomData.total}
            showLockIconForUnlck={true}
            onShowLockMonthsDetails={() => setShowLockMonthsModal(true)}
            allLockMonthsTooltip={allLockMonthsTooltipString}
          />
          <ExpenseKPICard
            title="F&B Expenses per Room"
            yesterdayData={fbExpensesPerRoomData.yesterday}
            lockData={fbExpensesPerRoomData.lock}
            unlckData={fbExpensesPerRoomData.unlck}
            totalData={fbExpensesPerRoomData.total}
            showLockIconForUnlck={true}
            onShowLockMonthsDetails={() => setShowLockMonthsModal(true)}
            allLockMonthsTooltip={allLockMonthsTooltipString}
          />
          <ExpenseKPICard
            title="Utilities Expenses per Room"
            yesterdayData={utilitiesExpensesPerRoomData.yesterday}
            lockData={utilitiesExpensesPerRoomData.lock}
            unlckData={utilitiesExpensesPerRoomData.unlck}
            totalData={utilitiesExpensesPerRoomData.total}
            showLockIconForUnlck={true}
            onShowLockMonthsDetails={() => setShowLockMonthsModal(true)}
            allLockMonthsTooltip={allLockMonthsTooltipString}
          />
        </div>
      </Modal>

      {/* Lock Months Details Modal */}
      <Modal
        isOpen={showLockMonthsModal}
        onClose={() => setShowLockMonthsModal(false)}
        title="Lock/Unlock Status by Month"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            This shows which months are locked (finalized) and which are still open for changes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lockMonths.map((monthData, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg border ${
                  monthData.locked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  monthData.locked 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {monthData.locked ? <Lock size={12} /> : <X size={12} />}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{monthData.month}</div>
                  <div className={`text-xs ${
                    monthData.locked ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {monthData.locked ? 'Locked' : 'Unlocked'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Note:</strong> Values are only available for locked months. Unlocked months are still subject to changes and their final values are not yet determined.
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepartmentalExpensesPerRoomCard;