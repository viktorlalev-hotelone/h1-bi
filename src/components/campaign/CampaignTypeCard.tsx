import React from 'react';
import { Edit, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { CampaignType, GeneratedCampaign } from '../../types/campaign';

interface CampaignTypeCardProps {
  campaign: CampaignType;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onEdit: () => void;
  onDelete: () => void;
  generatedCampaigns: GeneratedCampaign[];
  onGenerateForward: () => void;
  onGenerateBackward: () => void;
  onDeleteGenerated: (year: number) => void;
  availableHotels: { id: string; name: string }[];
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatPatternDate = (day: number, month: number) => {
  return `${day} ${monthNames[month - 1]}`;
};

const formatSalesOffset = (period: any) => {
  if (period.startDay === null) {
    return 'From -∞';
  }
  const startDate = `${period.startDay} ${monthNames[period.startMonth - 1]}${period.startYear ? ` (${period.startYear === 'first' ? 'First' : 'Second'} Year)` : ''}`;
  const endDate = `${period.endDay} ${monthNames[period.endMonth - 1]}${period.endYear ? ` (${period.endYear === 'first' ? 'First' : 'Second'} Year)` : ''}`;
  return `${startDate} - ${endDate}`;
};

const CampaignTypeCard: React.FC<CampaignTypeCardProps> = ({
  campaign,
  isExpanded,
  onToggleExpansion,
  onEdit,
  onDelete,
  generatedCampaigns,
  onGenerateForward,
  onGenerateBackward,
  onDeleteGenerated,
  availableHotels
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Campaign Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div>
          <div className="flex items-center">
            <h4 className="text-lg font-semibold text-gray-900 mr-3">{campaign.name}</h4>
            <div className="flex items-center space-x-2">
              {campaign.staySubPeriods.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {campaign.staySubPeriods.length} Stay
                </span>
              )}
              {campaign.salesSubPeriods.length > 0 && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {campaign.salesSubPeriods.length} Sales
                </span>
              )}
              {generatedCampaigns.length > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {generatedCampaigns.length} Years
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Pattern: {formatPatternDate(campaign.patternStartDay, campaign.patternStartMonth)} - {formatPatternDate(campaign.patternEndDay, campaign.patternEndMonth)}
            {campaign.spanningYears && ' (spanning years)'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
          
          {isExpanded && (
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                title="Edit Campaign Type"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Campaign Type"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4 pt-4">
            <div className="text-sm text-gray-600">
              Configure pattern and sub-periods for this campaign type
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onGenerateBackward}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                title="Generate Previous Year Campaign"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6"/>
                  <path d="M21 12H9"/>
                </svg>
              </button>
              <button
                onClick={onGenerateForward}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                title="Generate Next Year Campaign"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6"/>
                  <path d="M3 12h12"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Assigned Hotels */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Assigned Hotels</h5>
            <div className="flex flex-wrap gap-2">
              {campaign.assignedHotels.length === 0 ? (
                <span className="text-sm text-gray-500">No hotels assigned</span>
              ) : (
                campaign.assignedHotels.map(hotelId => {
                  const hotel = availableHotels.find(h => h.id === hotelId);
                  return (
                    <span key={hotelId} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {hotel?.name || hotelId}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Stay Sub-periods */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Stay/Service Sub-periods</h5>
            {campaign.staySubPeriods.length === 0 ? (
              <p className="text-sm text-gray-500">No stay sub-periods defined</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {campaign.staySubPeriods.map(period => (
                  <div key={period.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm text-gray-900">{period.name}</div>
                    <div className="text-xs text-gray-600">
                      {formatPatternDate(period.startDay, period.startMonth)} - {formatPatternDate(period.endDay, period.endMonth)}
                    </div>
                    <div className={`text-xs font-medium mt-1 ${
                      period.demandLevel === 'Rush' ? 'text-red-600' :
                      period.demandLevel === 'High' ? 'text-orange-600' :
                      period.demandLevel === 'Mid-High' ? 'text-yellow-600' :
                      period.demandLevel === 'Mid' ? 'text-blue-600' :
                      period.demandLevel === 'Low-Mid' ? 'text-green-600' :
                      period.demandLevel === 'Low' ? 'text-gray-600' :
                      'text-purple-600'
                    }`}>
                      {period.demandLevel}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sales Sub-periods */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Sales Sub-periods</h5>
            {campaign.salesSubPeriods.length === 0 ? (
              <p className="text-sm text-gray-500">No sales sub-periods defined</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {campaign.salesSubPeriods.map(period => (
                  <div key={period.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-gray-900">{period.name}</div>
                    <div className="text-xs text-gray-600">
                      {formatSalesOffset(period)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generated Campaigns Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-medium text-gray-900">Generated Campaigns</h5>
              <div className="text-sm text-gray-500">
                Based on pattern: {formatPatternDate(campaign.patternStartDay, campaign.patternStartMonth)} - {formatPatternDate(campaign.patternEndDay, campaign.patternEndMonth)}
              </div>
            </div>
            
            <div className="flex justify-center mb-4">
              <button
                onClick={onGenerateBackward}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                title="Add previous year campaign"
              >
                <Plus size={16} className="mr-1" />
                Add Previous Year
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {generatedCampaigns.map((genCampaign) => (
                <div key={genCampaign.year} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-semibold text-gray-900">{campaign.name} {genCampaign.year}</h6>
                    <button
                      onClick={() => onDeleteGenerated(genCampaign.year)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete this campaign"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {genCampaign.actualStartDate} - {genCampaign.actualEndDate}
                  </div>
                  
                  {genCampaign.staySubPeriods.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">Stay Sub-periods</div>
                      <div className="space-y-1">
                        {genCampaign.staySubPeriods.map(period => (
                          <div key={period.id} className="text-xs bg-white rounded p-2 border border-gray-200">
                            <div className="font-medium">{period.name}</div>
                            <div className="text-gray-500">{period.actualStartDate} - {period.actualEndDate}</div>
                            <div className={`text-xs font-medium mt-1 ${
                              period.demandLevel === 'Rush' ? 'text-red-600' :
                              period.demandLevel === 'High' ? 'text-orange-600' :
                              period.demandLevel === 'Mid-High' ? 'text-yellow-600' :
                              period.demandLevel === 'Mid' ? 'text-blue-600' :
                              period.demandLevel === 'Low-Mid' ? 'text-green-600' :
                              period.demandLevel === 'Low' ? 'text-gray-600' :
                              'text-purple-600'
                            }`}>
                              {period.demandLevel}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {genCampaign.salesSubPeriods.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Sales Sub-periods</div>
                      <div className="space-y-1">
                        {genCampaign.salesSubPeriods.map(period => (
                          <div key={period.id} className="text-xs bg-white rounded p-2 border border-purple-200">
                            <div className="font-medium">{period.name}</div>
                            <div className="text-gray-500">{period.actualRange}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={onGenerateForward}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                title="Add next year campaign"
              >
                <Plus size={16} className="mr-1" />
                Add Next Year
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTypeCard;