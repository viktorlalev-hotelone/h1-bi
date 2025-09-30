import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { useHotelSelection, useCurrentPeriod } from '../hooks/useHotelSelection';

interface PaceAnalysisTableProps {
  className?: string;
}

const PaceAnalysisTable: React.FC<PaceAnalysisTableProps> = ({ className = '' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedHotels } = useHotelSelection();
  const currentPeriod = useCurrentPeriod('rooms-explorer');

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // === КОНФИГУРАЦИЯ НА ДИАПАЗОНА БАЗИРАН НА ПЕРИОД НА ПРЕСТОЙ ===
    // Вземаме началната дата на периода на престой и отиваме 12 месеца назад
    let stayPeriodStart = new Date();
    if (currentPeriod?.startDate) {
      stayPeriodStart = new Date(currentPeriod.startDate);
    }
    
    // 12 месеца преди началото на периода на престой
    const analysisStart = new Date(stayPeriodStart);
    analysisStart.setMonth(analysisStart.getMonth() - 12);
    
    // Намираме понеделника на седмицата, която съдържа analysisStart
    const startMonday = new Date(analysisStart);
    const dayOfWeek = startMonday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Sunday
    startMonday.setDate(startMonday.getDate() - daysToMonday);
    
    // Изчисляваме колко седмици до днес
    const today = new Date();
    const weeksCount = Math.ceil((today.getTime() - startMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // Генерираме седмичните етикети
    const weeks = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabel(addDays(startMonday, i * 7)))];
    const weeksFullLabels = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabelFull(addDays(startMonday, i * 7)))];

    // Генерираме седмичните етикети
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
      
      // Кратък формат за X-axis
      return `W${String(weekNo).padStart(2, '0')}`;
    }

    // Пълен формат за tooltip
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

    // Генерираме седмичните данни за Pace Analysis
    const generatePaceData = () => {
      const weeks = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabel(addDays(startMonday, i * 7)))];
      const weeksFullLabels = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabelFull(addDays(startMonday, i * 7)))];
      const rawData = [['Week', 'Type', 'Running Total']];
      
    }
    const generateRunningTotals = (baseValue: number, growth: number = 1.15) => {
      const totals = [baseValue * 0.1]; // Before период
      let runningTotal = totals[0];
      
      for (let i = 0; i < weeksCount; i++) {
        const weeklyIncrease = baseValue * (0.8 + Math.random() * 0.4) * Math.pow(growth, i / weeksCount);
        runningTotal += weeklyIncrease;
        totals.push(Math.round(runningTotal));
      }
      return totals;
    };
    
    const currentTotals = generateRunningTotals(45000, 1.12);
    const priorTotals = generateRunningTotals(42000, 1.08);
    const budgetTotals = generateRunningTotals(48000, 1.10);
    
    // Генерираме occupancy данни
    const generateOccupancyData = (baseOccupancy: number) => {
      const occupancy = [baseOccupancy * 0.3]; // Before период
      for (let i = 0; i < weeksCount; i++) {
        const seasonalFactor = 1 + 0.2 * Math.sin((i / weeksCount) * 2 * Math.PI);
        const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
        occupancy.push(Math.min(100, baseOccupancy * seasonalFactor * randomFactor));
      }
      return occupancy;
    };
    
    const currentOccupancy = generateOccupancyData(75);
    const priorOccupancy = generateOccupancyData(72);
    const budgetOccupancy = generateOccupancyData(78);

    const option = {
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: weeks,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          interval: 'auto',
          margin: 8
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Cumulative Bookings (BGN)',
        axisLabel: {
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
          
          return `
            <div style="padding: 12px;">
              <div style="font-weight: 600; margin-bottom: 8px;">${weekLabel}</div>
              <div style="font-size: 12px;">
                <div><span style="color: #3B82F6;">■</span> Current: <b>${fmtMoney(currentTotals[i])} BGN</b> (${currentOccupancy[i].toFixed(1)}% occ)</div>
                <div><span style="color: #6B7280;">■</span> Prior Year: <b>${fmtMoney(priorTotals[i])} BGN</b> (${priorOccupancy[i].toFixed(1)}% occ)</div>
                <div><span style="color: #10B981;">■</span> Budget: <b>${fmtMoney(budgetTotals[i])} BGN</b> (${budgetOccupancy[i].toFixed(1)}% occ)</div>
              </div>
            </div>
          `;
        }
      },
      legend: { 
        data: ['Current', 'Prior Year', 'Budget'],
        bottom: 10
      },
      grid: {
        left: 40,
        right: 20,
        top: 30,
        bottom: 80,
        bottom: 60,
        containLabel: true
      },
      series: [
        { 
          name: 'Current', 
          type: 'line', 
          smooth: true,
          showSymbol: false,
          data: currentTotals,
          itemStyle: { color: '#3B82F6' },
          lineStyle: { width: 3 },
          label: { show: false }
        },
        { 
          name: 'Prior Year', 
          type: 'line', 
          smooth: true,
          showSymbol: false,
          data: priorTotals,
          itemStyle: { color: '#6B7280' },
          lineStyle: { width: 2 },
          label: { show: false }
        },
        { 
          name: 'Budget', 
          type: 'line', 
          smooth: true,
          showSymbol: false,
          data: budgetTotals,
          itemStyle: { color: '#10B981' },
          lineStyle: { width: 2 },
          label: { show: false }
        }
      ],
      graphic: (() => {
        // Изчисляваме позициите на етикетите спрямо финалните стойности на линиите
        const endValues = [
          { name: 'Current', value: currentTotals[currentTotals.length - 1], color: '#3B82F6' },
          { name: 'Prior Year', value: priorTotals[priorTotals.length - 1], color: '#6B7280' },
          { name: 'Budget', value: budgetTotals[budgetTotals.length - 1], color: '#10B981' }
        ];
        
        // Намираме min и max стойности за изчисляване на Y позициите
        const values = endValues.map(item => item.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue;
        
        // Изчисляваме Y позициите базирани на стойностите
        const chartHeight = 500;
        const gridTop = 30;
        const gridBottom = 80;
        const plotHeight = chartHeight - gridTop - gridBottom;
        
        return endValues.map(item => {
          // Нормализираме стойността между 0 и 1
          const normalizedValue = valueRange > 0 ? (item.value - minValue) / valueRange : 0.5;
          // Обръщаме Y координатата (по-високи стойности отгоре)
          const yPosition = gridTop + (1 - normalizedValue) * plotHeight;
          
          return {
            type: 'text',
            right: 10,
            top: yPosition,
            style: {
              text: `${item.name}: ${(item.value / 1000).toFixed(0)}K`,
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
      })()
    };

    chart.setOption(option);

    // Resize handler
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [selectedHotels, currentPeriod]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-900">Pace Analysis</h3>
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            title="Помощ за Pace Analysis"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <DrillDownIcon context="chart" />
        </div>
      </div>

      {/* Chart */}
      <div className="p-3">
        <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
      </div>
    </div>
  );
};

export default PaceAnalysisTable;