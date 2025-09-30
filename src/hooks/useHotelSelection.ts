import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSettings } from './useSettings';
import { useCampaigns } from './usePeriods';
import { DefaultPeriodSetting } from '../types';

export type HotelOption = 'consolidated-reports' | 'orel' | 'condor' | 'arsena' | 'kalina-garden' | 'astoria' | 'asteria' | 'sport';

export const hotelOptions = [
  { id: 'all-hotels' as const, label: 'All Hotels' },
  { id: 'orel' as const, label: 'Orel' },
  { id: 'condor' as const, label: 'Condor' },
  { id: 'arsena' as const, label: 'Arsena' },
  { id: 'kalina-garden' as const, label: 'Kalina Garden' },
  { id: 'astoria' as const, label: 'Astoria' },
  { id: 'asteria' as const, label: 'Asteria' },
  { id: 'sport' as const, label: 'Sport' },
];

const STORAGE_KEY = 'hotelone-selected-hotel';

export const useHotelSelection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedHotels, setSelectedHotels] = useState<HotelOption[]>(['all-hotels']);

  // Initialize from URL or localStorage
  useEffect(() => {
    const urlHotels = searchParams.get('hotels');
    const storedHotels = localStorage.getItem(STORAGE_KEY);
    
    // Validate hotel options
    const isValidHotel = (hotel: string): hotel is HotelOption => 
      hotelOptions.some(option => option.id === hotel);
    
    let initialHotels: HotelOption[] = ['consolidated-reports'];
    
    if (urlHotels) {
      const parsedHotels = urlHotels.split(',').filter(isValidHotel);
      if (parsedHotels.length > 0) {
        initialHotels = parsedHotels;
      }
    } else if (storedHotels) {
      try {
        const parsedStored = JSON.parse(storedHotels).filter(isValidHotel);
        if (parsedStored.length > 0) {
          initialHotels = parsedStored;
        }
      } catch (error) {
        // Fallback for old single hotel format
        if (isValidHotel(storedHotels)) {
          initialHotels = [storedHotels];
        }
      }
    }
    
    setSelectedHotels(initialHotels);
    
    // Update URL if it doesn't match the selected hotels
    if (searchParams.get('hotels') !== initialHotels.join(',')) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('hotels', initialHotels.join(','));
        return newParams;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const toggleHotel = (hotel: HotelOption) => {
    setSelectedHotels(current => {
      let newSelection: HotelOption[];
      
      if (hotel === 'all-hotels') {
        // If clicking "All Hotels"
        if (current.includes('all-hotels')) {
          // If "All Hotels" is already selected, do nothing (keep it selected)
          newSelection = current;
        } else {
          // If "All Hotels" is not selected, select only that
          newSelection = ['all-hotels'];
        }
      } else {
        // If "All Hotels" is currently selected and we click a specific hotel
        if (current.includes('all-hotels')) {
          newSelection = [hotel];
        } else {
          // Toggle the specific hotel
          if (current.includes(hotel)) {
            newSelection = current.filter(h => h !== hotel);
            // If no hotels left, select "All Hotels"
            if (newSelection.length === 0) {
              newSelection = ['all-hotels'];
            }
          } else {
            newSelection = [...current, hotel];
          }
        }
        
        // Check if we have selected all individual hotels (excluding 'all-hotels')
        const individualHotels = hotelOptions.filter(h => h.id !== 'all-hotels').map(h => h.id);
        const hasAllIndividualHotels = individualHotels.every(h => newSelection.includes(h));
        if (hasAllIndividualHotels) {
          newSelection = ['all-hotels'];
        }
      }
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelection));
      
      // Update URL
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('hotels', newSelection.join(','));
        return newParams;
      });
      
      return newSelection;
    });
  };

  // For backward compatibility, return the first selected hotel as selectedHotel
  const selectedHotel = selectedHotels[0];

  // Get display label for selected hotels
  const getSelectedLabel = () => {
    if (selectedHotels.includes('all-hotels')) {
      return 'All Hotels';
    }
    if (selectedHotels.length === 1) {
      return hotelOptions.find(h => h.id === selectedHotels[0])?.label || '';
    }
    return `${selectedHotels.length} Hotels Selected`;
  };

  return {
    selectedHotel, // For backward compatibility
    selectedHotels,
    toggleHotel,
    getSelectedLabel,
    hotelOptions,
  };
};

// Period configuration
export const getCurrentPeriod = () => {
  // This hook now needs to be used inside a component
  // We'll move this logic to a custom hook
  return null;
};

// Dashboard pages configuration
export const dashboardPages = [
  { id: 'home', name: 'Home Dashboard', description: 'Main dashboard with KPI overview' },
  { id: 'rooms-explorer', name: 'Rooms Explorer', description: 'Detailed room analytics and performance' },
  { id: 'financial-reports', name: 'Financial Reports', description: 'Revenue and expense analysis' },
  { id: 'operation-statement', name: 'Operation Statement', description: 'Monthly Custom P&L Report' },
];

