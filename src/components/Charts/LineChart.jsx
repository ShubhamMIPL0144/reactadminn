import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales Data',
        data: [65, 59, 80, 81, 56],
        fill: false, // Don't fill area under the line
        borderColor: 'blue', // Line color
        tension: 0.3, // Line curve tension
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Line Chart Example</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
