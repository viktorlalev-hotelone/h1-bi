import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Search } from 'lucide-react';

interface FAQDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  abbr: string;
  full: string;
  description: string;
  example?: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

interface FAQCategory {
  title: string;
  sections: FAQSection[];
}

const FAQDrawer: React.FC<FAQDrawerProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>(['periods-in-system']);
  const [openSections, setOpenSections] = useState<string[]>(['records-periods', 'recognition-periods']);
  const [openItems, setOpenItems] = useState<string[]>([]);

  // FAQ content structure
  const faqCategories: FAQCategory[] = [
    {
      title: 'Periods in System',
      sections: [
        {
          title: 'Records Periods',
          items: [
            {
              abbr: 'TDR',
              full: 'To Date Records',
              description: 'All bookings/sales created from -∞ through yesterday (inclusive).',
              example: 'If today is Sept 27, TDR includes everything booked up to Sept 26.'
            },
            {
              abbr: 'ATR',
              full: 'All Time Records',
              description: 'All bookings/sales created during the selected recognition period.',
              example: 'If the recognition period is Jan 1–Dec 31, 2025, ATR includes all bookings created between Jan 1 and Dec 31, 2025.'
            }
          ]
        },
        {
          title: 'Recognition Periods',
          items: [
            {
              abbr: 'CUR PTD',
              full: 'Current Period to Date',
              description: 'Recognized results from period start through yesterday (inclusive).'
            },
            {
              abbr: 'PRI PTD',
              full: 'Prior Period to Date',
              description: 'Same PTD window for the equivalent prior period (e.g., same dates last year).'
            },
            {
              abbr: 'BUD PTD',
              full: 'Budget Period to Date',
              description: 'Budgeted values for the elapsed part of the period (through yesterday).'
            },
            {
              abbr: 'FCT PTD',
              full: 'Forecast Period to Date',
              description: 'Forecasted values for the elapsed part of the period (through yesterday).'
            },
            {
              abbr: 'CUR OTB',
              full: 'Current On the Books',
              description: 'Future already on the books but not yet recognized (e.g., upcoming stays/orders).'
            },
            {
              abbr: 'PRI OTB',
              full: 'Prior On the Books',
              description: 'Same snapshot for the equivalent prior period/date.'
            },
            {
              abbr: 'BUD OTB',
              full: 'Budget On the Books',
              description: 'Budget plan for the unrecognized future part of the period.'
            },
            {
              abbr: 'FCT OTB',
              full: 'Forecast On the Books',
              description: 'Forecast for the unrecognized future part of the period.'
            },
            {
              abbr: 'CUR TOT',
              full: 'Current Total',
              description: 'PTD + OTB for the current period (realized so far + on-the-books for the rest).'
            },
            {
              abbr: 'PRI TOT',
              full: 'Prior Total',
              description: 'The equivalent total for the prior period.'
            },
            {
              abbr: 'BUD TOT',
              full: 'Budget Total',
              description: 'Budget for the entire period.'
            },
            {
              abbr: 'FCT TOT',
              full: 'Forecast Total',
              description: 'Forecast for the entire period.'
            }
          ]
        }
      ]
    }
  ];

  // Filter items based on search term
  const filterItems = (items: FAQItem[]) => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.full.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.example && item.example.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Highlight search terms in text
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  // Toggle functions
  const toggleCategory = (categoryTitle: string) => {
    const categoryId = categoryTitle.toLowerCase().replace(/\s+/g, '-');
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSection = (sectionTitle: string) => {
    const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleItem = (abbr: string) => {
    setOpenItems(prev => 
      prev.includes(abbr) 
        ? prev.filter(id => id !== abbr)
        : [...prev, abbr]
    );
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      const focusableElements = document.querySelectorAll(
        '[data-faq-drawer] button, [data-faq-drawer] input, [data-faq-drawer] [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        data-faq-drawer
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <HelpCircle size={20} className="text-blue-600 mr-2" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">FAQ & Abbreviations</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search abbreviations or terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto h-full pb-20">
          {/* Intro */}
          <div className="text-sm text-gray-700 leading-relaxed mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="mb-3">
              The terminology applies consistently to <strong>Revenue</strong> (sales/bookings), <strong>Expenses</strong> (documents), and <strong>Documents</strong> (folios).
            </p>
            <p className="mb-3">We distinguish between:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Records Periods</strong> (TDR / ATR) – based on when a sale or document was recorded.</li>
              <li><strong>Recognition Periods</strong> (PTD / OTB / TOT) – based on when revenue/expense is recognized (service/stay or accrual date).</li>
            </ul>
            <p className="mt-3 text-xs text-blue-700">
              <strong>Note:</strong> "Up until yesterday" is inclusive (e.g., if today is Sept 27, Sept 26 is included).
            </p>
          </div>

          {/* FAQ Categories */}
          {faqCategories.map((category) => {
            const categoryId = category.title.toLowerCase().replace(/\s+/g, '-');
            const isCategoryOpen = openCategories.includes(categoryId);
            
            return (
              <div key={categoryId} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-base font-semibold text-gray-900">{category.title}</h4>
                  <span className="text-gray-400">
                    {isCategoryOpen ? '−' : '+'}
                  </span>
                </button>
                
                {isCategoryOpen && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {category.sections.map((section) => {
                      const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
                      const isSectionOpen = openSections.includes(sectionId);
                      const filteredItems = filterItems(section.items);
                      
                      // Hide section if no items match search
                      if (searchTerm && filteredItems.length === 0) return null;
                      
                      return (
                        <div key={sectionId} className="border border-gray-100 rounded-lg">
                          <button
                            onClick={() => toggleSection(section.title)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                          >
                            <h5 className="text-sm font-medium text-gray-800">{section.title}</h5>
                            <span className="text-gray-400 text-sm">
                              {isSectionOpen ? '−' : '+'}
                            </span>
                          </button>
                          
                          {isSectionOpen && (
                            <div className="border-t border-gray-100 p-3 space-y-2">
                              {/* Revenue/Expenses subsection headers */}
                              {section.title === 'Records Periods' && (
                                <div className="space-y-3">
                                  <div>
                                    <h6 className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Revenue (Sales-based)</h6>
                                    <div className="space-y-2">
                                      {filteredItems.slice(0, 2).map((item) => {
                                        const isItemOpen = openItems.includes(item.abbr);
                                        
                                        return (
                                          <div key={item.abbr} className="border border-gray-100 rounded">
                                            <button
                                              onClick={() => toggleItem(item.abbr)}
                                              className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <div className="flex items-center">
                                                <span className="font-bold text-gray-900 mr-2">{highlightText(item.abbr)}</span>
                                                <span className="text-sm text-gray-600">— {highlightText(item.full)}</span>
                                              </div>
                                              <span className="text-gray-400 text-xs">
                                                {isItemOpen ? '−' : '+'}
                                              </span>
                                            </button>
                                            
                                            {isItemOpen && (
                                              <div className="border-t border-gray-100 p-3 bg-gray-50">
                                                <p className="text-sm text-gray-700 mb-2">
                                                  <strong>Practical meaning:</strong> {highlightText(item.description)}
                                                </p>
                                                {item.example && (
                                                  <p className="text-sm text-blue-700">
                                                    <strong>👉 Example:</strong> {highlightText(item.example)}
                                                  </p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h6 className="text-xs font-semibold text-purple-700 mb-2 uppercase tracking-wide">Expenses (Document-based)</h6>
                                    <div className="space-y-2">
                                      <div className="border border-gray-100 rounded">
                                        <button
                                          onClick={() => toggleItem('TDR-expenses')}
                                          className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-center">
                                            <span className="font-bold text-gray-900 mr-2">{highlightText('TDR')}</span>
                                            <span className="text-sm text-gray-600">— {highlightText('To Date Records')}</span>
                                          </div>
                                          <span className="text-gray-400 text-xs">
                                            {openItems.includes('TDR-expenses') ? '−' : '+'}
                                          </span>
                                        </button>
                                        
                                        {openItems.includes('TDR-expenses') && (
                                          <div className="border-t border-gray-100 p-3 bg-gray-50">
                                            <p className="text-sm text-gray-700">
                                              <strong>Practical meaning:</strong> {highlightText('All expense documents (invoices, store issues, receipts) entered from -∞ through yesterday (inclusive).')}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="border border-gray-100 rounded">
                                        <button
                                          onClick={() => toggleItem('ATR-expenses')}
                                          className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-center">
                                            <span className="font-bold text-gray-900 mr-2">{highlightText('ATR')}</span>
                                            <span className="text-sm text-gray-600">— {highlightText('All Time Records')}</span>
                                          </div>
                                          <span className="text-gray-400 text-xs">
                                            {openItems.includes('ATR-expenses') ? '−' : '+'}
                                          </span>
                                        </button>
                                        
                                        {openItems.includes('ATR-expenses') && (
                                          <div className="border-t border-gray-100 p-3 bg-gray-50">
                                            <p className="text-sm text-gray-700">
                                              <strong>Practical meaning:</strong> {highlightText('All expense documents entered from the start of the period up to the Lock (accounting close). After Lock, no new docs are expected for that period.')}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {section.title === 'Recognition Periods' && (
                                <div className="space-y-2">
                                  <h6 className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Values based on service/stay or accrual date</h6>
                                  {filteredItems.map((item) => {
                                    const isItemOpen = openItems.includes(item.abbr);
                                    
                                    return (
                                      <div key={item.abbr} className="border border-gray-100 rounded">
                                        <button
                                          onClick={() => toggleItem(item.abbr)}
                                          className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-center">
                                            <span className="font-bold text-gray-900 mr-2">{highlightText(item.abbr)}</span>
                                            <span className="text-sm text-gray-600">— {highlightText(item.full)}</span>
                                          </div>
                                          <span className="text-gray-400 text-xs">
                                            {isItemOpen ? '−' : '+'}
                                          </span>
                                        </button>
                                        
                                        {isItemOpen && (
                                          <div className="border-t border-gray-100 p-3 bg-gray-50">
                                            <p className="text-sm text-gray-700">
                                              {highlightText(item.description)}
                                            </p>
                                            {item.example && (
                                              <p className="text-sm text-blue-700 mt-2">
                                                <strong>👉 Example:</strong> {highlightText(item.example)}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* No results message */}
          {searchTerm && faqCategories.every(category => 
            category.sections.every(section => filterItems(section.items).length === 0)
          ) && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching for different terms or clear the search to see all content.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FAQDrawer;