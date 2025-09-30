import React from 'react';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { parseFormattedValue, parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';
import SevenDayPickupSparkline from './SevenDayPickupSparkline';

interface ComparisonData {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface OccupancyData {
  yesterday: {
    absolute: number; // Yesterday's occupancy change in percentage points
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  ptd: {
    current: number; // Current PTD occupancy percentage
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  otb: {
    current: number; // OTB occupancy percentage
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  total: {
    current: number; // Total period occupancy percentage
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
}

interface OccupancyKPICardProps {
  occupancyData: OccupancyData;
  onHelpClick?: () => void;
}

const OccupancyKPICard: React.FC<OccupancyKPICardProps> = ({ occupancyData, onHelpClick }) => {
  const { yesterday, ptd, otb, total } = occupancyData;

  // Generate 7-day pickup data for sparkline using yesterday badge value
  const yesterdayBadgeValue = parseBadgeValue(yesterday.absolute.toString());
  const sevenDayData = generateSevenDayPickupData('Occupancy %', yesterdayBadgeValue, false);

  const formatValue = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatYesterdayAbsolute = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
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

  const getYesterdayBandColor = (): string => {
    if (yesterday.absolute > 0) return 'bg-green-500';
    if (yesterday.absolute < 0) return 'bg-red-500';
    return 'bg-gray-500';
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
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[360px] max-w-full flex flex-col box-border">
      {/* Header */}
      <div className="mb-4 relative">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mb-2">Occupancy %</h3>
        
        {/* Action Row - Left aligned */}
        <div className="flex items-center justify-start space-x-2">
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Помощ за Occupancy %"
            >
              <HelpCircle size={14} />
            </button>
          )}
          <DrillDownIcon context="kpi" className="scale-75" />
        </div>
      </div>

      {/* Top Highlight Zone - Yesterday Impact */}
      <div className="relative">
        <div className="relative">
          {/* 7-Day Pickup Sparkline - positioned above yesterday badge */}
          <SevenDayPickupSparkline 
            data={sevenDayData} 
            kpiTitle="Occupancy %"
            isExpense={false}
            className="absolute right-0 bottom-full mb-1 z-10 opacity-70 hover:opacity-100"
          />
          <div 
            className={`${getYesterdayBandColor()} text-white rounded-lg p-3 sm:p-4 mb-4 w-full max-w-full`}
            aria-label={`Yesterday impact ${formatYesterdayAbsolute(yesterday.absolute)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-headline-clamp font-bold">{formatYesterdayAbsolute(yesterday.absolute)}</div>
                <div className="text-xxs sm:text-xs opacity-90">Yesterday</div>
              </div>
              <div className="text-right text-badge-clamp">
                <div className="opacity-90 leading-tight">
                  Prior: {formatPercentage(yesterday.vsPrior.value)}
                </div>
                <div className="opacity-90 leading-tight">
                  Budget: {formatPercentage(yesterday.vsBudget.value)}
                </div>
                <div className="opacity-90 leading-tight">
                  Forecast: {formatPercentage(yesterday.vsForecast.value)}
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
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(ptd.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptd.vsPrior.type)}`}>
              {formatPercentage(ptd.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptd.vsBudget.type)}`}>
              {formatPercentage(ptd.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(ptd.vsForecast.type)}`}>
              {formatPercentage(ptd.vsForecast.value)}
            </span>
          </div>
        </div>
        
        {/* OTB Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">OTB:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(otb.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otb.vsPrior.type)}`}>
              {formatPercentage(otb.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otb.vsBudget.type)}`}>
              {formatPercentage(otb.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otb.vsForecast.type)}`}>
              {formatPercentage(otb.vsForecast.value)}
            </span>
          </div>
        </div>
        
        {/* Total Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">Total:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(total.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(total.vsPrior.type)}`}>
              {formatPercentage(total.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(total.vsBudget.type)}`}>
              {formatPercentage(total.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(total.vsForecast.type)}`}>
              {formatPercentage(total.vsForecast.value)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyKPICard;