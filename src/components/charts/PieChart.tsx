import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC = () => {
  const data = {
    labels: ['Passwords', 'Documents', 'Bank Info', 'Notes', 'Keys'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
        ],
        borderColor: [
          '#DC2626',
          '#D97706',
          '#059669',
          '#2563EB',
          '#7C3AED',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          },
          padding: 20
        }
      },
    },
  };

  return (
    <div className="h-64">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;