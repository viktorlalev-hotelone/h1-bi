import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { HelpCircle, ChevronDown } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { useHotelSelection, useCurrentPeriod } from '../hooks/useHotelSelection';

interface UnifiedTop10AnalysisProps {
  className?: string;
}

const UnifiedTop10Analysis: React.FC<UnifiedTop10AnalysisProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedHotels } = useHotelSelection();
  const currentPeriod = useCurrentPeriod('rooms-explorer');
  const [selectedDimension, setSelectedDimension] = useState('companies');

  // Available dimensions - consolidated from all previous components
  const dimensions = [
    { id: 'companies', label: 'Top 10 Companies' },
    { id: 'marketing-segments', label: 'Top 10 Marketing Segments' },
    { id: 'marketing-sources', label: 'Top 10 Marketing Sources' },
    { id: 'marketing-channels', label: 'Top 10 Marketing Channels' },
    { id: 'nationalities', label: 'Top 10 Guest Nationalities' },
    { id: 'room-types', label: 'Top 10 Room Types' },
    { id: 'guest-mix', label: 'Top 10 Guest Mix' },
    { id: 'meal-plans', label: 'Top 10 Meal Plans' },
    { id: 'guest-cities', label: 'Top 10 Guest Cities' },
    { id: 'booking-windows', label: 'Top 10 Booking Windows' },
    { id: 'length-of-stay', label: 'Top 10 Length of Stay' },
    { id: 'days-of-week', label: 'Days of Week' }
  ];

  // Consolidated data configurations for all dimensions
  const dimensionData = {
    'companies': [
      { name: 'TUI Bulgaria', color: '#3B82F6', baseValue: 45000 },
      { name: 'Balkan Holidays', color: '#10B981', baseValue: 38000 },
      { name: 'Coral Travel', color: '#F59E0B', baseValue: 32000 },
      { name: 'Anex Tour', color: '#EF4444', baseValue: 28000 },
      { name: 'Join UP!', color: '#8B5CF6', baseValue: 25000 },
      { name: 'Pegasus', color: '#06B6D4', baseValue: 22000 },
      { name: 'Sunmar', color: '#84CC16', baseValue: 20000 },
      { name: 'Biblio Globus', color: '#F97316', baseValue: 18000 },
      { name: 'TEZ Tour', color: '#EC4899', baseValue: 16000 },
      { name: 'Direct Bookings', color: '#6B7280', baseValue: 15000 }
    ],
    'marketing-segments': [
      { name: 'Leisure', color: '#3B82F6', baseValue: 85000 },
      { name: 'Business', color: '#10B981', baseValue: 45000 },
      { name: 'Groups', color: '#F59E0B', baseValue: 38000 },
      { name: 'MICE', color: '#EF4444', baseValue: 25000 },
      { name: 'Wedding', color: '#8B5CF6', baseValue: 18000 },
      { name: 'Corporate Events', color: '#06B6D4', baseValue: 15000 }
    ],
    'marketing-sources': [
      { name: 'Online', color: '#3B82F6', baseValue: 75000 },
      { name: 'Tour Operators', color: '#10B981', baseValue: 65000 },
      { name: 'Direct', color: '#F59E0B', baseValue: 45000 },
      { name: 'Corporate', color: '#EF4444', baseValue: 35000 },
      { name: 'Travel Agents', color: '#8B5CF6', baseValue: 28000 },
      { name: 'OTA', color: '#06B6D4', baseValue: 25000 },
      { name: 'Referrals', color: '#84CC16', baseValue: 18000 },
      { name: 'Events', color: '#F97316', baseValue: 15000 },
      { name: 'Social Media', color: '#EC4899', baseValue: 12000 },
      { name: 'Print Media', color: '#6B7280', baseValue: 8000 }
    ],
    'marketing-channels': [
      { name: 'Website', color: '#3B82F6', baseValue: 55000 },
      { name: 'Booking.com', color: '#10B981', baseValue: 48000 },
      { name: 'Expedia', color: '#F59E0B', baseValue: 35000 },
      { name: 'Phone', color: '#EF4444', baseValue: 32000 },
      { name: 'Email', color: '#8B5CF6', baseValue: 28000 },
      { name: 'Walk-in', color: '#06B6D4', baseValue: 22000 },
      { name: 'Agoda', color: '#84CC16', baseValue: 18000 },
      { name: 'Hotels.com', color: '#F97316', baseValue: 15000 },
      { name: 'Airbnb', color: '#EC4899', baseValue: 12000 },
      { name: 'TripAdvisor', color: '#6B7280', baseValue: 10000 }
    ],
    'nationalities': [
      { name: 'Bulgaria', color: '#3B82F6', baseValue: 65000 },
      { name: 'Germany', color: '#10B981', baseValue: 55000 },
      { name: 'UK', color: '#F59E0B', baseValue: 42000 },
      { name: 'Russia', color: '#EF4444', baseValue: 38000 },
      { name: 'Romania', color: '#8B5CF6', baseValue: 28000 },
      { name: 'Poland', color: '#06B6D4', baseValue: 22000 },
      { name: 'Czech Republic', color: '#84CC16', baseValue: 18000 },
      { name: 'France', color: '#F97316', baseValue: 15000 },
      { name: 'Italy', color: '#EC4899', baseValue: 12000 },
      { name: 'Netherlands', color: '#6B7280', baseValue: 10000 }
    ],
    'room-types': [
      { name: 'Standard Double', color: '#3B82F6', baseValue: 85000 },
      { name: 'Superior Sea View', color: '#10B981', baseValue: 65000 },
      { name: 'Family Room', color: '#F59E0B', baseValue: 45000 },
      { name: 'Suite', color: '#EF4444', baseValue: 35000 },
      { name: 'Single', color: '#8B5CF6', baseValue: 25000 },
      { name: 'Triple', color: '#06B6D4', baseValue: 18000 },
      { name: 'Junior Suite', color: '#84CC16', baseValue: 15000 },
      { name: 'Deluxe', color: '#F97316', baseValue: 12000 },
      { name: 'Presidential Suite', color: '#EC4899', baseValue: 8000 },
      { name: 'Penthouse', color: '#6B7280', baseValue: 5000 }
    ],
    'guest-mix': [
      { name: 'Adults Only', color: '#3B82F6', baseValue: 75000 },
      { name: 'Families with Children', color: '#10B981', baseValue: 65000 },
      { name: 'Mixed', color: '#F59E0B', baseValue: 45000 },
      { name: 'Business Travelers', color: '#EF4444', baseValue: 35000 },
      { name: 'Groups', color: '#8B5CF6', baseValue: 28000 },
      { name: 'Couples', color: '#06B6D4', baseValue: 22000 }
    ],
    'meal-plans': [
      { name: 'All Inclusive', color: '#3B82F6', baseValue: 95000 },
      { name: 'Half Board', color: '#10B981', baseValue: 65000 },
      { name: 'Breakfast', color: '#F59E0B', baseValue: 45000 },
      { name: 'Full Board', color: '#EF4444', baseValue: 35000 },
      { name: 'Room Only', color: '#8B5CF6', baseValue: 25000 },
      { name: 'Ultra All Inclusive', color: '#06B6D4', baseValue: 18000 }
    ],
    'guest-cities': [
      { name: 'Sofia', color: '#3B82F6', baseValue: 45000 },
      { name: 'Berlin', color: '#10B981', baseValue: 38000 },
      { name: 'London', color: '#F59E0B', baseValue: 32000 },
      { name: 'Moscow', color: '#EF4444', baseValue: 28000 },
      { name: 'Bucharest', color: '#8B5CF6', baseValue: 25000 },
      { name: 'Warsaw', color: '#06B6D4', baseValue: 22000 },
      { name: 'Prague', color: '#84CC16', baseValue: 18000 },
      { name: 'Paris', color: '#F97316', baseValue: 15000 },
      { name: 'Rome', color: '#EC4899', baseValue: 12000 },
      { name: 'Amsterdam', color: '#6B7280', baseValue: 10000 }
    ],
    'booking-windows': [
      { name: '0-7 days', color: '#3B82F6', baseValue: 25000 },
      { name: '8-30 days', color: '#10B981', baseValue: 45000 },
      { name: '31-60 days', color: '#F59E0B', baseValue: 65000 },
      { name: '61-90 days', color: '#EF4444', baseValue: 55000 },
      { name: '91-120 days', color: '#8B5CF6', baseValue: 35000 },
      { name: '121-180 days', color: '#06B6D4', baseValue: 28000 },
      { name: '181-365 days', color: '#84CC16', baseValue: 18000 },
      { name: '365+ days', color: '#F97316', baseValue: 8000 }
    ],
    'length-of-stay': [
      { name: '1 night', color: '#3B82F6', baseValue: 15000 },
      { name: '2-3 nights', color: '#10B981', baseValue: 35000 },
      { name: '4-7 nights', color: '#F59E0B', baseValue: 85000 },
      { name: '8-14 nights', color: '#EF4444', baseValue: 65000 },
      { name: '15-21 nights', color: '#8B5CF6', baseValue: 25000 },
      { name: '22-30 nights', color: '#06B6D4', baseValue: 12000 },
      { name: '30+ nights', color: '#84CC16', baseValue: 5000 }
    ],
    'days-of-week': [
      { name: 'Monday', color: '#3B82F6', baseValue: 35000 },
      { name: 'Tuesday', color: '#10B981', baseValue: 32000 },
      { name: 'Wednesday', color: '#F59E0B', baseValue: 30000 },
      { name: 'Thursday', color: '#EF4444', baseValue: 33000 },
      { name: 'Friday', color: '#8B5CF6', baseValue: 45000 },
      { name: 'Saturday', color: '#06B6D4', baseValue: 55000 },
      { name: 'Sunday', color: '#84CC16', baseValue: 48000 }
    ]
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Calculate period-based configuration
    let stayPeriodStart = new Date();
    if (currentPeriod?.startDate) {
      stayPeriodStart = new Date(currentPeriod.startDate);
    }
    
    const analysisStart = new Date(stayPeriodStart);
    analysisStart.setMonth(analysisStart.getMonth() - 12);
    
    const startMonday = new Date(analysisStart);
    const dayOfWeek = startMonday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startMonday.setDate(startMonday.getDate() - daysToMonday);
    
    const today = new Date();
    const weeksCount = Math.ceil((today.getTime() - startMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Helper functions
    function addDays(d: Date, n: number) { 
      const x = new Date(d); 
      x.setDate(x.getDate() + n); 
      return x; 
    }

    function fmtWeekLabel(mondayDate: Date) {
      const d = new Date(Date.UTC(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `W${String(weekNo).padStart(2, '0')}`;
    }

    function fmtWeekLabelFull(mondayDate: Date) {
      const d = new Date(Date.UTC(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      
      const sunday = new Date(mondayDate);
      sunday.setDate(sunday.getDate() + 6);
      
      const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
      };
      
      return `Week ${String(weekNo).padStart(2, '0')} (${formatDate(mondayDate)} - ${formatDate(sunday)})`;
    }

    const weeks = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabel(addDays(startMonday, i * 7)))];
    const weeksFullLabels = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabelFull(addDays(startMonday, i * 7)))];

    const currentDimensionData = dimensionData[selectedDimension as keyof typeof dimensionData] || dimensionData.companies;

    const generateRunningTotals = (baseValue: number, growth: number = 1.15) => {
      const totals = [baseValue * 0.1];
      let runningTotal = totals[0];
      
      for (let i = 0; i < weeksCount; i++) {
        const weeklyIncrease = baseValue * (0.6 + Math.random() * 0.8) * Math.pow(growth, i / weeksCount);
        runningTotal += weeklyIncrease;
        totals.push(Math.round(runningTotal));
      }
      return totals;
    };

    const series = currentDimensionData.map(item => ({
      name: item.name,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: generateRunningTotals(item.baseValue, 1.08 + Math.random() * 0.08),
      itemStyle: { color: item.color },
      lineStyle: { width: 2 },
      label: { show: false }
    }));

    const calculateLabelPositions = () => {
      const endValues = series.map(s => ({
        name: s.name,
        value: s.data[s.data.length - 1] as number,
        color: s.itemStyle.color
      }));
      
      const values = endValues.map(item => item.value);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const valueRange = maxValue - minValue;
      
      const chartHeight = 500;
      const gridTop = 30;
      const gridBottom = 80;
      const plotHeight = chartHeight - gridTop - gridBottom;
      
      return endValues.map(item => {
        const normalizedValue = valueRange > 0 ? (item.value - minValue) / valueRange : 0.5;
        const yPosition = gridTop + (1 - normalizedValue) * plotHeight;
        
        const shortName = item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name;
        
        return {
          type: 'text',
          right: 10,
          top: yPosition,
          style: {
            text: `${shortName}: ${(item.value / 1000).toFixed(0)}K`,
            fontSize: 11,
            fontWeight: 'normal',
            fill: item.color,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: [2, 6],
            borderRadius: 4,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowBlur: 3
          }
        };
      });
    };

    const option = {
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: weeks,
        axisLabel: {
          rotate: 45,
          fontSize: 11,
          interval: 'auto',
          margin: 8
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Cumulative (BGN)',
        nameTextStyle: { fontSize: 12 },
        axisLabel: {
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const i = params[0].dataIndex;
          const weekLabel = i === 0 ? 'Before' : weeksFullLabels[i];
          
          const fmtMoney = (v: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
          
          let tooltipContent = `
            <div style="padding: 12px;">
              <div style="font-weight: 600; margin-bottom: 8px;">${weekLabel}</div>
              <div style="font-size: 12px;">
          `;
          
          const sortedParams = params.sort((a: any, b: any) => b.value - a.value);
          
          sortedParams.forEach((param: any) => {
            tooltipContent += `
              <div><span style="color: ${param.color};">■</span> ${param.seriesName}: <b>${fmtMoney(param.value)} BGN</b></div>
            `;
          });
          
          tooltipContent += `
              </div>
            </div>
          `;
          
          return tooltipContent;
        }
      },
      legend: { 
        data: currentDimensionData.map(item => item.name),
        bottom: 10,
        textStyle: { fontSize: 11 },
        itemWidth: 14,
        itemHeight: 10,
        type: 'scroll',
        pageButtonItemGap: 5,
        pageButtonGap: 20,
        pageIconSize: 10
      },
      grid: {
        left: 60,
        right: 160,
        top: 30,
        bottom: 80,
        containLabel: true
      },
      series: series,
      graphic: calculateLabelPositions()
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [selectedHotels, currentPeriod, selectedDimension]);

  const currentDimensionLabel = dimensions.find(d => d.id === selectedDimension)?.label || 'Top 10 Companies';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">{currentDimensionLabel}</h3>
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            title={`Помощ за ${currentDimensionLabel}`}
          >
            <HelpCircle size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dimensions.map(dimension => (
                <option key={dimension.id} value={dimension.id}>
                  {dimension.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <DrillDownIcon context="chart" />
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
      </div>
    </div>
  );
};

export default UnifiedTop10Analysis;