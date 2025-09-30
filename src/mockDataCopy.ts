import { KPICard, ChartData, TableRow, MenuItem } from '../types';
import { HotelOption } from '../hooks/useHotelSelection';

// Helper function to calculate OTB data till yesterday for each hotel
const calculateOTBTillYesterday = (hotelId: HotelOption) => {
  // Mock OTB data - in real app this would come from API
  const otbData = {
    'all-hotels': {
      roomsRevenue: { current: 4205000, prior: 3850000, budget: 4000000, pickup: 85000 },
      fbRevenue: { current: 1250000, prior: 1150000, budget: 1200000, pickup: 25000 },
      otherRevenue: { current: 320000, prior: 290000, budget: 310000, pickup: 8000 },
      departmentalExpenses: { current: 2800000, prior: 2650000, budget: 2750000, pickup: 45000 },
      undistributedExpenses: { current: 850000, prior: 820000, budget: 840000, pickup: 12000 },
      grossOperatingProfit: { current: 1120000, prior: 950000, budget: 1020000, pickup: 18000 },
      // Additional data for ratios
      roomsSold: { current: 48500, prior: 45200, budget: 47000, pickup: 850 },
      totalRooms: { current: 52000, prior: 52000, budget: 52000, pickup: 0 },
      fbCovers: { current: 125000, prior: 118000, budget: 122000, pickup: 2100 },
      fbCosts: { current: 625000, prior: 590000, budget: 610000, pickup: 12500 },
      salariesWages: { current: 1450000, prior: 1380000, budget: 1420000, pickup: 24000 },
      utilities: { current: 385000, prior: 365000, budget: 375000, pickup: 6500 },
      // Unpicked blocks data for next 7 days
      unpickedBlocks: { current: 1250, prior: 1180, budget: 1100, pickup: 25 },
      availableRoomsNext7Days: { current: 3640, prior: 3640, budget: 3640, pickup: 0 }, // 52 rooms * 7 days
      occupancyNext7Days: { current: 65.2, prior: 67.6, budget: 69.8, pickup: -0.8 } // %
    },
    'orel': {
      roomsRevenue: { current: 685000, prior: 620000, budget: 650000, pickup: 12000 },
      fbRevenue: { current: 185000, prior: 170000, budget: 180000, pickup: 4500 },
      otherRevenue: { current: 45000, prior: 42000, budget: 44000, pickup: 1200 },
      departmentalExpenses: { current: 485000, prior: 450000, budget: 470000, pickup: 7500 },
      undistributedExpenses: { current: 145000, prior: 138000, budget: 142000, pickup: 2100 },
      grossOperatingProfit: { current: 280000, prior: 244000, budget: 262000, pickup: 4800 },
      roomsSold: { current: 7850, prior: 7200, budget: 7500, pickup: 125 },
      totalRooms: { current: 8500, prior: 8500, budget: 8500, pickup: 0 },
      fbCovers: { current: 18500, prior: 17200, budget: 18000, pickup: 320 },
      fbCosts: { current: 92500, prior: 85000, budget: 90000, pickup: 1850 },
      salariesWages: { current: 245000, prior: 230000, budget: 240000, pickup: 4200 },
      utilities: { current: 58000, prior: 55000, budget: 57000, pickup: 950 },
      unpickedBlocks: { current: 185, prior: 165, budget: 150, pickup: 5 },
      availableRoomsNext7Days: { current: 595, prior: 595, budget: 595, pickup: 0 }, // 85 rooms * 7 days
      occupancyNext7Days: { current: 68.9, prior: 72.3, budget: 74.8, pickup: -1.2 }
    },
    'condor': {
      roomsRevenue: { current: 625000, prior: 580000, budget: 600000, pickup: 11500 },
      fbRevenue: { current: 170000, prior: 155000, budget: 165000, pickup: 4200 },
      otherRevenue: { current: 42000, prior: 38000, budget: 40000, pickup: 1100 },
      departmentalExpenses: { current: 445000, prior: 415000, budget: 430000, pickup: 6800 },
      undistributedExpenses: { current: 132000, prior: 125000, budget: 128000, pickup: 1900 },
      grossOperatingProfit: { current: 255000, prior: 233000, budget: 247000, pickup: 4500 },
      roomsSold: { current: 7200, prior: 6800, budget: 7000, pickup: 110 },
      totalRooms: { current: 7800, prior: 7800, budget: 7800, pickup: 0 },
      fbCovers: { current: 16800, prior: 15500, budget: 16200, pickup: 285 },
      fbCosts: { current: 85000, prior: 77500, budget: 82500, pickup: 1700 },
      salariesWages: { current: 225000, prior: 210000, budget: 220000, pickup: 3800 },
      utilities: { current: 52000, prior: 48000, budget: 50000, pickup: 850 },
      unpickedBlocks: { current: 165, prior: 155, budget: 140, pickup: 3 },
      availableRoomsNext7Days: { current: 546, prior: 546, budget: 546, pickup: 0 },
      occupancyNext7Days: { current: 69.8, prior: 71.6, budget: 74.4, pickup: -0.5 }
    },
    'arsena': {
      roomsRevenue: { current: 585000, prior: 540000, budget: 560000, pickup: 10800 },
      fbRevenue: { current: 155000, prior: 145000, budget: 150000, pickup: 3800 },
      otherRevenue: { current: 38000, prior: 35000, budget: 37000, pickup: 950 },
      departmentalExpenses: { current: 415000, prior: 385000, budget: 400000, pickup: 6200 },
      undistributedExpenses: { current: 125000, prior: 118000, budget: 122000, pickup: 1800 },
      grossOperatingProfit: { current: 233000, prior: 217000, budget: 225000, pickup: 4200 },
      roomsSold: { current: 6800, prior: 6300, budget: 6500, pickup: 95 },
      totalRooms: { current: 7200, prior: 7200, budget: 7200, pickup: 0 },
      fbCovers: { current: 15200, prior: 14500, budget: 15000, pickup: 250 },
      fbCosts: { current: 77500, prior: 72500, budget: 75000, pickup: 1550 },
      salariesWages: { current: 210000, prior: 195000, budget: 205000, pickup: 3500 },
      utilities: { current: 48000, prior: 45000, budget: 47000, pickup: 800 },
      unpickedBlocks: { current: 145, prior: 140, budget: 125, pickup: 2 },
      availableRoomsNext7Days: { current: 504, prior: 504, budget: 504, pickup: 0 },
      occupancyNext7Days: { current: 71.2, prior: 72.2, budget: 75.2, pickup: -0.3 }
    },
    'kalina-garden': {
      roomsRevenue: { current: 755000, prior: 690000, budget: 720000, pickup: 14200 },
      fbRevenue: { current: 210000, prior: 195000, budget: 205000, pickup: 5100 },
      otherRevenue: { current: 52000, prior: 48000, budget: 50000, pickup: 1400 },
      departmentalExpenses: { current: 535000, prior: 495000, budget: 515000, pickup: 8200 },
      undistributedExpenses: { current: 158000, prior: 148000, budget: 153000, pickup: 2300 },
      grossOperatingProfit: { current: 319000, prior: 290000, budget: 307000, pickup: 5400 },
      roomsSold: { current: 8500, prior: 7800, budget: 8200, pickup: 145 },
      totalRooms: { current: 9200, prior: 9200, budget: 9200, pickup: 0 },
      fbCovers: { current: 20500, prior: 19200, budget: 20000, pickup: 350 },
      fbCosts: { current: 105000, prior: 97500, budget: 102500, pickup: 2100 },
      salariesWages: { current: 270000, prior: 250000, budget: 265000, pickup: 4500 },
      utilities: { current: 62000, prior: 58000, budget: 60000, pickup: 1050 },
      unpickedBlocks: { current: 195, prior: 185, budget: 165, pickup: 4 },
      availableRoomsNext7Days: { current: 644, prior: 644, budget: 644, pickup: 0 },
      occupancyNext7Days: { current: 69.7, prior: 71.3, budget: 74.4, pickup: -0.6 }
    },
    'astoria': {
      roomsRevenue: { current: 525000, prior: 485000, budget: 500000, pickup: 9800 },
      fbRevenue: { current: 140000, prior: 130000, budget: 135000, pickup: 3400 },
      otherRevenue: { current: 34000, prior: 31000, budget: 33000, pickup: 850 },
      departmentalExpenses: { current: 375000, prior: 348000, budget: 362000, pickup: 5600 },
      undistributedExpenses: { current: 112000, prior: 105000, budget: 108000, pickup: 1600 },
      grossOperatingProfit: { current: 207000, prior: 193000, budget: 198000, pickup: 3700 },
      roomsSold: { current: 6200, prior: 5800, budget: 6000, pickup: 85 },
      totalRooms: { current: 6800, prior: 6800, budget: 6800, pickup: 0 },
      fbCovers: { current: 13800, prior: 13000, budget: 13500, pickup: 220 },
      fbCosts: { current: 70000, prior: 65000, budget: 67500, pickup: 1400 },
      salariesWages: { current: 190000, prior: 175000, budget: 185000, pickup: 3200 },
      utilities: { current: 42000, prior: 39000, budget: 41000, pickup: 700 },
      unpickedBlocks: { current: 125, prior: 120, budget: 110, pickup: 2 },
      availableRoomsNext7Days: { current: 476, prior: 476, budget: 476, pickup: 0 },
      occupancyNext7Days: { current: 73.7, prior: 74.8, budget: 76.9, pickup: -0.4 }
    },
    'asteria': {
      roomsRevenue: { current: 595000, prior: 550000, budget: 570000, pickup: 11200 },
      fbRevenue: { current: 160000, prior: 148000, budget: 155000, pickup: 3900 },
      otherRevenue: { current: 39000, prior: 36000, budget: 38000, pickup: 980 },
      departmentalExpenses: { current: 425000, prior: 395000, budget: 410000, pickup: 6400 },
      undistributedExpenses: { current: 128000, prior: 120000, budget: 124000, pickup: 1850 },
      grossOperatingProfit: { current: 236000, prior: 219000, budget: 229000, pickup: 4250 },
      roomsSold: { current: 6900, prior: 6400, budget: 6650, pickup: 95 },
      totalRooms: { current: 7400, prior: 7400, budget: 7400, pickup: 0 },
      fbCovers: { current: 15800, prior: 14800, budget: 15500, pickup: 265 },
      fbCosts: { current: 80000, prior: 74000, budget: 77500, pickup: 1600 },
      salariesWages: { current: 215000, prior: 200000, budget: 210000, pickup: 3600 },
      utilities: { current: 48000, prior: 45000, budget: 47000, pickup: 800 },
      unpickedBlocks: { current: 135, prior: 125, budget: 115, pickup: 3 },
      availableRoomsNext7Days: { current: 518, prior: 518, budget: 518, pickup: 0 },
      occupancyNext7Days: { current: 74.0, prior: 75.9, budget: 77.8, pickup: -0.7 }
    },
    'sport': {
      roomsRevenue: { current: 465000, prior: 430000, budget: 445000, pickup: 8700 },
      fbRevenue: { current: 125000, prior: 115000, budget: 120000, pickup: 3000 },
      otherRevenue: { current: 30000, prior: 28000, budget: 29000, pickup: 750 },
      departmentalExpenses: { current: 335000, prior: 315000, budget: 325000, pickup: 5100 },
      undistributedExpenses: { current: 98000, prior: 92000, budget: 95000, pickup: 1400 },
      grossOperatingProfit: { current: 182000, prior: 166000, budget: 174000, pickup: 3300 },
      roomsSold: { current: 5500, prior: 5100, budget: 5300, pickup: 75 },
      totalRooms: { current: 6000, prior: 6000, budget: 6000, pickup: 0 },
      fbCovers: { current: 12200, prior: 11500, budget: 12000, pickup: 185 },
      fbCosts: { current: 62500, prior: 57500, budget: 60000, pickup: 1250 },
      salariesWages: { current: 170000, prior: 158000, budget: 165000, pickup: 2800 },
      utilities: { current: 37000, prior: 35000, budget: 36000, pickup: 620 },
      unpickedBlocks: { current: 105, prior: 100, budget: 95, pickup: 1 },
      availableRoomsNext7Days: { current: 420, prior: 420, budget: 420, pickup: 0 },
      occupancyNext7Days: { current: 75.0, prior: 76.2, budget: 77.4, pickup: -0.5 }
    }
  };

  return otbData[hotelId] || otbData['all-hotels'];
};

