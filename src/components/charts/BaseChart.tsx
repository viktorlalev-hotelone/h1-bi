import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from '../DrillDownIcon';

interface BaseChartProps {
  title: string;
  onHelpClick?: () => void;
  chartOptions: any;
  height?: string;
  legend?: Array<{ color: string; label: string }>;
  className?: string;
  showVatBadge?: boolean;
  showLockMonthsBadge?: boolean;
}

const BaseChart: React.FC<BaseChartProps> = ({
  title,
  onHelpClick,
  chartOptions,
  height = '300px',
  legend,
  className = '',
  showVatBadge = false,
  showLockMonthsBadge = false
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(chartOptions);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [chartOptions]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{title}</h3>
          {showVatBadge && (
            <span 
              className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              title="These visuals always include VAT and are not affected by the global VAT exclusion setting."
            >
              Incl. VAT
            </span>
          )}
          {showLockMonthsBadge && (
            <span 
              className="ml-3 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
              title="This visual shows data only for locked months where final values are available."
            >
              Lock Months only
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <DrillDownIcon context="financial" />
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title={`Помощ за ${title}`}
            >
              <HelpCircle size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div ref={chartRef} style={{ width: '100%', height }} />
        {legend && (
          <div className="mt-3 flex justify-center">
            <div className="flex items-center space-x-4 text-sm">
              {legend.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded mr-2`} style={{ backgroundColor: item.color }}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseChart;