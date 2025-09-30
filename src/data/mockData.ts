import { KPICard, ChartData, TableRow, MenuItem } from '../types';
import { HotelOption } from '../hooks/useHotelSelection';

// Simplified base data structure - reduced from 7 hotels to 4 key hotels
const baseHotelData = {
  'all-hotels': {
    roomsRevenue: 4205000,
    fbRevenue: 1250000,
    otherRevenue: 320000,
    departmentalExpenses: 2800000,
    undistributedExpenses: 850000,
    roomsSold: 48500,
    totalRooms: 52000,
    unpickedBlocks: 1250,
    occupancyNext7Days: 65.2
  },
  'orel': {
    roomsRevenue: 685000,
    fbRevenue: 185000,
    otherRevenue: 45000,
    departmentalExpenses: 485000,
    undistributedExpenses: 145000,
    roomsSold: 7850,
    totalRooms: 8500,
    unpickedBlocks: 185,
    occupancyNext7Days: 68.9
  },
  'condor': {
    roomsRevenue: 625000,
    fbRevenue: 170000,
    otherRevenue: 42000,
    departmentalExpenses: 445000,
    undistributedExpenses: 132000,
    roomsSold: 7200,
    totalRooms: 7800,
    unpickedBlocks: 165,
    occupancyNext7Days: 69.8
  },
  'arsena': {
    roomsRevenue: 585000,
    fbRevenue: 155000,
    otherRevenue: 38000,
    departmentalExpenses: 415000,
    undistributedExpenses: 125000,
    roomsSold: 6800,
    totalRooms: 7200,
    unpickedBlocks: 145,
    occupancyNext7Days: 71.2
  }
};

// Simplified calculation functions
const calculatePercentageChange = (current: number, comparison: number): number => {
  return comparison === 0 ? 0 : ((current - comparison) / comparison) * 100;
};

const getChangeType = (percentage: number): 'positive' | 'negative' | 'neutral' => {
  if (percentage > 0) return 'positive';
  if (percentage < 0) return 'negative';
  return 'neutral';
};

const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString('en-US');
};

// Generate mock variations for prior/budget data
const generateVariations = (base: number) => ({
  current: base,
  prior: Math.round(base * (0.85 + Math.random() * 0.2)), // 85-105% of current
  budget: Math.round(base * (0.9 + Math.random() * 0.15)), // 90-105% of current
  pickup: Math.round(base * (0.01 + Math.random() * 0.03)) // 1-4% of current
});

// Get hotel data with variations
const getHotelData = (hotelId: HotelOption) => {
  const base = baseHotelData[hotelId] || baseHotelData['all-hotels'];
  
  return Object.keys(base).reduce((acc, key) => {
    if (typeof base[key as keyof typeof base] === 'number') {
      acc[key] = generateVariations(base[key as keyof typeof base] as number);
    }
    return acc;
  }, {} as any);
};

// Aggregate data for multiple hotels
const aggregateHotelData = (hotels: HotelOption[]) => {
  if (hotels.includes('all-hotels')) {
    return getHotelData('all-hotels');
  }
  
  const selectedData = hotels.map(hotel => getHotelData(hotel));
  const result: any = {};
  
  Object.keys(baseHotelData['all-hotels']).forEach(key => {
    result[key] = {
      current: selectedData.reduce((sum, data) => sum + (data[key]?.current || 0), 0),
      prior: selectedData.reduce((sum, data) => sum + (data[key]?.prior || 0), 0),
      budget: selectedData.reduce((sum, data) => sum + (data[key]?.budget || 0), 0),
      pickup: selectedData.reduce((sum, data) => sum + (data[key]?.pickup || 0), 0)
    };
  });
  
  return result;
};

// Create KPI card helper
const createKPICard = (
  id: string,
  title: string,
  current: number,
  prior: number,
  budget: number,
  pickup: number,
  formatter: (value: number) => string = formatCurrencyValue
): KPICard => {
  const percentageVsPrior = calculatePercentageChange(current, prior);
  const percentageVsBudget = calculatePercentageChange(current, budget);
  
  return {
    id,
    title,
    value: formatter(current),
    pickup: {
      value: Math.round(pickup / (title.includes('Revenue') ? 1000 : title.includes('Cost') ? 100 : 1000)),
      type: getChangeType(pickup)
    },
    comparisons: {
      vsPrior: {
        percentage: percentageVsPrior,
        type: getChangeType(percentageVsPrior),
        progress: Math.min(Math.abs(percentageVsPrior) * 5, 100)
      },
      vsBudget: {
        percentage: percentageVsBudget,
        type: getChangeType(percentageVsBudget),
        progress: Math.min(Math.abs(percentageVsBudget) * 5, 100)
      }
    }
  };
};

// Main KPI data function
export const getKPIData = (hotels: HotelOption[]): KPICard[] => {
  const data = hotels.length === 1 ? getHotelData(hotels[0]) : aggregateHotelData(hotels);
  
  const totalRevenue = data.roomsRevenue.current + data.fbRevenue.current + data.otherRevenue.current;
  const totalRevenuePrior = data.roomsRevenue.prior + data.fbRevenue.prior + data.otherRevenue.prior;
  const totalRevenueBudget = data.roomsRevenue.budget + data.fbRevenue.budget + data.otherRevenue.budget;
  const totalRevenuePickup = data.roomsRevenue.pickup + data.fbRevenue.pickup + data.otherRevenue.pickup;

  return [
    createKPICard('total-revenue', 'Total Revenue', totalRevenue, totalRevenuePrior, totalRevenueBudget, totalRevenuePickup),
    createKPICard('rooms-revenue', 'Rooms Revenue', data.roomsRevenue.current, data.roomsRevenue.prior, data.roomsRevenue.budget, data.roomsRevenue.pickup),
    createKPICard('fb-revenue', 'F&B Revenue', data.fbRevenue.current, data.fbRevenue.prior, data.fbRevenue.budget, data.fbRevenue.pickup),
    createKPICard('other-revenue', 'Other Revenue', data.otherRevenue.current, data.otherRevenue.prior, data.otherRevenue.budget, data.otherRevenue.pickup),
    createKPICard('departmental-expenses', 'Departmental Expenses', data.departmentalExpenses.current, data.departmentalExpenses.prior, data.departmentalExpenses.budget, data.departmentalExpenses.pickup),
    createKPICard('undistributed-expenses', 'Total Undistributed Expenses', data.undistributedExpenses.current, data.undistributedExpenses.prior, data.undistributedExpenses.budget, data.undistributedExpenses.pickup),
    createKPICard('gross-operating-profit', 'Gross Operating Profit', 
      totalRevenue - data.departmentalExpenses.current - data.undistributedExpenses.current,
      totalRevenuePrior - data.departmentalExpenses.prior - data.undistributedExpenses.prior,
      totalRevenueBudget - data.departmentalExpenses.budget - data.undistributedExpenses.budget,
      totalRevenuePickup - data.departmentalExpenses.pickup - data.undistributedExpenses.pickup
    )
  ];
};

// Ratios KPI data function
export const getRatiosKPIData = (hotels: HotelOption[]): KPICard[] => {
  const data = hotels.length === 1 ? getHotelData(hotels[0]) : aggregateHotelData(hotels);
  
  const adrCurrent = data.roomsRevenue.current / data.roomsSold.current;
  const adrPrior = data.roomsRevenue.prior / data.roomsSold.prior;
  const adrBudget = data.roomsRevenue.budget / data.roomsSold.budget;
  
  const revparCurrent = adrCurrent * (data.roomsSold.current / data.totalRooms.current);
  const revparPrior = adrPrior * (data.roomsSold.prior / data.totalRooms.prior);
  const revparBudget = adrBudget * (data.roomsSold.budget / data.totalRooms.budget);

  return [
    createKPICard('total-revpar', 'Total RevPAR', revparCurrent, revparPrior, revparBudget, 0.65, (v) => v.toFixed(2)),
    createKPICard('adr-per-room', 'ADR per Room', adrCurrent, adrPrior, adrBudget, -0.86, (v) => v.toFixed(2)),
    createKPICard('adr-per-person', 'ADR per Person', adrCurrent / 2, adrPrior / 2, adrBudget / 2, -0.16, (v) => v.toFixed(2))
  ];
};

// Cost ratios KPI data function  
export const getCostRatiosKPIData = (hotels: HotelOption[]): KPICard[] => {
  const data = hotels.length === 1 ? getHotelData(hotels[0]) : aggregateHotelData(hotels);
  
  // Simplified cost calculations
  const fbCostPerRoom = (data.fbRevenue.current * 0.5) / data.totalRooms.current; // Assume 50% cost ratio
  const payrollCostPerRoom = (data.roomsRevenue.current * 0.2) / data.totalRooms.current; // Assume 20% of revenue
  const utilitiesCostPerRoom = (data.roomsRevenue.current * 0.12) / data.totalRooms.current; // Assume 12% of revenue
  
  return [
    createKPICard('fb-cost-per-room', 'F&B Cost per Room', fbCostPerRoom, fbCostPerRoom * 0.95, fbCostPerRoom * 1.02, 0.45, (v) => v.toFixed(2)),
    createKPICard('fb-cost-per-person', 'F&B Cost per Person', fbCostPerRoom / 2, (fbCostPerRoom * 0.95) / 2, (fbCostPerRoom * 1.02) / 2, 0.12, (v) => v.toFixed(2)),
    createKPICard('payroll-cost-per-room', 'Payroll Cost per Room', payrollCostPerRoom, payrollCostPerRoom * 0.92, payrollCostPerRoom * 1.03, 1.23, (v) => v.toFixed(2)),
    createKPICard('utilities-cost-per-room', 'Utilities Cost per Room', utilitiesCostPerRoom, utilitiesCostPerRoom * 0.94, utilitiesCostPerRoom * 1.02, 0.35, (v) => v.toFixed(2))
  ];
};

