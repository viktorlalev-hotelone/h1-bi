import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from '../DrillDownIcon';

interface Top10CompaniesByPickupChartProps {
  onHelpClick?: () => void;
  className?: string;
}

interface CompanyPickupData {
  name: string;
  pickup: number;
  color: string;
}

const Top10CompaniesByPickupChart: React.FC<Top10CompaniesByPickupChartProps> = ({
  onHelpClick,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Mock data for Top 10 Companies by Total Revenue Pickup Yesterday
  const companiesData: CompanyPickupData[] = [
    { name: 'TUI Bulgaria', pickup: 15420, color: '#3B82F6' },
    { name: 'Balkan Holidays', pickup: 12850, color: '#10B981' },
    { name: 'Coral Travel', pickup: 9680, color: '#F59E0B' },
    { name: 'Anex Tour', pickup: 8340, color: '#EF4444' },
    { name: 'Join UP!', pickup: 7250, color: '#8B5CF6' },
    { name: 'Pegasus', pickup: 6180, color: '#06B6D4' },
    { name: 'Sunmar', pickup: 5420, color: '#84CC16' },
    { name: 'Biblio Globus', pickup: 4680, color: '#F97316' },
    { name: 'TEZ Tour', pickup: 3920, color: '#EC4899' },
    { name: 'Direct Bookings', pickup: 3180, color: '#6B7280' }
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: { show: false },
      grid: {
        left: 80,
        right: 80,
        top: 20,
        bottom: 20,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Pickup (BGN)',
        nameTextStyle: { 
          fontSize: 12,
          color: '#6B7280'
        },
        axisLabel: {
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          }
        },
        splitLine: {
          lineStyle: {
            color: '#E5E7EB',
            width: 1
          }
        }
      },
      yAxis: {
        type: 'category',
        data: companiesData.map(item => item.name).reverse(), // Reverse for top-to-bottom ordering
        axisLabel: {
          fontSize: 12,
          margin: 8,
          color: '#374151'
        },
        axisTick: { show: false },
        axisLine: { show: false }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const data = params[0];
          const company = data.name;
          const pickup = data.value;
          const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
          
          return `
            <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${company}</div>
              <div style="font-size: 14px;">
                <div style="margin-bottom: 4px;">
                  <span style="color: #6B7280;">Revenue Pickup Yesterday:</span> 
                  <span style="color: #059669; font-weight: 600;">
                    +${fmt(pickup)} BGN
                  </span>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF;">
                  Revenue increase from bookings made yesterday
                </div>
              </div>
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#D1D5DB',
        borderWidth: 1,
        textStyle: {
          color: '#374151'
        }
      },
      series: [
        {
          name: 'Revenue Pickup',
          type: 'bar',
          data: companiesData.map(item => ({
            value: item.pickup,
            itemStyle: { 
              color: item.color,
              borderRadius: [0, 4, 4, 0]
            }
          })).reverse(), // Reverse to match yAxis order
          barWidth: '60%',
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          label: {
            show: true,
            position: 'right',
            fontSize: 11,
            fontWeight: 'bold',
            color: '#374151',
            formatter: (params: any) => {
              const value = params.value;
              if (value >= 1000) {
                return `+${(value / 1000).toFixed(1)}K`;
              }
              return `+${value}`;
            }
          }
        }
      ],
      animation: true,
      animationDuration: 800,
      animationEasing: 'cubicOut'
    };

    chart.setOption(option);

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
          <h3 className="text-lg font-semibold text-gray-900">Top 10 Companies by Revenue</h3>
          <div className="flex items-center space-x-2">
            <DrillDownIcon context="financial" />
            {onHelpClick && (
              <button
                onClick={onHelpClick}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                title={`Помощ за Top 10 Companies by Revenue`}
              >
                <HelpCircle size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
          <div className="mt-4 text-xs text-gray-500">
            <p>• Shows revenue pickup from bookings made yesterday by company</p>
            <p>• Bars are ordered from highest to lowest revenue contribution</p>
            <p>• Hover over bars to see detailed revenue information</p>
          </div>
        </div>
    </div>
  );
};

export default Top10CompaniesByPickupChart;