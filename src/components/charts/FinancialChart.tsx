import React from 'react';
import BaseChart from './BaseChart';
import { createStackedBarConfig, createAgingBarConfig, createDatasetBarConfig } from './chartConfigs';

interface FinancialChartProps {
  type: 'payables' | 'receivables' | 'aging-payables' | 'aging-receivables' | 'post-departure' | 'rooms-not-available';
  title: string;
  data?: any[];
  dataSource?: any[][];
  onHelpClick?: () => void;
  className?: string;
  showVatBadge?: boolean;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
  type,
  title,
  data,
  dataSource,
  onHelpClick,
  className = '',
  showVatBadge = false
}) => {
  const getChartConfig = () => {
    switch (type) {
      case 'payables':
        return createStackedBarConfig(
          data || [],
          [
            { name: 'Accrual Ledger', dataKey: 'accrualLedger', color: '#3B82F6' },
            { name: 'Invoice Ledger', dataKey: 'invoiceLedger', color: '#10B981' }
          ],
          {
            tooltipFormatter: (params: any) => {
              const hotel = params[0].axisValueLabel;
              const accrualValue = params.find((p: any) => p.seriesName === 'Accrual Ledger')?.value || 0;
              const invoiceValue = params.find((p: any) => p.seriesName === 'Invoice Ledger')?.value || 0;
              const total = accrualValue + invoiceValue;
              
              const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
              const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : '0.0';
              
              return `
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${hotel}</div>
                  <div style="font-size: 13px; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: #6B7280;">Total Payables:</span> 
                      <span style="color: #1F2937; font-weight: 600;">${fmt(total)} BGN</span>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Breakdown:</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #3B82F6;">■ Accrual Ledger:</span>
                      <span style="font-weight: 600;">${fmt(accrualValue)} BGN (${pct(accrualValue)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                      <span style="color: #10B981;">■ Invoice Ledger:</span>
                      <span style="font-weight: 600;">${fmt(invoiceValue)} BGN (${pct(invoiceValue)}%)</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        );
      
      case 'receivables':
        return createStackedBarConfig(
          data || [],
          [
            { name: 'Guest Ledger', dataKey: 'guestLedger', color: '#3B82F6' },
            { name: 'City Ledger', dataKey: 'cityLedger', color: '#10B981' }
          ],
          {
            tooltipFormatter: (params: any) => {
              const hotel = params[0].axisValueLabel;
              const guestValue = params.find((p: any) => p.seriesName === 'Guest Ledger')?.value || 0;
              const cityValue = params.find((p: any) => p.seriesName === 'City Ledger')?.value || 0;
              const total = guestValue + cityValue;
              
              const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
              const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : '0.0';
              
              return `
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${hotel}</div>
                  <div style="font-size: 13px; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: #6B7280;">Total Receivables:</span> 
                      <span style="color: #1F2937; font-weight: 600;">${fmt(total)} BGN</span>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Breakdown:</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #3B82F6;">■ Guest Ledger:</span>
                      <span style="font-weight: 600;">${fmt(guestValue)} BGN (${pct(guestValue)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                      <span style="color: #10B981;">■ City Ledger:</span>
                      <span style="font-weight: 600;">${fmt(cityValue)} BGN (${pct(cityValue)}%)</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        );
      
      case 'aging-payables':
        return createAgingBarConfig(
          data || [],
          [
            { name: '0-30 days', dataKey: 'current', color: '#10B981' },
            { name: '31-60 days', dataKey: 'days30', color: '#F59E0B' },
            { name: '61+ days', dataKey: 'days60', color: '#EF4444' }
          ],
          {
            tooltipFormatter: (params: any) => {
              const hotel = params[0].axisValueLabel;
              const current = params.find((p: any) => p.seriesName === '0-30 days')?.value || 0;
              const days30 = params.find((p: any) => p.seriesName === '31-60 days')?.value || 0;
              const days60 = params.find((p: any) => p.seriesName === '61+ days')?.value || 0;
              const total = current + days30 + days60;
              
              const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
              const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : '0.0';
              
              return `
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${hotel}</div>
                  <div style="font-size: 13px; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: #6B7280;">Total Aging:</span> 
                      <span style="color: #1F2937; font-weight: 600;">${fmt(total)} BGN</span>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Aging Breakdown:</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #10B981;">■ 0-30 days:</span>
                      <span style="font-weight: 600;">${fmt(current)} BGN (${pct(current)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #F59E0B;">■ 31-60 days:</span>
                      <span style="font-weight: 600;">${fmt(days30)} BGN (${pct(days30)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                      <span style="color: #EF4444;">■ 61+ days:</span>
                      <span style="font-weight: 600;">${fmt(days60)} BGN (${pct(days60)}%)</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        );
      
      case 'aging-receivables':
        return createAgingBarConfig(
          data || [],
          [
            { name: '0-30 days', dataKey: 'current', color: '#10B981' },
            { name: '31-60 days', dataKey: 'days30', color: '#F59E0B' },
            { name: '61+ days', dataKey: 'days60', color: '#EF4444' }
          ],
          {
            tooltipFormatter: (params: any) => {
              const hotel = params[0].axisValueLabel;
              const current = params.find((p: any) => p.seriesName === '0-30 days')?.value || 0;
              const days30 = params.find((p: any) => p.seriesName === '31-60 days')?.value || 0;
              const days60 = params.find((p: any) => p.seriesName === '61+ days')?.value || 0;
              const total = current + days30 + days60;
              
              const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
              const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : '0.0';
              
              return `
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${hotel}</div>
                  <div style="font-size: 13px; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: #6B7280;">Total Aging:</span> 
                      <span style="color: #1F2937; font-weight: 600;">${fmt(total)} BGN</span>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Aging Breakdown:</div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #10B981;">■ 0-30 days:</span>
                      <span style="font-weight: 600;">${fmt(current)} BGN (${pct(current)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                      <span style="color: #F59E0B;">■ 31-60 days:</span>
                      <span style="font-weight: 600;">${fmt(days30)} BGN (${pct(days30)}%)</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                      <span style="color: #EF4444;">■ 61+ days:</span>
                      <span style="font-weight: 600;">${fmt(days60)} BGN (${pct(days60)}%)</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }
        );
      
      case 'post-departure':
        return createDatasetBarConfig(
          dataSource || [],
          [
            { name: '1-7 days', color: '#3B82F6' },
            { name: '6-14 days', color: '#10B981' },
            { name: '15-30 days', color: '#F59E0B' },
            { name: '31-60 days', color: '#EF4444' },
            { name: '61-90 days', color: '#8B5CF6' },
            { name: 'over 90 days', color: '#6B7280' }
          ],
          {
            tooltipFormatter: (params: any) => {
              const hotel = params[0].axisValueLabel;
              const values = params.map((p: any) => p.value || 0);
              const total = values.reduce((sum: number, val: number) => sum + val, 0);
              
              const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
              const pct = (n: number) => total ? ((n / total) * 100).toFixed(1) : '0.0';
              
              let content = `
                <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${hotel}</div>
                  <div style="font-size: 13px; margin-bottom: 8px;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: #6B7280;">Total Open Charges:</span> 
                      <span style="color: #1F2937; font-weight: 600;">${fmt(total)} BGN</span>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Breakdown by Period:</div>
              `;
              
              const categories = ['1-7 days', '6-14 days', '15-30 days', '31-60 days', '61-90 days', 'over 90 days'];
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];
              
              params.forEach((param: any, index: number) => {
                const value = param.value || 0;
                content += `
                  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                    <span style="color: ${colors[index]};">■ ${categories[index]}:</span>
                    <span style="font-weight: 600;">${fmt(value)} BGN (${pct(value)}%)</span>
                  </div>
                `;
              });
              
              content += `
                  </div>
                </div>
              `;
              
              return content;
            }
          }
        );
      
      case 'rooms-not-available':
        return createDatasetBarConfig(
          dataSource || [],
          [
            { name: 'From Campaign Start until Yesterday', color: '#10B981' },
            { name: 'From Today until Campaign End', color: '#F59E0B' }
          ]
        );
      
      default:
        return {};
    }
  };

  const getLegend = () => {
    switch (type) {
      case 'payables':
        return [
          { color: '#3B82F6', label: 'Accrual Ledger' },
          { color: '#10B981', label: 'Invoice Ledger' }
        ];
      
      case 'receivables':
        return [
          { color: '#3B82F6', label: 'Guest Ledger' },
          { color: '#10B981', label: 'City Ledger' }
        ];
      
      case 'aging-payables':
      case 'aging-receivables':
        return [
          { color: '#10B981', label: '0-30 days' },
          { color: '#F59E0B', label: '31-60 days' },
          { color: '#EF4444', label: '61+ days' }
        ];
      
      case 'post-departure':
        return [
          { color: '#3B82F6', label: '1-7 days' },
          { color: '#10B981', label: '6-14 days' },
          { color: '#F59E0B', label: '15-30 days' },
          { color: '#EF4444', label: '31-60 days' },
          { color: '#8B5CF6', label: '61-90 days' },
          { color: '#6B7280', label: 'over 90 days' }
        ];
      
      case 'rooms-not-available':
        return [
          { color: '#10B981', label: 'PTD' },
          { color: '#F59E0B', label: 'OTB' }
        ];
      
      default:
        return [];
    }
  };

  return (
    <BaseChart
      title={title}
      onHelpClick={onHelpClick}
      chartOptions={getChartConfig()}
      height="300px"
      legend={getLegend()}
      className={className}
      showVatBadge={showVatBadge}
    />
  );
};

export default FinancialChart;