import { useState, useEffect } from 'react';
import { Settings, PageDefaultPeriods } from '../types';

const defaultSettings: Settings = {
  currency: 'BGN',
  vatEnabled: false,
  commissionsEnabled: true,
  defaultCampaigns: {} // This will now store PageDefaultPeriods objects
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('hotelone-settings');
    if (stored) {
      try {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...JSON.parse(stored)
        }));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('hotelone-settings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
};