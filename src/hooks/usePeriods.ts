import { useState, useEffect } from 'react';
import { Campaign, SubPeriod } from '../types';

const STORAGE_KEY = 'hotelone-campaigns';

// Generate comprehensive default campaigns
const generateDefaultCampaigns = (): Campaign[] => {
  console.log('🏗️ Generating default campaigns...');
  
  const currentYear = new Date().getFullYear();
  const years = [2023, 2024, 2025, 2026, 2027];
  
  const campaigns: Campaign[] = [];
  const now = new Date().toISOString();
  
  // 1. Calendar Year Campaign (01 Jan - 31 Dec) - 5 periods
  const calendarYearPeriods: SubPeriod[] = years.map(year => ({
    id: `calendar-year-${year}`,
    name: `${year}`,
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`
  }));
  
  campaigns.push({
    id: 'calendar-year',
    name: 'Calendar Year',
    type: 'stay',
    description: 'Full calendar year periods from 01 Jan to 31 Dec',
    periods: calendarYearPeriods,
    assignedHotels: [],
    createdAt: now,
    updatedAt: now
  });
  
  // 2. Summer Season Campaign (01 May - 31 Oct) - 5 periods
  const summerPeriods: SubPeriod[] = years.map(year => ({
    id: `summer-${year}`,
    name: `Summer ${year}`,
    startDate: `${year}-05-01`,
    endDate: `${year}-10-31`
  }));
  
  campaigns.push({
    id: 'summer-season',
    name: 'Summer Season',
    type: 'stay',
    description: 'Summer tourism season from 01 May to 31 Oct',
    periods: summerPeriods,
    assignedHotels: [],
    createdAt: now,
    updatedAt: now
  });
  
  // 3. Winter Season Campaign (01 Dec - 30 Apr) - 5 periods
  const winterPeriods: SubPeriod[] = years.map(year => ({
    id: `winter-${year}`,
    name: `Winter ${year}/${year + 1}`,
    startDate: `${year}-12-01`,
    endDate: `${year + 1}-04-30`
  }));
  
  campaigns.push({
    id: 'winter-season',
    name: 'Winter Season',
    type: 'stay',
    description: 'Winter tourism season from 01 Dec to 30 Apr',
    periods: winterPeriods,
    assignedHotels: [],
    createdAt: now,
    updatedAt: now
  });
  
  console.log(`✅ Generated ${campaigns.length} campaigns with ${campaigns.reduce((sum, c) => sum + c.periods.length, 0)} total periods`);
  return campaigns;
};

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Initialize campaigns on mount
  useEffect(() => {
    console.log('🔄 Initializing campaigns...');
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('📦 Stored campaigns data:', stored);
      
      if (stored && stored !== 'undefined' && stored !== 'null') {
        const parsedCampaigns = JSON.parse(stored);
        console.log('✅ Loaded campaigns from localStorage:', parsedCampaigns);
        
        if (Array.isArray(parsedCampaigns) && parsedCampaigns.length > 0) {
          setCampaigns(parsedCampaigns);
          return;
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse campaigns:', error);
    }
    
    // Generate and save defaults
    console.log('🆕 Generating default campaigns...');
    const defaultCampaigns = generateDefaultCampaigns();
    setCampaigns(defaultCampaigns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCampaigns));
    console.log('💾 Saved default campaigns to localStorage');
  }, []);

  const saveCampaigns = (newCampaigns: Campaign[]) => {
    console.log('💾 Saving campaigns:', newCampaigns);
    setCampaigns(newCampaigns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCampaigns));
  };

  const addCampaign = (campaignData: { name: string; type: 'stay' | 'sales'; description?: string; isTemplate?: boolean; templateConfig?: any } | string, type: 'stay' | 'sales' = 'stay', description?: string) => {
    
    // Handle both old and new API
    let finalCampaignData;
    if (typeof campaignData === 'string') {
      // Old API compatibility
      finalCampaignData = {
        name: campaignData,
        type,
        description: description || '',
        isTemplate: false
      };
    } else {
      // New API
      finalCampaignData = campaignData;
    }
    
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: finalCampaignData.name,
      type: finalCampaignData.type,
      description: finalCampaignData.description || '',
      periods: [],
      assignedHotels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: finalCampaignData.isTemplate,
      templateConfig: finalCampaignData.templateConfig
    };
    
    const updatedCampaigns = [...campaigns, newCampaign];
    
    // If it's a sales template, auto-generate periods for matching stay campaigns
    if (finalCampaignData.isTemplate && finalCampaignData.templateConfig) {
      const generatedCampaigns = generatePeriodsFromTemplate(newCampaign, updatedCampaigns);
      saveCampaigns(generatedCampaigns);
    } else {
      saveCampaigns(updatedCampaigns);
    }
  };

  const generatePeriodsFromTemplate = (templateCampaign: Campaign, allCampaigns: Campaign[]): Campaign[] => {
    if (!templateCampaign.templateConfig) return allCampaigns;
    
    const { templateConfig } = templateCampaign;
    const targetStayCampaigns = allCampaigns.filter(c => 
      c.type === 'stay' && templateConfig.applyToStayCampaigns.includes(c.id)
    );
    
    // Generate periods for each matching stay campaign
    targetStayCampaigns.forEach(stayCampaign => {
      stayCampaign.periods.forEach(stayPeriod => {
        const stayStart = new Date(stayPeriod.startDate);
        const stayEnd = new Date(stayPeriod.endDate);
        
        // Calculate sales period dates
        let salesStart: string;
        if (templateConfig.relativeStartOffset === null) {
          salesStart = '1900-01-01'; // Represent −∞ as very old date
        } else {
          const startDate = new Date(stayStart);
          startDate.setDate(startDate.getDate() + templateConfig.relativeStartOffset);
          salesStart = startDate.toISOString().split('T')[0];
        }
        
        const endDate = templateConfig.endRelativeTo === 'start' ? stayStart : stayEnd;
        endDate.setDate(endDate.getDate() + templateConfig.relativeEndOffset);
        const salesEnd = endDate.toISOString().split('T')[0];
        
        // Create sales period name
        const salesPeriodName = `${templateCampaign.name} - ${stayPeriod.name}`;
        
        // Add period to template campaign
        templateCampaign.periods.push({
          id: `period-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: salesPeriodName,
          startDate: salesStart,
          endDate: salesEnd
        });
      });
    });
    
    return allCampaigns;
  };

  // Update the function signature to handle both old and new API
  const addCampaignLegacy = (name: string, type: 'stay' | 'sales' = 'stay', description?: string) => {
    return addCampaign({ name, type, description });
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    const updated = campaigns.map(campaign => 
      campaign.id === id 
        ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
        : campaign
    );
    saveCampaigns(updated);
  };

  const deleteCampaign = (id: string) => {
    const filtered = campaigns.filter(campaign => campaign.id !== id);
    saveCampaigns(filtered);
  };

  const addPeriod = (campaignId: string, period: Omit<SubPeriod, 'id'>) => {
    const newPeriod: SubPeriod = {
      ...period,
      id: `period-${Date.now()}`
    };
    
    const updated = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            periods: [...campaign.periods, newPeriod],
            updatedAt: new Date().toISOString()
          }
        : campaign
    );
    saveCampaigns(updated);
  };

  const updatePeriod = (campaignId: string, periodId: string, updates: Partial<SubPeriod>) => {
    const updated = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? {
            ...campaign,
            periods: campaign.periods.map(period => 
              period.id === periodId ? { ...period, ...updates } : period
            ),
            updatedAt: new Date().toISOString()
          }
        : campaign
    );
    saveCampaigns(updated);
  };

  const deletePeriod = (campaignId: string, periodId: string) => {
    const updated = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? {
            ...campaign,
            periods: campaign.periods.filter(period => period.id !== periodId),
            updatedAt: new Date().toISOString()
          }
        : campaign
    );
    saveCampaigns(updated);
  };

  const assignCampaignToHotel = (campaignId: string, hotelId: string) => {
    const updated = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? {
            ...campaign,
            assignedHotels: campaign.assignedHotels.includes(hotelId) 
              ? campaign.assignedHotels 
              : [...campaign.assignedHotels, hotelId],
            updatedAt: new Date().toISOString()
          }
        : campaign
    );
    saveCampaigns(updated);
  };

  const unassignCampaignFromHotel = (campaignId: string, hotelId: string) => {
    const updated = campaigns.map(campaign => 
      campaign.id === campaignId 
        ? {
            ...campaign,
            assignedHotels: campaign.assignedHotels.filter(id => id !== hotelId),
            updatedAt: new Date().toISOString()
          }
        : campaign
    );
    saveCampaigns(updated);
  };

  const duplicateCampaign = (campaignId: string, newName: string) => {
    const originalCampaign = campaigns.find(c => c.id === campaignId);
    if (!originalCampaign) return;

    const duplicatedCampaign: Campaign = {
      ...originalCampaign,
      id: `campaign-${Date.now()}`,
      name: newName,
      assignedHotels: [], // New campaign starts unassigned
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      periods: originalCampaign.periods.map(period => ({
        ...period,
        id: `period-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };

    const updatedCampaigns = [...campaigns, duplicatedCampaign];
    saveCampaigns(updatedCampaigns);
  };

  // Get current period based on campaign type and today's date
  const getCurrentPeriod = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign || campaign.periods.length === 0) return null;

    const today = new Date();
    const currentYear = today.getFullYear();
    
    // For Calendar Year campaigns, find the current year
    if (campaign.name.toLowerCase().includes('calendar')) {
      const currentYearPeriod = campaign.periods.find(p => 
        p.startDate.startsWith(currentYear.toString())
      );
      return currentYearPeriod || campaign.periods[campaign.periods.length - 1];
    }
    
    // For seasonal campaigns, find period that contains today or next upcoming period
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // First, try to find a period that contains today
    const currentPeriod = campaign.periods.find(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return today >= startDate && today <= endDate;
    });
    
    if (currentPeriod) return currentPeriod;
    
    // If no current period, find the next upcoming period
    const futurePeriods = campaign.periods
      .filter(period => new Date(period.startDate) > today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    if (futurePeriods.length > 0) return futurePeriods[0];
    
    // If no future periods, return the most recent past period
    const pastPeriods = campaign.periods
      .filter(period => new Date(period.endDate) < today)
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    
    return pastPeriods.length > 0 ? pastPeriods[0] : campaign.periods[0];
  };
  console.log('🔍 Current campaigns count:', campaigns.length);

  return {
    campaigns,
    getCurrentPeriod,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addPeriod,
    updatePeriod,
    deletePeriod,
    assignCampaignToHotel,
    unassignCampaignFromHotel,
    duplicateCampaign
  };
};