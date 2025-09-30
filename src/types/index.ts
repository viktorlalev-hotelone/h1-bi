export interface KPICard {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  pickup?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
  };
  comparisons?: {
    vsPrior: {
      percentage: number;
      type: 'positive' | 'negative' | 'neutral';
      progress: number;
    };
    vsBudget: {
      percentage: number;
      type: 'positive' | 'negative' | 'neutral';
      progress: number;
      soon?: boolean;
    };
  };
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
}

export interface PageDefaultPeriods {
  recognitionPeriodId: string; // e.g., 'calendar-year', 'rolling-12m', etc.
  recordsPeriodId: 'TDR' | 'ATR'; // 'TDR' or 'ATR'
}

export interface Settings {
  currency: string;
  vatEnabled: boolean;
  commissionsEnabled: boolean;
  defaultCampaigns: {
    [pageId: string]: PageDefaultPeriods; // pageId -> both period settings
  };
}

export interface SubPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'stay' | 'sales';
  description?: string;
  periods: SubPeriod[];
  assignedHotels: string[]; // Hotel IDs that use this campaign
  createdAt: string;
  updatedAt: string;
  // For sales campaigns - template configuration
  isTemplate?: boolean;
  templateConfig?: {
    relativeStartOffset?: number; // days before stay period start (-∞ if null)
    relativeEndOffset?: number; // days relative to stay period start/end
    endRelativeTo: 'start' | 'end'; // relative to stay period start or end
    applyToStayCampaigns: string[]; // which stay campaign types to apply to
  };
}