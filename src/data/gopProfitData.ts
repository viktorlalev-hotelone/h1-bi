export interface GOPProfitItem {
  name: string;
  value: number;
  color: string;
  type: 'positive' | 'negative' | 'total';
}

export const gopProfitDevelopmentData: GOPProfitItem[] = [
  {
    name: 'Rooms Profit',
    value: 6000000,
    color: '#22D3EE',
    type: 'positive'
  },
  {
    name: 'F&B Profit',
    value: 800000,
    color: '#3B82F6',
    type: 'positive'
  },
  {
    name: 'Other Profit',
    value: 400000,
    color: '#6366F1',
    type: 'positive'
  },
  {
    name: 'A & G',
    value: -1200000,
    color: '#8B5CF6',
    type: 'negative'
  },
  {
    name: 'IT',
    value: -800000,
    color: '#A855F7',
    type: 'negative'
  },
  {
    name: 'H.R.P',
    value: -600000,
    color: '#C084FC',
    type: 'negative'
  },
  {
    name: 'P & M',
    value: -500000,
    color: '#D8B4FE',
    type: 'negative'
  },
  {
    name: 'S & M',
    value: -400000,
    color: '#E879F9',
    type: 'negative'
  },
  {
    name: 'Fees',
    value: -300000,
    color: '#F472B6',
    type: 'negative'
  }
];

// Calculate GOP (Gross Operating Profit)
export const calculateGOP = (): number => {
  return gopProfitDevelopmentData.reduce((total, item) => total + item.value, 0);
};