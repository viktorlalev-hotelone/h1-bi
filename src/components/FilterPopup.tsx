import React from 'react';
import { X, Filter, Calendar, Building2, Settings, Info, Check } from 'lucide-react';
import { useCurrentPeriod, useHotelSelection } from '../hooks/useHotelSelection';
import { useLocation } from 'react-router-dom';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSalesPeriodChange?: (period: string) => void;
  onActiveFiltersSummaryChange?: (summary: string[]) => void;
}

// Available hotels for the tiles selector
const availableHotels = [
  { id: 'all-hotels', label: 'All Hotels' },
  { id: 'orel', label: 'Orel' },
  { id: 'condor', label: 'Condor' },
  { id: 'arsena', label: 'Arsena' }
];

const FilterPopup: React.FC<FilterPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSalesPeriodChange, 
  onActiveFiltersSummaryChange 
}) => {
  const location = useLocation();
  
  const [tempSelectedHotels, setTempSelectedHotels] = React.useState<string[]>(['all-hotels']);
  
  // Get current period and hotel selection
  const getPageId = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/explorer/rooms') return 'rooms-explorer';
    if (location.pathname === '/reports/operation-statement') return 'operation-statement';
    return 'home';
  };
  
  const currentPeriod = useCurrentPeriod(getPageId());
  const { selectedHotels, getSelectedLabel, toggleHotel } = useHotelSelection();

  // Check if we're on the Dashboard page
  const isDashboardPage = location.pathname === '/';

  // Get yesterday's date for TDR display
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  // Initialize temp selected hotels when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedHotels([...selectedHotels]);
    }
  }, [isOpen, selectedHotels]);

  // Helper functions for date formatting
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    };
    
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getPriorYear = () => new Date().getFullYear() - 1;

  // Handle hotel tile selection
  const handleHotelTileClick = (hotelId: string) => {
    if (hotelId === 'all-hotels') {
      setTempSelectedHotels(['all-hotels']);
    } else {
      setTempSelectedHotels(current => {
        if (current.includes('all-hotels')) {
          return [hotelId];
        } else {
          if (current.includes(hotelId)) {
            const newSelection = current.filter(h => h !== hotelId);
            return newSelection.length === 0 ? ['all-hotels'] : newSelection;
          } else {
            const newSelection = [...current, hotelId];
            const individualHotels = availableHotels.filter(h => h.id !== 'all-hotels').map(h => h.id);
            const hasAllIndividualHotels = individualHotels.every(h => newSelection.includes(h));
            return hasAllIndividualHotels ? ['all-hotels'] : newSelection;
          }
        }
      });
    }
  };

  // Handle Apply Filters
  const handleApplyFilters = () => {
    // Apply hotel selection changes
    tempSelectedHotels.forEach(hotel => {
      if (!selectedHotels.includes(hotel)) {
        toggleHotel(hotel);
      }
    });
    selectedHotels.forEach(hotel => {
      if (!tempSelectedHotels.includes(hotel)) {
        toggleHotel(hotel);
      }
    });
    onClose();
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setTempSelectedHotels(['all-hotels']);
  };

  // Handle Cancel
  const handleCancel = () => {
    setTempSelectedHotels([...selectedHotels]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Filter size={20} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">Current Selection</h3>
            <div className={`grid gap-4 ${isDashboardPage ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              
              {/* Hotels / Accounts (interactive) */}
              <div className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Building2 size={16} className="text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-blue-900">Hotels / Accounts</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableHotels.map(hotel => (
                    <button
                      key={hotel.id}
                      onClick={() => handleHotelTileClick(hotel.id)}
                      className={`p-2 text-xs rounded-lg border transition-colors text-left ${
                        tempSelectedHotels.includes(hotel.id)
                          ? 'border-blue-500 bg-blue-100 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{hotel.label}</span>
                        {tempSelectedHotels.includes(hotel.id) && (
                          <Check size={12} className="text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Recognition Period (Stay / Service) - Dashboard only */}
              {isDashboardPage && (
                <div className="bg-white border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-blue-900">Recognition Period</div>
                      <div className="text-xs text-blue-600">Stay / Service</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Read-only</span>
                      <button
                        className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                        title="The Recognition Period defines when revenue and expenses are recognized. On the Dashboard this is fixed from Settings (Current, Prior, Budget and Forecast ranges)."
                      >
                        <Info size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-blue-800">
                      <strong>Current:</strong> {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${getCurrentYear()}`}
                    </div>
                    <div className="text-xs text-blue-800">
                      <strong>Prior:</strong> {currentPeriod?.recognition?.priorDisplayRange || `01 Jan – 31 Dec ${getPriorYear()}`}
                    </div>
                    <div className="text-xs text-blue-800">
                      <strong>Budget:</strong> {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${getCurrentYear()}`}
                    </div>
                    <div className="text-xs text-blue-800">
                      <strong>Forecast:</strong> {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${getCurrentYear()}`}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Records Period (Sales / Purchasing) - Dashboard only */}
              {isDashboardPage && (
                <div className="bg-white border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-blue-900">Records Period</div>
                      <div className="text-xs text-blue-600">Sales / Purchasing</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Read-only</span>
                      <button
                        className="p-1 rounded-full hover:bg-blue-100 text-blue-600"
                        title="Records Period is configured in Settings and defines which sales/purchasing records are included."
                      >
                        <Info size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-blue-800">
                      <strong>{currentPeriod?.records?.name || 'TDR'}:</strong> {currentPeriod?.records?.description || `up to yesterday (${yesterdayFormatted})`}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      Records Period affects how Budget, Forecast and Prior comparisons are presented.
                    </div>
                  </div>
                </div>
              )}
              
              {/* Period Card - Non-Dashboard pages */}
              {!isDashboardPage && (
                <div className="flex items-center">
                  <Calendar size={16} className="text-blue-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Period</div>
                    <div className="text-sm text-blue-700">
                      {currentPeriod?.campaignName} - {currentPeriod?.name}
                    </div>
                    <div className="text-xs text-blue-600">{currentPeriod?.displayRange}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Placeholder for future filter sections */}
          <div className="space-y-6">
            {isDashboardPage ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Configuration</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  This is a Dashboard page. Advanced filters are not available here. Recognition and Records periods are predefined in Settings.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Configuration</h3>
                <p className="text-gray-600 mb-4">
                  Advanced filtering options will be available here. This will include:
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>• Hotel selection and grouping</div>
                  <div>• Period and date range configuration</div>
                  <div>• Company and market segment filters</div>
                  <div>• Room type and guest nationality filters</div>
                  <div>• Booking window and length of stay filters</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              onClick={handleResetFilters}
              Reset Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;