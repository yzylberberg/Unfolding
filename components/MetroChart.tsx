// components/MetroChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MetroStation, METRO_COLORS } from '@/types/metro';
import { getStationsOnly } from '@/lib/dataUtils';

interface MetroChartProps {
  data: MetroStation[];
  characteristic: string;
  characteristicName: string;
  characteristicUnit?: string;
  lineName: string;
  parisAverage?: number;
  showStationsOnly?: boolean;
}

export default function MetroChart({
  data,
  characteristic,
  characteristicName,
  characteristicUnit,
  lineName,
  parisAverage,
  showStationsOnly = false,
}: MetroChartProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  
  // Get line color first
  const lineColor = METRO_COLORS[lineName] || '#999999';
  
  // Prepare data for the chart
  const chartData = showStationsOnly ? getStationsOnly(data) : data;
  
  const seriesData = chartData
    .filter(station => typeof station[characteristic] === 'number' && station[characteristic] !== -9999)
    .map(station => {
      const isStation = station.name_station && station.name_station.trim() !== '';
      return {
        x: Number(station.distance_origin),
        y: station[characteristic] as number,
        name: station.name_station || undefined,
        isStation: isStation,
        marker: {
          radius: isStation ? 6 : 2, // Larger dots for stations, smaller for intermediate points
          fillColor: lineColor,
        }
      };
    });
  
  // Calculate smoothed data using moving average (window size = 5)
  const smoothedData = seriesData.map((point, index, arr) => {
    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(0, index - halfWindow);
    const end = Math.min(arr.length, index + halfWindow + 1);
    const windowData = arr.slice(start, end);
    const avg = windowData.reduce((sum, p) => sum + p.y, 0) / windowData.length;
    
    return {
      x: point.x,
      y: avg,
      name: point.name,
    };
  });
  
  // Get station positions for labels below the chart
  const stationPositions = getStationsOnly(data).map(station => ({
    value: Number(station.distance_origin),
    label: station.name_station,
  }));
  
  const options: Highcharts.Options = {
    chart: {
      type: showStationsOnly ? 'column' : 'line',
      height: 500,
      backgroundColor: '#1e3a5f',
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      },
    },
    title: {
      text: `${characteristicName} along ${lineName.replace('METRO ', 'line ')}`,
      style: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: 'bold',
      },
    },
    subtitle: {
      text: '',
    },
    xAxis: {
      title: {
        text: 'Distance to origin (West-East, or South-North orientation)',
        style: {
          color: '#ffffff',
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          color: '#ffffff',
          fontSize: '12px',
        },
      },
      gridLineColor: '#3a5a7f',
      lineColor: '#ffffff',
      tickColor: '#ffffff',
      plotLines: stationPositions.map((station) => ({
        color: '#5a7a9f',
        width: 1,
        value: station.value,
        dashStyle: 'Dash',
        label: {
          text: station.label,
          rotation: 15, // 15 degree angle
          align: 'left',
          verticalAlign: 'top',
          y: 15,
          style: {
            fontSize: '11px',
            color: '#a0c0e0', // Lighter blue for readability
          },
        },
        zIndex: 2,
      })),
    },
    yAxis: {
      title: {
        text: `${characteristicName}${characteristicUnit ? ` (${characteristicUnit})` : ''}`,
        style: {
          color: '#ffffff',
          fontSize: '14px',
        },
      },
      labels: {
        style: {
          color: '#ffffff',
          fontSize: '12px',
        },
      },
      gridLineColor: '#3a5a7f',
      plotLines: parisAverage !== undefined ? [
        {
          color: '#FF6B6B',
          width: 2,
          value: parisAverage,
          dashStyle: 'ShortDash',
          label: {
            text: `Average: ${parisAverage.toFixed(2)}`,
            align: 'right',
            style: {
              color: '#FF6B6B',
              fontWeight: 'bold',
              fontSize: '13px',
            },
          },
          zIndex: 5,
        },
      ] : [],
    },
    series: [
      // Actual data - thinner line
      {
        type: showStationsOnly ? 'column' : 'line',
        name: `${characteristicName} (actual)`,
        data: seriesData,
        color: lineColor,
        opacity: 0.6,
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle',
        },
        lineWidth: 1.5,
        showInLegend: false,
      },
      // Smoothed data - bolder line
      {
        type: 'line',
        name: `${characteristicName} (smoothed)`,
        data: smoothedData,
        color: lineColor,
        marker: {
          enabled: false,
        },
        lineWidth: 4,
        showInLegend: false,
      },
    ],
    tooltip: {
      backgroundColor: '#2a4a6f',
      borderColor: '#ffffff',
      style: {
        color: '#ffffff',
        fontSize: '13px',
      },
      formatter: function() {
        const point = this.point as any;
        return `
          <b>${point.name || 'Intermediate point'}</b><br/>
          Distance: ${point.x.toFixed(2)} km<br/>
          ${characteristicName}: <b>${point.y.toFixed(2)}</b>${characteristicUnit ? ` ${characteristicUnit}` : ''}
        `;
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };
  
  return (
    <div className="w-full bg-[#1e3a5f] rounded-lg shadow-lg p-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
}
