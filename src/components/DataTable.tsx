import React, { useState } from 'react';
import { Download, Eye, Settings } from 'lucide-react';

interface DataTableProps {
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
  onRowClick?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ title, data, columns, onRowClick }) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.key));
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  
  // Handle empty or undefined data
  const safeData = data || [];
  const hasData = safeData.length > 0;

  const exportToCSV = () => {
    const headers = columns.filter(col => visibleColumns.includes(col.key)).map(col => col.label);
    const rows = safeData.map(row => 
      visibleColumns.map(key => row[key] || '')
    );
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowColumnPicker(!showColumnPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Settings size={16} />
            </button>
            {showColumnPicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                {columns.map(column => (
                  <label key={column.key} className="flex items-center px-3 py-1 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column.key)}
                      onChange={() => toggleColumn(column.key)}
                      className="mr-2"
                    />
                    <span className="text-sm">{column.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center px-2 sm:px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
          >
            <Download size={12} className="mr-1" />
            <span className="hidden sm:inline">CSV Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {!hasData ? (
          <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-400 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 text-sm">There are no records to display at this time.</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns
                  .filter(col => visibleColumns.includes(col.key))
                  .map(column => (
                  <th key={column.key} className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
                {onRowClick && (
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  {columns
                    .filter(col => visibleColumns.includes(col.key))
                    .map(column => (
                    <td key={column.key} className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {row[column.key] || '-'}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => onRowClick(row)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;