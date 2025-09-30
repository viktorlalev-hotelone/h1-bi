import React, { useState } from 'react';
import { Settings, Download, BarChart3, Grid3X3, X } from 'lucide-react';
import PeriodSelector from './PeriodSelector';

interface RoomsKPITableProps {
  className?: string;
  pickupPeriod?: string;
  onPickupPeriodChange?: (period: string) => void;
  granulation?: string;
  onGranulationChange?: (granulation: string) => void;
}

interface TableColumn {
  id: string;
  label: string;
  group: string;
  visible: boolean;
  subColumns?: {
    id: string;
    label: string;
    width?: string;
  }[];
}

// Updated interface to match the exact table structure from images
interface TableRow {
  period: string;
  roomsRevenue: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  occupancy: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  roomNightsSold: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  adrPerRoomNightSold: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  guestNightsSold: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  adrPerGuestNightSold: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  avgGuestsPerRoom: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
  avgLengthOfStay: {
    current: number;
    netPickup: number;
    deltaPercentPrior: string;
    deltaPercentBudget: string;
  };
}

const RoomsKPITable: React.FC<RoomsKPITableProps> = ({ 
  className = '',
  pickupPeriod = '9/17/2025 - 9/17/2025',
  onPickupPeriodChange,
  granulation = 'Month',
  onGranulationChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState<TableColumn[]>([
    {
      id: 'roomsRevenue',
      label: 'ROOMS REVENUE',
      group: 'revenue',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '100px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'occupancy',
      label: 'OCCUPANCY',
      group: 'occupancy',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'roomNightsSold',
      label: 'ROOM NIGHTS SOLD',
      group: 'rooms',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'adrPerRoomNightSold',
      label: 'ADR PER ROOM NIGHT SOLD',
      group: 'adr',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'guestNightsSold',
      label: 'GUEST NIGHTS SOLD',
      group: 'guests',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'adrPerGuestNightSold',
      label: 'ADR PER GUEST NIGHT SOLD',
      group: 'adr',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'avgGuestsPerRoom',
      label: 'AVG GUESTS PER ROOM',
      group: 'metrics',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    },
    {
      id: 'avgLengthOfStay',
      label: 'AVG LENGTH OF STAY',
      group: 'metrics',
      visible: true,
      subColumns: [
        { id: 'current', label: 'CURRENT', width: '70px' },
        { id: 'netPickup', label: 'NET PICKUP', width: '60px' },
        { id: 'deltaPercentPrior', label: 'Δ VS PRIOR', width: '65px' },
        { id: 'deltaPercentBudget', label: 'Δ VS BUDGET', width: '65px' }
      ]
    }
  ]);

  // Mock data matching the exact format from images
  const tableData: TableRow[] = [
    {
      period: 'June 2025',
      roomsRevenue: { current: 513728.22, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      occupancy: { current: 76.75, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      roomNightsSold: { current: 3099, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerRoomNightSold: { current: 165.77, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      guestNightsSold: { current: 6981, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerGuestNightSold: { current: 73.59, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgGuestsPerRoom: { current: 2.25, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgLengthOfStay: { current: 5.89, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' }
    },
    {
      period: 'July 2025',
      roomsRevenue: { current: 1070649.83, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      occupancy: { current: 93.17, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      roomNightsSold: { current: 3953, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerRoomNightSold: { current: 270.84, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      guestNightsSold: { current: 9516, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerGuestNightSold: { current: 112.51, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgGuestsPerRoom: { current: 2.41, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgLengthOfStay: { current: 5.57, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' }
    },
    {
      period: 'August 2025',
      roomsRevenue: { current: 1104907.90, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      occupancy: { current: 93.02, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      roomNightsSold: { current: 3973, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerRoomNightSold: { current: 278.10, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      guestNightsSold: { current: 9337, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerGuestNightSold: { current: 118.34, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgGuestsPerRoom: { current: 2.35, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgLengthOfStay: { current: 5.15, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' }
    },
    {
      period: 'September 2025',
      roomsRevenue: { current: 483093.35, netPickup: 1928.26, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      occupancy: { current: 80.18, netPickup: 1.56, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      roomNightsSold: { current: 3293, netPickup: 64, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerRoomNightSold: { current: 146.70, netPickup: -2.31, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      guestNightsSold: { current: 6886, netPickup: 77, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      adrPerGuestNightSold: { current: 70.16, netPickup: -0.51, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgGuestsPerRoom: { current: 2.09, netPickup: -0.02, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
      avgLengthOfStay: { current: 5.68, netPickup: 0.03, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' }
    }
  ];

  // Grand Total row matching the exact format from images
  const grandTotal: TableRow = {
    period: 'Grand Total',
    roomsRevenue: { current: 3172379.30, netPickup: 1928.26, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    occupancy: { current: 85.95, netPickup: 0.39, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    roomNightsSold: { current: 14318, netPickup: 64, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    adrPerRoomNightSold: { current: 221.57, netPickup: -0.86, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    guestNightsSold: { current: 32720, netPickup: 77, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    adrPerGuestNightSold: { current: 96.96, netPickup: -0.16, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    avgGuestsPerRoom: { current: 2.29, netPickup: 0, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' },
    avgLengthOfStay: { current: 5.54, netPickup: 0.01, deltaPercentPrior: 'SOON', deltaPercentBudget: 'SOON' }
  };

  const toggleColumn = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const resetToDefault = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const exportToCSV = () => {
    // Implementation for CSV export
    console.log('Exporting to CSV...');
  };

  const formatValue = (value: number | string, type: string) => {
    if (value === 'SOON') return <span className="text-blue-600 text-xs font-medium">SOON</span>;
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'integer':
        return Math.round(value).toString();
      default:
        return value.toString();
    }
  };

  const getPickupBadgeClass = (value: number) => {
    if (value > 0) return 'bg-green-500 text-white px-1 py-0.5 rounded text-xs font-medium';
    if (value < 0) return 'bg-red-500 text-white px-1 py-0.5 rounded text-xs font-medium';
    return 'bg-gray-500 text-white px-1 py-0.5 rounded text-xs font-medium';
  };

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className} max-w-full`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Rooms KPIs by Service Dates</h3>
        <div className="flex items-center space-x-2">
          {/* Pickup Period */}
          <PeriodSelector
            label="Pickup Period"
            value={pickupPeriod}
            onChange={(value) => onPickupPeriodChange?.(value)}
            className="text-xs"
          />
          
          {/* Granulation */}
          <select
            value={granulation}
            onChange={(e) => onGranulationChange?.(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Day">Day</option>
          </select>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Column Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download size={14} className="mr-1" />
            Export
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="Chart View">
            <BarChart3 size={16} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="Grid View">
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rooms KPIs by Service Dates - Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder column groups, or use the toggle to show/hide them.
              </p>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {columns.map((column) => (
                  <div key={column.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-100 rounded mr-3 flex items-center justify-center cursor-move">
                        <span className="text-xs">+</span>
                      </div>
                      <span className="font-medium text-gray-900">{column.label}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => toggleColumn(column.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={resetToDefault}
                  className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="relative border-t border-gray-200" style={{ height: '400px', maxWidth: '100%' }}>
        <div className="absolute inset-0 overflow-auto">
          <table className="w-full min-w-max">
          {/* Header */}
          <thead className="sticky top-0 z-20">
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[150px] z-30">
                DATE/PERIOD OF SERVICE
              </th>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                  colSpan={column.subColumns?.length || 1}
                >
                  {column.label}
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="sticky left-0 bg-gray-50 px-4 py-2 border-r border-gray-200 z-30"></th>
              {visibleColumns.map((column) =>
                column.subColumns?.map((subCol) => (
                  <th
                    key={`${column.id}-${subCol.id}`}
                    className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                    style={{ minWidth: subCol.width }}
                  >
                    {subCol.label}
                  </th>
                ))
              )}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody className="bg-white">
            {[...tableData, grandTotal].map((row, index) => (
              <tr
                key={row.period}
                className={`hover:bg-gray-50 border-b border-gray-200 ${
                  row.period === 'Grand Total' 
                    ? 'bg-gray-50 font-semibold border-t-2 border-gray-300 sticky bottom-0 z-10' 
                    : ''
                }`}
              >
                <td className={`sticky left-0 px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 z-20 ${
                  row.period === 'Grand Total' ? 'bg-gray-50' : 'bg-white'
                }`}>
                  {row.period}
                </td>
                
                {visibleColumns.map((column) => {
                  const data = row[column.id as keyof TableRow] as any;
                  return column.subColumns?.map((subCol) => {
                    const value = data[subCol.id];
                    let formattedValue;
                    let cellClass = `px-2 py-3 text-center border-r border-gray-200 whitespace-nowrap ${
                      subCol.id === 'current' ? 'text-sm' : 'text-xs'
                    }`;
                    
                    if (subCol.id === 'current') {
                      if (column.id === 'roomsRevenue') {
                        formattedValue = formatValue(value, 'currency');
                      } else if (column.id === 'occupancy') {
                        formattedValue = formatValue(value, 'percentage');
                      } else if (column.id.includes('adr')) {
                        formattedValue = formatValue(value, 'currency');
                      } else if (column.id.includes('avg')) {
                        formattedValue = formatValue(value, 'decimal');
                      } else {
                        formattedValue = formatValue(value, 'integer');
                      }
                    } else if (subCol.id === 'netPickup') {
                      if (typeof value === 'number' && value !== 0) {
                        formattedValue = <span className={`${getPickupBadgeClass(value)} text-xs`}>{value > 0 ? '+' : ''}{formatValue(value, column.id === 'roomsRevenue' ? 'currency' : column.id === 'occupancy' ? 'decimal' : 'decimal')}</span>;
                      } else {
                        formattedValue = <span className="px-1 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">{formatValue(value, 'decimal')}</span>;
                      }
                    } else if (subCol.id.includes('deltaPercent')) {
                      formattedValue = formatValue(value, typeof value === 'string' ? 'string' : 'percentage');
                    }
                    
                    return (
                      <td key={`${column.id}-${subCol.id}`} className={cellClass}>
                        {formattedValue}
                      </td>
                    );
                  });
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default RoomsKPITable;