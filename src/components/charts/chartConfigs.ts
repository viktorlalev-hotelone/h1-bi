// Chart configuration factory functions

export const createStackedBarConfig = (
  data: any[],
  series: Array<{ name: string; dataKey: string; color: string }>,
  options: {
    showTotal?: boolean;
    tooltipFormatter?: (params: any) => string;
  } = {}
) => {
  const { showTotal = true, tooltipFormatter } = options;

  return {
    title: { show: false },
    legend: { show: false },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: tooltipFormatter || ((params: any) => {
        const hotel = params[0].axisValueLabel;
        const values = series.map(s => {
          const param = params.find((p: any) => p.seriesName === s.name);
          return param ? param.value : 0;
        });
        const total = values.reduce((sum: number, val: number) => sum + val, 0);
        
        const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
        const lines = [`<b>${hotel}</b>`, `Total: <b>${fmt(total)}</b>`];
        
        series.forEach((s, i) => {
          const value = values[i];
          const percentage = total ? ((value / total) * 100).toFixed(1) : '0';
          lines.push(`${s.name}: ${fmt(value)} (${percentage}%)`);
        });
        
        return lines.join('<br/>');
      })
    },
    grid: {
      left: 70,
      right: 80,
      top: 20,
      bottom: 16,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: (v: number) => v.toLocaleString('bg-BG')
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        fontSize: 12,
        margin: 8
      }
    },
    series: series.map((s, index) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: data.map(item => item[s.dataKey]),
      barWidth: '45%',
      itemStyle: { color: s.color },
      emphasis: { focus: 'series' },
      label: index === series.length - 1 && showTotal ? {
        show: true,
        position: 'right',
        fontSize: 12,
        formatter: (params: any) => {
          const item = data[params.dataIndex];
          const total = series.reduce((sum, ser) => sum + item[ser.dataKey], 0);
          return total.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
        },
        color: '#374151'
      } : { show: false },
      labelLayout: { hideOverlap: true }
    })),
    animation: false
  };
};

export const createAgingBarConfig = (
  data: any[],
  agingBuckets: Array<{ name: string; dataKey: string; color: string }>,
  options: {
    tooltipFormatter?: (params: any) => string;
  } = {}
) => {
  const { tooltipFormatter } = options;
  
  return createStackedBarConfig(data, agingBuckets, {
    tooltipFormatter: tooltipFormatter || ((params: any) => {
      const hotel = params[0].axisValueLabel;
      const values = agingBuckets.map(bucket => {
        const param = params.find((p: any) => p.seriesName === bucket.name);
        return param ? param.value : 0;
      });
      const total = values.reduce((sum: number, val: number) => sum + val, 0);
      
      const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
      const lines = [`<b>${hotel}</b>`, `Total: <b>${fmt(total)}</b>`];
      
      agingBuckets.forEach((bucket, i) => {
        const value = values[i];
        const percentage = total ? ((value / total) * 100).toFixed(1) : '0';
        lines.push(`${bucket.name}: ${fmt(value)} (${percentage}%)`);
      });
      
      return lines.join('<br/>');
    })
  });
};

export const createDatasetBarConfig = (
  dataSource: any[][],
  seriesConfig: Array<{ name: string; color?: string }>,
  options: {
    tooltipFormatter?: (params: any) => string;
    labelFormatter?: (params: any) => string;
  } = {}
) => {
  const { tooltipFormatter, labelFormatter } = options;

  return {
    title: { show: false },
    legend: { show: false },
    grid: { left: 70, right: 80, top: 20, bottom: 16, containLabel: true },
    dataset: { source: dataSource },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      confine: true,
      formatter: tooltipFormatter
    },
    xAxis: {
      type: 'value',
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        fontSize: 12,
        margin: 8
      }
    },
    series: seriesConfig.map((config, index) => ({
      name: config.name,
      type: 'bar',
      stack: 'sum',
      encode: { x: config.name, y: dataSource[0][0] },
      barWidth: '45%',
      itemStyle: config.color ? { color: config.color } : undefined,
      label: index === seriesConfig.length - 1 ? {
        show: true,
        position: 'right',
        fontSize: 12,
        formatter: labelFormatter || ((params: any) => {
          const values = params.value.slice(1);
          const total = values.reduce((sum: number, val: number) => sum + (val || 0), 0);
          return total.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
        }),
        color: '#374151'
      } : { show: false },
      labelLayout: { hideOverlap: true }
    })),
    animation: false
  };
};

export const createStackedBarWithDailyBreakdownConfig = (
  weeklyData: Array<{
    week: string;
    weekPeriod: string;
    totalNights: number;
    percentageShare: number;
    dailyBreakdown: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
  }>,
  options: {
    tooltipFormatter?: (params: any) => string;
  } = {}
) => {
  const { tooltipFormatter } = options;

  const dayColors = {
    monday: '#3B82F6',
    tuesday: '#10B981',
    wednesday: '#F59E0B',
    thursday: '#EF4444',
    friday: '#8B5CF6',
    saturday: '#06B6D4',
    sunday: '#84CC16'
  };

  return {
    title: { show: false },
    legend: { 
      show: true,
      bottom: 10,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      textStyle: { fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: tooltipFormatter || ((params: any) => {
        const weekIndex = params[0].dataIndex;
        const weekData = weeklyData[weekIndex];
        
        const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
        
        let content = `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="font-weight: 600; margin-bottom: 8px; color: #1F2937;">${weekData.week}</div>
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">${weekData.weekPeriod}</div>
            <div style="font-size: 13px; margin-bottom: 8px;">
              <div style="margin-bottom: 4px;">
                <span style="color: #6B7280;">Total Room Nights:</span> 
                <span style="color: #1F2937; font-weight: 600;">${fmt(weekData.totalNights)}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="color: #6B7280;">Share of Yesterday's Bookings:</span> 
                <span style="color: #3B82F6; font-weight: 600;">${weekData.percentageShare.toFixed(1)}%</span>
              </div>
            </div>
            <div style="border-top: 1px solid #E5E7EB; padding-top: 8px;">
              <div style="font-size: 11px; color: #6B7280; margin-bottom: 4px; font-weight: 600;">Daily Breakdown:</div>
        `;
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        days.forEach((day, index) => {
          const nights = weekData.dailyBreakdown[day as keyof typeof weekData.dailyBreakdown];
          const percentage = weekData.totalNights ? ((nights / weekData.totalNights) * 100).toFixed(1) : '0';
          const color = dayColors[day as keyof typeof dayColors];
          content += `
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: ${color};">■ ${dayLabels[index]}:</span>
              <span style="font-weight: 600;">${fmt(nights)} nights (${percentage}%)</span>
            </div>
          `;
        });
        
        content += `
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #9CA3AF;">
              Room nights booked yesterday for this week
            </div>
          </div>
        `;
        
        return content;
      })
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weeklyData.map(item => item.week),
      axisLabel: {
        fontSize: 10,
        rotate: 45,
        interval: 0,
        margin: 8
      }
    },
    yAxis: {
      type: 'value',
      name: 'Room Nights',
      nameTextStyle: { fontSize: 11 },
      axisLabel: {
        fontSize: 10,
        formatter: (value: number) => {
          if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
          return value.toString();
        }
      }
    },
    series: [
      {
        name: 'Mon',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.monday),
        itemStyle: { color: dayColors.monday }
      },
      {
        name: 'Tue',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.tuesday),
        itemStyle: { color: dayColors.tuesday }
      },
      {
        name: 'Wed',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.wednesday),
        itemStyle: { color: dayColors.wednesday }
      },
      {
        name: 'Thu',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.thursday),
        itemStyle: { color: dayColors.thursday }
      },
      {
        name: 'Fri',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.friday),
        itemStyle: { color: dayColors.friday }
      },
      {
        name: 'Sat',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.saturday),
        itemStyle: { color: dayColors.saturday }
      },
      {
        name: 'Sun',
        type: 'bar',
        stack: 'total',
        data: weeklyData.map(item => item.dailyBreakdown.sunday),
        itemStyle: { color: dayColors.sunday }
      }
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut'
  };
};

export const createWaterfallConfig = (
  data: Array<{ name: string; value: number; color: string; type: 'positive' | 'negative' | 'total' }>,
  options: {
    showConnectors?: boolean;
    tooltipFormatter?: (params: any) => string;
  } = {}
) => {
  const { showConnectors = true, tooltipFormatter } = options;

  // Calculate running totals for waterfall effect
  let runningTotal = 0;
  const processedData = data.map((item, index) => {
    const startValue = runningTotal;
    runningTotal += item.value;
    
    return {
      name: item.name,
      value: item.value,
      color: item.color,
      type: item.type,
      startValue,
      endValue: runningTotal,
      absoluteValue: Math.abs(item.value)
    };
  });

  // Create invisible bars (for positioning)
  const invisibleBars = processedData.map(item => 
    item.value >= 0 ? item.startValue : item.endValue
  );

  // Create visible bars (actual values)
  const visibleBars = processedData.map(item => item.absoluteValue);

  // Create connector line data
  const connectorData = processedData.map(item => item.endValue);

  return {
    title: { show: false },
    legend: { show: false },
    grid: {
      left: 80,
      right: 40,
      top: 40,
      bottom: 60,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: tooltipFormatter || ((params: any) => {
        const dataIndex = params[0].dataIndex;
        const item = processedData[dataIndex];
        const fmt = (n: number) => n.toLocaleString('bg-BG', { maximumFractionDigits: 0 });
        
        return `
          <div style="padding: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px;">${item.name}</div>
            <div style="font-size: 14px;">
              <div>Value: <b>${fmt(item.value)} BGN</b></div>
              <div>Running Total: <b>${fmt(item.endValue)} BGN</b></div>
            </div>
          </div>
        `;
      })
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontSize: 11,
        interval: 0,
        margin: 8
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (BGN)',
      nameTextStyle: { fontSize: 12 },
      axisLabel: {
        fontSize: 11,
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
    series: [
      // Invisible bars for positioning
      {
        name: 'Invisible',
        type: 'bar',
        stack: 'total',
        data: invisibleBars,
        itemStyle: { color: 'transparent' },
        emphasis: { itemStyle: { color: 'transparent' } },
        tooltip: { show: false },
        silent: true
      },
      // Visible bars with colors
      {
        name: 'Values',
        type: 'bar',
        stack: 'total',
        data: processedData.map(item => ({
          value: item.absoluteValue,
          itemStyle: { color: item.color }
        })),
        barWidth: '60%',
        emphasis: { focus: 'series' }
      },
      // Connector line
      ...(showConnectors ? [{
        name: 'Running Total',
        type: 'line',
        data: connectorData,
        lineStyle: {
          color: '#6B7280',
          width: 2,
          type: 'dashed'
        },
        symbol: 'circle',
        symbolSize: 4,
        itemStyle: { color: '#6B7280' },
        tooltip: { show: false }
      }] : [])
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
};