import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { formatCompactRevenue, formatCompactADR, formatPercentage, getPercentageColor } from '../utils/formatters';
import { parseFormattedValue, parseBadgeValue } from '../utils/formatters';
import { generateSevenDayPickupData } from '../utils/mockDataGenerators';
import SevenDayPickupSparkline from './SevenDayPickupSparkline';
import { KPICard as KPICardType } from '../types';

interface KPICardProps {
  kpi: KPICardType;
  onHelpClick?: () => void;
  hasToggle?: boolean;
  isToggleOpen?: boolean;
  onToggleClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, onHelpClick, hasToggle, isToggleOpen, onToggleClick }) => {
  const { title, value, change, changeType, pickup, comparisons } = kpi;

  // Generate 7-day pickup data for sparkline (only if not Unpicked Blocks)
  const isUnpickedBlocks = title.includes('Unpicked Blocks');
  const isExpense = title.includes('Expenses') || title.includes('Cost');
  
  let sevenDayData = null;
  if (!isUnpickedBlocks && pickup) {
    const yesterdayBadgeValue = parseBadgeValue(pickup.value.toString());
    sevenDayData = generateSevenDayPickupData(title, yesterdayBadgeValue, isExpense);
  }

  // Don't show sparkline for Unpicked Blocks
  const shouldShowSparkline = !isUnpickedBlocks;

  const formatMainValue = (value: string, title: string) => {
    if (title.includes('Revenue')) {
      return formatCompactRevenue(value);
    } else if (title.includes('Expenses') || title.includes('Profit')) {
      return formatCompactRevenue(value);
    } else if (value.includes('%')) {
      return value;
    }
    return value;
  };

  const getPickupBadgeStyle = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'bg-green-500 text-white';
      case 'negative':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-6 w-full min-w-[360px] max-w-full flex flex-col box-border">
      {/* Title and Action Row */}
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
              <HelpCircle size={18} />
            </button>
          )}
          
          <DrillDownIcon context="kpi" className="scale-110" />
          
          {hasToggle && onToggleClick && (
            <button
              onClick={onToggleClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              title={isToggleOpen ? "Hide breakdown" : "Show breakdown"}
            >
              {isToggleOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Main Value and Pickup Badge */}
      <div className="flex items-start justify-between mb-4 sm:mb-6 flex-1">
        <div className="text-headline-clamp font-bold text-gray-900 flex-1 min-w-0">
          {formatMainValue(value, title)}
        </div>
        {pickup && (
          <div className="relative">
            {/* 7-Day Pickup Sparkline - positioned above pickup badge */}
            {shouldShowSparkline && sevenDayData && (
              <SevenDayPickupSparkline 
                data={sevenDayData} 
                kpiTitle={title}
                isExpense={isExpense}
                className="absolute right-0 bottom-full mb-1 z-10 opacity-70 hover:opacity-100"
              />
            )}
            <div 
              className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded text-center min-w-[50px] sm:min-w-[60px] lg:min-w-[70px] ml-2 sm:ml-3 flex-shrink-0 ${getPickupBadgeStyle(pickup.type)}`}
              aria-label={`Yesterday pickup ${pickup.value > 0 ? '+' : ''}${pickup.value}`}
            >
              <div className="text-badge-clamp font-bold leading-tight">
                {pickup.value > 0 ? '+' : ''}{pickup.value}
              </div>
              <div className="text-xxs sm:text-xs font-medium leading-tight hidden lg:block">
                yesterday
              </div>
              <div className="text-xxs sm:text-xs font-medium leading-tight lg:hidden">
                ytd
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Lines */}
      {comparisons && (
      <div className="space-y-3 sm:space-y-4 mt-auto">
        {/* Row 1: vs Prior or % of all rooms in blocks */}
        <div>
          <div className={`text-xxs sm:text-xs font-medium mb-2 leading-tight ${isUnpickedBlocks ? 'text-purple-600' : getPercentageColor(comparisons.vsPrior.percentage)}`}>
            {isUnpickedBlocks 
              ? `${Math.abs(comparisons.vsPrior.percentage).toFixed(1)}% of Blocks`
              : `${comparisons.vsPrior.percentage > 0 ? '+' : ''}${formatPercentage(comparisons.vsPrior.percentage)} compared to Prior`
            }
          </div>
          <div className="relative">
            <div className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-full max-w-full">
              <div 
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${isUnpickedBlocks ? 'bg-purple-500' : 'bg-orange-400'}`}
                style={{ width: `${comparisons.vsPrior.progress}%` }}
              />
            </div>
            <span className="absolute right-0 top-3 sm:top-3.5 text-xxs text-gray-400">0</span>
          </div>
        </div>

        {/* Row 2: vs Budget or % of all free rooms */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xxs sm:text-xs font-medium leading-tight ${isUnpickedBlocks ? 'text-blue-600' : getPercentageColor(comparisons.vsBudget.percentage)}`}>
              {isUnpickedBlocks 
                ? `${Math.abs(comparisons.vsBudget.percentage).toFixed(1)}% of free rooms`
                : `${comparisons.vsBudget.percentage > 0 ? '+' : ''}${formatPercentage(comparisons.vsBudget.percentage)} compared to Budget`
              }
            </span>
          </div>
          <div className="relative">
            <div className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-full max-w-full">
              <div 
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${isUnpickedBlocks ? 'bg-blue-500' : 'bg-orange-400'}`}
                style={{ width: `${comparisons.vsBudget.progress}%` }}
              />
            </div>
            <span className="absolute right-0 top-3 sm:top-3.5 text-xxs text-gray-400">0</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default KPICard;