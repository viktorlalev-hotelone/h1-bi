export interface DailyPickupData {
  date: string;
  dayName: string;
  isYesterday: boolean;
  current: number;
  prior: number;
  budget: number;
  forecast: number;
}

export const generateSevenDayPickupData = (kpiTitle: string, yesterdayBadgeValue: number, isExpense: boolean = false): DailyPickupData[] => {
  const data: DailyPickupData[] = [];
  const today = new Date();
  
  // Generate data for last 7 days (including yesterday)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const isYesterday = i === 1; // Yesterday is 1 day ago
    
    if (isYesterday) {
      // For yesterday, use the exact badge value
      const current = yesterdayBadgeValue;
      
      // Generate realistic comparisons for yesterday
      let priorVariation = 0.85 + Math.random() * 0.2; // 85-105% of current
      let budgetVariation = 0.9 + Math.random() * 0.15; // 90-105% of current
      let forecastVariation = 0.92 + Math.random() * 0.12; // 92-104% of current
      
      // For expenses, adjust logic (higher expenses are worse)
      if (isExpense) {
        priorVariation = 0.8 + Math.random() * 0.25; // 80-105% of current
        budgetVariation = 0.85 + Math.random() * 0.2; // 85-105% of current
        forecastVariation = 0.88 + Math.random() * 0.18; // 88-106% of current
      }
      
      data.push({
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        dayName: date.toLocaleDateString('en-GB', { weekday: 'short' }),
        isYesterday,
        current,
        prior: Math.round(current * priorVariation),
        budget: Math.round(current * budgetVariation),
        forecast: Math.round(current * forecastVariation)
      });
    } else {
      // For other days, generate variations around the yesterday value
      let dailyVariation = 0.7 + Math.random() * 0.6; // 70-130% variation
      
      if (kpiTitle.includes('Revenue')) {
        dailyVariation = 0.8 + Math.random() * 0.4; // 80-120% variation
      } else if (kpiTitle.includes('Occupancy')) {
        dailyVariation = 0.9 + Math.random() * 0.2; // 90-110% variation
      } else if (kpiTitle.includes('Expenses')) {
        dailyVariation = 0.85 + Math.random() * 0.3; // 85-115% variation
      }
      
      const current = Math.round(yesterdayBadgeValue * dailyVariation);
      
      // Generate comparisons for this day
      let priorVariation = 0.85 + Math.random() * 0.2;
      let budgetVariation = 0.9 + Math.random() * 0.15;
      let forecastVariation = 0.92 + Math.random() * 0.12;
      
      if (isExpense) {
        priorVariation = 0.8 + Math.random() * 0.25;
        budgetVariation = 0.85 + Math.random() * 0.2;
        forecastVariation = 0.88 + Math.random() * 0.18;
      }
      
      data.push({
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        dayName: date.toLocaleDateString('en-GB', { weekday: 'short' }),
        isYesterday,
        current,
        prior: Math.round(current * priorVariation),
        budget: Math.round(current * budgetVariation),
        forecast: Math.round(current * forecastVariation)
      });
    }
  }
  
  return data;
};

export const calculatePercentageDifference = (current: number, comparison: number): number => {
  if (comparison === 0) return 0;
  return ((current - comparison) / comparison) * 100;
};

export const formatSparklineValue = (value: number, kpiTitle: string): string => {
  const sign = value >= 0 ? '+' : '';
  
  if (kpiTitle.includes('Revenue') || kpiTitle.includes('Expenses')) {
    if (Math.abs(value) >= 1000000) {
      return `${sign}${(value / 1000000).toFixed(2)}M BGN`;
    } else if (Math.abs(value) >= 1000) {
      return `${sign}${(value / 1000).toFixed(0)}K BGN`;
    }
    return `${sign}${value.toLocaleString()} BGN`;
  } else if (kpiTitle.includes('Occupancy') || kpiTitle.includes('%')) {
    return `${sign}${value.toFixed(1)}%`;
  } else if (kpiTitle.includes('ADR') || kpiTitle.includes('per Room')) {
    return `${sign}${value.toFixed(2)} BGN`;
  }
  return `${sign}${value.toLocaleString()}`;
};

export const getSparklineFillColor = (current: number, isExpense: boolean = false): string => {
  if (isExpense) {
    // For expenses: negative change (decrease) is good (green), positive change (increase) is bad (red)
    return current <= 0 ? '#10B981' : '#EF4444';
  } else {
    // For revenue/occupancy: positive change is good (green), negative change is bad (red)
    return current >= 0 ? '#10B981' : '#EF4444';
  }
};

export const getSparklineStrokeColor = (current: number, isExpense: boolean = false): string => {
  if (isExpense) {
    return current <= 0 ? '#059669' : '#DC2626';
  } else {
    return current >= 0 ? '#059669' : '#DC2626';
  }
};