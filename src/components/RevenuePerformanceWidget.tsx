import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Customized } from 'recharts';
import { Download, Calendar, HelpCircle } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { formatRevenue, formatPercentage, getPercentageColor } from '../utils/formatters';
import { monthlyPerformanceData } from '../data/monthlyPerformanceData';

interface RevenuePerformanceWidgetProps {
  onHelpClick?: () => void;
}

const RevenuePerformanceWidget: React.FC<RevenuePerformanceWidgetProps> = ({ onHelpClick }) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState({
    budget: true,
    forecast: true,
    otbCurrent: true,
    otbPrior: true,
  });
  const [overlayPositions, setOverlayPositions] = useState({
    px: 0,
    plotLeft: 0,
    plotRight: 0,
    actualCX: 0,
    otbCX: 0,
  });


  // Chart margins - consistent everywhere
  const MARGINS = { top: 48, right: 24, bottom: 8, left: 56 };
  
  // Use shared monthly performance data
  const currentData = monthlyPerformanceData.map(month => ({
    ...month,
    otbCurrent: month.revenue.current,
    otbPrior: month.revenue.prior,
    budget: month.revenue.budget,
    forecast: month.revenue.forecast
  }));
  
  const freezeDate = new Date('2024-06-30'); // Forecast shown after this date
  const currentDate = new Date();
  const showForecast = currentDate > freezeDate;

  // Calculate smart Y-axis domain for better visibility
  const calculateYAxisDomain = () => {
    const visibleData = currentData.filter(d => {
      const hasOtbCurrent = d.otbCurrent > 0;
      return hasOtbCurrent || visible.otbPrior || visible.budget || (visible.forecast && showForecast);
    });
    
    if (visibleData.length === 0) return [0, 1000000];
    
    const allValues: number[] = [];
    
    visibleData.forEach(d => {
      if (visible.otbCurrent && d.otbCurrent > 0) allValues.push(d.otbCurrent);
      if (visible.otbPrior) allValues.push(d.otbPrior);
      if (visible.budget) allValues.push(d.budget);
      if (visible.forecast && showForecast) allValues.push(d.forecast);
    });
    
    if (allValues.length === 0) return [0, 1000000];
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    
    // Add 10% padding above and below for better visibility
    const padding = Math.max(range * 0.1, 10000); // Minimum 10k padding
    const domainMin = Math.max(0, min - padding);
    const domainMax = max + padding;
    
    return [domainMin, domainMax];
  };

  // Calculate today's position and overlay geometry
  React.useEffect(() => {
    const calculateOverlayPositions = () => {
      if (!containerRef) return;

      const cw = containerRef.clientWidth;
      if (cw === 0) return;

      const plotLeft = MARGINS.left;
      const plotRight = cw - MARGINS.right;
      const plotWidth = plotRight - plotLeft;

      // Calculate today's position (numeric month index)
      const today = new Date();
      const m = today.getMonth() + 1; // 1..12
      const days = new Date(today.getFullYear(), m, 0).getDate();
      const d = today.getDate();
      const todayIndex = m + d / days; // e.g. Sep 14 ≈ 9.47

      // Convert to pixels along 1..12 range (11 intervals between 12 ticks)
      let px = plotLeft + ((todayIndex - 1) / 11) * plotWidth;
      px = Math.max(plotLeft, Math.min(px, plotRight));

      // Calculate band centers
      const actualCX = (plotLeft + px) / 2;
      const otbCX = (px + plotRight) / 2;

      setOverlayPositions({
        px,
        plotLeft,
        plotRight,
        actualCX,
        otbCX,
      });
    };

    calculateOverlayPositions();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateOverlayPositions);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  // Calculate today's position for the ReferenceLine (numeric month index)
  const today = new Date();
  const m = today.getMonth() + 1; // 1..12
  const daysInMonth = new Date(today.getFullYear(), m, 0).getDate();
  const d = today.getDate(); // 1..daysInMonth
  const todayPosition = m + (d / daysInMonth); // fractional position between months

  // Format today's date for the pill label
  const formatTodayLabel = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Month names for tick formatter
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formatMonth = (monthIndex: number) => {
    return monthNames[monthIndex - 1] || '';
  };

  const calculatePercentage = (current: number, comparison: number): number => {
    if (comparison === 0) return 0;
    return ((current - comparison) / comparison) * 100;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const visiblePayload = payload.filter((entry: any) => {
        const dataKey = entry.dataKey;
        if (dataKey === 'otbCurrent') return visible.otbCurrent;
        if (dataKey === 'otbPrior') return visible.otbPrior;
        if (dataKey === 'budget') return visible.budget;
        if (dataKey === 'forecast') return visible.forecast;
        return true;
      });
      
      if (visiblePayload.length === 0) return null;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            {visible.otbCurrent && (
              <>
                <div className="flex justify-between items-center">
                  <span>CUR:</span>
                  <span className="font-medium">{formatRevenue(data.otbCurrent)}</span>
                </div>
                {visible.otbPrior && (
                  <div className="flex justify-between items-center">
                    <span>vs PRI:</span>
                    <span className={`font-medium ${getPercentageColor(calculatePercentage(data.otbCurrent, data.otbPrior))}`}>
                      {formatPercentage(calculatePercentage(data.otbCurrent, data.otbPrior))}
                    </span>
                  </div>
                )}
                {visible.budget && (
                  <div className="flex justify-between items-center">
                    <span>vs BUD:</span>
                    <span className={`font-medium ${getPercentageColor(calculatePercentage(data.otbCurrent, data.budget))}`}>
                      {formatPercentage(calculatePercentage(data.otbCurrent, data.budget))}
                    </span>
                  </div>
                )}
                {visible.forecast && showForecast && (
                  <div className="flex justify-between items-center">
                    <span>vs FCT:</span>
                    <span className={`font-medium ${getPercentageColor(calculatePercentage(data.otbCurrent, data.forecast))}`}>
                      {formatPercentage(calculatePercentage(data.otbCurrent, data.forecast))}
                    </span>
                  </div>
                )}
              </>
            )}
            {visible.otbPrior && (
              <div className="flex justify-between items-center">
                <span>PRI:</span>
                <span className="font-medium">{formatRevenue(data.otbPrior)}</span>
              </div>
            )}
            {visible.budget && (
              <div className="flex justify-between items-center">
                <span>BUD:</span>
                <span className="font-medium">{formatRevenue(data.budget)}</span>
              </div>
            )}
            {visible.forecast && showForecast && (
              <div className="flex justify-between items-center">
                <span>FCT:</span>
                <span className="font-medium">{formatRevenue(data.forecast)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const exportToCSV = () => {
    const headers = ['Month', 'CUR', 'PRI', 'Δ% vs PRI', 'BUD', 'Δ% vs BUD', 'FCT', 'Δ% vs FCT'];
    const rows = currentData.map(row => [
      row.month,
      row.otbCurrent,
      row.otbPrior,
      formatPercentage(calculatePercentage(row.otbCurrent, row.otbPrior)),
      row.budget,
      formatPercentage(calculatePercentage(row.otbCurrent, row.budget)),
      row.forecast,
      formatPercentage(calculatePercentage(row.otbCurrent, row.forecast)),
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-performance-${new Date().getFullYear()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Total Revenue Performance by Month | TDR (To Date Records)</h2>
          <div className="flex items-center space-x-2">
            <DrillDownIcon context="revenue" />
            {onHelpClick && (
              <button
                onClick={onHelpClick}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                title="Помощ за Revenue Performance"
              >
                <HelpCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 sm:p-6">
        <div className="relative h-64 sm:h-80 mb-4 sm:mb-6" ref={setContainerRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData} margin={{ top: 48, right: 12, bottom: 8, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="monthIndex" 
                domain={[1, 12]} 
                tickFormatter={formatMonth}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                allowDataOverflow
                xAxisId="m1"
              />
              <YAxis 
                id="left"
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                domain={calculateYAxisDomain()}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                content={(props) => {
                  const map = { "BUD":"budget", "FCT":"forecast",
                               "CUR":"otbCurrent", "PRI":"otbPrior" };
                  return (
                    <div className="flex justify-center items-center flex-wrap gap-6 mt-4">
                      {props.payload?.map((item: any) => {
                        const key = map[item.value as keyof typeof map];
                        const isOn = visible[key as keyof typeof visible];
                        return (
                          <button
                            key={item.value}
                            type="button"
                            role="button"
                            tabIndex={0}
                            aria-pressed={isOn}
                            onClick={() => setVisible(v => ({ ...v, [key]: !v[key] }))}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                setVisible(v => ({ ...v, [key]: !v[key] }));
                              }
                            }}
                            className={`flex items-center gap-1 sm:gap-2 cursor-pointer transition-opacity duration-200 bg-transparent border-none p-0 ${
                              isOn ? 'opacity-100' : 'opacity-45'
                            }`}
                          >
                            <span
                              className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span
                              className="text-xs sm:text-sm font-medium"
                              style={{ color: item.color }}
                            >
                              {item.value}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <ReferenceLine 
                x={todayPosition} 
                xAxisId="m1"
                yAxisId="left"
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="4 4" 
                isFront
                ifOverflow="extendDomain"
              />
              <Line
                type="monotone"
                dataKey="otbCurrent"
                stroke="#3B82F6"
                strokeWidth={3}
                name="CUR"
                connectNulls={false}
                xAxisId="m1"
                yAxisId="left"
                hide={!visible.otbCurrent}
              />
              <Line
                type="monotone"
                dataKey="otbPrior"
                stroke="#6B7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="PRI"
                xAxisId="m1"
                yAxisId="left"
                hide={!visible.otbPrior}
              />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#10B981"
                strokeWidth={1}
                name="BUD"
                xAxisId="m1"
                yAxisId="left"
                hide={!visible.budget}
              />
              {showForecast && (
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  name="FCT"
                  xAxisId="m1"
                  yAxisId="left"
                  hide={!visible.forecast}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* HTML Overlay */}
          {overlayPositions.px > 0 && (
            <>
              {/* Top rules */}
              <div
                style={{
                  position: 'absolute',
                  top: MARGINS.top - 44,
                  left: overlayPositions.plotLeft,
                  width: overlayPositions.px - overlayPositions.plotLeft,
                  height: 1,
                  background: '#FCA5A5',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: MARGINS.top - 44,
                  left: overlayPositions.px,
                  width: overlayPositions.plotRight - overlayPositions.px,
                  height: 1,
                  background: '#93C5FD',
                  pointerEvents: 'none',
                }}
              />

              {/* Top captions */}
              <div
                style={{
                  position: 'absolute',
                  left: overlayPositions.actualCX,
                  top: MARGINS.top - 36,
                  transform: 'translateX(-50%)',
                  color: '#EF4444',
                  fontSize: 12,
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}
              >
                PTD
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: overlayPositions.otbCX,
                  top: MARGINS.top - 36,
                  transform: 'translateX(-50%)',
                  color: '#2563EB',
                  fontSize: 12,
                  fontWeight: 600,
                  pointerEvents: 'none',
                }}
              >
                OTB
              </div>

              {/* Today pill label */}
              <div
                style={{
                  position: 'absolute',
                  left: overlayPositions.px,
                  top: MARGINS.top - 22,
                  transform: 'translateX(-50%)',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 8,
                  padding: '4px 10px',
                  color: '#B91C1C',
                  fontSize: 12,
                  fontWeight: 600,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Today, {formatTodayLabel(today)}
              </div>

              {/* Vertical Today line */}
              <div
                style={{
                  position: 'absolute',
                  left: overlayPositions.px,
                  top: MARGINS.top,
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: `calc(100% - ${MARGINS.top + MARGINS.bottom}px)`,
                  background: `repeating-linear-gradient(
                    to bottom,
                    #EF4444 0,
                    #EF4444 4px,
                    transparent 4px,
                    transparent 8px
                  )`,
                  opacity: 0.8,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            </>
          )}
        </div>

        {/* Export Button and Data Freshness */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Calendar size={12} className="mr-1" />
            Data updated: 13 Sep 2025
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center px-2 sm:px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
          >
            <Download size={12} className="mr-1" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenuePerformanceWidget;