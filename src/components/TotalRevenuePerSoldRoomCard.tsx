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

interface TotalRevenuePerSoldRoomCardProps {
  onHelpClick?: () => void;
}

const TotalRevenuePerSoldRoomCard: React.FC<TotalRevenuePerSoldRoomCardProps> = ({ onHelpClick }) => {
  const [showBreakdownModal, setShowBreakdownModal] = React.useState(false);

  // Generate 7-day pickup data for sparkline using yesterday badge value
  const yesterdayBadgeValue = parseBadgeValue('0.86'); // 0.86 from yesterday badge
  const sevenDayData = generateSevenDayPickupData('Total Revenue per Sold Room', yesterdayBadgeValue, false);

  // Mock data for main Total Revenue per Sold Room card
  const mainData = {
    yesterday: {
      absolute: -0.86, // Decrease in revenue per room
      vsPrior: { value: 9.4, type: 'positive' as const },
      vsBudget: { value: -2.7, type: 'negative' as const },
      vsForecast: { value: 5.8, type: 'positive' as const }
    },
    ptd: {
      current: 221.57,
      vsPrior: { value: 9.4, type: 'positive' as const },
      vsBudget: { value: -2.7, type: 'negative' as const },
      vsForecast: { value: 5.8, type: 'positive' as const }
    },
    otb: {
      current: 185.42,
      vsPrior: { value: -5.3, type: 'negative' as const },
      vsBudget: { value: 8.7, type: 'positive' as const },
      vsForecast: { value: -1.9, type: 'negative' as const }
    },
    total: {
      current: 208.15,
      vsPrior: { value: 6.8, type: 'positive' as const },
      vsBudget: { value: 2.1, type: 'positive' as const },
      vsForecast: { value: 3.2, type: 'positive' as const }
    }
  };

  // Mock data for breakdown cards
  const totalRevPARData = {
    yesterday: {
      absolute: 2.15,
      vsPrior: { value: 12.8, type: 'positive' as const },
      vsBudget: { value: -1.4, type: 'negative' as const },
      vsForecast: { value: 6.2, type: 'positive' as const }
    },
    ptd: {
      current: 174.25,
      vsPrior: { value: 11.2, type: 'positive' as const },
      vsBudget: { value: 3.8, type: 'positive' as const },
      vsForecast: { value: 2.4, type: 'positive' as const }
    },
    otb: {
      current: 142.80,
      vsPrior: { value: -4.5, type: 'negative' as const },
      vsBudget: { value: 9.1, type: 'positive' as const },
      vsForecast: { value: -2.1, type: 'negative' as const }
    },
    total: {
      current: 163.45,
      vsPrior: { value: 7.9, type: 'positive' as const },
      vsBudget: { value: 5.2, type: 'positive' as const },
      vsForecast: { value: 1.8, type: 'positive' as const }
    }
  };

  const adrPerRoomSoldData = {
    yesterday: {
      absolute: -2.31,
      vsPrior: { value: 8.6, type: 'positive' as const },
      vsBudget: { value: -3.8, type: 'negative' as const },
      vsForecast: { value: 4.2, type: 'positive' as const }
    },
    ptd: {
      current: 221.57,
      vsPrior: { value: 9.4, type: 'positive' as const },
      vsBudget: { value: -2.7, type: 'negative' as const },
      vsForecast: { value: 5.8, type: 'positive' as const }
    },
    otb: {
      current: 195.20,
      vsPrior: { value: -6.2, type: 'negative' as const },
      vsBudget: { value: 7.5, type: 'positive' as const },
      vsForecast: { value: -1.3, type: 'negative' as const }
    },
    total: {
      current: 212.85,
      vsPrior: { value: 5.8, type: 'positive' as const },
      vsBudget: { value: 1.9, type: 'positive' as const },
      vsForecast: { value: 3.8, type: 'positive' as const }
    }
  };

  const adrPerGuestNightData = {
    yesterday: {
      absolute: -0.51,
      vsPrior: { value: 7.2, type: 'positive' as const },
      vsBudget: { value: -4.1, type: 'negative' as const },
      vsForecast: { value: 3.8, type: 'positive' as const }
    },
    ptd: {
      current: 96.96,
      vsPrior: { value: 8.1, type: 'positive' as const },
      vsBudget: { value: -3.2, type: 'negative' as const },
      vsForecast: { value: 4.5, type: 'positive' as const }
    },
    otb: {
      current: 84.15,
      vsPrior: { value: -5.8, type: 'negative' as const },
      vsBudget: { value: 6.9, type: 'positive' as const },
      vsForecast: { value: -2.4, type: 'negative' as const }
    },
    total: {
      current: 92.45,
      vsPrior: { value: 4.9, type: 'positive' as const },
      vsBudget: { value: 0.8, type: 'positive' as const },
      vsForecast: { value: 2.1, type: 'positive' as const }
    }
  };

  const formatValue = (value: number): string => {
    return value.toFixed(2);
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
    <>
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[360px] max-w-full flex flex-col box-border">
        {/* Header */}
        <div className="mb-4 relative">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mb-2">Total Revenue per Sold Room</h3>
          
          {/* Action Row - Left aligned */}
          <div className="flex items-center justify-start space-x-2">
            {onHelpClick && (
              <button
                onClick={onHelpClick}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                title="Помощ"
              >
                <HelpCircle size={14} />
              </button>
            )}
            <DrillDownIcon context="kpi" className="scale-75" />
            <button
              onClick={() => setShowBreakdownModal(true)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Show revenue per room breakdown"
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
              kpiTitle="Total Revenue per Sold Room"
              isExpense={false}
              className="absolute right-0 bottom-full mb-1 z-10 opacity-70 hover:opacity-100"
            />
            <div 
              className={`${mainData.yesterday.absolute >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg p-3 sm:p-4 mb-4 w-full max-w-full`}
              aria-label={`Yesterday impact ${mainData.yesterday.absolute >= 0 ? '+' : ''}${formatValue(Math.abs(mainData.yesterday.absolute))}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-headline-clamp font-bold">{mainData.yesterday.absolute >= 0 ? '+' : ''}{formatValue(Math.abs(mainData.yesterday.absolute))}</div>
                  <div className="text-xxs sm:text-xs opacity-90">Yesterday</div>
                </div>
                <div className="text-right text-badge-clamp">
                  <div className="opacity-90 leading-tight">
                    Prior: {formatPercentage(mainData.yesterday.vsPrior.value)}
                  </div>
                  <div className="opacity-90 leading-tight">
                    Budget: {formatPercentage(mainData.yesterday.vsBudget.value)}
                  </div>
                  <div className="opacity-90 leading-tight">
                    Forecast: {formatPercentage(mainData.yesterday.vsForecast.value)}
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
              <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(mainData.ptd.current)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.ptd.vsPrior.type)}`}>
                {formatPercentage(mainData.ptd.vsPrior.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.ptd.vsBudget.type)}`}>
                {formatPercentage(mainData.ptd.vsBudget.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.ptd.vsForecast.type)}`}>
                {formatPercentage(mainData.ptd.vsForecast.value)}
              </span>
            </div>
          </div>
          
          {/* OTB Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xxs font-medium text-gray-700 mr-2">OTB:</span>
              <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(mainData.otb.current)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.otb.vsPrior.type)}`}>
                {formatPercentage(mainData.otb.vsPrior.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.otb.vsBudget.type)}`}>
                {formatPercentage(mainData.otb.vsBudget.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.otb.vsForecast.type)}`}>
                {formatPercentage(mainData.otb.vsForecast.value)}
              </span>
            </div>
          </div>
          
          {/* Total Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xxs font-medium text-gray-700 mr-2">Total:</span>
              <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(mainData.total.current)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.total.vsPrior.type)}`}>
                {formatPercentage(mainData.total.vsPrior.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.total.vsBudget.type)}`}>
                {formatPercentage(mainData.total.vsBudget.value)}
              </span>
              <span className={`text-xxs whitespace-nowrap ${getComparisonColor(mainData.total.vsForecast.type)}`}>
                {formatPercentage(mainData.total.vsForecast.value)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue per Room Breakdown Modal */}
      <Modal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        title="Total Revenue per Sold Room Breakdown"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          <RevenueBreakdownCard
            title="Total RevPAR"
            yesterdayData={totalRevPARData.yesterday}
            ptdData={totalRevPARData.ptd}
            otbData={totalRevPARData.otb}
            totalData={totalRevPARData.total}
            onHelpClick={() => {/* Handle help for Total RevPAR */}}
          />
          <RevenueBreakdownCard
            title="ADR per Room Sold"
            yesterdayData={adrPerRoomSoldData.yesterday}
            ptdData={adrPerRoomSoldData.ptd}
            otbData={adrPerRoomSoldData.otb}
            totalData={adrPerRoomSoldData.total}
            onHelpClick={() => {/* Handle help for ADR per Room Sold */}}
          />
          <RevenueBreakdownCard
            title="ADR per Guest Night"
            yesterdayData={adrPerGuestNightData.yesterday}
            ptdData={adrPerGuestNightData.ptd}
            otbData={adrPerGuestNightData.otb}
            totalData={adrPerGuestNightData.total}
            onHelpClick={() => {/* Handle help for ADR per Guest Night */}}
          />
        </div>
      </Modal>
    </>
  );
};

export default TotalRevenuePerSoldRoomCard;