import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: {
    description: string;
    howToRead: string;
    practicalUse: string;
  };
}

const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <HelpCircle size={20} className="text-blue-600 mr-2" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-full pb-20">
          {/* Description */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">What is this?</h4>
            <p className="text-gray-700 leading-relaxed">
              {content.description || "This section provides detailed information about the selected metric or chart."}
            </p>
          </div>

          {/* How to Read */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">How to read this?</h4>
            <p className="text-gray-700 leading-relaxed">
              {content.howToRead || "Learn how to interpret the data, understand the visual elements, and read the key indicators."}
            </p>
          </div>

          {/* Practical Use */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Practical use</h4>
            <p className="text-gray-700 leading-relaxed">
              {content.practicalUse || "Discover how to apply this information in your daily operations and decision-making process."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpDrawer;