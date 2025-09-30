import React, { useState, useCallback } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FloatingFilterButton from './FloatingFilterButton';
import FilterPopup from './FilterPopup';
import FAQDrawer from './FAQDrawer';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showFAQDrawer, setShowFAQDrawer] = useState(false);
  const location = useLocation();
  const [currencyBadgeRect, setCurrencyBadgeRect] = useState<DOMRect | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<string>('');
  const [activeFiltersSummary, setActiveFiltersSummary] = useState<string[]>([]);
  
  // Check if mobile and auto-collapse sidebar
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setSidebarOpen(false); // Close sidebar when switching to mobile
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        const burger = document.querySelector('[data-burger]');
        if (sidebar && !sidebar.contains(event.target as Node) && 
            burger && !burger.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const handleCurrencyBadgeRectChange = useCallback((rect: DOMRect | null) => {
    setCurrencyBadgeRect(rect);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  
  // Calculate sidebar width for FilterStrip positioning
  const getSidebarWidth = () => {
    if (isMobile) return 0; // On mobile, sidebar is overlay, so FilterStrip should start from left edge
    return sidebarCollapsed ? 64 : 256; // 64px when collapsed (w-16), 256px when expanded (w-64)
  };

  // Calculate total height of fixed elements
  const topBarHeight = 64; // h-16 = 64px
  const totalFixedHeight = topBarHeight;

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar 
        onToggleSidebar={handleToggleSidebar} 
        onCurrencyBadgeRectChange={handleCurrencyBadgeRectChange}
        onOpenFAQ={() => setShowFAQDrawer(true)}
      />
      
      <div className="flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          isOpen={sidebarOpen}
          topOffset={totalFixedHeight}
          heightCalc={`calc(100vh - ${totalFixedHeight}px)`}
        />
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className={`flex-1 transition-all duration-300 ${
          isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`} style={{ marginTop: `64px` }}>
          <div className="p-3 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Floating Filter Button */}
      <FloatingFilterButton 
        onOpenFilterPopup={() => setShowFilterPopup(true)} 
        isMobile={isMobile}
        currencyBadgeRect={currencyBadgeRect}
        salesPeriod={salesPeriod}
        activeFiltersSummary={activeFiltersSummary}
      />
      
      {/* Filter Popup */}
      <FilterPopup 
        isOpen={showFilterPopup} 
        onClose={() => setShowFilterPopup(false)} 
        onSalesPeriodChange={setSalesPeriod}
        onActiveFiltersSummaryChange={setActiveFiltersSummary}
      />
      
      {/* FAQ Drawer */}
      <FAQDrawer 
        isOpen={showFAQDrawer} 
        onClose={() => setShowFAQDrawer(false)} 
      />
    </div>
  );
};

export default Layout;