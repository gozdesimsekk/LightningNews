'use client';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const NewsChart = ({ data }) => {
  const [selectedSource, setSelectedSource] = useState('all');

  const filteredData = selectedSource === 'all'
    ? data
    : data.filter(d => d.sources.includes(selectedSource));

  const maxCount = Math.max(...filteredData.map(d => d.count));

  const chartData = {
    labels: filteredData.map(d => d.hour),
    datasets: [
      {
        label: 'Number of News Articles',
        data: filteredData.map(d => d.count),
        backgroundColor: filteredData.map((_, index) =>
          filteredData[index].count === maxCount
            ? 'rgba(255, 99, 132, 0.8)'
            : `rgba(${75 + index * 30}, 192, 192, 0.6)`
        ),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)',
        hoverBorderColor: 'rgba(255, 159, 64, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Hourly News',
        font: {
          size: 18,
          family: 'Arial',
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(200, 200, 200, 0.8)',
        borderWidth: 1,
        callbacks: {
          title: (tooltipItem) => {
            const hour = tooltipItem[0].label;
            const hourData = filteredData.find(d => d.hour === hour);
            return `${hour} - Sources: ${hourData.sources.join(', ')}`;
          },
          label: (tooltipItem) => {
            const currentCount = tooltipItem.raw;
            const previousCount = filteredData[tooltipItem.dataIndex - 1]?.count || 0;
            const change = previousCount ? ((currentCount - previousCount) / previousCount * 100).toFixed(2) : 0;
            return `News Count: ${currentCount} (${change > 0 ? `+${change}%` : `${change}%`})`;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#000',
        align: 'top',
        font: {
          weight: 'bold',
        },
        formatter: (value) => `${value}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hours of the Day',
          color: '#333',
          font: {
            size: 16,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of News Articles',
          color: '#333',
          font: {
            size: 16,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ height: '350px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default NewsChart;