// Total operational cost KPI
export const getTotalOperationalCostKPIData = (hotels: HotelOption[]): KPICard => {
  const data = hotels.length === 1 ? getHotelData(hotels[0]) : aggregateHotelData(hotels);
  
  const totalOpCostCurrent = (data.departmentalExpenses.current + data.undistributedExpenses.current) / data.totalRooms.current;
  const totalOpCostPrior = (data.departmentalExpenses.prior + data.undistributedExpenses.prior) / data.totalRooms.prior;
  const totalOpCostBudget = (data.departmentalExpenses.budget + data.undistributedExpenses.budget) / data.totalRooms.budget;

  return createKPICard('total-operational-cost-per-room', 'Total Operational Cost per Room', 
    totalOpCostCurrent, totalOpCostPrior, totalOpCostBudget, 2.15, (v) => v.toFixed(2));
};

// Unpicked blocks KPI
export const getUnpickedBlocksKPIData = (hotels: HotelOption[]): KPICard => {
  const data = hotels.length === 1 ? getHotelData(hotels[0]) : aggregateHotelData(hotels);
  
  return {
    id: 'unpicked-blocks',
    title: 'Unpicked Blocks (7 days)',
    value: data.unpickedBlocks.current.toString(),
    pickup: {
      value: data.unpickedBlocks.pickup,
      type: getChangeType(data.unpickedBlocks.pickup)
    },
    comparisons: {
      vsPrior: {
        percentage: calculatePercentageChange(data.unpickedBlocks.current, data.unpickedBlocks.prior),
        type: 'neutral',
        progress: 75
      },
      vsBudget: {
        percentage: calculatePercentageChange(data.unpickedBlocks.current, data.unpickedBlocks.budget),
        type: 'neutral', 
        progress: 60
      }
    }
  };
};

// Simplified static data
export const revenueChartData: ChartData[] = [
  { name: 'Jan', value: 42000 },
  { name: 'Feb', value: 38000 },
  { name: 'Mar', value: 45000 },
  { name: 'Apr', value: 47832 },
  { name: 'May', value: 52000 },
  { name: 'Jun', value: 48000 }
];

export const adrChartData: ChartData[] = [
  { name: 'Jan', value: 85.20 },
  { name: 'Feb', value: 82.10 },
  { name: 'Mar', value: 87.30 },
  { name: 'Apr', value: 89.50 },
  { name: 'May', value: 91.20 },
  { name: 'Jun', value: 88.70 }
];

export const occupancyChartData: ChartData[] = [
  { name: 'Jan', value: 72.5 },
  { name: 'Feb', value: 68.2 },
  { name: 'Mar', value: 75.8 },
  { name: 'Apr', value: 78.4 },
  { name: 'May', value: 82.1 },
  { name: 'Jun', value: 79.3 }
];

export const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/'
  },
  {
    id: 'analytics',
    label: 'Analytics', 
    icon: 'BarChart3',
    path: '/analytics',
    children: [
      { id: 'rooms', label: 'Rooms', icon: 'Building2', path: '/explorer/rooms' },
      { id: 'blocks', label: 'Blocks', icon: 'BarChart3', path: '/analytics/blocks' },
      { id: 'fb-revenue', label: 'F&B Revenue', icon: 'Calculator', path: '/analytics/fb-revenue' },
      { id: 'other-revenue', label: 'Other Revenue', icon: 'TrendingUp', path: '/analytics/other-revenue' },
      { id: 'account-receivables', label: 'Account Receivables', icon: 'FileText', path: '/analytics/account-receivables' },
      { id: 'rooms-out-of-sales', label: 'Rooms out of Sales', icon: 'TrendingUp', path: '/analytics/rooms-out-of-sales' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText', 
    path: '/reports',
    children: [
      { id: 'operation-statement', label: 'Operation Statement', icon: 'Calculator', path: '/reports/operation-statement' },
      { id: 'bob-vs-budget-forecast', label: 'BOB Vs Budget/Forecast', path: '/reports/bob-vs-budget-forecast', icon: 'BarChart3' }
    ]
  }
];

// Simplified table data
export const tableData: TableRow[] = [
  { id: '1', date: '2024-01-15', room: 'Premium Suite 201', guest: 'John Smith', revenue: '€125.00', nights: 2, adr: '€62.50' },
  { id: '2', date: '2024-01-15', room: 'Standard Room 105', guest: 'Maria Garcia', revenue: '€89.00', nights: 1, adr: '€89.00' },
  { id: '3', date: '2024-01-14', room: 'Deluxe Room 308', guest: 'Robert Johnson', revenue: '€180.00', nights: 2, adr: '€90.00' }
];

export const operationData: TableRow[] = [
  { id: '1', category: 'Room Revenue', january: '€42,000', february: '€38,000', march: '€45,000', april: '€47,832', total: '€172,832' },
  { id: '2', category: 'F&B Revenue', january: '€12,000', february: '€11,500', march: '€13,200', april: '€14,100', total: '€50,800' },
  { id: '3', category: 'Operating Expenses', january: '€28,000', february: '€26,500', march: '€29,800', april: '€31,200', total: '€115,500' }
];