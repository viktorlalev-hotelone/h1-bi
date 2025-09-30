import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from '../DrillDownIcon';
import { createStackedBarWithDailyBreakdownConfig } from './chartConfigs';

interface FutureAnalyticsRoomNightsChartProps {
  onHelpClick?: () => void;
  className?: string;
}

interface WeeklyRoomNightsData {
  week: string;
  weekPeriod: string;
  totalNights: number;
  percentageShare: number;
  dailyBreakdown: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
}

const FutureAnalyticsRoomNightsChart: React.FC<FutureAnalyticsRoomNightsChartProps> = ({
  onHelpClick,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate mock data for future weeks
  const generateFutureWeeksData = (): WeeklyRoomNightsData[] => {
    const data: WeeklyRoomNightsData[] = [];
    const today = new Date();
    
    // Generate data for next 12 weeks
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (i * 7));
      
      // Find Monday of this week
      const monday = new Date(weekStart);
      const dayOfWeek = monday.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      monday.setDate(monday.getDate() - daysToMonday);
      
      // Calculate Sunday
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      // Get week number
      const weekNumber = getWeekNumber(monday);
      
      // Format week period
      const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        return `${day} ${month}`;
      };
      
      const weekPeriod = `${formatDate(monday)} – ${formatDate(sunday)}`;
      
      // Generate daily breakdown with seasonal patterns
      const baseNights = 800 + Math.random() * 400; // 800-1200 base nights
      const seasonalFactor = 1 + 0.3 * Math.sin((i / 12) * 2 * Math.PI); // Seasonal variation
      
      // Different patterns for different days
      const dailyFactors = {
        monday: 0.12 + Math.random() * 0.05,
        tuesday: 0.11 + Math.random() * 0.04,
        wednesday: 0.13 + Math.random() * 0.04,
        thursday: 0.14 + Math.random() * 0.05,
        friday: 0.16 + Math.random() * 0.06,
        saturday: 0.18 + Math.random() * 0.07,
        sunday: 0.16 + Math.random() * 0.06
      };
      
      const totalNights = Math.round(baseNights * seasonalFactor);
      
      const dailyBreakdown = {
        monday: Math.round(totalNights * dailyFactors.monday),
        tuesday: Math.round(totalNights * dailyFactors.tuesday),
        wednesday: Math.round(totalNights * dailyFactors.wednesday),
        thursday: Math.round(totalNights * dailyFactors.thursday),
        friday: Math.round(totalNights * dailyFactors.friday),
        saturday: Math.round(totalNights * dailyFactors.saturday),
        sunday: Math.round(totalNights * dailyFactors.sunday)
      };
      
      // Adjust to match total (due to rounding)
      const calculatedTotal = Object.values(dailyBreakdown).reduce((sum, val) => sum + val, 0);
      const difference = totalNights - calculatedTotal;
      if (difference !== 0) {
        dailyBreakdown.saturday += difference; // Add difference to Saturday (usually highest)
      }
      
      data.push({
        week: `Week ${weekNumber}`,
        weekPeriod,
        totalNights,
        percentageShare: 5 + Math.random() * 15, // 5-20% share
        dailyBreakdown
      });
    }
    
    return data;
  };

  // Get ISO week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const weeklyData = generateFutureWeeksData();
    
    const chartOptions = createStackedBarWithDailyBreakdownConfig(weeklyData);
    chart.setOption(chartOptions);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Room Nights by Week and Days of Week</h3>
        <div className="flex items-center space-x-2">
          <DrillDownIcon context="chart" />
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Помощ за Room Nights by Week and Days of Week"
            >
              <HelpCircle size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        <div className="mt-4 text-xs text-gray-500">
          <p>• Shows distribution of room nights booked yesterday across future weeks</p>
          <p>• Each bar segment represents a different day of the week</p>
          <p>• Hover over bars to see detailed breakdown by day</p>
        </div>
      </div>
    </div>
  );
};

export default FutureAnalyticsRoomNightsChart;