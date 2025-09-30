import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { HelpCircle } from 'lucide-react';
import { formatRevenue, formatAveragePrice, formatPercentage } from '../utils/formatters';
import { ChartData } from '../types';

interface ChartProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'bar';
  color?: string;
  onMetricChange?: (metric: string) => void;
  availableMetrics?: string[];
  currentMetric?: string;
  onHelpClick?: () => void;
}

const Chart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  type = 'line', 
  color = '#3B82F6',
  onMetricChange,
  availableMetrics = [],
  currentMetric,
  onHelpClick
}) => {
  // Handle empty or undefined data
  const safeData = data || [];
  const hasData = safeData.length > 0;

  const formatYAxisTick = (value: number) => {
    if (currentMetric?.includes('Revenue')) {
      return `${(value / 1000).toFixed(0)}k`;
    } else if (currentMetric?.includes('ADR')) {
      return value.toFixed(0);
    } else if (currentMetric?.includes('%')) {
      return `${value.toFixed(0)}%`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltipValue = (value: number) => {
    if (currentMetric?.includes('Revenue')) {
      return formatRevenue(value);
    } else if (currentMetric?.includes('ADR')) {
      return formatAveragePrice(value);
    } else if (currentMetric?.includes('%')) {
      return formatPercentage(value);
    }
    return formatRevenue(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title={`Помощ за ${title}`}
            >
              <HelpCircle size={16} />
            </button>
          )}
        </div>
        {availableMetrics.length > 0 && onMetricChange && (
          <select 
            value={currentMetric}
            onChange={(e) => onMetricChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableMetrics.map(metric => (
              <option key={metric} value={metric}>{metric}</option>
            ))}
          </select>
        )}
      </div>
      
      {!hasData ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip formatter={(value: number) => [formatTooltipValue(value), currentMetric || 'Value']} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip formatter={(value: number) => [formatTooltipValue(value), currentMetric || 'Value']} />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
};

export default Chart;