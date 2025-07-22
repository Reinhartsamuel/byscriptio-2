"use client";
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RadarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Normalize data to a 0-100 scale
      const normalize = (value, min, max) => {
        return ((value - min) / (max - min)) * 100;
      };

      // Define min/max for each metric (adjust as needed)
      const pnlUsdMin = 0;
      const pnlUsdMax = 100000; // Adjust based on expected PnL range (e.g., 100k USD)
      const maxDrawdownMin = 0;
      const maxDrawdownMax = 100; // Adjust if drawdown can exceed 100%

      const normalizedData = [
        parseFloat(data?.winRate), // Win Rate is already in 0-100 scale
        normalize(parseFloat(data?.pnlUsd), pnlUsdMin, pnlUsdMax),
        normalize(data?.maxDrawdown, maxDrawdownMin, maxDrawdownMax),
      ];

      const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Win Rate (%)', 'Pnl (USD)', 'Max Drawdown (%)'],
          datasets: [{
            label: 'Trading Metrics',
            data: normalizedData,
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true,
                color: 'white'
              },
              grid: {
                color: 'rgba(128, 128, 128, 0.5)'
              },
              pointLabels: {
                color: 'white',
                callback: (value, index) => {
                  // Customize labels to show original values
                  if (index === 0) return `Win Rate: ${data?.winRate}%`;
                  if (index === 1) return `PnL: ${parseFloat(data?.pnlPercent).toLocaleString()}%`;
                  if (index === 2) return `Max DD: ${data?.maxDrawdown}%`;
                  return value;
                }
              },
              ticks: {
                backdropColor: 'transparent',
                color: 'white',
                callback: (value) => {
                  // Hide tick labels (or customize if needed)
                  return '';
                }
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });

      return () => {
        radarChart.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default RadarChart;
