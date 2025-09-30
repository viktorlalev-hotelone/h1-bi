import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from '../DrillDownIcon';

interface GuestNationalitiesMapProps {
  onHelpClick?: () => void;
  className?: string;
}

const GuestNationalitiesMap: React.FC<GuestNationalitiesMapProps> = ({
  onHelpClick,
  className = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // Load world map data
    const loadWorldMap = async () => {
      try {
        const response = await fetch('/maps/world.json');
        const geoJsonData = await response.json();
        
        // Register the map
        echarts.registerMap('world', geoJsonData);

        // Mock data for guest nationalities (revenue in BGN)
        const nationalitiesData = [
          { name: 'Bulgaria', value: 850000 },
          { name: 'Germany', value: 720000 },
          { name: 'United Kingdom', value: 580000 },
          { name: 'Russia', value: 520000 },
          { name: 'Romania', value: 450000 },
          { name: 'Poland', value: 380000 },
          { name: 'Czech Republic', value: 320000 },
          { name: 'France', value: 280000 },
          { name: 'Italy', value: 240000 },
          { name: 'Netherlands', value: 200000 },
          { name: 'Austria', value: 180000 },
          { name: 'Belgium', value: 150000 },
          { name: 'Switzerland', value: 120000 },
          { name: 'Sweden', value: 100000 },
          { name: 'Norway', value: 85000 },
          { name: 'Denmark', value: 75000 },
          { name: 'Finland', value: 65000 },
          { name: 'Spain', value: 55000 },
          { name: 'Portugal', value: 45000 },
          { name: 'Greece', value: 40000 }
        ];

        const option = {
          backgroundColor: '#FFFFFF',
          title: {
            show: false
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              if (params.data) {
                const value = params.data.value;
                const formattedValue = (value && typeof value === 'number') 
                  ? value.toLocaleString('bg-BG', { maximumFractionDigits: 0 })
                  : '0';
                return `
                  <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${params.name}</div>
                    <div style="font-size: 14px;">
                      <div style="margin-bottom: 4px;">
                        <span style="color: #6B7280;">Revenue:</span> 
                        <span style="color: #3B82F6; font-weight: 600;">
                          ${formattedValue} BGN
                        </span>
                      </div>
                      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF;">
                        Guest nationality revenue contribution
                      </div>
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="font-weight: 600; color: #6B7280;">${params.name}</div>
                    <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">No data available</div>
                  </div>
                `;
              }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#D1D5DB',
            borderWidth: 1,
            textStyle: {
              color: '#374151'
            }
          },
          visualMap: {
            min: 0,
            max: 850000,
            left: 'left',
            top: 'bottom',
            text: ['High', 'Low'],
            textStyle: {
              color: '#374151',
              fontSize: 12
            },
            inRange: {
              color: ['#DBEAFE', '#3B82F6', '#1E40AF', '#1E3A8A']
            },
            calculable: true,
            orient: 'horizontal',
            itemWidth: 20,
            itemHeight: 140,
            formatter: (value: number) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }
              return value.toString();
            }
          },
          geo: {
            map: 'world',
            roam: true,
            zoom: 2.5,
            center: [15, 54],
            itemStyle: {
              areaColor: '#F3F4F6',
              borderColor: '#E5E7EB',
              borderWidth: 0.5
            },
            emphasis: {
              itemStyle: {
                areaColor: '#E5E7EB',
                borderColor: '#9CA3AF',
                borderWidth: 1
              }
            },
            select: {
              itemStyle: {
                areaColor: '#DBEAFE'
              }
            }
          },
          series: [
            {
              name: 'Guest Nationalities Revenue',
              type: 'map',
              geoIndex: 0,
              data: nationalitiesData,
              emphasis: {
                focus: 'self',
                itemStyle: {
                  borderColor: '#1E40AF',
                  borderWidth: 2
                }
              }
            }
          ],
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        };

        chart.setOption(option);
      } catch (error) {
        console.error('Failed to load world map data:', error);
        
        // Fallback option without map data
        const fallbackOption = {
          backgroundColor: '#FFFFFF',
          title: {
            text: 'World Map Loading...',
            left: 'center',
            top: 'middle',
            textStyle: {
              color: '#6B7280',
              fontSize: 16
            }
          }
        };
        
        chart.setOption(fallbackOption);
      }
    };

    loadWorldMap();

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
        <h3 className="text-lg font-semibold text-gray-900">Guest Nationalities Revenue Map</h3>
        <div className="flex items-center space-x-2">
          <DrillDownIcon context="chart" />
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
              title="Помощ за Guest Nationalities Map"
            >
              <HelpCircle size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        <div className="mt-4 text-xs text-gray-500">
          <p>• Hover over countries to see detailed revenue data</p>
          <p>• Use mouse wheel to zoom and drag to pan around the map</p>
          <p>• Color intensity represents revenue contribution from each nationality</p>
        </div>
      </div>
    </div>
  );
};

export default GuestNationalitiesMap;