// Helper function to get Total Operational Cost Per Room KPI data
export const getTotalOperationalCostKPIData = (hotels: HotelOption[]): KPICard => {
  let otbData: any;
  
  if (hotels.includes('all-hotels') || hotels.length > 1) {
    if (hotels.includes('all-hotels')) {
      otbData = calculateOTBTillYesterday('all-hotels');
    } else {
      const selectedData = hotels.map(hotel => calculateOTBTillYesterday(hotel));
      
      otbData = {
        departmentalExpenses: {
          current: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.pickup, 0)
        },
        undistributedExpenses: {
          current: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.pickup, 0)
        },
        totalRooms: {
          current: selectedData.reduce((sum, data) => sum + data.totalRooms.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.totalRooms.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.totalRooms.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.totalRooms.pickup, 0)
        }
      };
    }
  } else {
    otbData = calculateOTBTillYesterday(hotels[0]);
  }
  
  // Calculate total operational cost per room
  const totalOpCostCurrent = (otbData.departmentalExpenses.current + otbData.undistributedExpenses.current) / otbData.totalRooms.current;
  const totalOpCostPrior = (otbData.departmentalExpenses.prior + otbData.undistributedExpenses.prior) / otbData.totalRooms.prior;
  const totalOpCostBudget = (otbData.departmentalExpenses.budget + otbData.undistributedExpenses.budget) / otbData.totalRooms.budget;
  const totalOpCostPickup = (otbData.departmentalExpenses.pickup + otbData.undistributedExpenses.pickup) / (otbData.totalRooms.pickup || 1);

  return {
    id: 'total-operational-cost-per-room',
    title: 'Total Operational Cost Per Room',
    value: `${totalOpCostCurrent.toFixed(2)}`,
    change: `${calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior) >= 0 ? '+' : ''}${calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior).toFixed(1)}%`,
    changeType: getChangeType(calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior)),
    pickup: {
      value: parseFloat((totalOpCostPickup || 0).toFixed(2)),
      type: getChangeType(totalOpCostPickup || 0)
    },
    comparisons: {
      vsPrior: {
        percentage: calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior),
        type: getChangeType(calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior)),
        progress: Math.min(Math.abs(calculatePercentageChange(totalOpCostCurrent, totalOpCostPrior)) * 5, 100)
      },
      vsBudget: {
        percentage: calculatePercentageChange(totalOpCostCurrent, totalOpCostBudget),
        type: getChangeType(calculatePercentageChange(totalOpCostCurrent, totalOpCostBudget)),
        progress: Math.min(Math.abs(calculatePercentageChange(totalOpCostCurrent, totalOpCostBudget)) * 5, 100)
      }
    }
  };
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, comparison: number): number => {
  if (comparison === 0) return 0;
  return ((current - comparison) / comparison) * 100;
};

// Helper function to determine change type
const getChangeType = (percentage: number): 'positive' | 'negative' | 'neutral' => {
  if (percentage > 0) return 'positive';
  if (percentage < 0) return 'negative';
  return 'neutral';
};

// Helper function to format currency values
const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString('en-US');
};
export const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    children: [
      { id: 'rooms', label: 'Rooms', icon: 'Building2', path: '/explorer/rooms' },
      { id: 'hotels', label: 'Hotels Portfolio Performance', icon: 'Building2', path: '/explorer/hotels' },
      {
        id: 'rooms-explorer',
        label: 'Rooms Revenue',
        icon: 'Building2',
        path: '/explorer/rooms',
      },
      {
        id: 'blocks',
        label: 'Blocks',
        icon: 'BarChart3',
        path: '/analytics/blocks'
      },
      {
        id: 'fb-revenue',
        label: 'F&B Revenue',
        icon: 'Calculator',
        path: '/analytics/fb-revenue'
      },
      {
        id: 'other-revenue',
        label: 'Other Revenue',
        icon: 'TrendingUp',
        path: '/analytics/other-revenue'
      },
      {
        id: 'account-receivables',
        label: 'Account Receivables',
        icon: 'FileText',
        path: '/analytics/account-receivables'
      },
      {
        id: 'rooms-out-of-sales',
        label: 'Rooms out of Sales',
        icon: 'TrendingUp',
        path: '/analytics/rooms-out-of-sales'
      }
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText',
    path: '/reports',
    children: [
      {
        id: 'operation-statement',
        label: 'Operation Statement',
        icon: 'Calculator',
        path: '/reports/operation-statement',
      },
      {
        id: 'bob-vs-budget-forecast',
        label: 'BOB Vs Budget/Forecast',
        path: '/reports/bob-vs-budget-forecast',
        icon: 'BarChart3',
      }
    ],
  },
];

// Helper function to get Ratios KPI data for selected hotel
export const getRatiosKPIData = (hotels: HotelOption[]): KPICard[] => {
  let otbData: any;
  
  if (hotels.includes('all-hotels') || hotels.length > 1) {
    if (hotels.includes('all-hotels')) {
      // Use aggregated data for all hotels
      otbData = calculateOTBTillYesterday('all-hotels');
    } else {
      // Sum data for selected hotels only
      const selectedData = hotels.map(hotel => calculateOTBTillYesterday(hotel));
      
      // Aggregate the selected hotels' data
      otbData = {
        roomsRevenue: {
          current: selectedData.reduce((sum, data) => sum + data.roomsRevenue.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.roomsRevenue.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.roomsRevenue.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.roomsRevenue.pickup, 0)
        },
        fbRevenue: {
          current: selectedData.reduce((sum, data) => sum + data.fbRevenue.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.fbRevenue.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.fbRevenue.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.fbRevenue.pickup, 0)
        },
        roomsSold: {
          current: selectedData.reduce((sum, data) => sum + data.roomsSold.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.roomsSold.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.roomsSold.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.roomsSold.pickup, 0)
        },
        totalRooms: {
          current: selectedData.reduce((sum, data) => sum + data.totalRooms.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.totalRooms.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.totalRooms.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.totalRooms.pickup, 0)
        },
        fbCovers: {
          current: selectedData.reduce((sum, data) => sum + data.fbCovers.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.fbCovers.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.fbCovers.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.fbCovers.pickup, 0)
        },
        fbCosts: {
          current: selectedData.reduce((sum, data) => sum + data.fbCosts.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.fbCosts.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.fbCosts.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.fbCosts.pickup, 0)
        },
        salariesWages: {
          current: selectedData.reduce((sum, data) => sum + data.salariesWages.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.salariesWages.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.salariesWages.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.salariesWages.pickup, 0)
        },
        utilities: {
          current: selectedData.reduce((sum, data) => sum + data.utilities.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.utilities.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.utilities.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.utilities.pickup, 0)
        }
      };
    }
  } else {
    // Use data for the single selected hotel
    otbData = calculateOTBTillYesterday(hotels[0]);
  }
  
  // Calculate ratios
  const adrCurrent = otbData.roomsRevenue.current / otbData.roomsSold.current;
  const adrPrior = otbData.roomsRevenue.prior / otbData.roomsSold.prior;
  const adrBudget = otbData.roomsRevenue.budget / otbData.roomsSold.budget;
  const adrPickup = (otbData.roomsSold.pickup !== 0) ? otbData.roomsRevenue.pickup / otbData.roomsSold.pickup : 0;
  
  const tadrCurrent = otbData.roomsRevenue.current / otbData.totalRooms.current;
  const tadrPrior = otbData.roomsRevenue.prior / otbData.totalRooms.prior;
  const tadrBudget = otbData.roomsRevenue.budget / otbData.totalRooms.budget;
  const tadrPickup = (otbData.totalRooms.pickup !== 0) ? otbData.roomsRevenue.pickup / otbData.totalRooms.pickup : 0;
  
  const revparCurrent = adrCurrent * (otbData.roomsSold.current / otbData.totalRooms.current);
  const revparPrior = adrPrior * (otbData.roomsSold.prior / otbData.totalRooms.prior);
  const revparBudget = adrBudget * (otbData.roomsSold.budget / otbData.totalRooms.budget);
  const revparPickup = adrPickup * ((otbData.totalRooms.pickup !== 0) ? otbData.roomsSold.pickup / otbData.totalRooms.pickup : 0);
  
  // ADR Per Person (assuming 2 people per room on average)
  const adrPerPersonCurrent = adrCurrent / 2;
  const adrPerPersonPrior = adrPrior / 2;
  const adrPerPersonBudget = adrBudget / 2;
  const adrPerPersonPickup = adrPickup / 2;
  
  const fbCostPerPersonCurrent = otbData.fbCosts.current / otbData.fbCovers.current;
  const fbCostPerPersonPrior = otbData.fbCosts.prior / otbData.fbCovers.prior;
  const fbCostPerPersonBudget = otbData.fbCosts.budget / otbData.fbCovers.budget;
  const fbCostPerPersonPickup = (otbData.fbCovers.pickup !== 0) ? otbData.fbCosts.pickup / otbData.fbCovers.pickup : 0;
  
  // F&B Cost Per Room
  const fbCostPerRoomCurrent = otbData.fbCosts.current / otbData.totalRooms.current;
  const fbCostPerRoomPrior = otbData.fbCosts.prior / otbData.totalRooms.prior;
  const fbCostPerRoomBudget = otbData.fbCosts.budget / otbData.totalRooms.budget;
  const fbCostPerRoomPickup = (otbData.totalRooms.pickup !== 0) ? otbData.fbCosts.pickup / otbData.totalRooms.pickup : 0;
  
  const salariesPerRoomCurrent = otbData.salariesWages.current / otbData.totalRooms.current;
  const salariesPerRoomPrior = otbData.salariesWages.prior / otbData.totalRooms.prior;
  const salariesPerRoomBudget = otbData.salariesWages.budget / otbData.totalRooms.budget;
  const salariesPerRoomPickup = (otbData.totalRooms.pickup !== 0) ? otbData.salariesWages.pickup / otbData.totalRooms.pickup : 0;
  
  const utilitiesPerRoomCurrent = otbData.utilities.current / otbData.totalRooms.current;
  const utilitiesPerRoomPrior = otbData.utilities.prior / otbData.totalRooms.prior;
  const utilitiesPerRoomBudget = otbData.utilities.budget / otbData.totalRooms.budget;
  const utilitiesPerRoomPickup = (otbData.totalRooms.pickup !== 0) ? otbData.utilities.pickup / otbData.totalRooms.pickup : 0;

  return [
    {
      id: 'total-revenue-per-sold-room',
      title: 'Total Revenue per Sold Room',
      value: `${tadrCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(tadrCurrent, tadrPrior) >= 0 ? '+' : ''}${calculatePercentageChange(tadrCurrent, tadrPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(tadrCurrent, tadrPrior)),
      pickup: {
        value: parseFloat((tadrPickup || 0).toFixed(2)),
        type: getChangeType(tadrPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(tadrCurrent, tadrPrior),
          type: getChangeType(calculatePercentageChange(tadrCurrent, tadrPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(tadrCurrent, tadrPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(tadrCurrent, tadrBudget),
          type: getChangeType(calculatePercentageChange(tadrCurrent, tadrBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(tadrCurrent, tadrBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'total-revpar',
      title: 'Total RevPAR',
      value: `${revparCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(revparCurrent, revparPrior) >= 0 ? '+' : ''}${calculatePercentageChange(revparCurrent, revparPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(revparCurrent, revparPrior)),
      pickup: {
        value: parseFloat((revparPickup || 0).toFixed(2)),
        type: getChangeType(revparPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(revparCurrent, revparPrior),
          type: getChangeType(calculatePercentageChange(revparCurrent, revparPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(revparCurrent, revparPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(revparCurrent, revparBudget),
          type: getChangeType(calculatePercentageChange(revparCurrent, revparBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(revparCurrent, revparBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'adr-per-room',
      title: 'ADR Per Room',
      value: `${adrCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(adrCurrent, adrPrior) >= 0 ? '+' : ''}${calculatePercentageChange(adrCurrent, adrPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(adrCurrent, adrPrior)),
      pickup: {
        value: parseFloat((adrPickup || 0).toFixed(2)),
        type: getChangeType(adrPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(adrCurrent, adrPrior),
          type: getChangeType(calculatePercentageChange(adrCurrent, adrPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(adrCurrent, adrPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(adrCurrent, adrBudget),
          type: getChangeType(calculatePercentageChange(adrCurrent, adrBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(adrCurrent, adrBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'adr-per-person',
      title: 'ADR Per Person',
      value: `${adrPerPersonCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior) >= 0 ? '+' : ''}${calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior)),
      pickup: {
        value: parseFloat((adrPerPersonPickup || 0).toFixed(2)),
        type: getChangeType(adrPerPersonPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior),
          type: getChangeType(calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(adrPerPersonCurrent, adrPerPersonPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(adrPerPersonCurrent, adrPerPersonBudget),
          type: getChangeType(calculatePercentageChange(adrPerPersonCurrent, adrPerPersonBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(adrPerPersonCurrent, adrPerPersonBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'fb-cost-per-room',
      title: 'F&B Cost Per Room',
      value: `${fbCostPerRoomCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior) >= 0 ? '+' : ''}${calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior)),
      pickup: {
        value: parseFloat((fbCostPerRoomPickup || 0).toFixed(2)),
        type: getChangeType(fbCostPerRoomPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior),
          type: getChangeType(calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomBudget),
          type: getChangeType(calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(fbCostPerRoomCurrent, fbCostPerRoomBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'fb-cost-per-person',
      title: 'F&B Cost Per Person',
      value: `${fbCostPerPersonCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior) >= 0 ? '+' : ''}${calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior)),
      pickup: {
        value: parseFloat((fbCostPerPersonPickup || 0).toFixed(2)),
        type: getChangeType(fbCostPerPersonPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior),
          type: getChangeType(calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonBudget),
          type: getChangeType(calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(fbCostPerPersonCurrent, fbCostPerPersonBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'payroll-cost-per-room',
      title: 'Payroll Cost per Room',
      value: `${salariesPerRoomCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior) >= 0 ? '+' : ''}${calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior)),
      pickup: {
        value: parseFloat((salariesPerRoomPickup || 0).toFixed(2)),
        type: getChangeType(salariesPerRoomPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior),
          type: getChangeType(calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomBudget),
          type: getChangeType(calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(salariesPerRoomCurrent, salariesPerRoomBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'utilities-cost-per-room',
      title: 'Utilities Cost per Room',
      value: `${utilitiesPerRoomCurrent.toFixed(2)}`,
      change: `${calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior) >= 0 ? '+' : ''}${calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior)),
      pickup: {
        value: parseFloat((utilitiesPerRoomPickup || 0).toFixed(2)),
        type: getChangeType(utilitiesPerRoomPickup || 0)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior),
          type: getChangeType(calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomPrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomBudget),
          type: getChangeType(calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(utilitiesPerRoomCurrent, utilitiesPerRoomBudget)) * 5, 100)
        }
      }
    }
  ];
};

// Helper function to get Unpicked Blocks KPI data
export const getUnpickedBlocksKPIData = (hotels: HotelOption[]): KPICard => {
  let otbData: any;
  
  if (hotels.includes('all-hotels') || hotels.length > 1) {
    if (hotels.includes('all-hotels')) {
      otbData = calculateOTBTillYesterday('all-hotels');
    } else {
      const selectedData = hotels.map(hotel => calculateOTBTillYesterday(hotel));
      
      otbData = {
        unpickedBlocks: {
          current: selectedData.reduce((sum, data) => sum + data.unpickedBlocks.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.unpickedBlocks.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.unpickedBlocks.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.unpickedBlocks.pickup, 0)
        },
        availableRoomsNext7Days: {
          current: selectedData.reduce((sum, data) => sum + data.availableRoomsNext7Days.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.availableRoomsNext7Days.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.availableRoomsNext7Days.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.availableRoomsNext7Days.pickup, 0)
        },
        occupancyNext7Days: {
          current: selectedData.reduce((sum, data, index, arr) => sum + data.occupancyNext7Days.current / arr.length, 0),
          prior: selectedData.reduce((sum, data, index, arr) => sum + data.occupancyNext7Days.prior / arr.length, 0),
          budget: selectedData.reduce((sum, data, index, arr) => sum + data.occupancyNext7Days.budget / arr.length, 0),
          pickup: selectedData.reduce((sum, data, index, arr) => sum + data.occupancyNext7Days.pickup / arr.length, 0)
        }
      };
    }
  } else {
    otbData = calculateOTBTillYesterday(hotels[0]);
  }
  
  // Calculate unpicked blocks percentage
  const unpickedBlocksPercentage = (otbData.unpickedBlocks.current / otbData.availableRoomsNext7Days.current) * 100;
  const unpickedBlocksPercentagePrior = (otbData.unpickedBlocks.prior / otbData.availableRoomsNext7Days.prior) * 100;
  const unpickedBlocksPercentageBudget = (otbData.unpickedBlocks.budget / otbData.availableRoomsNext7Days.budget) * 100;
  const unpickedBlocksPercentagePickup = ((otbData.unpickedBlocks.pickup / (otbData.availableRoomsNext7Days.pickup || 1)) * 100) || 0;

  return {
    id: 'unpicked-blocks-next-7-days',
    title: 'Rooms in Unpicked Blocks (Next 7 Days)',
    value: `${otbData.unpickedBlocks.current} (${unpickedBlocksPercentage.toFixed(1)}%)`,
    change: `${calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior).toFixed(1)}%`,
    changeType: getChangeType(calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior)),
    pickup: {
      value: otbData.unpickedBlocks.pickup,
      type: getChangeType(otbData.unpickedBlocks.pickup)
    },
    comparisons: {
      vsPrior: {
        percentage: calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior),
        type: getChangeType(calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior)),
        progress: Math.min(Math.abs(calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.prior)) * 5, 100)
      },
      vsBudget: {
        percentage: calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.budget),
        type: getChangeType(calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.budget)),
        progress: Math.min(Math.abs(calculatePercentageChange(otbData.unpickedBlocks.current, otbData.unpickedBlocks.budget)) * 5, 100)
      }
    }
  };
};

// Helper function to get KPI data for selected hotel
export const getKPIData = (hotels: HotelOption[]): KPICard[] => {
  let otbData: any;
  
  if (hotels.includes('all-hotels') || hotels.length > 1) {
    if (hotels.includes('all-hotels')) {
      // Use aggregated data for all hotels
      otbData = calculateOTBTillYesterday('all-hotels');
    } else {
      // Sum data for selected hotels only
      const selectedData = hotels.map(hotel => calculateOTBTillYesterday(hotel));
      
      // Aggregate the selected hotels' data
      otbData = {
        roomsRevenue: {
          current: selectedData.reduce((sum, data) => sum + data.roomsRevenue.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.roomsRevenue.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.roomsRevenue.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.roomsRevenue.pickup, 0)
        },
        fbRevenue: {
          current: selectedData.reduce((sum, data) => sum + data.fbRevenue.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.fbRevenue.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.fbRevenue.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.fbRevenue.pickup, 0)
        },
        otherRevenue: {
          current: selectedData.reduce((sum, data) => sum + data.otherRevenue.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.otherRevenue.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.otherRevenue.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.otherRevenue.pickup, 0)
        },
        departmentalExpenses: {
          current: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.departmentalExpenses.pickup, 0)
        },
        undistributedExpenses: {
          current: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.undistributedExpenses.pickup, 0)
        },
        grossOperatingProfit: {
          current: selectedData.reduce((sum, data) => sum + data.grossOperatingProfit.current, 0),
          prior: selectedData.reduce((sum, data) => sum + data.grossOperatingProfit.prior, 0),
          budget: selectedData.reduce((sum, data) => sum + data.grossOperatingProfit.budget, 0),
          pickup: selectedData.reduce((sum, data) => sum + data.grossOperatingProfit.pickup, 0)
        }
      };
    }
  } else {
    // Use data for the single selected hotel
    otbData = calculateOTBTillYesterday(hotels[0]);
  }
  
  // Calculate total revenue
  const totalRevenue = otbData.roomsRevenue.current + otbData.fbRevenue.current + otbData.otherRevenue.current;
  const totalRevenuePrior = otbData.roomsRevenue.prior + otbData.fbRevenue.prior + otbData.otherRevenue.prior;
  const totalRevenueBudget = otbData.roomsRevenue.budget + otbData.fbRevenue.budget + otbData.otherRevenue.budget;
  const totalRevenuePickup = otbData.roomsRevenue.pickup + otbData.fbRevenue.pickup + otbData.otherRevenue.pickup;

  return [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: `${formatCurrencyValue(totalRevenue)}`,
      change: `${calculatePercentageChange(totalRevenue, totalRevenuePrior) >= 0 ? '+' : ''}${calculatePercentageChange(totalRevenue, totalRevenuePrior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(totalRevenue, totalRevenuePrior)),
      pickup: {
        value: Math.round(totalRevenuePickup / 1000),
        type: getChangeType(totalRevenuePickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(totalRevenue, totalRevenuePrior),
          type: getChangeType(calculatePercentageChange(totalRevenue, totalRevenuePrior)),
          progress: Math.min(Math.abs(calculatePercentageChange(totalRevenue, totalRevenuePrior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(totalRevenue, totalRevenueBudget),
          type: getChangeType(calculatePercentageChange(totalRevenue, totalRevenueBudget)),
          progress: Math.min(Math.abs(calculatePercentageChange(totalRevenue, totalRevenueBudget)) * 5, 100)
        }
      }
    },
    {
      id: 'rooms-revenue',
      title: 'Rooms Revenue',
      value: `${formatCurrencyValue(otbData.roomsRevenue.current)}`,
      change: `${calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior)),
      pickup: {
        value: Math.round(otbData.roomsRevenue.pickup / 1000),
        type: getChangeType(otbData.roomsRevenue.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior),
          type: getChangeType(calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.budget),
          type: getChangeType(calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.roomsRevenue.current, otbData.roomsRevenue.budget)) * 5, 100)
        }
      }
    },
    {
      id: 'fb-revenue',
      title: 'F&B Revenue',
      value: `${formatCurrencyValue(otbData.fbRevenue.current)}`,
      change: `${calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior)),
      pickup: {
        value: Math.round(otbData.fbRevenue.pickup / 1000),
        type: getChangeType(otbData.fbRevenue.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior),
          type: getChangeType(calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.budget),
          type: getChangeType(calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.fbRevenue.current, otbData.fbRevenue.budget)) * 5, 100)
        }
      }
    },
    {
      id: 'other-revenue',
      title: 'Other Revenue',
      value: `${formatCurrencyValue(otbData.otherRevenue.current)}`,
      change: `${calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior)),
      pickup: {
        value: Math.round(otbData.otherRevenue.pickup / 100) / 10,
        type: getChangeType(otbData.otherRevenue.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior),
          type: getChangeType(calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.budget),
          type: getChangeType(calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.otherRevenue.current, otbData.otherRevenue.budget)) * 5, 100)
        }
      }
    },
    {
      id: 'departmental-expenses',
      title: 'Departmental Expenses',
      value: `${formatCurrencyValue(otbData.departmentalExpenses.current)}`,
      change: `${calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior)),
      pickup: {
        value: Math.round(otbData.departmentalExpenses.pickup / 1000),
        type: getChangeType(otbData.departmentalExpenses.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior),
          type: getChangeType(calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.budget),
          type: getChangeType(calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.departmentalExpenses.current, otbData.departmentalExpenses.budget)) * 5, 100)
        }
      }
    },
    {
      id: 'undistributed-expenses',
      title: 'Total Undistributed Expenses',
      value: `${formatCurrencyValue(otbData.undistributedExpenses.current)}`,
      change: `${calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior)),
      pickup: {
        value: Math.round(otbData.undistributedExpenses.pickup / 1000),
        type: getChangeType(otbData.undistributedExpenses.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior),
          type: getChangeType(calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.budget),
          type: getChangeType(calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.undistributedExpenses.current, otbData.undistributedExpenses.budget)) * 5, 100)
        }
      }
    },
    {
      id: 'gross-operating-profit',
      title: 'Gross Operating Profit',
      value: `${formatCurrencyValue(otbData.grossOperatingProfit.current)}`,
      change: `${calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior) >= 0 ? '+' : ''}${calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior).toFixed(1)}%`,
      changeType: getChangeType(calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior)),
      pickup: {
        value: Math.round(otbData.grossOperatingProfit.pickup / 1000),
        type: getChangeType(otbData.grossOperatingProfit.pickup)
      },
      comparisons: {
        vsPrior: {
          percentage: calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior),
          type: getChangeType(calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.prior)) * 5, 100)
        },
        vsBudget: {
          percentage: calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.budget),
          type: getChangeType(calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.budget)),
          progress: Math.min(Math.abs(calculatePercentageChange(otbData.grossOperatingProfit.current, otbData.grossOperatingProfit.budget)) * 5, 100)
        }
      }
    }
  ];
};

