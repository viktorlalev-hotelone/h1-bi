import React, { useState, useRef, useEffect } from 'react';
import { DailyPickupData, calculatePercentageDifference, formatSparklineValue, getSparklineFillColor, getSparklineStrokeColor } from '../utils/mockDataGenerators';

interface SevenDayPickupSparklineProps {
  data: DailyPickupData[];
  kpiTitle: string;
  isExpense?: boolean;
  className?: string;
}

const SevenDayPickupSparkline: React.FC<SevenDayPickupSparklineProps> = ({ 
  data, 
  kpiTitle, 
  isExpense = false,
  className = '' 
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) return null;

  // Increased sparkline dimensions for better visibility (25% larger)
  const width = 100;
  const height = 32;
  const padding = 3;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Calculate overall trend from yesterday's value
  const yesterdayData = data.find(d => d.isYesterday);
  const yesterdayValue = yesterdayData?.current || 0;
  const fillColor = getSparklineFillColor(yesterdayValue, isExpense);
  const strokeColor = getSparklineStrokeColor(yesterdayValue, isExpense);

  // Find min/max values for scaling
  const currentValues = data.map(d => d.current);
  const minCurrent = Math.min(...currentValues);
  const maxCurrent = Math.max(...currentValues);
  const range = maxCurrent - minCurrent;

  // Generate SVG path for sparkline
  const generatePath = () => {
    if (range === 0) {
      // Flat line if no variation
      const y = padding + plotHeight / 2;
      return `M ${padding} ${y} L ${width - padding} ${y}`;
    }

    const points = data.map((day, index) => {
      const x = padding + (index / (data.length - 1)) * plotWidth;
      const normalizedValue = (day.current - minCurrent) / range;
      const y = padding + plotHeight - (normalizedValue * plotHeight);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });

    return points.join(' ');
  };

  // Generate area path (for fill)
  const generateAreaPath = () => {
    if (range === 0) {
      const y = padding + plotHeight / 2;
      return `M ${padding} ${height - padding} L ${padding} ${y} L ${width - padding} ${y} L ${width - padding} ${height - padding} Z`;
    }

    const linePath = generatePath();
    const baseY = height - padding;
    return `${linePath} L ${width - padding} ${baseY} L ${padding} ${baseY} Z`;
  };

  // Handle mouse movement to detect hovered day
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Calculate which day is being hovered
    const relativeX = Math.max(0, Math.min(x - padding, plotWidth));
    const dayIndex = Math.round((relativeX / plotWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(dayIndex, data.length - 1));
    
    setHoveredDayIndex(clampedIndex);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoveredDayIndex(null);
  };

  // Adjust tooltip position to stay within screen bounds
  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = tooltipPosition.x;
      let adjustedY = tooltipPosition.y;
      
      // Adjust horizontal position
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      if (adjustedX < 10) {
        adjustedX = 10;
      }
      
      // Adjust vertical position
      if (rect.bottom > viewportHeight) {
        adjustedY = tooltipPosition.y - rect.height - 10;
      }
      if (adjustedY < 10) {
        adjustedY = 10;
      }
      
      // Apply adjusted position
      tooltip.style.left = `${adjustedX}px`;
      tooltip.style.top = `${adjustedY}px`;
    }
  }, [showTooltip, tooltipPosition, hoveredDayIndex]);

  // Format values for tooltip
  const formatTooltipValue = (value: number): string => {
    if (kpiTitle.includes('Revenue') || kpiTitle.includes('Expenses')) {
      return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (kpiTitle.includes('%') || kpiTitle.includes('Occupancy')) {
      return `${value.toFixed(1)}%`;
    } else if (kpiTitle.includes('ADR') || kpiTitle.includes('per Room')) {
      return value.toFixed(2);
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const getCurrencyUnit = (): string => {
    if (kpiTitle.includes('Revenue') || kpiTitle.includes('Expenses')) {
      return 'BGN';
    } else if (kpiTitle.includes('%') || kpiTitle.includes('Occupancy')) {
      return '';
    } else if (kpiTitle.includes('ADR') || kpiTitle.includes('per Room')) {
      return 'BGN';
    }
    return '';
  };

  const getComparisonColor = (percentage: number): string => {
    if (isExpense) {
      // For expenses: negative percentage (decrease) is good (green), positive (increase) is bad (red)
      return percentage <= 0 ? '#10B981' : '#EF4444';
    } else {
      // For revenue/occupancy: positive percentage is good (green), negative is bad (red)
      return percentage >= 0 ? '#10B981' : '#EF4444';
    }
  };

  return (
    <>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`cursor-pointer transition-opacity duration-200 hover:opacity-100 ${className}`}
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15))' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Area fill */}
        <path
          d={generateAreaPath()}
          fill={fillColor}
          fillOpacity={0.25}
        />
        
        {/* Line stroke */}
        <path
          d={generatePath()}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((day, index) => {
          const x = padding + (index / (data.length - 1)) * plotWidth;
          const normalizedValue = range === 0 ? 0.5 : (day.current - minCurrent) / range;
          const y = padding + plotHeight - (normalizedValue * plotHeight);
          
          const isHovered = hoveredDayIndex === index;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={day.isYesterday ? 3 : (isHovered ? 2.5 : 1.5)}
              fill={day.isYesterday ? strokeColor : (isHovered ? strokeColor : 'white')}
              stroke={strokeColor}
              strokeWidth={day.isYesterday ? 2 : (isHovered ? 2 : 1)}
              opacity={day.isYesterday ? 1 : (isHovered ? 1 : 0.8)}
              className="transition-all duration-150"
            />
          );
        })}
        
        {/* Hover indicator line */}
        {hoveredDayIndex !== null && (
          <line
            x1={padding + (hoveredDayIndex / (data.length - 1)) * plotWidth}
            y1={padding}
            x2={padding + (hoveredDayIndex / (data.length - 1)) * plotWidth}
            y2={height - padding}
            stroke={strokeColor}
            strokeWidth={1}
            strokeDasharray="2 2"
            opacity={0.6}
          />
        )}
      </svg>

      {/* Enhanced Tooltip */}
      {showTooltip && hoveredDayIndex !== null && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 pointer-events-none animate-fadeIn"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            maxWidth: '280px',
            minWidth: '240px'
          }}
        >
          {(() => {
            const day = data[hoveredDayIndex];
            const vsPrior = calculatePercentageDifference(day.current, day.prior);
            const vsBudget = calculatePercentageDifference(day.current, day.budget);
            const vsForecast = calculatePercentageDifference(day.current, day.forecast);
            const currencyUnit = getCurrencyUnit();
            
            return (
              <div>
                <div className={`text-sm font-semibold mb-3 ${
                  day.isYesterday ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {day.dayName}, {day.date}
                  {day.isYesterday && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Yesterday
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  {/* Current Value - Main Figure */}
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="font-medium text-blue-900">CUR:</span>
                    <span className="font-bold text-blue-900">
                      {formatTooltipValue(day.current)} {currencyUnit}
                    </span>
                  </div>
                  
                  {/* Comparisons */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">PRI:</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {formatTooltipValue(day.prior)} {currencyUnit}
                        </span>
                        <span className={`ml-2 text-xs font-medium`} style={{ color: getComparisonColor(vsPrior) }}>
                          ({vsPrior >= 0 ? '+' : ''}{vsPrior.toFixed(1)}% vs PRI)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">BUD:</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {formatTooltipValue(day.budget)} {currencyUnit}
                        </span>
                        <span className={`ml-2 text-xs font-medium`} style={{ color: getComparisonColor(vsBudget) }}>
                          ({vsBudget >= 0 ? '+' : ''}{vsBudget.toFixed(1)}% vs BUD)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">FCT:</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {formatTooltipValue(day.forecast)} {currencyUnit}
                        </span>
                        <span className={`ml-2 text-xs font-medium`} style={{ color: getComparisonColor(vsForecast) }}>
                          ({vsForecast >= 0 ? '+' : ''}{vsForecast.toFixed(1)}% vs FCT)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  7-day trend • Hover to see daily details
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
};

export default SevenDayPickupSparkline;