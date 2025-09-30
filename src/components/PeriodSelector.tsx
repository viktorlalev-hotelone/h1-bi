import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Settings, X } from 'lucide-react';
import { useCampaigns } from '../hooks/usePeriods';

interface PeriodSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isSalesPeriod?: boolean;
}

interface PredefinedPeriod {
  id: string;
  label: string;
  description: string;
  getValue: () => string;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ label, value, onChange, className = '', isSalesPeriod = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'set' | 'custom'>('quick');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [priorYears, setPriorYears] = useState<number>(1);
  const [customRange, setCustomRange] = useState<number>(1);
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { campaigns } = useCampaigns();

  // Calculate yesterday date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Calculate start date based on range
  const getStartDate = (range: number) => {
    const startDate = new Date(yesterday);
    startDate.setDate(startDate.getDate() - (range - 1));
    return startDate.toISOString().split('T')[0];
  };

  const handlePeriodSelect = (periodId: string) => {
    setSelectedPeriod(periodId);
  };

  const handleCustomRangeChange = (range: number) => {
    setCustomRange(range);
    setCustomStart(getStartDate(range));
    setCustomEnd(yesterdayStr);
  };

  const handleApply = () => {
    if (selectedPeriod) {
      const period = predefinedPeriods.find(p => p.id === selectedPeriod);
      if (period) {
        onChange(period.getValue());
      }
    } else if (customStart && customEnd) {
      onChange(`${customStart} - ${customEnd}`);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    setCustomStart(getStartDate(customRange));
    setCustomEnd(yesterdayStr);
  }, [customRange]);

  // Predefined periods
  const predefinedPeriods: PredefinedPeriod[] = [
    {
      id: 'today',
      label: 'Today',
      description: new Date().toLocaleDateString('en-GB'),
      getValue: () => {
        const today = new Date().toISOString().split('T')[0];
        return `${today} - ${today}`;
      }
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      description: new Date(Date.now() - 86400000).toLocaleDateString('en-GB'),
      getValue: () => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        return `${yesterday} - ${yesterday}`;
      }
    },
    {
      id: 'this-week',
      label: 'This Week',
      description: 'Monday to Sunday',
      getValue: () => {
        const today = new Date();
        const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return `${monday.toISOString().split('T')[0]} - ${sunday.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'last-week',
      label: 'Last Week',
      description: 'Previous Monday to Sunday',
      getValue: () => {
        const today = new Date();
        const lastMonday = new Date(today.setDate(today.getDate() - today.getDay() - 6));
        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6);
        return `${lastMonday.toISOString().split('T')[0]} - ${lastSunday.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'this-month',
      label: 'This Month',
      description: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${firstDay.toISOString().split('T')[0]} - ${lastDay.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'last-month',
      label: 'Last Month',
      description: new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
        return `${firstDay.toISOString().split('T')[0]} - ${lastDay.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'last-7-days',
      label: 'Last 7 Days',
      description: 'Including today',
      getValue: () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        return `${sevenDaysAgo.toISOString().split('T')[0]} - ${today.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'last-30-days',
      label: 'Last 30 Days',
      description: 'Including today',
      getValue: () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        return `${thirtyDaysAgo.toISOString().split('T')[0]} - ${today.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'next-7-days',
      label: 'Next 7 Days',
      description: 'Starting from today',
      getValue: () => {
        const today = new Date();
        const sevenDaysLater = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
        return `${today.toISOString().split('T')[0]} - ${sevenDaysLater.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'next-30-days',
      label: 'Next 30 Days',
      description: 'Starting from today',
      getValue: () => {
        const today = new Date();
        const thirtyDaysLater = new Date(today.getTime() + 29 * 24 * 60 * 60 * 1000);
        return `${today.toISOString().split('T')[0]} - ${thirtyDaysLater.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'last-3-months',
      label: 'Last 3 Months',
      description: 'Previous quarter',
      getValue: () => {
        const today = new Date();
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return `${threeMonthsAgo.toISOString().split('T')[0]} - ${lastMonth.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'next-3-months',
      label: 'Next 3 Months',
      description: 'Upcoming quarter',
      getValue: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const threeMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, 0);
        return `${firstDay.toISOString().split('T')[0]} - ${threeMonthsLater.toISOString().split('T')[0]}`;
      }
    },
    {
      id: 'this-year',
      label: 'This Year',
      description: new Date().getFullYear().toString(),
      getValue: () => {
        const year = new Date().getFullYear();
        return `${year}-01-01 - ${year}-12-31`;
      }
    },
    {
      id: 'last-year',
      label: 'Last Year',
      description: (new Date().getFullYear() - 1).toString(),
      getValue: () => {
        const year = new Date().getFullYear() - 1;
        return `${year}-01-01 - ${year}-12-31`;
      }
    },
    {
      id: 'next-year',
      label: 'Next Year',
      description: (new Date().getFullYear() + 1).toString(),
      getValue: () => {
        const year = new Date().getFullYear() + 1;
        return `${year}-01-01 - ${year}-12-31`;
      }
    }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-700">{value || 'Select period'}</span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-96">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Select Period</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'quick'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quick Select
              </button>
              <button
                onClick={() => setActiveTab('set')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'set'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Set Periods
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'custom'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Custom
              </button>
            </div>

            <div className="space-y-4">
              {/* Quick Select Tab */}
              {activeTab === 'quick' && (
                <div className="space-y-1">
                  {(label.includes('Pickup') ? predefinedPeriods.filter(period => {
                    // Only show most common past periods for Pickup Period
                    const today = new Date();
                    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                    
                    // Allow only periods that end before or on yesterday
                    if (period.id === 'today') return false;
                    if (period.id.includes('next')) return false;
                    if (period.id.includes('this') && period.id !== 'this-month') return false;
                    
                    // Show only most common periods to reduce height
                    const commonPeriods = ['yesterday', 'last-week', 'last-month', 'last-7-days', 'last-30-days'];
                    if (!commonPeriods.includes(period.id)) return false;
                    
                    return true;
                  }) : predefinedPeriods).map((period) => (
                    <button
                      key={period.id}
                      onClick={() => handlePeriodSelect(period.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedPeriod === period.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm">{period.label}</div>
                      <div className="text-xs text-gray-500">{period.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Set Periods Tab */}
              {activeTab === 'set' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select from configured periods
                    </label>
                    <div className="space-y-2">
                      {campaigns.map(campaign => (
                        <div key={campaign.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-sm text-gray-900 mb-2">{campaign.name}</div>
                          <div className="space-y-1">
                            {campaign.periods.map(period => (
                              <button
                                key={period.id}
                                onClick={() => {
                                  const startDate = new Date(period.startDate).toLocaleDateString('en-CA');
                                  const endDate = new Date(period.endDate).toLocaleDateString('en-CA');
                                  onChange(`${startDate} - ${endDate}`);
                                  setIsOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              >
                                <div className="font-medium">{period.name}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(period.startDate).toLocaleDateString('en-GB')} - {new Date(period.endDate).toLocaleDateString('en-GB')}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Tab */}
              {activeTab === 'custom' && (
                <div className="space-y-4">
                  {/* Quick Range Slider */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Quick Range: Last {customRange} day{customRange > 1 ? 's' : ''}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="365"
                      value={customRange}
                      onChange={(e) => handleCustomRangeChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 day</span>
                      <span>365 days</span>
                    </div>
                  </div>

                  {/* Date Range Display */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900">
                          {new Date(customStart).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">End Date</label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                          {new Date(customEnd).toLocaleDateString('en-GB')} (Yesterday)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedPeriod && !customStart}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;