import React from 'react';
import { HelpCircle, ChevronDown, Lock } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { parseFormattedValue, parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';
import SevenDayPickupSparkline from './SevenDayPickupSparkline';

interface ComparisonData {
  value: number;
  type: 'positive' | 'negative' | 'neutral';
}

interface YesterdayData {
  // Legacy format (for regular Departmental Expenses card)
  absolute?: number;
  vsPrior: ComparisonData;
  vsBudget: ComparisonData;
  vsForecast: ComparisonData;
  // New format (for "per Room" cards only)
  hadLockedUpdateYesterday?: boolean;
  yesterdayDeltaLocked?: number;
}

interface ExpenseKPICardProps {
  title: string;
  yesterdayData: YesterdayData;
  lockData: {
    current: number | string;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  unlckData: {
    current: number | string;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  totalData: {
    current: number | string;
    vsPrior: ComparisonData;
    vsBudget: ComparisonData;
    vsForecast: ComparisonData;
  };
  onHelpClick?: () => void;
  hasDropdown?: boolean;
  onDropdownClick?: () => void;
  showLockIconForUnlck?: boolean;
  onShowLockMonthsDetails?: () => void;
  allLockMonthsTooltip?: string;
}

const ExpenseKPICard: React.FC<ExpenseKPICardProps> = ({
  title,
  yesterdayData,
  lockData,
  unlckData,
  totalData,
  onHelpClick,
  hasDropdown,
  onDropdownClick,
  showLockIconForUnlck,
  onShowLockMonthsDetails,
  allLockMonthsTooltip
}) => {
  // Generate 7-day pickup data for sparkline using yesterday badge value
  const isExpense = true; // All expense cards are expense type
  let sevenDayData = null;
  
  if (yesterdayData.absolute !== undefined) {
    // Legacy format - use absolute value
    const yesterdayBadgeValue = parseBadgeValue(yesterdayData.absolute.toString());
    sevenDayData = generateSevenDayPickupData(title, yesterdayBadgeValue, isExpense);
  } else if (yesterdayData.yesterdayDeltaLocked !== undefined) {
    // New format - use yesterdayDeltaLocked value
    const yesterdayBadgeValue = parseBadgeValue(yesterdayData.yesterdayDeltaLocked.toString());
    sevenDayData = generateSevenDayPickupData(title, yesterdayBadgeValue, isExpense);
  }

  // Get yesterday's date for tooltips
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

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

  // Get yesterday band info - supports both old and new logic
  const getYesterdayBandInfo = () => {
    // New logic for "per Room" cards
    if (yesterdayData.hadLockedUpdateYesterday !== undefined) {
      if (yesterdayData.hadLockedUpdateYesterday) {
        // Case A: New month was locked yesterday
        const value = yesterdayData.yesterdayDeltaLocked;
        return {
          color: value > 0 ? 'bg-red-500' : value < 0 ? 'bg-green-500' : 'bg-gray-500', // Red for expense increase, green for decrease
          value: value > 0 ? `+${formatValue(Math.abs(value))}` : value < 0 ? `-${formatValue(Math.abs(value))}` : '0',
          subtext: 'Yesterday',
          tooltip: `Changes recorded in locked months on ${yesterdayDate}`
        };
      } else {
        // Case B: No new month was locked yesterday
        return {
          color: 'bg-gray-400',
          value: '—',
          subtext: 'No locked updates yesterday',
          tooltip: `No new months were locked and no changes to locked months on ${yesterdayDate}`
        };
      }
    }
    
    // Legacy logic for regular "Departmental Expenses" card
    const value = yesterdayData.absolute || 0;
    return {
      color: value > 0 ? 'bg-red-500' : value < 0 ? 'bg-green-500' : 'bg-gray-500',
      value: value > 0 ? `+${formatValue(Math.abs(value))}` : value < 0 ? `-${formatValue(Math.abs(value))}` : '0',
      subtext: 'Yesterday',
      tooltip: `Expense changes on ${yesterdayDate}`
    };
  };

  const yesterdayBandInfo = getYesterdayBandInfo();
  
  // Determine if we should show comparisons in yesterday band
  const shouldShowComparisons = yesterdayData.hadLockedUpdateYesterday !== undefined 
    ? yesterdayData.hadLockedUpdateYesterday 
    : true; // Always show for legacy cards

  const renderBottomRow = (
    label: string,
    current: number | string,
    vsPrior: ComparisonData,
    vsBudget: ComparisonData,
    vsForecast: ComparisonData
  ): React.ReactNode => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-xs font-medium text-gray-700 mr-2">{label}:</span>
        {(typeof current === 'string' || current === null || current === undefined) ? (
          <div className="flex items-center">
            <span 
              className="text-xs sm:text-sm text-gray-500 italic cursor-help" 
              title={allLockMonthsTooltip}
            >
              Values available only for locked months
            </span>
            {label === 'UNLCK' && showLockIconForUnlck && onShowLockMonthsDetails && (
              <button
                onClick={onShowLockMonthsDetails}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                title="Show lock/unlock status for all months"
              >
                <Lock size={12} />
              </button>
            )}
          </div>
        ) : (
          <span className="text-sm font-semibold text-gray-900">{formatValue(current)}</span>
        )}
      </div>
      {(typeof current === 'number' && current !== null && current !== undefined) && (
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${getComparisonColor(vsPrior.type)}`}>
            {formatPercentage(vsPrior.value)}
          </span>
          <span className={`text-xs ${getComparisonColor(vsBudget.type)}`}>
            {formatPercentage(vsBudget.value)}
          </span>
          <span className={`text-xs ${getComparisonColor(vsForecast.type)}`}>
            {formatPercentage(vsForecast.value)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[360px] max-w-full flex flex-col box-border">
      {/* Header */}
      <div className="mb-4 relative">
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
          {hasDropdown && onDropdownClick && (
            <button
              onClick={onDropdownClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Show expense breakdown"
            >
              <ChevronDown size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Top Highlight Zone - Yesterday Impact */}
      <div className="relative">
        <div className="relative">
          {/* 7-Day Pickup Sparkline - positioned above yesterday badge */}
          {sevenDayData && (
            <SevenDayPickupSparkline 
              data={sevenDayData} 
              kpiTitle={title}
              isExpense={isExpense}
              className="absolute right-0 bottom-full mb-1 z-10 opacity-70 hover:opacity-100"
            />
          )}
          <div 
            className={`${yesterdayBandInfo.color} text-white rounded-lg p-3 sm:p-4 mb-4 w-full max-w-full`}
            title={yesterdayBandInfo.tooltip}
            aria-label={`Yesterday impact ${yesterdayBandInfo.value}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-headline-clamp font-bold">{yesterdayBandInfo.value}</div>
                <div className="text-xxs sm:text-xs opacity-90">{yesterdayBandInfo.subtext}</div>
              </div>
              {shouldShowComparisons && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context Zone */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        {/* LOCK Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">LOCK:</span>
            {(typeof lockData.current === 'string' || lockData.current === null || lockData.current === undefined) ? (
              <div className="flex items-center">
                <span 
                  className="text-xxs sm:text-xs text-gray-500 italic cursor-help" 
                  title={allLockMonthsTooltip}
                >
                  Values available only for locked months
                </span>
                {showLockIconForUnlck && onShowLockMonthsDetails && (
                  <button
                    onClick={onShowLockMonthsDetails}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Show lock/unlock status for all months"
                  >
                    <Lock size={12} />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-900">{formatValue(lockData.current)}</span>
            )}
          </div>
          {(typeof lockData.current === 'number' && lockData.current !== null && lockData.current !== undefined) && (
            <div className="flex items-center space-x-1">
              <span className={`text-xxs ${getComparisonColor(lockData.vsPrior.type)}`}>
                {formatPercentage(lockData.vsPrior.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(lockData.vsBudget.type)}`}>
                {formatPercentage(lockData.vsBudget.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(lockData.vsForecast.type)}`}>
                {formatPercentage(lockData.vsForecast.value)}
              </span>
            </div>
          )}
        </div>
        
        {/* UNLCK Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">UNLCK:</span>
            {(typeof unlckData.current === 'string' || unlckData.current === null || unlckData.current === undefined) ? (
              <div className="flex items-center">
                <span 
                  className="text-xxs sm:text-xs text-gray-500 italic cursor-help" 
                  title={allLockMonthsTooltip}
                >
                  Values available only for locked months
                </span>
                {showLockIconForUnlck && onShowLockMonthsDetails && (
                  <button
                    onClick={onShowLockMonthsDetails}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Show lock/unlock status for all months"
                  >
                    <Lock size={12} />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-900">{formatValue(unlckData.current)}</span>
            )}
          </div>
          {(typeof unlckData.current === 'number' && unlckData.current !== null && unlckData.current !== undefined) && (
            <div className="flex items-center space-x-1">
              <span className={`text-xxs ${getComparisonColor(unlckData.vsPrior.type)}`}>
                {formatPercentage(unlckData.vsPrior.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(unlckData.vsBudget.type)}`}>
                {formatPercentage(unlckData.vsBudget.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(unlckData.vsForecast.type)}`}>
                {formatPercentage(unlckData.vsForecast.value)}
              </span>
            </div>
          )}
        </div>
        
        {/* Total Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xxs font-medium text-gray-700 mr-2">TOT:</span>
            {(typeof totalData.current === 'string' || totalData.current === null || totalData.current === undefined) ? (
              <div className="flex items-center">
                <span 
                  className="text-xxs sm:text-xs text-gray-500 italic cursor-help" 
                  title={allLockMonthsTooltip}
                >
                  Values available only for locked months
                </span>
                {showLockIconForUnlck && onShowLockMonthsDetails && (
                  <button
                    onClick={onShowLockMonthsDetails}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Show lock/unlock status for all months"
                  >
                    <Lock size={12} />
                  </button>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-900">{formatValue(totalData.current)}</span>
            )}
          </div>
          {(typeof totalData.current === 'number' && totalData.current !== null && totalData.current !== undefined) && (
            <div className="flex items-center space-x-1">
              <span className={`text-xxs ${getComparisonColor(totalData.vsPrior.type)}`}>
                {formatPercentage(totalData.vsPrior.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(totalData.vsBudget.type)}`}>
                {formatPercentage(totalData.vsBudget.value)}
              </span>
              <span className={`text-xxs ${getComparisonColor(totalData.vsForecast.type)}`}>
                {formatPercentage(totalData.vsForecast.value)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseKPICard;