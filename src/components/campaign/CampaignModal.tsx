import React from 'react';
import { X, Save, Plus, Trash2, Building2 } from 'lucide-react';
import { CampaignType, StaySubPeriod, SalesSubPeriod } from '../../types/campaign';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCampaign: CampaignType | null;
  formData: {
    name: string;
    patternStartDay: number;
    patternStartMonth: number;
    patternEndDay: number;
    patternEndMonth: number;
    spanningYears: boolean;
    assignedHotels: string[];
  };
  onFormDataChange: (updates: Partial<typeof formData>) => void;
  staySubPeriods: StaySubPeriod[];
  salesSubPeriods: SalesSubPeriod[];
  onStaySubPeriodsChange: (periods: StaySubPeriod[]) => void;
  onSalesSubPeriodsChange: (periods: SalesSubPeriod[]) => void;
  onSave: () => void;
  availableHotels: { id: string; name: string }[];
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const demandLevels = ['Distressed', 'Low', 'Low-Mid', 'Mid', 'Mid-High', 'High', 'Rush'] as const;

// Reusable date input component
const DateInput: React.FC<{
  label: string;
  day: number;
  month: number;
  year?: 'first' | 'second';
  showYear?: boolean;
  onDayChange: (day: number) => void;
  onMonthChange: (month: number) => void;
  onYearChange?: (year: 'first' | 'second') => void;
  className?: string;
}> = ({ label, day, month, year, showYear, onDayChange, onMonthChange, onYearChange, className = '' }) => (
  <div className={`bg-white rounded-lg border border-green-200 p-3 ${className}`}>
    <h4 className="text-sm font-semibold text-green-800 mb-2">{label}</h4>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
        <input
          type="number"
          min="1"
          max="31"
          value={day}
          onChange={(e) => onDayChange(parseInt(e.target.value))}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
        <select
          value={month}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          {monthNames.map((month, idx) => (
            <option key={month} value={idx + 1}>{month}</option>
          ))}
        </select>
      </div>
      {showYear && onYearChange && (
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
          <select
            value={year || 'first'}
            onChange={(e) => onYearChange(e.target.value as 'first' | 'second')}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="first">First Year</option>
            <option value="second">Second Year</option>
          </select>
        </div>
      )}
    </div>
  </div>
);

const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  editingCampaign,
  formData,
  onFormDataChange,
  staySubPeriods,
  salesSubPeriods,
  onStaySubPeriodsChange,
  onSalesSubPeriodsChange,
  onSave,
  availableHotels
}) => {
  if (!isOpen) return null;

  const addStaySubPeriod = () => {
    const lastPeriod = staySubPeriods[staySubPeriods.length - 1];
    const newPeriod: StaySubPeriod = {
      id: `stay-${Date.now()}`,
      name: `Sub-period ${staySubPeriods.length + 1}`,
      startDay: lastPeriod ? lastPeriod.endDay + 1 : formData.patternStartDay,
      startMonth: lastPeriod ? lastPeriod.endMonth : formData.patternStartMonth,
      endDay: formData.patternEndDay,
      endMonth: formData.patternEndMonth,
      demandLevel: 'Mid'
    };
    onStaySubPeriodsChange([...staySubPeriods, newPeriod]);
  };

  const updateStaySubPeriod = (index: number, updates: Partial<StaySubPeriod>) => {
    const updated = [...staySubPeriods];
    updated[index] = { ...updated[index], ...updates };
    onStaySubPeriodsChange(updated);
  };

  const addSalesSubPeriod = () => {
    const lastPeriod = salesSubPeriods[salesSubPeriods.length - 1];
    const newPeriod: SalesSubPeriod = {
      id: `sales-${Date.now()}`,
      name: `Sales Period ${salesSubPeriods.length + 1}`,
      startDay: salesSubPeriods.length === 0 ? null : (lastPeriod?.endDay || formData.patternStartDay),
      startMonth: salesSubPeriods.length === 0 ? formData.patternStartMonth : (lastPeriod?.endMonth || formData.patternStartMonth),
      startYear: formData.spanningYears ? 'first' : undefined,
      endDay: formData.patternEndDay,
      endMonth: formData.patternEndMonth,
      endYear: formData.spanningYears ? (formData.patternEndMonth < formData.patternStartMonth ? 'second' : 'first') : undefined
    };
    onSalesSubPeriodsChange([...salesSubPeriods, newPeriod]);
  };

  const updateSalesSubPeriod = (index: number, updates: Partial<SalesSubPeriod>) => {
    const updated = [...salesSubPeriods];
    updated[index] = { ...updated[index], ...updates };
    onSalesSubPeriodsChange(updated);
  };

  const toggleHotel = (hotelId: string) => {
    onFormDataChange({
      assignedHotels: formData.assignedHotels.includes(hotelId)
        ? formData.assignedHotels.filter(id => id !== hotelId)
        : [...formData.assignedHotels, hotelId]
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCampaign ? 'Edit Campaign Type' : 'Create Campaign Type'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Campaign Name (e.g., Summer Season, Winter Period)"
              />
            </div>

            {/* Pattern Dates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stay/Service Main Period</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.patternStartDay}
                    onChange={(e) => onFormDataChange({ patternStartDay: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                  <select
                    value={formData.patternStartMonth}
                    onChange={(e) => onFormDataChange({ patternStartMonth: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthNames.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.patternEndDay}
                    onChange={(e) => onFormDataChange({ patternEndDay: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                  <select
                    value={formData.patternEndMonth}
                    onChange={(e) => onFormDataChange({ patternEndMonth: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthNames.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.spanningYears}
                  onChange={(e) => onFormDataChange({ spanningYears: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">End date is in next calendar year</span>
              </label>
            </div>

            {/* Hotel Assignment */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign to Hotels</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableHotels.map(hotel => (
                  <label key={hotel.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedHotels.includes(hotel.id)}
                      onChange={() => toggleHotel(hotel.id)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <Building2 size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{hotel.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Stay/Service Sub-periods */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Stay/Service Sub-periods</h3>
                <button
                  onClick={addStaySubPeriod}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Sub-period
                </button>
              </div>
              
              <div className="space-y-3">
                {staySubPeriods.map((period, index) => (
                  <div key={period.id} className="p-4 bg-gray-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Period Name</label>
                        <input
                          type="text"
                          value={period.name}
                          onChange={(e) => updateStaySubPeriod(index, { name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="e.g., High Season"
                        />
                      </div>
                      <div className="flex-1 mr-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Demand Level</label>
                        <select
                          value={period.demandLevel}
                          onChange={(e) => updateStaySubPeriod(index, { demandLevel: e.target.value as any })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {demandLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => onStaySubPeriodsChange(staySubPeriods.filter((_, i) => i !== index))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                        title="Delete Stay Period"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <DateInput
                        label="Start Date"
                        day={period.startDay}
                        month={period.startMonth}
                        onDayChange={(day) => updateStaySubPeriod(index, { startDay: day })}
                        onMonthChange={(month) => updateStaySubPeriod(index, { startMonth: month })}
                      />
                      <DateInput
                        label="End Date"
                        day={period.endDay}
                        month={period.endMonth}
                        onDayChange={(day) => updateStaySubPeriod(index, { endDay: day })}
                        onMonthChange={(month) => updateStaySubPeriod(index, { endMonth: month })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Sub-periods */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sales Sub-periods</h3>
                <button
                  onClick={addSalesSubPeriod}
                  className="flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Sales Period
                </button>
              </div>
              
              <div className="space-y-3">
                {salesSubPeriods.map((period, index) => (
                  <div key={period.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Period Name</label>
                        <input
                          type="text"
                          value={period.name}
                          onChange={(e) => updateSalesSubPeriod(index, { name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Early Bird Sales"
                        />
                      </div>
                      <button
                        onClick={() => onSalesSubPeriodsChange(salesSubPeriods.filter((_, i) => i !== index))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                        title="Delete Sales Period"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-purple-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-purple-800">Start Date</h4>
                          <label className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={period.startDay === null}
                              onChange={(e) => updateSalesSubPeriod(index, { 
                                startDay: e.target.checked ? null : 1,
                                startMonth: e.target.checked ? formData.patternStartMonth : period.startMonth
                              })}
                              className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-1"
                            />
                            <span className="text-purple-700 font-medium">From -∞</span>
                          </label>
                        </div>
                        {period.startDay !== null && (
                          <DateInput
                            label=""
                            day={period.startDay}
                            month={period.startMonth}
                            year={period.startYear}
                            showYear={formData.spanningYears}
                            onDayChange={(day) => updateSalesSubPeriod(index, { startDay: day })}
                            onMonthChange={(month) => updateSalesSubPeriod(index, { startMonth: month })}
                            onYearChange={(year) => updateSalesSubPeriod(index, { startYear: year })}
                            className="border-purple-200"
                          />
                        )}
                      </div>
                      
                      <DateInput
                        label="End Date"
                        day={period.endDay}
                        month={period.endMonth}
                        year={period.endYear}
                        showYear={formData.spanningYears}
                        onDayChange={(day) => updateSalesSubPeriod(index, { endDay: day })}
                        onMonthChange={(month) => updateSalesSubPeriod(index, { endMonth: month })}
                        onYearChange={(year) => updateSalesSubPeriod(index, { endYear: year })}
                        className="border-purple-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className="mr-2" />
            {editingCampaign ? 'Update' : 'Create'} Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;