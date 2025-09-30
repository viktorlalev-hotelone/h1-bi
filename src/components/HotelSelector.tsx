import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Search, Check } from 'lucide-react';

// Simplified hotel options - hardcoded list
const hotelOptions = [
  { id: 'all-hotels', label: 'All Hotels' },
  { id: 'orel', label: 'Orel' },
  { id: 'condor', label: 'Condor' },
  { id: 'arsena', label: 'Arsena' }
];

// Simplified hook for hotel selection
const useSimpleHotelSelection = () => {
  const [selectedHotels, setSelectedHotels] = useState<string[]>(['all-hotels']);

  const toggleHotel = (hotel: string) => {
    setSelectedHotels(current => {
      let newSelection: string[];
      
      if (hotel === 'all-hotels') {
        // If clicking "All Hotels", select only that
        newSelection = ['all-hotels'];
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
        
        // Check if we have selected all individual hotels
        const individualHotels = hotelOptions.filter(h => h.id !== 'all-hotels').map(h => h.id);
        const hasAllIndividualHotels = individualHotels.every(h => newSelection.includes(h));
        if (hasAllIndividualHotels) {
          newSelection = ['all-hotels'];
        }
      }
      
      return newSelection;
    });
  };

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
    selectedHotels,
    toggleHotel,
    getSelectedLabel,
    hotelOptions,
  };
};

const HotelSelector: React.FC = () => {
  const { selectedHotels, toggleHotel, getSelectedLabel } = useSimpleHotelSelection();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredOptions = hotelOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (hotel: string) => {
    toggleHotel(hotel);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'Enter' && filteredOptions.length > 0) {
      handleSelect(filteredOptions[0].id);
    }
  };

  return (
    <div className={`relative ${''}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-2 sm:px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}
        aria-label="Hotel selector"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Building2 size={isMobile ? 14 : 16} className="mr-1 sm:mr-2 text-gray-500 flex-shrink-0" />
        <span className={`font-medium text-gray-700 mr-1 sm:mr-2 truncate max-w-[120px] sm:max-w-none ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>
          {isMobile ? getSelectedLabel() : `Hotel: ${getSelectedLabel()}`}
        </span>
        <ChevronDown
          size={isMobile ? 14 : 16}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Search Input */}
          <div className="px-3 pb-2 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    selectedHotels.includes(option.id) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                  }`}
                  role="option"
                  aria-selected={selectedHotels.includes(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedHotels.includes(option.id) && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No hotels found
              </div>
            )}
          </div>
          
          {/* Selection Summary */}
          {selectedHotels.length > 1 && !selectedHotels.includes('all-hotels') && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-600">
                {selectedHotels.length} hotels selected
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelSelector;