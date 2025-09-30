import React from 'react';
import { Calendar, RefreshCw, ChevronDown, Filter, X, Settings } from 'lucide-react';
import { useCurrentPeriod } from '../hooks/useHotelSelection';
import { useLocation } from 'react-router-dom';
import HotelSelector from './HotelSelector';
import PeriodSelector from './PeriodSelector';

interface FilterStripProps {
  showRoomsAnalytics?: boolean;
  pickupPeriod?: string;
  onPickupPeriodChange?: (period: string) => void;
  granulation?: string;
  onGranulationChange?: (granulation: string) => void;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onSalesPeriodChange?: (period: string) => void;
  onActiveFiltersSummaryChange?: (summary: string[]) => void;
}

const FilterStrip: React.FC<FilterStripProps> = ({ 
  showRoomsAnalytics = false,
  pickupPeriod = '9/17/2025 - 9/17/2025',
  onPickupPeriodChange,
  granulation = 'Month',
  onGranulationChange,
  selectedPeriod = '9/17/2025 - 9/17/2025',
  onPeriodChange,
  onSalesPeriodChange,
  onActiveFiltersSummaryChange
}) => {
  const location = useLocation();
  const [showMegaMenu, setShowMegaMenu] = React.useState(false);
  const megaMenuRef = React.useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState({
    stayPeriod: selectedPeriod || '9/17/2025 - 9/17/2025',
    salesPeriod: selectedPeriod || '9/17/2025 - 9/17/2025',
    salesPeriodType: 'actual' as 'actual' | 'sales-to-date',
    companies: [] as string[],
    marketingSource: [] as string[],
    marketingSegment: [] as string[],
    marketingChannel: [] as string[],
    guestNationalities: [] as string[],
    roomTypes: [] as string[],
    guestMix: [] as string[],
    mealPlans: [] as string[],
    bookingWindows: [] as string[],
    lengthOfStay: [] as string[],
    weekdays: [] as string[]
  });
  
  // Determine page ID based on current route
  const getPageId = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/explorer/rooms') return 'rooms-explorer';
    if (location.pathname === '/reports/operation-statement') return 'operation-statement';
    return 'home';
  };
  
  const currentPeriod = useCurrentPeriod(getPageId());

  // Close mega menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setShowMegaMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Filter options
  const filterOptions = {
    companies: ['TUI Bulgaria', 'Balkan Holidays', 'Coral Travel', 'Anex Tour', 'Join UP!', 'Direct Bookings'],
    marketingSource: ['Online', 'Tour Operators', 'Direct', 'Corporate', 'Travel Agents', 'OTA'],
    marketingSegment: ['Leisure', 'Business', 'Groups', 'MICE', 'Wedding', 'Corporate Events'],
    marketingChannel: ['Website', 'Booking.com', 'Expedia', 'Phone', 'Email', 'Walk-in'],
    guestNationalities: ['Bulgaria', 'Germany', 'UK', 'Russia', 'Romania', 'Poland', 'Czech Republic'],
    roomTypes: ['Standard Double', 'Superior Sea View', 'Family Room', 'Suite', 'Single', 'Triple'],
    guestMix: ['Adults Only', 'Families with Children', 'Mixed', 'Business Travelers', 'Groups'],
    mealPlans: ['Room Only', 'Breakfast', 'Half Board', 'Full Board', 'All Inclusive', 'Ultra All Inclusive'],
    bookingWindows: ['0-7 days', '8-30 days', '31-60 days', '61-90 days', '91+ days'],
    lengthOfStay: ['1 night', '2-3 nights', '4-7 nights', '8-14 nights', '15+ nights'],
    weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType as keyof typeof prev] as string[], value]
        : (prev[filterType as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      stayPeriod: '9/17/2025 - 9/17/2025',
      salesPeriod: '9/17/2025 - 9/17/2025',
     salesPeriodType: 'actual',
      companies: [],
      marketingSource: [],
      marketingSegment: [],
      marketingChannel: [],
      guestNationalities: [],
      roomTypes: [],
      guestMix: [],
      mealPlans: [],
      bookingWindows: [],
      lengthOfStay: [],
      weekdays: []
    });
    setExpandedSections([]);
  };

  // Generate active filters summary
  const generateActiveFiltersSummary = () => {
    const summary: string[] = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        const filterName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (value.length <= 2) {
          summary.push(`${filterName}: ${value.join(', ')}`);
        } else {
          summary.push(`${filterName}: ${value.length} selected`);
        }
      }
    });
    
    return summary;
  };

  // Notify parent components about changes
  React.useEffect(() => {
    if (onSalesPeriodChange) {
      onSalesPeriodChange(filters.salesPeriod);
    }
    
    if (onActiveFiltersSummaryChange) {
      const summary = generateActiveFiltersSummary();
      onActiveFiltersSummaryChange(summary);
    }
  }, [filters, onSalesPeriodChange, onActiveFiltersSummaryChange]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getActiveFiltersCount = () => {
    // Count all active filters including periods
    return Object.values(filters).reduce((count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray.length;
      }
      return count;
    }, 0);
  };

  // Add period changes to active count
  let periodChanges = 0;
  if (filters.stayPeriod !== '9/17/2025 - 9/17/2025') periodChanges++;
  if (filters.salesPeriod !== '9/17/2025 - 9/17/2025') periodChanges++;
  if (pickupPeriod !== '9/17/2025 - 9/17/2025') periodChanges++;

  const getSectionActiveCount = (sectionId: string) => {
    const filterArray = filters[sectionId as keyof typeof filters];
    return Array.isArray(filterArray) ? filterArray.length : 0;
  };

  // Filter sections configuration
  const filterSections = [
    {
      id: 'companies',
      title: 'Companies',
      description: 'Tour operators and booking sources',
      options: filterOptions.companies
    },
    {
      id: 'marketingSource',
      title: 'Marketing Source',
      description: 'Primary booking channels',
      options: filterOptions.marketingSource
    },
    {
      id: 'marketingSegment',
      title: 'Marketing Segment',
      description: 'Guest categories and purposes',
      options: filterOptions.marketingSegment
    },
    {
      id: 'marketingChannel',
      title: 'Marketing Channel',
      description: 'Specific booking platforms',
      options: filterOptions.marketingChannel
    },
    {
      id: 'guestNationalities',
      title: 'Guest Nationalities',
      description: 'Countries of origin',
      options: filterOptions.guestNationalities
    },
    {
      id: 'roomTypes',
      title: 'Room Types',
      description: 'Accommodation categories',
      options: filterOptions.roomTypes
    },
    {
      id: 'guestMix',
      title: 'Guest Mix',
      description: 'Guest composition types',
      options: filterOptions.guestMix
    },
    {
      id: 'mealPlans',
      title: 'Meal Plans',
      description: 'Dining packages included',
      options: filterOptions.mealPlans
    },
    {
      id: 'bookingWindows',
      title: 'Booking Windows',
      description: 'Time between booking and stay',
      options: filterOptions.bookingWindows
    },
    {
      id: 'lengthOfStay',
      title: 'Length of Stay',
      description: 'Duration of guest stays',
      options: filterOptions.lengthOfStay
    },
    {
      id: 'weekdays',
      title: 'Weekdays',
      description: 'Days of the week',
      options: filterOptions.weekdays
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-6 py-2 sm:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex items-center">
          <HotelSelector />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 flex-wrap">
          {!showRoomsAnalytics && (
            <div className="flex items-center text-xs text-gray-600">
              <Calendar size={12} className="mr-1 sm:mr-2 flex-shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium truncate">{currentPeriod?.campaignName}:</span>
                <span className="sm:ml-1 text-xs sm:text-sm">{currentPeriod?.displayRange}</span>
              </div>
            </div>
          )}
          
          {/* Active Filters Summary */}
          {showRoomsAnalytics && getActiveFiltersCount() > 0 && (
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {getActiveFiltersCount()} active filters
            </div>
          )}
          {showRoomsAnalytics && (
            <>
              {/* Mega Menu Toggle */}
              <div className="relative" ref={megaMenuRef}>
                <button
                  onClick={() => setShowMegaMenu(!showMegaMenu)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showMegaMenu || getActiveFiltersCount() > 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter size={12} className="mr-1" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                  <ChevronDown size={12} className={`ml-1 transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown */}
                {showMegaMenu && (
                  <div className="absolute top-full right-0 mt-2 w-screen max-w-7xl bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Advanced Filters</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {/* Navigate to settings */}}
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                            title="Configure periods in Settings"
                          >
                            <Settings size={12} className="mr-1" />
                            Configure
                          </button>
                          <button
                            onClick={clearAllFilters}
                            className="text-xs text-gray-600 hover:text-gray-800"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setShowMegaMenu(false)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {/* Period and Granulation Controls */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-semibold text-blue-900 mb-3">Period & Time Settings</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Stay Period */}
                            <div>
                              <label className="block text-xs font-medium text-blue-800 mb-2">Stay Period</label>
                              <PeriodSelector
                                label=""
                                value={filters.stayPeriod}
                                onChange={(value) => setFilters(prev => ({ ...prev, stayPeriod: value }))}
                                className="w-full"
                              />
                            </div>
                            
                            {/* Sales Period Type */}
                            <div>
                              <label className="block text-xs font-medium text-blue-800 mb-2">Sales Period Type</label>
                              <select
                                value={filters.salesPeriodType}
                                onChange={(e) => setFilters(prev => ({ ...prev, salesPeriodType: e.target.value as 'actual' | 'sales-to-date' }))}
                                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              >
                                <option value="actual">Actual</option>
                                <option value="sales-to-date">Sales To Date</option>
                              </select>
                            </div>
                            
                            {/* Sales Period */}
                            <div>
                              <label className="block text-xs font-medium text-blue-800 mb-2">
                                Sales Period {filters.salesPeriodType === 'sales-to-date' ? '(STD)' : ''}
                              </label>
                              <PeriodSelector
                                label=""
                                value={filters.salesPeriod}
                                onChange={(value) => setFilters(prev => ({ ...prev, salesPeriod: value }))}
                                isSalesPeriod={true}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200 my-4"></div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Data Filters</h4>

                        {/* Grid Layout for Data Filter Sections */}
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                          {filterSections.map((section) => {
                            const isExpanded = expandedSections.includes(section.id);
                            const activeCount = getSectionActiveCount(section.id);
                            
                            return (
                              <div key={section.id} className="relative">
                                {/* Section Card */}
                                <button
                                  onClick={() => toggleSection(section.id)}
                                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                                    isExpanded 
                                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-900">{section.title}</span>
                                    {activeCount > 0 && (
                                      <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                        {activeCount}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mb-2">{section.description}</p>
                                  <div className="flex items-center justify-center">
                                    <ChevronDown 
                                      size={14} 
                                      className={`text-gray-400 transition-transform ${
                                        isExpanded ? 'rotate-180' : ''
                                      }`} 
                                    />
                                  </div>
                                </button>
                                
                                {/* Expanded Options Overlay */}
                                {isExpanded && (
                                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-y-auto">
                                    <div className="grid grid-cols-1 gap-2">
                                      {section.options.map(option => (
                                        <button
                                          key={option}
                                          onClick={() => handleFilterChange(section.id, option, !(filters[section.id as keyof typeof filters] as string[]).includes(option))}
                                          className={`p-2 text-xs rounded-lg border transition-colors text-left ${
                                            (filters[section.id as keyof typeof filters] as string[]).includes(option)
                                              ? 'border-blue-500 bg-blue-100 text-blue-700 font-medium'
                                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                          }`}
                                        >
                                          {option}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button className="p-1 rounded hover:bg-gray-100 text-blue-600">
                <RefreshCw size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterStrip;