// Import necessary libraries
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Register the required components with Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Count Byte Distribution Function
const countByteDistribution = (data) => {
  const distribution = Array(256).fill(0);
  data.forEach((byte) => {
    distribution[byte]++;
  });
  return distribution;
};

// Chart Component
const ByteDistributionChart = ({ data }) => {
  // Calculate byte distribution
  const distribution = countByteDistribution(data);

  // Prepare data for Chart.js
  const chartData = {
    labels: Array.from({ length: 256 }, (_, i) => i), // Labels from 0 to 255
    datasets: [
      {
        label: "Byte Distribution",
        data: distribution,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for bars
        borderColor: "rgba(75, 192, 192, 1)", // Border color for bars
        borderWidth: 1, // Border width for bars
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: "Byte Distribution Chart", // Title of the chart
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Byte Values", // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency", // Y-axis label
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ByteDistributionChart;
