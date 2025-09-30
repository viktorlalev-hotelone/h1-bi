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

interface RevenueBreakdownCardProps {
  title: string;
  yesterdayData: {
    absolute: number;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  ptdData: {
    current: number;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  otbData: {
    current: number;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  totalData: {
    current: number;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  onHelpClick?: () => void;
}

const RevenueBreakdownCard: React.FC<RevenueBreakdownCardProps> = ({
  title,
  yesterdayData,
  ptdData,
  otbData,
  totalData,
  onHelpClick
}) => {
  // Generate 7-day pickup data for sparkline using yesterday badge value
  const isExpense = title.includes('Expenses') || title.includes('Cost');
  const yesterdayBadgeValue = parseBadgeValue(yesterdayData.absolute.toString());
  const sevenDayData = generateSevenDayPickupData(title, yesterdayBadgeValue, isExpense);

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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[320px] max-w-full flex flex-col box-border">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mb-2">{title}</h3>
        
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
        </div>
      </div>

      {/* Top Highlight Zone - Yesterday Impact */}
      <div className="relative">
        <div className="relative">
          {/* 7-Day Pickup Sparkline - positioned above yesterday badge */}
          <SevenDayPickupSparkline 
            data={sevenDayData} 
            kpiTitle={title}
            isExpense={isExpense}
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
        
        {/* OTB Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">OTB:</span>
            <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">{formatValue(otbData.current)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbData.vsPrior.type)}`}>
              {formatPercentage(otbData.vsPrior.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbData.vsBudget.type)}`}>
              {formatPercentage(otbData.vsBudget.value)}
            </span>
            <span className={`text-xxs whitespace-nowrap ${getComparisonColor(otbData.vsForecast.type)}`}>
              {formatPercentage(otbData.vsForecast.value)}
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
    </div>
  );
};

export default RevenueBreakdownCard;