import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { HelpCircle, Calendar, RefreshCw } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import PeriodSelector from './PeriodSelector';
import { useHotelSelection, useCurrentPeriod } from '../hooks/useHotelSelection';

interface RoomsKPIRadarChartProps {
  className?: string;
}

const RoomsKPIRadarChart: React.FC<RoomsKPIRadarChartProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedHotels } = useHotelSelection();
  const currentPeriod = useCurrentPeriod('rooms-explorer');
  const [pickupPeriod, setPickupPeriod] = useState('9/20/2025 - 9/20/2025');
  const [granulation, setGranulation] = useState('Month');
  const [selectedMonth, setSelectedMonth] = useState('June 2025');

  // Available months for the slider
  const availableMonths = [
    'June 2025',
    'July 2025', 
    'August 2025',
    'September 2025',
    'October 2025',
    'November 2025'
  ];

  const currentMonthIndex = availableMonths.indexOf(selectedMonth);

  // Mock data for different months
  const monthlyData: { [key: string]: any } = {
    'June 2025': {
      'Rooms Revenue': { current: 1026192.63, prior: 0, budget: 0 },
      'ADR/Room Night': { current: 200.73, prior: 0, budget: 0 },
      'Occupancy %': { current: 66.95, prior: 0, budget: 0 },
      'ADR/Guest Night': { current: 89.18, prior: 0, budget: 0 },
      'Room Nights': { current: 5162.00, prior: 0, budget: 0 },
      'AVG Guests Room': { current: 2.90, prior: 0, budget: 0 },
      'AVG Length Of Stay': { current: 5.88, prior: 0, budget: 0 }
    },
    'July 2025': {
      'Rooms Revenue': { current: 1200000, prior: 1100000, budget: 1150000 },
      'ADR/Room Night': { current: 220.50, prior: 210.30, budget: 215.00 },
      'Occupancy %': { current: 85.2, prior: 82.1, budget: 83.5 },
      'ADR/Guest Night': { current: 95.20, prior: 92.10, budget: 93.80 },
      'Room Nights': { current: 5800, prior: 5600, budget: 5700 },
      'AVG Guests Room': { current: 2.85, prior: 2.82, budget: 2.84 },
      'AVG Length Of Stay': { current: 6.2, prior: 6.0, budget: 6.1 }
    },
    'August 2025': {
      'Rooms Revenue': { current: 1350000, prior: 1250000, budget: 1300000 },
      'ADR/Room Night': { current: 245.80, prior: 235.20, budget: 240.00 },
      'Occupancy %': { current: 92.5, prior: 89.8, budget: 91.0 },
      'ADR/Guest Night': { current: 102.50, prior: 98.30, budget: 100.20 },
      'Room Nights': { current: 6200, prior: 5900, budget: 6050 },
      'AVG Guests Room': { current: 2.95, prior: 2.88, budget: 2.92 },
      'AVG Length Of Stay': { current: 6.5, prior: 6.2, budget: 6.3 }
    },
    'September 2025': {
      'Rooms Revenue': { current: 980000, prior: 920000, budget: 950000 },
      'ADR/Room Night': { current: 185.40, prior: 178.60, budget: 182.00 },
      'Occupancy %': { current: 78.3, prior: 75.2, budget: 76.8 },
      'ADR/Guest Night': { current: 82.10, prior: 79.40, budget: 80.75 },
      'Room Nights': { current: 4800, prior: 4600, budget: 4700 },
      'AVG Guests Room': { current: 2.75, prior: 2.72, budget: 2.74 },
      'AVG Length Of Stay': { current: 5.4, prior: 5.2, budget: 5.3 }
    }
  };

  const currentData = monthlyData[selectedMonth] || monthlyData['June 2025'];

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Normalize data to 0-100 scale for radar chart
    const normalizeValue = (value: number, metric: string) => {
      const ranges: { [key: string]: { min: number; max: number } } = {
        'Rooms Revenue': { min: 0, max: 1500000 },
        'ADR/Room Night': { min: 0, max: 300 },
        'Occupancy %': { min: 0, max: 100 },
        'ADR/Guest Night': { min: 0, max: 120 },
        'Room Nights': { min: 0, max: 7000 },
        'AVG Guests Room': { min: 0, max: 4 },
        'AVG Length Of Stay': { min: 0, max: 8 }
      };
      
      const range = ranges[metric];
      if (!range) return 0;
      
      return Math.min(100, Math.max(0, ((value - range.min) / (range.max - range.min)) * 100));
    };

    // Prepare radar chart data
    const indicators = Object.keys(currentData).map(metric => ({
      name: metric,
      max: 100
    }));

    const seriesData = [];
    
    // Current data
    const currentValues = Object.entries(currentData).map(([metric, values]) => 
      normalizeValue(values.current, metric)
    );
    seriesData.push({
      value: currentValues,
      name: 'Current',
      itemStyle: { color: '#3B82F6' },
      areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
    });

    // Prior data (if available)
    const hasPriorData = Object.values(currentData).some((values: any) => values.prior > 0);
    if (hasPriorData) {
      const priorValues = Object.entries(currentData).map(([metric, values]) => 
        normalizeValue(values.prior, metric)
      );
      seriesData.push({
        value: priorValues,
        name: 'Prior',
        itemStyle: { color: '#F97316' },
        areaStyle: { color: 'rgba(249, 115, 22, 0.1)' }
      });
    }

    // Budget data (if available)
    const hasBudgetData = Object.values(currentData).some((values: any) => values.budget > 0);
    if (hasBudgetData) {
      const budgetValues = Object.entries(currentData).map(([metric, values]) => 
        normalizeValue(values.budget, metric)
      );
      seriesData.push({
        value: budgetValues,
        name: 'Budget',
        itemStyle: { color: '#9CA3AF' },
        areaStyle: { color: 'rgba(156, 163, 175, 0.1)' }
      });
    }

    const option = {
      legend: {
        data: seriesData.map(s => s.name),
        bottom: 10,
        textStyle: { fontSize: 12 }
      },
      radar: {
        indicator: indicators,
        radius: '70%',
        axisName: {
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          lineStyle: { color: '#e5e7eb' }
        },
        axisLine: {
          lineStyle: { color: '#e5e7eb' }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.1)', 'rgba(200, 200, 200, 0.1)']
          }
        }
      },
      series: [{
        name: 'Rooms KPIs',
        type: 'radar',
        data: seriesData,
        emphasis: {
          lineStyle: { width: 4 }
        }
      }],
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const dataIndex = params.dataIndex;
          const seriesName = params.seriesName;
          const metricName = indicators[dataIndex].name;
          const actualValue = currentData[metricName][params.name.toLowerCase()];
          
          let formattedValue = actualValue.toLocaleString();
          if (metricName.includes('%')) {
            formattedValue = `${actualValue.toFixed(1)}%`;
          } else if (metricName.includes('ADR') || metricName.includes('Revenue')) {
            formattedValue = `${actualValue.toLocaleString()} BGN`;
          } else if (metricName.includes('AVG')) {
            formattedValue = actualValue.toFixed(2);
          }
          
          return `<b>${metricName}</b><br/>${params.name}: ${formattedValue}`;
        }
      }
    };

    chart.setOption(option);

    // Resize handler
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [selectedMonth, currentData]);

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setSelectedMonth(availableMonths[currentMonthIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentMonthIndex + 1]);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">Rooms KPIs by Service Dates</h3>
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Помощ за Rooms KPIs Radar"
            >
              <HelpCircle size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <DrillDownIcon context="chart" />
          </div>
        </div>
        
        {/* Controls moved to header level */}
        <div className="flex items-center">
          <PeriodSelector
            label="Pickup Period"
            value={pickupPeriod}
            onChange={setPickupPeriod}
            className="text-xs mr-4"
          />
          <select
            value={granulation}
            onChange={(e) => setGranulation(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mr-4"
          >
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Day">Day</option>
          </select>
          <button className="p-1 rounded hover:bg-gray-100 text-blue-600">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center p-3 border-b border-gray-100">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Current</span>
          </div>
          {Object.values(currentData).some((values: any) => values.prior > 0) && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Prior</span>
            </div>
          )}
          {Object.values(currentData).some((values: any) => values.budget > 0) && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
              <span>Budget</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        <div ref={chartRef} style={{ width: '100%', height: '350px' }} />
      </div>

      {/* Month Slider */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonthIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ◀
          </button>
          <span className="font-medium text-gray-900">{selectedMonth}</span>
          <button
            onClick={handleNextMonth}
            disabled={currentMonthIndex === availableMonths.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶
          </button>
        </div>
        
        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max={availableMonths.length - 1}
            value={currentMonthIndex}
            onChange={(e) => setSelectedMonth(availableMonths[parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {availableMonths.map((month, index) => (
              <div
                key={month}
                className={`w-2 h-2 rounded-full ${
                  index === currentMonthIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsKPIRadarChart;