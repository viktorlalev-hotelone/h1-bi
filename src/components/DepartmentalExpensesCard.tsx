import React, { useState } from 'react';
import ExpenseKPICard from './ExpenseKPICard';
import Modal from './Modal';
import { parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';

interface ComparisonData {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface DepartmentalExpensesCardProps {
  onHelpClick?: () => void;
}

const DepartmentalExpensesCard: React.FC<DepartmentalExpensesCardProps> = ({ onHelpClick }) => {
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  // Mock data for main Departmental Expenses card
  const mainExpenseData = {
    yesterday: {
      absolute: 12500, // Expense increase
      vsPrior: { value: 8.3, type: 'negative' as const },
      vsBudget: { value: -2.1, type: 'positive' as const },
      vsForecast: { value: 4.7, type: 'negative' as const }
    },
    lock: {
      current: 2850000,
      vsPrior: { value: 6.8, type: 'negative' as const },
      vsBudget: { value: -1.5, type: 'positive' as const },
      vsForecast: { value: 3.2, type: 'negative' as const }
    },
    unlck: {
      current: 450000,
      vsPrior: { value: 12.4, type: 'negative' as const },
      vsBudget: { value: 5.8, type: 'negative' as const },
      vsForecast: { value: -2.3, type: 'positive' as const }
    },
    total: {
      current: 3300000,
      vsPrior: { value: 7.9, type: 'negative' as const },
      vsBudget: { value: 0.8, type: 'negative' as const },
      vsForecast: { value: 2.1, type: 'negative' as const }
    }
  };

  // Mock data for breakdown cards
  const undistributedExpensesData = {
    yesterday: {
      absolute: 3200,
      vsPrior: { value: 5.4, type: 'negative' as const },
      vsBudget: { value: -1.8, type: 'positive' as const },
      vsForecast: { value: 2.9, type: 'negative' as const }
    },
    lock: {
      current: 850000,
      vsPrior: { value: 4.2, type: 'negative' as const },
      vsBudget: { value: -0.8, type: 'positive' as const },
      vsForecast: { value: 1.9, type: 'negative' as const }
    },
    unlck: {
      current: 125000,
      vsPrior: { value: 8.7, type: 'negative' as const },
      vsBudget: { value: 3.4, type: 'negative' as const },
      vsForecast: { value: -1.2, type: 'positive' as const }
    },
    total: {
      current: 975000,
      vsPrior: { value: 5.1, type: 'negative' as const },
      vsBudget: { value: 0.9, type: 'negative' as const },
      vsForecast: { value: 1.4, type: 'negative' as const }
    }
  };

  const payrollExpensesData = {
    yesterday: {
      absolute: 4800,
      vsPrior: { value: 7.2, type: 'negative' as const },
      vsBudget: { value: -0.5, type: 'positive' as const },
      vsForecast: { value: 3.8, type: 'negative' as const }
    },
    lock: {
      current: 1200000,
      vsPrior: { value: 5.9, type: 'negative' as const },
      vsBudget: { value: -1.2, type: 'positive' as const },
      vsForecast: { value: 2.4, type: 'negative' as const }
    },
    unlck: {
      current: 180000,
      vsPrior: { value: 9.8, type: 'negative' as const },
      vsBudget: { value: 4.1, type: 'negative' as const },
      vsForecast: { value: -0.8, type: 'positive' as const }
    },
    total: {
      current: 1380000,
      vsPrior: { value: 6.4, type: 'negative' as const },
      vsBudget: { value: 0.3, type: 'negative' as const },
      vsForecast: { value: 1.9, type: 'negative' as const }
    }
  };

  const fbExpensesData = {
    yesterday: {
      absolute: 2800,
      vsPrior: { value: 6.1, type: 'negative' as const },
      vsBudget: { value: -2.3, type: 'positive' as const },
      vsForecast: { value: 1.7, type: 'negative' as const }
    },
    lock: {
      current: 420000,
      vsPrior: { value: 4.8, type: 'negative' as const },
      vsBudget: { value: -1.9, type: 'positive' as const },
      vsForecast: { value: 0.9, type: 'negative' as const }
    },
    unlck: {
      current: 85000,
      vsPrior: { value: 11.2, type: 'negative' as const },
      vsBudget: { value: 6.3, type: 'negative' as const },
      vsForecast: { value: -3.1, type: 'positive' as const }
    },
    total: {
      current: 505000,
      vsPrior: { value: 5.7, type: 'negative' as const },
      vsBudget: { value: 1.2, type: 'negative' as const },
      vsForecast: { value: 0.4, type: 'negative' as const }
    }
  };

  const utilitiesExpensesData = {
    yesterday: {
      absolute: 1700,
      vsPrior: { value: 9.4, type: 'negative' as const },
      vsBudget: { value: -3.2, type: 'positive' as const },
      vsForecast: { value: 5.1, type: 'negative' as const }
    },
    lock: {
      current: 380000,
      vsPrior: { value: 7.3, type: 'negative' as const },
      vsBudget: { value: -2.1, type: 'positive' as const },
      vsForecast: { value: 2.8, type: 'negative' as const }
    },
    unlck: {
      current: 60000,
      vsPrior: { value: 14.5, type: 'negative' as const },
      vsBudget: { value: 8.2, type: 'negative' as const },
      vsForecast: { value: -1.9, type: 'positive' as const }
    },
    total: {
      current: 440000,
      vsPrior: { value: 8.1, type: 'negative' as const },
      vsBudget: { value: 1.4, type: 'negative' as const },
      vsForecast: { value: 2.2, type: 'negative' as const }
    }
  };

  return (
    <>
      <ExpenseKPICard
        title="Departmental Expenses"
        yesterdayData={mainExpenseData.yesterday}
        lockData={mainExpenseData.lock}
        unlckData={mainExpenseData.unlck}
        totalData={mainExpenseData.total}
        onHelpClick={onHelpClick}
        hasDropdown={true}
        onDropdownClick={() => setShowBreakdownModal(true)}
      />

      {/* Expense Breakdown Modal */}
      <Modal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        title="Departmental Expenses Breakdown"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          <ExpenseKPICard
            title="Undistributed Expenses"
            yesterdayData={undistributedExpensesData.yesterday}
            lockData={undistributedExpensesData.lock}
            unlckData={undistributedExpensesData.unlck}
            totalData={undistributedExpensesData.total}
            onHelpClick={() => {/* Handle help for undistributed expenses */}}
          />
          <ExpenseKPICard
            title="Payroll Expenses"
            yesterdayData={payrollExpensesData.yesterday}
            lockData={payrollExpensesData.lock}
            unlckData={payrollExpensesData.unlck}
            totalData={payrollExpensesData.total}
            onHelpClick={() => {/* Handle help for payroll expenses */}}
          />
          <ExpenseKPICard
            title="F&B Expenses"
            yesterdayData={fbExpensesData.yesterday}
            lockData={fbExpensesData.lock}
            unlckData={fbExpensesData.unlck}
            totalData={fbExpensesData.total}
            onHelpClick={() => {/* Handle help for F&B expenses */}}
          />
          <ExpenseKPICard
            title="Utilities Expenses"
            yesterdayData={utilitiesExpensesData.yesterday}
            lockData={utilitiesExpensesData.lock}
            unlckData={utilitiesExpensesData.unlck}
            totalData={utilitiesExpensesData.total}
            onHelpClick={() => {/* Handle help for utilities expenses */}}
          />
        </div>
      </Modal>
    </>
  );
};

export default DepartmentalExpensesCard;