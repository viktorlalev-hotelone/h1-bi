import React from 'react';
import BaseChart from './BaseChart';
import { createWaterfallConfig } from './chartConfigs';
import { gopProfitDevelopmentData, calculateGOP } from '../../data/gopProfitData';

interface GOPProfitDevelopmentChartProps {
  onHelpClick?: () => void;
  className?: string;
  showLockMonthsBadge?: boolean;
}

const GOPProfitDevelopmentChart: React.FC<GOPProfitDevelopmentChartProps> = ({
  onHelpClick,
  className = '',
  showLockMonthsBadge = false
}) => {
  const chartOptions = createWaterfallConfig(gopProfitDevelopmentData, {
    showConnectors: true,
    tooltipFormatter: (params: any) => {
      const dataIndex = params[0].dataIndex;
      const item = gopProfitDevelopmentData[dataIndex];
      const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
      
      // Calculate running total up to this point
      let runningTotal = 0;
      for (let i = 0; i <= dataIndex; i++) {
        runningTotal += gopProfitDevelopmentData[i].value;
      }
      
      const isPositive = item.value >= 0;
      const valueColor = isPositive ? '#10B981' : '#EF4444';
      
      return `
        <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${item.name}</div>
          <div style="font-size: 13px; line-height: 1.4;">
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Impact:</span> 
              <span style="color: ${valueColor}; font-weight: 600;">
                ${isPositive ? '+' : ''}${fmt(item.value)} BGN
              </span>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="color: #6B7280;">Running Total:</span> 
              <span style="font-weight: 600; color: #1F2937;">
                ${fmt(runningTotal)} BGN
              </span>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF;">
              ${isPositive ? 'Contributes to' : 'Reduces'} Gross Operating Profit
            </div>
          </div>
        </div>
      `;
    }
  });

  const finalGOP = calculateGOP();
  const formattedGOP = finalGOP.toLocaleString('bg-BG', { maximumFractionDigits: 0 });

  return (
    <div className={className}>
      <BaseChart
        title="GOP - Profit Development"
        onHelpClick={onHelpClick}
        chartOptions={chartOptions}
        height="360px"
        showLockMonthsBadge={showLockMonthsBadge}
      />
      
      {/* GOP Summary */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Gross Operating Profit:</span>
          <span className={`text-lg font-bold ${finalGOP >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {finalGOP >= 0 ? '+' : ''}{formattedGOP} BGN
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Calculated from revenue streams minus operational expenses
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
          Тази визуализация показва резултатите само от минали и заключени периоди, които са посочени като такива при приходите и разходите.
        </div>
      </div>
    </div>
  );
};

export default GOPProfitDevelopmentChart;