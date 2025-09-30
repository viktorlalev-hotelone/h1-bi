// Utility functions for consistent number formatting across the application

export const formatRevenue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(3)}m`;
  } else if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return value.toString();
};

export const formatAveragePrice = (value: number): string => {
  return value.toFixed(2);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatCompactRevenue = (value: string): string => {
  // Extract numeric value from strings like "€47,832" or "лв47,832"
  const numStr = value.replace(/[€лв$,]/g, '');
  const num = parseFloat(numStr);
  
  if (isNaN(num)) return value;
  
  return formatRevenue(num);
};

export const formatCompactADR = (value: string, currency: string = 'BGN'): string => {
  // Extract numeric value from strings like "€89.50"
  const numStr = value.replace(/[€лв$]/g, '');
  const num = parseFloat(numStr);
  
  if (isNaN(num)) return value;
  
  return formatAveragePrice(num, currency);
};

export const getPercentageColor = (percentage: number): string => {
  return percentage >= 0 ? 'text-green-600' : 'text-red-600';
};

export const parseFormattedValue = (formattedValue: string): number => {
  // Remove currency symbols, commas, and other formatting
  const cleanValue = formattedValue.replace(/[€лв$,%]/g, '');
  
  // Handle compact notation (k, m)
  if (cleanValue.includes('k')) {
    return parseFloat(cleanValue.replace('k', '')) * 1000;
  } else if (cleanValue.includes('m')) {
    return parseFloat(cleanValue.replace('m', '')) * 1000000;
  }
  
  return parseFloat(cleanValue) || 0;
};

export const parseBadgeValue = (formattedValue: string): number => {
  // Remove currency symbols, commas, and other formatting
  const cleanValue = formattedValue.replace(/[€лв$BGN,%\s]/g, '');
  
  // Handle compact notation (k, m)
  if (cleanValue.includes('k')) {
    return parseFloat(cleanValue.replace('k', '')) * 1000;
  } else if (cleanValue.includes('m')) {
    return parseFloat(cleanValue.replace('m', '')) * 1000000;
  }
  
  return parseFloat(cleanValue) || 0;
};