export const revenueChartData: ChartData[] = [
  { name: 'Jan', value: 42000 },
  { name: 'Feb', value: 38000 },
  { name: 'Mar', value: 45000 },
  { name: 'Apr', value: 47832 },
  { name: 'May', value: 52000 },
  { name: 'Jun', value: 48000 },
];

export const adrChartData: ChartData[] = [
  { name: 'Jan', value: 85.20 },
  { name: 'Feb', value: 82.10 },
  { name: 'Mar', value: 87.30 },
  { name: 'Apr', value: 89.50 },
  { name: 'May', value: 91.20 },
  { name: 'Jun', value: 88.70 },
];

export const occupancyChartData: ChartData[] = [
  { name: 'Jan', value: 72.5 },
  { name: 'Feb', value: 68.2 },
  { name: 'Mar', value: 75.8 },
  { name: 'Apr', value: 78.4 },
  { name: 'May', value: 82.1 },
  { name: 'Jun', value: 79.3 },
];

export const tableData: TableRow[] = [
  {
    id: '1',
    date: '2024-01-15',
    room: 'Premium Suite 201',
    guest: 'John Smith',
    revenue: '€125.00',
    nights: 2,
    adr: '€62.50',
  },
  {
    id: '2',
    date: '2024-01-15',
    room: 'Standard Room 105',
    guest: 'Maria Garcia',
    revenue: '€89.00',
    nights: 1,
    adr: '€89.00',
  },
  {
    id: '3',
    date: '2024-01-14',
    room: 'Deluxe Room 308',
    guest: 'Robert Johnson',
    revenue: '€180.00',
    nights: 2,
    adr: '€90.00',
  },
  {
    id: '4',
    date: '2024-01-14',
    room: 'Economy Room 102',
    guest: 'Emma Wilson',
    revenue: '€65.00',
    nights: 1,
    adr: '€65.00',
  },
  {
    id: '5',
    date: '2024-01-13',
    room: 'Premium Suite 205',
    guest: 'David Brown',
    revenue: '€150.00',
    nights: 1,
    adr: '€150.00',
  },
];

export const operationData: TableRow[] = [
  {
    id: '1',
    category: 'Room Revenue',
    january: '€42,000',
    february: '€38,000',
    march: '€45,000',
    april: '€47,832',
    total: '€172,832',
  },
  {
    id: '2',
    category: 'F&B Revenue',
    january: '€12,000',
    february: '€11,500',
    march: '€13,200',
    april: '€14,100',
    total: '€50,800',
  },
  {
    id: '3',
    category: 'Other Revenue',
    january: '€3,500',
    february: '€3,200',
    march: '€3,800',
    april: '€4,200',
    total: '€14,700',
  },
  {
    id: '4',
    category: 'Operating Expenses',
    january: '€28,000',
    february: '€26,500',
    march: '€29,800',
    april: '€31,200',
    total: '€115,500',
  },
];

export const revenueExpensesData: TableRow[] = [
  {
    id: '1',
    document: 'Invoice #2024-001',
    date: '2024-01-15',
    type: 'Revenue',
    amount: '€1,250.00',
    category: 'Room Sales',
  },
  {
    id: '2',
    document: 'Invoice #2024-002',
    date: '2024-01-14',
    type: 'Expense',
    amount: '€450.00',
    category: 'Housekeeping Supplies',
  },
  {
    id: '3',
    document: 'Invoice #2024-003',
    date: '2024-01-13',
    type: 'Revenue',
    amount: '€890.00',
    category: 'F&B Sales',
  },
  {
    id: '4',
    document: 'Invoice #2024-004',
    date: '2024-01-12',
    type: 'Expense',
    amount: '€2,100.00',
    category: 'Utilities',
  },
];