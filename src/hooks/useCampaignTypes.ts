import { useState, useEffect } from 'react';
import { CampaignType, GeneratedCampaign, StaySubPeriod, SalesSubPeriod } from '../types/campaign';

const STORAGE_KEY = 'hotelone-campaign-types';

const getDefaultCampaignTypes = (): CampaignType[] => [
  {
    id: 'winter-campaign',
    name: 'Winter',
    patternStartDay: 1,
    patternStartMonth: 12,
    patternEndDay: 30,
    patternEndMonth: 4,
    spanningYears: true,
    staySubPeriods: [
      {
        id: 'winter-stay-1',
        name: 'Early Winter',
        startDay: 1,
        startMonth: 12,
        endDay: 20,
        endMonth: 12,
        demandLevel: 'Mid'
      },
      {
        id: 'winter-stay-2',
        name: 'Holiday Season',
        startDay: 21,
        startMonth: 12,
        endDay: 10,
        endMonth: 1,
        demandLevel: 'High'
      },
      {
        id: 'winter-stay-3',
        name: 'Late Winter',
        startDay: 11,
        startMonth: 1,
        endDay: 30,
        endMonth: 4,
        demandLevel: 'Low-Mid'
      }
    ],
    salesSubPeriods: [
      {
        id: 'winter-sales-1',
        name: 'Early Bird Winter Sales',
        startDay: null,
        startMonth: 1,
        endDay: 30,
        endMonth: 9,
        startYear: 'first',
        endYear: 'first'
      },
      {
        id: 'winter-sales-2',
        name: 'Last Minute Winter Sales',
        startDay: 1,
        startMonth: 10,
        endDay: 30,
        endMonth: 4,
        startYear: 'first',
        endYear: 'second'
      }
    ],
    assignedHotels: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'summer-campaign',
    name: 'Summer',
    patternStartDay: 1,
    patternStartMonth: 5,
    patternEndDay: 31,
    patternEndMonth: 10,
    spanningYears: false,
    staySubPeriods: [
      {
        id: 'summer-stay-1',
        name: 'Early Summer',
        startDay: 1,
        startMonth: 5,
        endDay: 15,
        endMonth: 6,
        demandLevel: 'Mid'
      },
      {
        id: 'summer-stay-2',
        name: 'Peak Summer',
        startDay: 16,
        startMonth: 6,
        endDay: 31,
        endMonth: 8,
        demandLevel: 'Rush'
      },
      {
        id: 'summer-stay-3',
        name: 'Late Summer',
        startDay: 1,
        startMonth: 9,
        endDay: 31,
        endMonth: 10,
        demandLevel: 'High'
      }
    ],
    salesSubPeriods: [
      {
        id: 'summer-sales-1',
        name: 'Early Bird Summer Sales',
        startDay: null,
        startMonth: 1,
        endDay: 31,
        endMonth: 3,
        startYear: 'first',
        endYear: 'first'
      },
      {
        id: 'summer-sales-2',
        name: 'Regular Summer Sales',
        startDay: 1,
        startMonth: 4,
        endDay: 31,
        endMonth: 10,
        startYear: 'first',
        endYear: 'first'
      }
    ],
    assignedHotels: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'calendar-year-campaign',
    name: 'Calendar Year',
    patternStartDay: 1,
    patternStartMonth: 1,
    patternEndDay: 31,
    patternEndMonth: 12,
    spanningYears: false,
    staySubPeriods: [
      {
        id: 'calendar-stay-1',
        name: 'Q1',
        startDay: 1,
        startMonth: 1,
        endDay: 31,
        endMonth: 3,
        demandLevel: 'Low'
      },
      {
        id: 'calendar-stay-2',
        name: 'Q2',
        startDay: 1,
        startMonth: 4,
        endDay: 30,
        endMonth: 6,
        demandLevel: 'Mid'
      },
      {
        id: 'calendar-stay-3',
        name: 'Q3',
        startDay: 1,
        startMonth: 7,
        endDay: 30,
        endMonth: 9,
        demandLevel: 'High'
      },
      {
        id: 'calendar-stay-4',
        name: 'Q4',
        startDay: 1,
        startMonth: 10,
        endDay: 31,
        endMonth: 12,
        demandLevel: 'Mid-High'
      }
    ],
    salesSubPeriods: [
      {
        id: 'calendar-sales-1',
        name: 'Year-round Sales',
        startDay: null,
        startMonth: 1,
        endDay: 31,
        endMonth: 12,
        startYear: 'first',
        endYear: 'first'
      }
    ],
    assignedHotels: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useCampaignTypes = () => {
  const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState<{ [campaignTypeId: string]: GeneratedCampaign[] }>({});

  // Initialize campaign types
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCampaignTypes(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse campaign types:', error);
        setCampaignTypes(getDefaultCampaignTypes());
      }
    } else {
      setCampaignTypes(getDefaultCampaignTypes());
    }
  }, []);

  // Generate campaigns for each campaign type
  useEffect(() => {
    const newGeneratedCampaigns: { [campaignTypeId: string]: GeneratedCampaign[] } = {};
    
    campaignTypes.forEach(campaign => {
      if (!generatedCampaigns[campaign.id]) {
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 1, currentYear, currentYear + 1];
        
        newGeneratedCampaigns[campaign.id] = years.map(year => 
          generateCampaignForYear(campaign, year)
        );
      }
    });
    
    setGeneratedCampaigns(prev => ({ ...prev, ...newGeneratedCampaigns }));
  }, [campaignTypes]);

  const generateCampaignForYear = (campaign: CampaignType, year: number): GeneratedCampaign => {
    const getActualDate = (day: number, month: number, yearOffset: number = 0) => {
      const actualYear = year + yearOffset;
      const date = new Date(actualYear, month - 1, day);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const actualStartDate = getActualDate(campaign.patternStartDay, campaign.patternStartMonth);
    const actualEndDate = getActualDate(
      campaign.patternEndDay, 
      campaign.patternEndMonth, 
      campaign.spanningYears ? 1 : 0
    );

    const staySubPeriods = campaign.staySubPeriods.map(period => ({
      ...period,
      actualStartDate: getActualDate(period.startDay, period.startMonth),
      actualEndDate: getActualDate(period.endDay, period.endMonth, campaign.spanningYears && period.endMonth < campaign.patternStartMonth ? 1 : 0)
    }));

    const salesSubPeriods = campaign.salesSubPeriods.map(period => {
      if (period.startDay === null) {
        const endDate = getActualDate(period.endDay, period.endMonth, period.endYear === 'second' ? 1 : 0);
        return {
          ...period,
          actualRange: `From -∞ to ${endDate}`
        };
      } else {
        const startDate = getActualDate(period.startDay, period.startMonth, period.startYear === 'second' ? 1 : 0);
        const endDate = getActualDate(period.endDay, period.endMonth, period.endYear === 'second' ? 1 : 0);
        return {
          ...period,
          actualRange: `${startDate} - ${endDate}`
        };
      }
    });

    return {
      year,
      actualStartDate,
      actualEndDate,
      staySubPeriods,
      salesSubPeriods
    };
  };

  const saveCampaignTypes = (newCampaignTypes: CampaignType[]) => {
    setCampaignTypes(newCampaignTypes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCampaignTypes));
  };

  const addCampaignType = (campaignType: CampaignType) => {
    const updatedCampaigns = [...campaignTypes, campaignType];
    saveCampaignTypes(updatedCampaigns);
  };

  const updateCampaignType = (id: string, updates: Partial<CampaignType>) => {
    const updated = campaignTypes.map(campaign => 
      campaign.id === id 
        ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
        : campaign
    );
    saveCampaignTypes(updated);
  };

  const deleteCampaignType = (id: string) => {
    const filtered = campaignTypes.filter(campaign => campaign.id !== id);
    saveCampaignTypes(filtered);
    
    // Also remove generated campaigns
    setGeneratedCampaigns(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const generateCampaignForward = (campaignId: string) => {
    const campaign = campaignTypes.find(c => c.id === campaignId);
    if (!campaign) return;

    const currentCampaigns = generatedCampaigns[campaignId] || [];
    const maxYear = Math.max(...currentCampaigns.map(c => c.year));
    const nextYear = maxYear + 1;
    
    const newGeneratedCampaign = generateCampaignForYear(campaign, nextYear);
    
    setGeneratedCampaigns(prev => ({
      ...prev,
      [campaignId]: [...(prev[campaignId] || []), newGeneratedCampaign].sort((a, b) => a.year - b.year)
    }));
  };

  const generateCampaignBackward = (campaignId: string) => {
    const campaign = campaignTypes.find(c => c.id === campaignId);
    if (!campaign) return;

    const currentCampaigns = generatedCampaigns[campaignId] || [];
    const minYear = Math.min(...currentCampaigns.map(c => c.year));
    const previousYear = minYear - 1;
    
    const newGeneratedCampaign = generateCampaignForYear(campaign, previousYear);
    
    setGeneratedCampaigns(prev => ({
      ...prev,
      [campaignId]: [newGeneratedCampaign, ...(prev[campaignId] || [])].sort((a, b) => a.year - b.year)
    }));
  };

  const deleteGeneratedCampaign = (campaignTypeId: string, year: number) => {
    setGeneratedCampaigns(prev => ({
      ...prev,
      [campaignTypeId]: (prev[campaignTypeId] || []).filter(c => c.year !== year)
    }));
  };

  const getGeneratedCampaigns = (campaignId: string): GeneratedCampaign[] => {
    return generatedCampaigns[campaignId] || [];
  };

  return {
    campaignTypes,
    generatedCampaigns,
    addCampaignType,
    updateCampaignType,
    deleteCampaignType,
    generateCampaignForward,
    generateCampaignBackward,
    deleteGeneratedCampaign,
    getGeneratedCampaigns
  };
};