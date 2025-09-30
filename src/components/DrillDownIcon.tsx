import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, TrendingUp, Building2, BarChart3, FileText, Drill } from 'lucide-react';

interface DrillDownOption {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface DrillDownIconProps {
  context: 'revenue' | 'kpi' | 'chart' | 'financial';
  className?: string;
}

const DrillDownIcon: React.FC<DrillDownIconProps> = ({ context, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define drill-down options based on context
  const getOptions = (): DrillDownOption[] => {
    switch (context) {
      case 'revenue':
        return [
          {
            id: 'rooms-explorer',
            label: 'Rooms Explorer',
            description: 'Detailed room analytics and performance metrics',
            path: '/explorer/rooms',
            icon: Building2,
            color: 'text-blue-600'
          },
        ];
      case 'kpi':
        return [
          {
            id: 'rooms-explorer',
            label: 'Rooms Explorer',
            description: 'Detailed room analytics dashboard',
            path: '/explorer/rooms',
            icon: Building2,
            color: 'text-blue-600'
          }
        ];
      case 'chart':
        return [
          {
            id: 'rooms-explorer',
            label: 'Rooms Analytics',
            description: 'Advanced room performance analysis',
            path: '/explorer/rooms',
            icon: Building2,
            color: 'text-blue-600'
          }
        ];
      case 'financial':
        return [
          {
            id: 'operation-statement',
            label: 'Operation Statement',
            description: 'Detailed financial reports and analysis',
            path: '/reports/operation-statement',
            icon: FileText,
            color: 'text-green-600'
          }
        ];
      default:
        return [];
    }
  };

  const options = getOptions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    // Simplified navigation - just log the attempt for now
    console.log(`Drill down navigation to: ${path}`);
    // In a real app, you could navigate to the path or show a placeholder
    // window.location.href = path;
    setIsOpen(false);
  };

  if (options.length === 0) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          isHovered || isOpen
            ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-md scale-110'
            : 'bg-transparent hover:bg-gray-100'
        }`}
        title="Drill down for more details"
      >
        <div className="relative">
          {/* Drill icon - animated */}
          <Drill 
            size={18} 
            className={`transition-all duration-200 ${
              isHovered || isOpen 
                ? 'text-orange-600 rotate-12' 
                : 'text-gray-500'
            }`}
          />
          
          {/* Sparkle effect when hovered */}
          {(isHovered || isOpen) && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <Drill size={14} className="mr-2 text-orange-600" />
              Drill Down Options
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Explore deeper insights with current selection
            </p>
          </div>
          
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleNavigation(option.path)}
                className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-150 group"
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform ${option.color}`}>
                    <option.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {option.description}
                    </div>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className="text-gray-400 group-hover:text-blue-600 transform rotate-[-90deg] group-hover:translate-x-1 transition-all" 
                  />
                </div>
              </button>
            ))}
          </div>
          
          {/* Current selection info */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-600">
              <span>Click any option above to drill down for more details</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillDownIcon;