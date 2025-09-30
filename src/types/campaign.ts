export interface CampaignType {
  id: string;
  name: string;
  patternStartDay: number;
  patternStartMonth: number;
  patternEndDay: number;
  patternEndMonth: number;
  spanningYears: boolean;
  staySubPeriods: StaySubPeriod[];
  salesSubPeriods: SalesSubPeriod[];
  assignedHotels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaySubPeriod {
  id: string;
  name: string;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
  demandLevel: 'Distressed' | 'Low' | 'Low-Mid' | 'Mid' | 'Mid-High' | 'High' | 'Rush';
}

export interface SalesSubPeriod {
  id: string;
  name: string;
  startDay: number | null;
  startMonth: number;
  startYear?: 'first' | 'second';
  endDay: number;
  endMonth: number;
  endYear?: 'first' | 'second';
}

export interface GeneratedCampaign {
  year: number;
  actualStartDate: string;
  actualEndDate: string;
  staySubPeriods: (StaySubPeriod & { actualStartDate: string; actualEndDate: string })[];
  salesSubPeriods: (SalesSubPeriod & { actualRange: string })[];
}