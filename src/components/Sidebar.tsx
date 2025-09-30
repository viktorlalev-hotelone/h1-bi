import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home, BarChart3, Building2, FileText, Calculator, TrendingUp, Settings, Bed, Calendar, CreditCard, AlertTriangle, XCircle, Briefcase, Tag, Globe, Share2, Flag, Users, Utensils, Clock, Hourglass, CalendarDays } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  isOpen?: boolean;
  topOffset?: number;
  heightCalc?: string;
}

// Hardcoded menu items for skeleton version
const menuItems = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/'
  },
  {
    id: 'explorer-insights',
    label: 'Explorer Insights',
    icon: 'BarChart3',
    path: '#',
    children: [
      {
        id: 'rooms',
        label: 'Rooms',
        icon: 'Building2',
        path: '/explorer/rooms'
      },
      {
        id: 'hotels',
        label: 'Hotels Performance',
        icon: 'TrendingUp',
        path: '/explorer/hotels'
      },
      {
        id: 'blocks',
        label: 'Blocks',
        icon: 'Calendar',
        path: '/analytics/blocks'
      },
      {
        id: 'fb-revenue',
        label: 'F&B Revenue',
        icon: 'CreditCard',
        path: '/analytics/fb-revenue'
      },
      {
        id: 'other-revenue',
        label: 'Other Revenue',
        icon: 'TrendingUp',
        path: '/analytics/other-revenue'
      },
      {
        id: 'account-receivables',
        label: 'Account Receivables',
        icon: 'FileText',
        path: '/analytics/account-receivables'
      },
      {
        id: 'cancelations',
        label: 'Cancelations',
        icon: 'XCircle',
        path: '/analytics/cancelations'
      },
      {
        id: 'companies',
        label: 'Companies',
        icon: 'Briefcase',
        path: '/analytics/companies'
      },
      {
        id: 'marketing-segments',
        label: 'Marketing Segments',
        icon: 'Tag',
        path: '/analytics/marketing-segments'
      },
      {
        id: 'marketing-sources',
        label: 'Marketing Sources',
        icon: 'Globe',
        path: '/analytics/marketing-sources'
      },
      {
        id: 'marketing-channels',
        label: 'Marketing Channels',
        icon: 'Share2',
        path: '/analytics/marketing-channels'
      },
      {
        id: 'guest-nationalities',
        label: 'Guest Nationalities',
        icon: 'Flag',
        path: '/analytics/guest-nationalities'
      },
      {
        id: 'room-types',
        label: 'Room Types',
        icon: 'Bed',
        path: '/analytics/room-types'
      },
      {
        id: 'guest-mix',
        label: 'Guest Mix',
        icon: 'Users',
        path: '/analytics/guest-mix'
      },
      {
        id: 'meal-plans',
        label: 'Meal Plans',
        icon: 'Utensils',
        path: '/analytics/meal-plans'
      },
      {
        id: 'booking-windows',
        label: 'Booking Windows',
        icon: 'Clock',
        path: '/analytics/booking-windows'
      },
      {
        id: 'length-of-stay',
        label: 'Length of Stay',
        icon: 'Hourglass',
        path: '/analytics/length-of-stay'
      },
      {
        id: 'days-of-week',
        label: 'Days of Week',
        icon: 'CalendarDays',
        path: '/analytics/days-of-week'
      },
      {
        id: 'rooms-out-of-sales',
        label: 'Rooms out of Sales',
        icon: 'AlertTriangle',
        path: '/analytics/rooms-out-of-sales'
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText',
    path: '#',
    children: [
      {
        id: 'operation-statement',
        label: 'Operation Statement',
        icon: 'Calculator',
        path: '/reports/operation-statement'
      },
      {
        id: 'bob-vs-budget-forecast',
        label: 'BOB Vs Budget/Forecast',
        icon: 'TrendingUp',
        path: '/reports/bob-vs-budget-forecast'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings'
  }
];

const iconMap = {
  Home,
  BarChart3,
  Building2,
  FileText,
  Calculator,
  TrendingUp,
  Settings,
  Bed,
  Calendar,
  CreditCard,
  AlertTriangle,
  XCircle,
  Briefcase,
  Tag,
  Globe,
  Share2,
  Flag,
  Users,
  Utensils,
  Clock,
  Hourglass,
  CalendarDays,
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, isOpen = false, topOffset = 64, heightCalc = 'calc(100vh - 64px)' }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: any) => 
    item.children?.some((child: any) => isActive(child.path));

  const renderMenuItem = (item: any, level = 0) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap];
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path) || isParentActive(item);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors ${
            active
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100'
          } ${level > 0 ? 'ml-4' : ''}`}
          onClick={() => hasChildren ? toggleExpanded(item.id) : null}
        >
          <Link to={hasChildren ? '#' : item.path} className="flex items-center flex-1">
            <Icon size={18} className="mr-3" />
            {!collapsed && (
              <>
                <span className={level > 0 ? 'text-sm' : 'font-medium'}>{item.label}</span>
                {hasChildren && (
                  <div className="ml-auto">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                )}
              </>
            )}
          </Link>
        </div>
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      data-sidebar
      className={`fixed left-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isMobile 
          ? `w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
          : collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ 
        top: `${topOffset}px`,
        height: heightCalc
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-2 sm:p-4 space-y-1 overflow-y-auto flex-grow">
          {menuItems.map(item => renderMenuItem(item, 0))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;