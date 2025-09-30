import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Settings, Info, LogOut, ChevronDown, HelpCircle } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onCurrencyBadgeRectChange?: (rect: DOMRect | null) => void;
  onOpenFAQ: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, onCurrencyBadgeRectChange, onOpenFAQ }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hubMenuOpen, setHubMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const currencyBadgeRef = useRef<HTMLDivElement>(null);
  
  // Static settings for skeleton version
  const settings = {
    currency: 'BGN',
    vatEnabled: false,
    commissionsEnabled: true
  };

  // Track currency badge position
  useEffect(() => {
    const updateCurrencyBadgeRect = () => {
      if (currencyBadgeRef.current && onCurrencyBadgeRectChange) {
        const rect = currencyBadgeRef.current.getBoundingClientRect();
        onCurrencyBadgeRectChange(rect);
      }
    };

    updateCurrencyBadgeRect();

    const resizeObserver = new ResizeObserver(updateCurrencyBadgeRect);
    if (currencyBadgeRef.current) {
      resizeObserver.observe(currencyBadgeRef.current);
    }

    window.addEventListener('resize', updateCurrencyBadgeRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCurrencyBadgeRect);
    };
  }, [onCurrencyBadgeRectChange]);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-2 sm:px-4 z-50">
      <div className="flex items-center">
        <button
          data-burger
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 mr-2 sm:mr-4"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">HotelOne BI</h1>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Currency and Settings Indicators - Hidden on mobile, shown in dropdown */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Currency Indicator */}
          <div ref={currencyBadgeRef} className="flex items-center px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-700">{settings.currency}</span>
          </div>
          
          {/* VAT Indicator */}
          <div className={`flex items-center px-2 py-1 rounded-lg border ${
            settings.vatEnabled 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            <span className="text-xs font-medium">
              {settings.vatEnabled ? '✓' : '✗'} VAT
            </span>
          </div>
          
          {/* Commissions Indicator */}
          <div className={`flex items-center px-2 py-1 rounded-lg border ${
            settings.commissionsEnabled 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            <span className="text-xs font-medium">
              {settings.commissionsEnabled ? '✓' : '✗'} -%
            </span>
          </div>
          
          {/* Settings Button */}
          <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200">
            <Settings size={16} />
          </Link>
          
          {/* FAQ Button */}
          <button 
            onClick={onOpenFAQ}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200"
            title="FAQ & Abbreviations"
          >
            <HelpCircle size={16} />
          </button>
        </div>
        
        {/* Mobile Settings Menu */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 border border-gray-200"
          >
            <Settings size={16} />
          </button>
          
          {settingsMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 text-sm text-gray-700">
                <div className="font-medium mb-2">Settings</div>
                <div className="text-xs text-gray-500">Currency: {settings.currency} | VAT: {settings.vatEnabled ? 'On' : 'Off'} | Commissions: {settings.commissionsEnabled ? 'On' : 'Off'}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Hub Selector */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setHubMenuOpen(!hubMenuOpen)}
            className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <span className="mr-1 hidden sm:inline">Hub:</span>
            <span className="text-gray-900 truncate max-w-32 sm:max-w-none">St. St. Constantine and Helena Holding JSC</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
          
          {hubMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                <div className="font-medium">St. St. Constantine and Helena Holding JSC</div>
                <div className="text-xs text-gray-500">Current Hub</div>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                <div className="font-medium">Sunny Beach Resort Group</div>
                <div className="text-xs text-gray-500">Alternative Hub</div>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                <div className="font-medium">Golden Sands Hotels Ltd</div>
                <div className="text-xs text-gray-500">Alternative Hub</div>
              </button>
            </div>
          )}
        </div>
        
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <Link to="/settings" className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center">
                <Settings size={16} className="mr-3" />
                Settings
              </Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center">
                <Info size={16} className="mr-3" />
                App Info
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-red-600">
                <LogOut size={16} className="mr-3" />
                Logout
              </button>
            </div>
          )}
          </div>
      </div>
    </div>
  );
};

export default TopBar;