import React, { useState } from 'react';
import { Plus, Save, Calendar } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useCampaigns } from '../hooks/usePeriods';
import { useCampaignTypes } from '../hooks/useCampaignTypes';
import { CampaignType, StaySubPeriod, SalesSubPeriod } from '../types/campaign';
import { PageDefaultPeriods } from '../types';
import CampaignTypeCard from '../components/campaign/CampaignTypeCard';
import CampaignModal from '../components/campaign/CampaignModal';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, updateSettings } = useSettings();
  const { campaigns } = useCampaigns();
  const {
    campaignTypes,
    addCampaignType,
    updateCampaignType,
    deleteCampaignType,
    generateCampaignForward,
    generateCampaignBackward,
    deleteGeneratedCampaign,
    getGeneratedCampaigns
  } = useCampaignTypes();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignType | null>(null);
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    patternStartDay: 1,
    patternStartMonth: 1,
    patternEndDay: 31,
    patternEndMonth: 12,
    spanningYears: false,
    assignedHotels: [] as string[]
  });
  
  const [staySubPeriods, setStaySubPeriods] = useState<StaySubPeriod[]>([]);
  const [salesSubPeriods, setSalesSubPeriods] = useState<SalesSubPeriod[]>([]);

  // Default periods state
  const [tempDefaultCampaigns, setTempDefaultCampaigns] = useState<{ [pageId: string]: PageDefaultPeriods }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const availableHotels = [
    { id: 'hotel-1', name: 'Hotel Alpha' },
    { id: 'hotel-2', name: 'Hotel Beta' },
    { id: 'hotel-3', name: 'Hotel Gamma' }
  ];

  // Updated available pages - only Dashboard and Report pages
  const availablePages = [
    { id: 'home', name: 'Home Dashboard', description: 'Main dashboard with KPI overview', path: '/', type: 'dashboard' as const },
    { id: 'reports-operation-statement', name: 'Operation Statement', description: 'Monthly Custom P&L Report', path: '/reports/operation-statement', type: 'report' as const },
    { id: 'reports-bob-vs-budget-forecast', name: 'BOB Vs Budget/Forecast', description: 'Compare Books on Books performance against budget and forecast', path: '/reports/bob-vs-budget-forecast', type: 'report' as const }
  ];

  // Predefined Recognition Periods
  const recognitionPeriods = [
    { id: 'calendar-year', name: 'Calendar Year', description: '01 Jan – 31 Dec' },
    { id: 'rolling-12m', name: 'Rolling 12 Months', description: 'Last 12 months from today' },
    { id: 'current-month', name: 'Current Month', description: 'Current calendar month' },
    { id: 'current-quarter', name: 'Current Quarter', description: 'Current calendar quarter' },
    { id: 'ytd', name: 'Year to Date', description: '01 Jan to today' }
  ];

  // Records Periods options
  const recordsPeriods = [
    { id: 'TDR', name: 'To Date Records (TDR)', description: 'Data from period start to yesterday' },
    { id: 'ATR', name: 'All Time Records (ATR)', description: 'All available records without limitation' }
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize temp state when switching to default-periods tab
  React.useEffect(() => {
    if (activeTab === 'default-periods') {
      setTempDefaultCampaigns({ ...settings.defaultCampaigns });
      setHasUnsavedChanges(false);
    }
  }, [activeTab, settings.defaultCampaigns]);

  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      patternStartDay: 1,
      patternStartMonth: 1,
      patternEndDay: 31,
      patternEndMonth: 12,
      spanningYears: false,
      assignedHotels: []
    });
    setStaySubPeriods([]);
    setSalesSubPeriods([]);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingCampaign(null);
    setShowCreateModal(true);
  };

  const openEditModal = (campaign: CampaignType) => {
    setFormData({
      name: campaign.name,
      patternStartDay: campaign.patternStartDay,
      patternStartMonth: campaign.patternStartMonth,
      patternEndDay: campaign.patternEndDay,
      patternEndMonth: campaign.patternEndMonth,
      spanningYears: campaign.spanningYears,
      assignedHotels: [...campaign.assignedHotels]
    });
    setStaySubPeriods([...campaign.staySubPeriods]);
    setSalesSubPeriods([...campaign.salesSubPeriods]);
    setEditingCampaign(campaign);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCampaign(null);
    resetForm();
  };

  const saveCampaignType = () => {
    const newCampaign: CampaignType = {
      id: editingCampaign?.id || `campaign-type-${Date.now()}`,
      name: formData.name,
      patternStartDay: formData.patternStartDay,
      patternStartMonth: formData.patternStartMonth,
      patternEndDay: formData.patternEndDay,
      patternEndMonth: formData.patternEndMonth,
      spanningYears: formData.spanningYears,
      staySubPeriods: [...staySubPeriods],
      salesSubPeriods: [...salesSubPeriods],
      assignedHotels: [...formData.assignedHotels],
      createdAt: editingCampaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCampaign) {
      updateCampaignType(editingCampaign.id, newCampaign);
    } else {
      addCampaignType(newCampaign);
    }

    closeModal();
  };

  const handlePeriodTypeChange = (pageId: string, type: 'recognition' | 'records') => {
    // This function is no longer needed since we configure both periods separately
  };

  const handleRecognitionPeriodChange = (pageId: string, recognitionPeriodId: string) => {
    setTempDefaultCampaigns(prev => ({
      ...prev,
      [pageId]: {
        recognitionPeriodId,
        recordsPeriodId: prev[pageId]?.recordsPeriodId || 'TDR'
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleRecordsPeriodChange = (pageId: string, recordsPeriodId: 'TDR' | 'ATR') => {
    setTempDefaultCampaigns(prev => ({
      ...prev,
      [pageId]: {
        recognitionPeriodId: prev[pageId]?.recognitionPeriodId || 'calendar-year',
        recordsPeriodId
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handlePeriodIdChange = (pageId: string, id: string) => {
    // This function is replaced by handleRecognitionPeriodChange and handleRecordsPeriodChange
  };

  const saveDefaultPeriods = () => {
    updateSettings({
      defaultCampaigns: tempDefaultCampaigns
    });
    setHasUnsavedChanges(false);
  };

  const resetDefaultPeriods = () => {
    setTempDefaultCampaigns({ ...settings.defaultCampaigns });
    setHasUnsavedChanges(false);
  };

  const getPeriodDescription = (setting: PageDefaultPeriods | undefined): string => {
    if (!setting) return '— No default period —';
    
    const recognitionPeriod = recognitionPeriods.find(p => p.id === setting.recognitionPeriodId);
    const recordsPeriod = recordsPeriods.find(p => p.id === setting.recordsPeriodId);
    
    const recognitionDesc = recognitionPeriod ? `${recognitionPeriod.name} (${recognitionPeriod.description})` : 'Unknown Recognition Period';
    const recordsDesc = recordsPeriod ? recordsPeriod.name : 'Unknown Records Period';
    
    return `Recognition: ${recognitionDesc} | Records: ${recordsDesc}`;
  };

  const getRecognitionPeriodDescription = (recognitionPeriodId: string | undefined): string => {
    if (!recognitionPeriodId) return '— No default recognition period —';
    const period = recognitionPeriods.find(p => p.id === recognitionPeriodId);
    return period ? `${period.name} (${period.description})` : 'Unknown Recognition Period';
  };

  const getRecordsPeriodDescription = (recordsPeriodId: string | undefined): string => {
    if (!recordsPeriodId) return '— No default records period —';
    const period = recordsPeriods.find(p => p.id === recordsPeriodId);
    return period ? period.name : 'Unknown Records Period';
  };

  const formatPatternDate = (day: number, month: number) => {
    return `${day} ${monthNames[month - 1]}`;
  };

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Campaign Types Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage campaign types with pattern dates and sub-periods
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create Campaign Type
        </button>
      </div>

      <div className="space-y-4">
        {campaignTypes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaign Types</h3>
            <p className="text-gray-600 mb-4">Create your first campaign type to get started</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Create Campaign Type
            </button>
          </div>
        ) : (
          campaignTypes.map(campaign => (
            <CampaignTypeCard
              key={campaign.id}
              campaign={campaign}
              isExpanded={expandedCampaigns.includes(campaign.id)}
              onToggleExpansion={() => toggleCampaignExpansion(campaign.id)}
              onEdit={() => openEditModal(campaign)}
              onDelete={() => deleteCampaignType(campaign.id)}
              generatedCampaigns={getGeneratedCampaigns(campaign.id)}
              onGenerateForward={() => generateCampaignForward(campaign.id)}
              onGenerateBackward={() => generateCampaignBackward(campaign.id)}
              onDeleteGenerated={(year) => deleteGeneratedCampaign(campaign.id, year)}
              availableHotels={availableHotels}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderDefaultPeriodsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Default Period Configuration</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure which period type should be used as default for each Dashboard and Report page
        </p>
      </div>

      {/* Global Period Definitions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">Available Period Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-blue-800 mb-2">Recognition Periods</h5>
            <div className="space-y-1">
              {recognitionPeriods.map(period => (
                <div key={period.id} className="text-xs text-blue-700">
                  <span className="font-medium">{period.name}:</span> {period.description}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-medium text-blue-800 mb-2">Records Periods</h5>
            <div className="space-y-1">
              {recordsPeriods.map(period => (
                <div key={period.id} className="text-xs text-blue-700">
                  <span className="font-medium">{period.name}:</span> {period.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {availablePages.map(page => {
          const currentSetting = tempDefaultCampaigns[page.id];
          return (
            <div key={page.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                      page.type === 'dashboard' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {page.type === 'dashboard' ? 'Dashboard' : 'Report'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{page.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Path: {page.path}</p>
                </div>
                
                <div className="flex-shrink-0 ml-4 space-y-3">
                  {/* Recognition Period Selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Recognition Period</label>
                    <select
                      value={currentSetting?.recognitionPeriodId || ''}
                      onChange={(e) => handleRecognitionPeriodChange(page.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px] text-sm"
                    >
                      <option value="">— No default recognition period —</option>
                      {recognitionPeriods.map(period => (
                        <option key={period.id} value={period.id}>
                          {period.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Records Period Selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Records Period</label>
                    <select
                      value={currentSetting?.recordsPeriodId || ''}
                      onChange={(e) => handleRecordsPeriodChange(page.id, e.target.value as 'TDR' | 'ATR')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px] text-sm"
                    >
                      <option value="">— No default records period —</option>
                      {recordsPeriods.map(period => (
                        <option key={period.id} value={period.id}>
                          {period.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Current selection:</span>
                    <div className="mt-1 p-2 bg-white rounded border border-gray-200">
                      {getPeriodDescription(currentSetting)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasUnsavedChanges && (
        <div className="flex items-center justify-end space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 mr-auto">You have unsaved changes</p>
          <button
            onClick={resetDefaultPeriods}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={saveDefaultPeriods}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure currency preferences, VAT settings, and campaign management</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaign Types
          </button>
          <button
            onClick={() => setActiveTab('default-periods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'default-periods'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Default Periods
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">General Settings</h3>
            <p className="text-gray-600 mb-4">
              General application settings will be available here.
            </p>
            <div className="text-sm text-gray-500">
              Currency, VAT, and other general settings coming soon
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && renderCampaignsTab()}
      {activeTab === 'default-periods' && renderDefaultPeriodsTab()}

      {/* Campaign Modal */}
      <CampaignModal
        isOpen={showCreateModal}
        onClose={closeModal}
        editingCampaign={editingCampaign}
        formData={formData}
        onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        staySubPeriods={staySubPeriods}
        salesSubPeriods={salesSubPeriods}
        onStaySubPeriodsChange={setStaySubPeriods}
        onSalesSubPeriodsChange={setSalesSubPeriods}
        onSave={saveCampaignType}
        availableHotels={availableHotels}
      />
    </div>
  );
};

export default Settings;