// Shared monthly performance data for Revenue, Expenses, and GOP calculations

export interface MonthlyPerformanceData {
  month: string;
  monthIndex: number;
  revenue: {
    current: number;
    prior: number;
    budget: number;
    forecast: number;
  };
  expenses: {
    current: number;
    prior: number;
    budget: number;
    forecast: number;
  };
  locked: boolean;
}

export const monthlyPerformanceData: MonthlyPerformanceData[] = [
  {
    month: 'Jan',
    monthIndex: 1,
    revenue: { current: 575000, prior: 520000, budget: 550000, forecast: 580000 },
    expenses: { current: 285000, prior: 270000, budget: 280000, forecast: 290000 },
    locked: true
  },
  {
    month: 'Feb',
    monthIndex: 2,
    revenue: { current: 620000, prior: 580000, budget: 600000, forecast: 615000 },
    expenses: { current: 295000, prior: 285000, budget: 290000, forecast: 300000 },
    locked: true
  },
  {
    month: 'Mar',
    monthIndex: 3,
    revenue: { current: 680000, prior: 620000, budget: 650000, forecast: 675000 },
    expenses: { current: 310000, prior: 295000, budget: 305000, forecast: 315000 },
    locked: true
  },
  {
    month: 'Apr',
    monthIndex: 4,
    revenue: { current: 720000, prior: 680000, budget: 700000, forecast: 715000 },
    expenses: { current: 325000, prior: 310000, budget: 320000, forecast: 330000 },
    locked: true
  },
  {
    month: 'May',
    monthIndex: 5,
    revenue: { current: 780000, prior: 720000, budget: 750000, forecast: 775000 },
    expenses: { current: 340000, prior: 325000, budget: 335000, forecast: 345000 },
    locked: true
  },
  {
    month: 'Jun',
    monthIndex: 6,
    revenue: { current: 820000, prior: 780000, budget: 800000, forecast: 815000 },
    expenses: { current: 355000, prior: 340000, budget: 350000, forecast: 360000 },
    locked: true
  },
  {
    month: 'Jul',
    monthIndex: 7,
    revenue: { current: 0, prior: 850000, budget: 880000, forecast: 885000 },
    expenses: { current: 0, prior: 365000, budget: 370000, forecast: 375000 },
    locked: false
  },
  {
    month: 'Aug',
    monthIndex: 8,
    revenue: { current: 0, prior: 880000, budget: 900000, forecast: 910000 },
    expenses: { current: 0, prior: 375000, budget: 380000, forecast: 385000 },
    locked: false
  },
  {
    month: 'Sep',
    monthIndex: 9,
    revenue: { current: 0, prior: 820000, budget: 850000, forecast: 860000 },
    expenses: { current: 0, prior: 350000, budget: 360000, forecast: 365000 },
    locked: false
  },
  {
    month: 'Oct',
    monthIndex: 10,
    revenue: { current: 0, prior: 750000, budget: 780000, forecast: 790000 },
    expenses: { current: 0, prior: 330000, budget: 340000, forecast: 345000 },
    locked: false
  },
  {
    month: 'Nov',
    monthIndex: 11,
    revenue: { current: 0, prior: 680000, budget: 700000, forecast: 710000 },
    expenses: { current: 0, prior: 310000, budget: 320000, forecast: 325000 },
    locked: false
  },
  {
    month: 'Dec',
    monthIndex: 12,
    revenue: { current: 0, prior: 620000, budget: 650000, forecast: 660000 },
    expenses: { current: 0, prior: 295000, budget: 305000, forecast: 310000 },
    locked: false
  }
];

// Calculate GOP (Revenue - Expenses) for each month
export const calculateGOPData = () => {
  return monthlyPerformanceData.map(month => ({
    ...month,
    gop: {
      current: month.revenue.current - month.expenses.current,
      prior: month.revenue.prior - month.expenses.prior,
      budget: month.revenue.budget - month.expenses.budget,
      forecast: month.revenue.forecast - month.expenses.forecast
    }
  }));
};

// Get only locked months data
export const getLockedMonthsData = () => {
  return calculateGOPData().filter(month => month.locked);
};