// New hook for getting current period info
export const useCurrentPeriod = (pageId: string = 'home') => {
  const { settings } = useSettings();
  const { campaigns, getCurrentPeriod } = useCampaigns();
  
  const defaultPeriodSetting = settings.defaultCampaigns[pageId];
  
  // Helper function to calculate period based on type
  const calculatePeriod = (setting: DefaultPeriodSetting) => {
    if (setting.type === 'records') {
      const currentYear = new Date().getFullYear();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (setting.id === 'TDR') {
        return {
          name: 'To Date Records',
          startDate: `01 Jan ${currentYear}`,
          endDate: yesterday.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          displayRange: `01 Jan - ${yesterday.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          campaignName: 'TDR',
          priorStayPeriodDisplayRange: `01 Jan - ${yesterday.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${currentYear - 1}`
        };
      } else if (setting.id === 'ATR') {
        return {
          name: 'All Time Records',
          startDate: '01 Jan 1900',
          endDate: '31 Dec 2100',
          displayRange: 'All Time Records',
          campaignName: 'ATR',
          priorStayPeriodDisplayRange: 'All Time Records'
        };
      }
    } else if (setting.type === 'recognition') {
      const currentYear = new Date().getFullYear();
      const priorYear = currentYear - 1;
      
      switch (setting.id) {
        case 'calendar-year':
          return {
            name: `Calendar Year ${currentYear}`,
            startDate: `01 Jan ${currentYear}`,
            endDate: `31 Dec ${currentYear}`,
            displayRange: `01 Jan - 31 Dec ${currentYear}`,
            campaignName: 'Calendar Year',
            priorStayPeriodDisplayRange: `01 Jan - 31 Dec ${priorYear}`
          };
        case 'rolling-12m':
          const today = new Date();
          const twelveMonthsAgo = new Date(today);
          twelveMonthsAgo.setFullYear(today.getFullYear() - 1);
          return {
            name: 'Rolling 12 Months',
            startDate: twelveMonthsAgo.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            endDate: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            displayRange: `${twelveMonthsAgo.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
            campaignName: 'Rolling 12M',
            priorStayPeriodDisplayRange: `${new Date(twelveMonthsAgo.getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${twelveMonthsAgo.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
          };
        case 'current-month':
          const firstDay = new Date(currentYear, today.getMonth(), 1);
          const lastDay = new Date(currentYear, today.getMonth() + 1, 0);
          return {
            name: `Current Month`,
            startDate: firstDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            endDate: lastDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            displayRange: `${firstDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${lastDay.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
            campaignName: 'Current Month',
            priorStayPeriodDisplayRange: `${new Date(firstDay.getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${new Date(lastDay.getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
          };
        case 'current-quarter':
          const quarter = Math.floor(today.getMonth() / 3);
          const quarterStart = new Date(currentYear, quarter * 3, 1);
          const quarterEnd = new Date(currentYear, (quarter + 1) * 3, 0);
          return {
            name: `Q${quarter + 1} ${currentYear}`,
            startDate: quarterStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            endDate: quarterEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            displayRange: `${quarterStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${quarterEnd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
            campaignName: `Q${quarter + 1}`,
            priorStayPeriodDisplayRange: `${new Date(quarterStart.getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${new Date(quarterEnd.getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`
          };
        case 'ytd':
          return {
            name: `YTD ${currentYear}`,
            startDate: `01 Jan ${currentYear}`,
            endDate: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            displayRange: `01 Jan - ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
            campaignName: 'YTD',
            priorStayPeriodDisplayRange: `01 Jan - ${today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${priorYear}`
          };
      }
    }
    
    // Fallback
    return null;
  };
  
  if (!defaultPeriodSetting) {
    // Fallback to current year
    const currentYear = new Date().getFullYear();
    const priorYear = currentYear - 1;
    return {
      name: `YTD ${currentYear}`,
      startDate: `01 Jan ${currentYear}`,
      endDate: `31 Dec ${currentYear}`,
      displayRange: `01 Jan - 31 Dec ${currentYear}`,
      campaignName: 'Calendar Year (Default)',
      priorStayPeriodDisplayRange: `01 Jan - 31 Dec ${priorYear}`
    };
  }
  
  // Calculate period based on setting
  const calculatedPeriod = calculatePeriod(defaultPeriodSetting);
  if (calculatedPeriod) {
    return calculatedPeriod;
  }
  
  // If calculation fails, use fallback
  const currentYear = new Date().getFullYear();
  const priorYear = currentYear - 1;
  return {
    name: `YTD ${currentYear}`,
    startDate: `01 Jan ${currentYear}`,
    endDate: `31 Dec ${currentYear}`,
    displayRange: `01 Jan - 31 Dec ${currentYear}`,
    campaignName: 'Calendar Year (Fallback)',
    priorStayPeriodDisplayRange: `01 Jan - 31 Dec ${priorYear}`
  };
};