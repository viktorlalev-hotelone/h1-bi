import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { parseFormattedValue, parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';
import SevenDayPickupSparkline from './SevenDayPickupSparkline';
import Modal from './Modal';
import RevenueBreakdownCard from './RevenueBreakdownCard';

interface ComparisonData {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface NewTotalRevenueCardProps {
  onHelpClick?: () => void;
}

const NewTotalRevenueCard: React.FC<NewTotalRevenueCardProps> = ({ onHelpClick }) => {
  const [showBreakdownModal, setShowBreakdownModal] = React.useState(false);

  // Generate 7-day pickup data for sparkline using yesterday badge value
  const yesterdayBadgeValue = parseBadgeValue('38k'); // +38k from yesterday badge
  const sevenDayData = generateSevenDayPickupData('Total Revenue', yesterdayBadgeValue, false);

  // Mock data based on the image
  const yesterdayData = {
    absolute: 38000, // +38k
    vsPrior: { value: 12.4, type: 'positive' as const },
    vsBudget: { value: -3.2, type: 'negative' as const },
    vsForecast: { value: 5.8, type: 'positive' as const }
  };

  const ptdData = {
    current: 5775000, // 5.775m
    vsPrior: { value: 9.2, type: 'positive' as const },
    vsBudget: { value: 4.8, type: 'positive' as const },
    vsForecast: { value: 2.1, type: 'positive' as const }
  };

  const otbPtdData = {
    current: 2125000, // 2.125m
    vsPrior: { value: -5.3, type: 'negative' as const },
    vsBudget: { value: 8.7, type: 'positive' as const },
    vsForecast: { value: -1.9, type: 'negative' as const }
  };

  const totalData = {
    current: 7900000, // 7.9m
    vsPrior: { value: 6.8, type: 'positive' as const },
    vsBudget: { value: 5.9, type: 'positive' as const },
    vsForecast: { value: 1.2, type: 'positive' as const }
  };

  // Mock data for breakdown cards
  const roomsRevenueData = {
    yesterday: {
      absolute: 32000,
      vsPrior: { value: 15.2, type: 'positive' as const },
      vsBudget: { value: -1.8, type: 'negative' as const },
      vsForecast: { value: 6.4, type: 'positive' as const }
    },
    ptd: {
      current: 4850000,
      vsPrior: { value: 11.5, type: 'positive' as const },
      vsBudget: { value: 3.2, type: 'positive' as const },
      vsForecast: { value: 1.8, type: 'positive' as const }
    },
    otb: {
      current: 1950000,
      vsPrior: { value: -4.1, type: 'negative' as const },
      vsBudget: { value: 7.9, type: 'positive' as const },
      vsForecast: { value: -0.8, type: 'negative' as const }
    },
    total: {
      current: 6800000,
      vsPrior: { value: 8.2, type: 'positive' as const },
      vsBudget: { value: 4.8, type: 'positive' as const },
      vsForecast: { value: 1.5, type: 'positive' as const }
    }
  };

  const fbRevenueData = {
    yesterday: {
      absolute: 4500,
      vsPrior: { value: 8.7, type: 'positive' as const },
      vsBudget: { value: -5.4, type: 'negative' as const },
      vsForecast: { value: 3.2, type: 'positive' as const }
    },
    ptd: {
      current: 685000,
      vsPrior: { value: 6.8, type: 'positive' as const },
      vsBudget: { value: 2.1, type: 'positive' as const },
      vsForecast: { value: 0.9, type: 'positive' as const }
    },
    otb: {
      current: 125000,
      vsPrior: { value: -8.2, type: 'negative' as const },
      vsBudget: { value: 12.5, type: 'positive' as const },
      vsForecast: { value: -2.8, type: 'negative' as const }
    },
    total: {
      current: 810000,
      vsPrior: { value: 4.5, type: 'positive' as const },
      vsBudget: { value: 6.2, type: 'positive' as const },
      vsForecast: { value: 0.2, type: 'positive' as const }
    }
  };

  const otherRevenueData = {
    yesterday: {
      absolute: 1500,
      vsPrior: { value: 6.3, type: 'positive' as const },
      vsBudget: { value: -8.1, type: 'negative' as const },
      vsForecast: { value: 2.8, type: 'positive' as const }
    },
    ptd: {
      current: 240000,
      vsPrior: { value: 4.2, type: 'positive' as const },
      vsBudget: { value: 1.8, type: 'positive' as const },
      vsForecast: { value: 0.5, type: 'positive' as const }
    },
    otb: {
      current: 50000,
      vsPrior: { value: -12.5, type: 'negative' as const },
      vsBudget: { value: 15.2, type: 'positive' as const },
      vsForecast: { value: -4.1, type: 'negative' as const }
    },
    total: {
      current: 290000,
      vsPrior: { value: 2.8, type: 'positive' as const },
      vsBudget: { value: 4.5, type: 'positive' as const },
      vsForecast: { value: -0.3, type: 'negative' as const }
    }
  };

  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(3)}m`;
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return value.toString();
  };

  const formatPercentage = (value: number, showSign: boolean = true): string => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getComparisonColor = (type: 'positive' | 'negative' | 'neutral'): string => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderComparison = (comparison: ComparisonData, label: string): React.ReactNode => (
    <span className={`text-xs ${getComparisonColor(comparison.type)}`}>
      {label}: {formatPercentage(comparison.value)}
    </span>
  );

  const renderBottomRow = (
    label: string,
    current: number,
    vsPrior: ComparisonData,
    vsBudget: ComparisonData,
    vsForecast: ComparisonData
  ): React.ReactNode => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-xs font-medium text-gray-700 mr-2">{label}:</span>
        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatValue(current)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <span className={`text-xs whitespace-nowrap ${getComparisonColor(vsPrior.type)}`}>
          {formatPercentage(vsPrior.value)}
        </span>
        <span className={`text-xs whitespace-nowrap ${getComparisonColor(vsBudget.type)}`}>
          {formatPercentage(vsBudget.value)}
        </span>
        <span className={`text-xs whitespace-nowrap ${getComparisonColor(vsForecast.type)}`}>
          {formatPercentage(vsForecast.value)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[360px] max-w-full flex flex-col box-border">
      {/* Header */}
      <div className="mb-4 relative">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mb-2">Total Revenue</h3>
        
        {/* Action Row - Left aligned */}
        <div className="flex items-center justify-start space-x-2">
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Помощ за Total Revenue"
            >
              <HelpCircle size={14} />
            </button>
          )}
          <DrillDownIcon context="kpi" className="scale-75" />
          <button
            onClick={() => setShowBreakdownModal(true)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            title="Show revenue breakdown"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Top Highlight Zone - Yesterday Impact */}
      <div className="relative">
        <div className="relative">
          {/* 7-Day Pickup Sparkline - positioned above yesterday badge */}
          <SevenDayPickupSparkline 
            data={sevenDayData} 
            kpiTitle="Total Revenue"
            isExpense={false}
            className="absolute right-0 bottom-full mb-1 z-10 opacity-70 hover:opacity-100"
          />
          <div 
            className="bg-green-500 text-white rounded-lg p-3 sm:p-4 mb-4 w-full max-w-full"
            aria-label={`Yesterday impact +${formatValue(yesterdayData.absolute)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-headline-clamp font-bold">+{formatValue(yesterdayData.absolute)}</div>
                <div className="text-xxs sm:text-xs opacity-90">Yesterday</div>
              </div>
              <div className="text-right text-badge-clamp">
                <div className="opacity-90 leading-tight">
                  Prior: {formatPercentage(yesterdayData.vsPrior.value)}
                </div>
                <div className="opacity-90 leading-tight">
                  Budget: {formatPercentage(yesterdayData.vsBudget.value)}
                </div>
                <div className="opacity-90 leading-tight">
                  Forecast: {formatPercentage(yesterdayData.vsForecast.value)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context Zone */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        {/* PTD Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">PTD:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(ptdData.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptdData.vsPrior.type)}`}>
              {formatPercentage(ptdData.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptdData.vsBudget.type)}`}>
              {formatPercentage(ptdData.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptdData.vsForecast.type)}`}>
              {formatPercentage(ptdData.vsForecast.value)}
            </span>
          </div>
        </div>
        
        {/* OTB PTD Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">OTB:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(otbPtdData.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbPtdData.vsPrior.type)}`}>
              {formatPercentage(otbPtdData.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbPtdData.vsBudget.type)}`}>
              {formatPercentage(otbPtdData.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbPtdData.vsForecast.type)}`}>
              {formatPercentage(otbPtdData.vsForecast.value)}
            </span>
          </div>
        </div>
        
        {/* Total Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">Total:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(totalData.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(totalData.vsPrior.type)}`}>
              {formatPercentage(totalData.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(totalData.vsBudget.type)}`}>
              {formatPercentage(totalData.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(totalData.vsForecast.type)}`}>
              {formatPercentage(totalData.vsForecast.value)}
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Modal */}
      <Modal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        title="Total Revenue Breakdown"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          <RevenueBreakdownCard
            title="Rooms Revenue"
            yesterdayData={roomsRevenueData.yesterday}
            ptdData={roomsRevenueData.ptd}
            otbData={roomsRevenueData.otb}
            totalData={roomsRevenueData.total}
            onHelpClick={() => {/* Handle help for rooms revenue */}}
          />
          <RevenueBreakdownCard
            title="F&B Revenue"
            yesterdayData={fbRevenueData.yesterday}
            ptdData={fbRevenueData.ptd}
            otbData={fbRevenueData.otb}
            totalData={fbRevenueData.total}
            onHelpClick={() => {/* Handle help for F&B revenue */}}
          />
          <RevenueBreakdownCard
            title="Other Revenue"
            yesterdayData={otherRevenueData.yesterday}
            ptdData={otherRevenueData.ptd}
            otbData={otherRevenueData.otb}
            totalData={otherRevenueData.total}
            onHelpClick={() => {/* Handle help for other revenue */}}
          />
        </div>
      </Modal>
    </div>
  );
};

export default NewTotalRevenueCard;