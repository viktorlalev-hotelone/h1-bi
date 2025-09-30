import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Building2, Filter } from 'lucide-react';
import { useCurrentPeriod, useHotelSelection } from '../hooks/useHotelSelection';
import { useLocation } from 'react-router-dom';

interface FloatingFilterButtonProps {
  onOpenFilterPopup: () => void;
  isMobile: boolean;
  currencyBadgeRect?: DOMRect | null;
  salesPeriod?: string;
  activeFiltersSummary?: string[];
}

const FloatingFilterButton: React.FC<FloatingFilterButtonProps> = ({ 
  onOpenFilterPopup, 
  isMobile, 
  currencyBadgeRect,
  salesPeriod = '',
  activeFiltersSummary = []
}) => {
  // Initialize position based on device type
  const getInitialPosition = () => {
    if (isMobile) {
      // Mobile: bottom right corner
      return { x: window.innerWidth - 48, y: window.innerHeight - 68 };
    } else {
      // Desktop: position relative to currency badge if available
      if (currencyBadgeRect) {
        const buttonSize = 32;
        const spacing = 8; // Space between button and badge
        return { 
          x: currencyBadgeRect.left - buttonSize - spacing, 
          y: currencyBadgeRect.top + (currencyBadgeRect.height - buttonSize) / 2 
        };
      } else {
        // Fallback: top right, approximate position
        return { x: window.innerWidth - 172, y: 24 };
      }
    }
  };
  
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  
  // Get current period and hotel selection
  const getPageId = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/explorer/rooms') return 'rooms-explorer';
    if (location.pathname === '/reports/operation-statement') return 'operation-statement';
    return 'home';
  };
  
  const currentPeriod = useCurrentPeriod(getPageId());
  const { getSelectedLabel } = useHotelSelection();

  // Update position when mobile state changes
  useEffect(() => {
    setPosition(getInitialPosition());
  }, [isMobile, currencyBadgeRect]);

  // Handle mouse down to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle dragging and mouse up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep button within viewport bounds
      const buttonSize = 32; // w-8 h-8 = 32px
      const maxX = window.innerWidth - buttonSize;
      const maxY = window.innerHeight - buttonSize;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle click to open filter popup
  const handleClick = (e: React.MouseEvent) => {
    // Only open popup if we're not dragging
    if (!isDragging) {
      onOpenFilterPopup();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={`fixed z-50 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Filters"
      >
        <Filter size={14} />
      </button>

      {/* Tooltip */}
      {isHovered && !isDragging && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg pointer-events-none max-w-xs whitespace-nowrap"
          style={{
            left: `${Math.max(10, Math.min(position.x - 100, window.innerWidth - 250))}px`,
            top: `${position.y < 80 ? position.y + 42 : position.y - 72}px`,
          }}
        >
          <div className="font-medium mb-2">Current Selection</div>
          
          {/* Check if we're on Dashboard page */}
          {location.pathname === '/' ? (
            <>
              {/* Accounts */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Building2 size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-blue-300">Accounts:</span>
                </div>
                <div className="text-xs text-gray-200 ml-3">{getSelectedLabel()}</div>
              </div>
              
              {/* Recognition Period */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Calendar size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-green-300">Recognition Period (Stay / Service):</span>
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  Current: {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${new Date().getFullYear()}`}
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  Prior: {currentPeriod?.recognition?.priorDisplayRange || `01 Jan – 31 Dec ${new Date().getFullYear() - 1}`}
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  Budget: {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${new Date().getFullYear()}`}
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  Forecast: {currentPeriod?.recognition?.displayRange || `01 Jan – 31 Dec ${new Date().getFullYear()}`}
                </div>
              </div>
              
              {/* Records Period */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Calendar size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-purple-300">Records Period (Sales / Purchasing):</span>
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  {currentPeriod?.records?.name || 'TDR'}: {currentPeriod?.records?.description || `up to yesterday (${new Date(Date.now() - 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })})`}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Accounts/Hotels */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Building2 size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-blue-300">Accounts:</span>
                </div>
                <div className="text-xs text-gray-200 ml-3">{getSelectedLabel()}</div>
              </div>
              
              {/* Stay Period */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Calendar size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-green-300">Stay Period:</span>
                </div>
                <div className="text-xs text-gray-200 ml-3">
                  {currentPeriod?.campaignName}: {currentPeriod?.name}
                </div>
                <div className="text-xs text-gray-300 ml-3">{currentPeriod?.displayRange}</div>
              </div>
              
              {/* Prior Stay Period */}
              <div className="mb-2">
                <div className="flex items-center text-xs mb-1">
                  <Calendar size={10} className="mr-1 flex-shrink-0" />
                  <span className="font-medium text-orange-300">Prior Stay Period:</span>
                </div>
                <div className="text-xs text-gray-300 ml-3">{currentPeriod?.priorStayPeriodDisplayRange}</div>
              </div>
              
              {/* Sales Period */}
              {salesPeriod && (
                <div className="mb-2">
                  <div className="flex items-center text-xs mb-1">
                    <Calendar size={10} className="mr-1 flex-shrink-0" />
                    <span className="font-medium text-purple-300">Sales Period:</span>
                  </div>
                  <div className="text-xs text-gray-300 ml-3">{salesPeriod}</div>
                </div>
              )}
            </>
          )}
          
          {/* Active Filters - only for non-Dashboard pages */}
          {!location.pathname.startsWith('/') && activeFiltersSummary.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center text-xs mb-1">
                <Filter size={10} className="mr-1 flex-shrink-0" />
                <span className="font-medium text-yellow-300">Active Filters:</span>
              </div>
              <div className="text-xs text-gray-300 ml-3">
                {activeFiltersSummary.map((filter, index) => (
                  <div key={index}>{filter}</div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
            Click to open filters • Drag to move
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingFilterButton;