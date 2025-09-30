import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { HelpCircle } from 'lucide-react';
import DrillDownIcon from './DrillDownIcon';
import { useHotelSelection, useCurrentPeriod } from '../hooks/useHotelSelection';

const WeeklyPickupChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedHotels } = useHotelSelection();
  const currentPeriod = useCurrentPeriod('rooms-explorer');

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // === КОНФИГУРАЦИЯ НА ДИАПАЗОНА БАЗИРАН НА ПЕРИОД НА ПРЕСТОЙ ===
    // Вземаме началната дата на периода на престой и отиваме 12 месеца назад
    let stayPeriodStart = new Date();
    if (currentPeriod?.startDate) {
      stayPeriodStart = new Date(currentPeriod.startDate);
    }
    
    // 12 месеца преди началото на периода на престой
    const analysisStart = new Date(stayPeriodStart);
    analysisStart.setMonth(analysisStart.getMonth() - 12);
    
    // Намираме понеделника на седмицата, която съдържа analysisStart
    const startMonday = new Date(analysisStart);
    const dayOfWeek = startMonday.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = Sunday
    startMonday.setDate(startMonday.getDate() - daysToMonday);
    
    // Изчисляваме колко седмици до днес
    const today = new Date();
    const weeksCount = Math.ceil((today.getTime() - startMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 2;

    // помощни
    function addDays(d: Date, n: number) { 
      const x = new Date(d); 
      x.setDate(x.getDate() + n); 
      return x; 
    }

    function fmtWeekLabel(mondayDate: Date) {
      const d = new Date(Date.UTC(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      
      // Кратък формат за X-axis
      return `W${String(weekNo).padStart(2, '0')}`;
    }

    // Пълен формат за tooltip
    function fmtWeekLabelFull(mondayDate: Date) {
      const d = new Date(Date.UTC(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      
      const sunday = new Date(mondayDate);
      sunday.setDate(sunday.getDate() + 6);
      
      const formatDate = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month} ${year}`;
      };
      
      return `Week ${String(weekNo).padStart(2, '0')} (${formatDate(mondayDate)} - ${formatDate(sunday)})`;
    }

    // Добавяме "Before" период като първи елемент
    const weeks = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabel(addDays(startMonday, i * 7)))];
    const weeksFullLabels = ['Before', ...Array.from({ length: weeksCount }, (_, i) => fmtWeekLabelFull(addDays(startMonday, i * 7)))];

    // изчисляваме cutoffIdx по дата (не по етикет), за да режем Current след „днешната" седмица
    let cutoffIdx = Math.floor((today.getTime() - startMonday.getTime()) / (7 * 24 * 3600 * 1000)) + 1; // +1 заради "Before"
    if (cutoffIdx < 1) cutoffIdx = 0; // ако днес е преди диапазона → няма current
    if (cutoffIdx > weeks.length - 1) cutoffIdx = weeks.length - 1; // ако днес е след диапазона → целият диапазон е валиден за current

    // helper: след cutoff → null (за да няма линия)
    const padAfter = (arr: number[], cutoff: number) => arr.map((v, i) => i <= cutoff ? v : null);

    // ===== DEMO ДАННИ (Pickup по СЕДМИЦИ, BGN) =====
    // Генерираме данни за всички седмици + Before период
    const generateWeeklyData = (baseValue: number, variance: number = 0.2) => {
      const data = [baseValue * 0.3]; // Before период - по-малка стойност
      for (let i = 0; i < weeksCount; i++) {
        const seasonalFactor = 1 + 0.3 * Math.sin((i / weeksCount) * 2 * Math.PI); // Сезонност
        const randomFactor = 1 + (Math.random() - 0.5) * variance;
        data.push(baseValue * seasonalFactor * randomFactor);
      }
      return data;
    };
    
    const revCurFull = generateWeeklyData(130000, 0.15);
    const revLY = generateWeeklyData(120000, 0.18);
    const revBud = generateWeeklyData(135000, 0.12);

    // Доп. метрики (за tooltip) – съкратени до weeksCount
    const rnCurFull = generateWeeklyData(1200, 0.15);
    const rnLY = generateWeeklyData(1150, 0.18);
    const rnBud = generateWeeklyData(1250, 0.12);

    const avgGuestsPerRoomCurFull = generateWeeklyData(2.18, 0.05);
    const avgGuestsPerRoomLY = generateWeeklyData(2.15, 0.05);
    const avgGuestsPerRoomBud = generateWeeklyData(2.20, 0.05);

    const avgLOS_CurFull = generateWeeklyData(3.1, 0.08);
    const avgLOS_LY = generateWeeklyData(3.0, 0.08);
    const avgLOS_Bud = generateWeeklyData(3.2, 0.08);

    const shareCurFull = generateWeeklyData(70, 0.08);
    const shareLY = generateWeeklyData(68, 0.08);
    const shareBud = generateWeeklyData(72, 0.08);

    // Изчисляеми
    const gn = (rn: number[], avgG: number[]) => rn.map((v, i) => Math.round(v * avgG[i]));
    const adr = (rev: number[], rn: number[]) => rev.map((v, i) => +(v / rn[i]).toFixed(2));
    const adrGuest = (rev: number[], gnArr: number[]) => rev.map((v, i) => +(v / gnArr[i]).toFixed(2));

    // Current → режем след cutoffIdx (пълно null занапред)
    const revCur = padAfter(revCurFull, cutoffIdx);
    const rnCur = padAfter(rnCurFull, cutoffIdx);
    const avgGCur = padAfter(avgGuestsPerRoomCurFull, cutoffIdx);
    const losCur = padAfter(avgLOS_CurFull, cutoffIdx);
    const shareCur = padAfter(shareCurFull, cutoffIdx);

    // Derived за Current с null след cutoff
    const gnCur = rnCur.map((v, i) => v == null || avgGCur[i] == null ? null : Math.round(v * avgGCur[i]));
    const adrRoomCur = revCur.map((v, i) => v == null || rnCur[i] == null ? null : +(v / rnCur[i]).toFixed(2));
    const adrGuestCur = revCur.map((v, i) => v == null || gnCur[i] == null ? null : +(v / gnCur[i]).toFixed(2));

    // LY & Budget (пълни)
    const gnLY = gn(rnLY, avgGuestsPerRoomLY);
    const gnBud = gn(rnBud, avgGuestsPerRoomBud);
    const adrRoomLY = adr(revLY, rnLY);
    const adrRoomBud = adr(revBud, rnBud);
    const adrGuestLY = adrGuest(revLY, gnLY);
    const adrGuestBud = adrGuest(revBud, gnBud);

    // Генерираме данни за stay weeks разпределение (за tooltip bar chart)
    const generateStayWeeksData = (salesWeekIndex: number) => {
      if (!currentPeriod?.startDate || !currentPeriod?.endDate) {
        return { current: [], prior: [], budget: [] };
      }

      const stayStart = new Date(currentPeriod.startDate);
      const stayEnd = new Date(currentPeriod.endDate);
      
      // Изчисляваме броя седмици в stay периода
      const stayWeeksCount = Math.ceil((stayEnd.getTime() - stayStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      // Генерираме разпределение на приходите по stay weeks
      const generateDistribution = (totalRevenue: number) => {
        const distribution = [];
        let remaining = totalRevenue;
        
        for (let i = 0; i < Math.min(stayWeeksCount, 12); i++) { // Максимум 12 седмици за визуализация
          const stayWeekStart = new Date(stayStart);
          stayWeekStart.setDate(stayWeekStart.getDate() + i * 7);
          
          const stayWeekEnd = new Date(stayWeekStart);
          stayWeekEnd.setDate(stayWeekEnd.getDate() + 6);
          
          // Сезонен фактор за различни седмици
          const seasonalFactor = 0.5 + 0.5 * Math.sin((i / stayWeeksCount) * Math.PI);
          const weekRevenue = (remaining * seasonalFactor * (0.8 + Math.random() * 0.4)) / (stayWeeksCount - i);
          
          remaining -= weekRevenue;
          
          distribution.push({
            week: fmtWeekLabelFull(stayWeekStart),
            revenue: Math.max(0, weekRevenue)
          });
        }
        
        return distribution;
      };

      const currentRevenue = revCur[salesWeekIndex] || 0;
      const priorRevenue = revLY[salesWeekIndex] || 0;
      const budgetRevenue = revBud[salesWeekIndex] || 0;

      return {
        current: generateDistribution(currentRevenue),
        prior: generateDistribution(priorRevenue),
        budget: generateDistribution(budgetRevenue)
      };
    };
    // ===== ВИЗУАЛИЗАЦИЯ (area line) =====
    const fmtMoney = (v: number | null) => v == null ? '-' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
    const fmtInt = (v: number | null) => v == null ? '-' : new Intl.NumberFormat('en-US').format(v);

    // Създаваме custom tooltip с bar chart
    const createTooltipBarChart = (salesWeekIndex: number) => {
      const stayWeeksData = generateStayWeeksData(salesWeekIndex);
      const maxRevenue = Math.max(
        ...stayWeeksData.current.map(d => d.revenue),
        ...stayWeeksData.prior.map(d => d.revenue),
        ...stayWeeksData.budget.map(d => d.revenue)
      );

      let chartHTML = `
        <div style="width: 500px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-weight: 600; margin-bottom: 8px; text-align: center;">
            Revenue Distribution by Stay Weeks<br/>
            <span style="font-size: 12px; color: #666; font-weight: normal;">Sales Week: ${weeksFullLabels[salesWeekIndex]}</span>
          </div>
          <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 12px; font-size: 11px;">
            <span style="color: #3B82F6;">■ Current</span>
            <span style="color: #6B7280;">■ Prior Year</span>
            <span style="color: #10B981;">■ Budget</span>
          </div>
          <div style="display: flex; align-items: end; height: 200px; border-bottom: 1px solid #e5e7eb; padding: 0 10px;">
      `;

      // Генерираме bar chart
      const maxBars = Math.min(stayWeeksData.current.length, 12); // Максимум 12 бара
      for (let i = 0; i < maxBars; i++) {
        const currentData = stayWeeksData.current[i];
        const priorData = stayWeeksData.prior[i];
        const budgetData = stayWeeksData.budget[i];

        if (!currentData) continue;

        const currentHeight = maxRevenue > 0 ? (currentData.revenue / maxRevenue) * 150 : 0;
        const priorHeight = maxRevenue > 0 ? (priorData.revenue / maxRevenue) * 150 : 0;
        const budgetHeight = maxRevenue > 0 ? (budgetData.revenue / maxRevenue) * 150 : 0;

        chartHTML += `
          <div style="display: flex; flex-direction: column; align-items: center; margin-right: 8px; flex: 1;">
            <div style="display: flex; align-items: end; height: 150px; margin-bottom: 4px;">
              <div style="width: 8px; background: #3B82F6; margin-right: 1px; height: ${currentHeight}px; border-radius: 2px 2px 0 0;" title="Current: ${fmtMoney(currentData.revenue)} BGN"></div>
              <div style="width: 8px; background: #6B7280; margin-right: 1px; height: ${priorHeight}px; border-radius: 2px 2px 0 0;" title="Prior: ${fmtMoney(priorData.revenue)} BGN"></div>
              <div style="width: 8px; background: #10B981; height: ${budgetHeight}px; border-radius: 2px 2px 0 0;" title="Budget: ${fmtMoney(budgetData.revenue)} BGN"></div>
            </div>
            <div style="font-size: 9px; text-align: center; writing-mode: vertical-rl; text-orientation: mixed; height: 30px; overflow: hidden;">
              ${currentData.week}
            </div>
          </div>
        `;
      }

      chartHTML += `
          </div>
          <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #666;">
            <div>
              <div><span style="color: #3B82F6;">■</span> Current: ${fmtMoney(stayWeeksData.current.reduce((sum, d) => sum + d.revenue, 0))} BGN</div>
              <div><span style="color: #6B7280;">■</span> Prior Year: ${fmtMoney(stayWeeksData.prior.reduce((sum, d) => sum + d.revenue, 0))} BGN</div>
              <div><span style="color: #10B981;">■</span> Budget: ${fmtMoney(stayWeeksData.budget.reduce((sum, d) => sum + d.revenue, 0))} BGN</div>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
            Shows how revenue from this sales week is distributed across stay weeks in the selected period
          </div>
        </div>
      `;

      return chartHTML;
    }

    const option = {
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: weeks,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          interval: 'auto',
          margin: 8
        }
      },
      yAxis: { 
        type: 'value', 
        name: 'Pickup (BGN)',
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        className: 'custom-tooltip',
        formatter: (params: any) => {
          const i = params[0].dataIndex;
          
          if (i === 0) {
            // За "Before" период показваме обикновен tooltip
            return `
              <div style="padding: 12px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Before Period</div>
                <div style="font-size: 12px;">
                  <div>Current: <b>${fmtMoney(revCur[i])} BGN</b></div>
                  <div>Prior Year: <b>${fmtMoney(revLY[i])} BGN</b></div>
                  <div>Budget: <b>${fmtMoney(revBud[i])} BGN</b></div>
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #666;">
                  Aggregated data before analysis period
                </div>
              </div>
            `;
          } else {
            // За седмичните данни показваме bar chart
            return createTooltipBarChart(i);
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: { 
        data: ['Pickup — Current', 'Pickup — Last Year', 'Pickup — Budget'],
        bottom: 10
      },
      grid: {
        left: 70,
        right: 20,
        top: 20,
        bottom: 120
      },
      series: [
        { 
          name: 'Pickup — Current', 
          type: 'line', 
          smooth: true, 
          showSymbol: false,
          areaStyle: { opacity: 0.3 }, 
          data: revCur,
          itemStyle: { color: '#3B82F6' },
          areaStyle: { color: '#3B82F6', opacity: 0.2 }
        },
        { 
          name: 'Pickup — Last Year', 
          type: 'line', 
          smooth: true, 
          showSymbol: false,
          areaStyle: { opacity: 0.3 }, 
          data: revLY,
          itemStyle: { color: '#6B7280' },
          areaStyle: { color: '#6B7280', opacity: 0.2 }
        },
        { 
          name: 'Pickup — Budget', 
          type: 'line', 
          smooth: true, 
          showSymbol: false,
          areaStyle: { opacity: 0.3 }, 
          data: revBud,
          itemStyle: { color: '#10B981' },
          areaStyle: { color: '#10B981', opacity: 0.2 }
        }
      ]
    };

    chart.setOption(option);

    // Resize handler
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [selectedHotels, currentPeriod]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Pickup Analysis</h3>
        <div className="flex items-center space-x-2">
          <DrillDownIcon context="chart" />
          <button
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            title="Помощ за Weekly Pickup Analysis"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        <div className="mt-4 text-xs text-gray-500">
          <p>• <strong>Before</strong> period shows aggregated data before the analysis period</p>
          <p>• <strong>Current</strong> data is cut off after the current week (today's week)</p>
          <p>• Hover over data points to see detailed metrics for each week</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPickupChart;