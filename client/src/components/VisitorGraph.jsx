import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const VisitorGraph = () => {
    const [selectedYear, setSelectedYear] = useState('2020');

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                type: 'bar',
                label: 'Sales',
                data: [50000, 60000, 75000, 72000, 81000, 88000],
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderRadius: 6,
            },
            {
                type: 'line',
                label: 'Revenue',
                data: [45000, 58000, 73000, 70000, 79000, 85000],
                borderColor: '#1D4ED8',
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#1D4ED8',
                pointRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `$${tooltipItem.raw.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                    color: '#4B5563',
                    font: { size: 12 },
                },
            },
            x: {
                ticks: {
                    color: '#4B5563',
                    font: { size: 12 },
                },
            },
        },
    };

    return (
        <div className="p-4 bg-blue-50 shadow-md rounded-2xl w-full h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Unique Visitor Graph</h2>
                <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">$620,076</h2>
                    <h6 className="mt-1 text-sm font-medium text-gray-600">MRR Growth</h6>
                    <p className="text-xs text-gray-500">
                        Monthly recurring revenue growth.{' '}
                        <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                    </p>
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">$1,120</h2>
                    <h6 className="mt-1 text-sm font-medium text-gray-600">Avg. MRR/Customer</h6>
                    <p className="text-xs text-gray-500">
                        Revenue per customer monthly/yearly.{' '}
                        <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-full max-h-[300px] min-h-[200px] relative">
                <Chart type="bar" data={data} options={options} />
            </div>
        </div>
    );
};

export default VisitorGraph;