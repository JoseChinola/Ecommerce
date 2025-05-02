import { useEffect, useRef, useState } from 'react';
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    DoughnutController
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, DoughnutController);

const CountryDistribution = ({ data }) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const colors = ['#00d0de', '#873efe', '#fc6161', '#eee500', '#ec4dbc', '#0f8bfd', '#9ca3af'];

    // 1) Solo con data: quito el loading tan pronto llega array no vacío
    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setLoading(false);
        }
    }, [data]);

    // 2) Cuando loading ya es false y el canvas ya está montado, dibujo la gráfica
    useEffect(() => {
        if (loading) return;              // espero a que loading pase a false
        if (!chartRef.current) return;    // y a que el canvas exista

        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(item => item.city),
                datasets: [{
                    data: data.map(item => item.percentage),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 0,
                }]
            },
            options: {
                cutout: '70%',
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { boxWidth: 15, padding: 12 }
                    },
                },
            }
        });

        return () => chart.destroy();
    }, [loading, data]);

    if (loading) {
        return (
            <div className="bg-blue-50 rounded-xl shadow-md p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                </div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-8"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 rounded-xl shadow-md p-4">
            <div className="font-semibold text-lg mb-4">Distribución por Ciudad</div>
            <div className="flex justify-center mb-4">
                <canvas ref={chartRef} width="300" height="300" />
            </div>
            <ul className="px-2 py-1 space-y-1">
                {data.map((c, idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                    backgroundColor: colors[idx % colors.length],
                                    boxShadow: `${colors[idx % colors.length]}4D 0px 0px 10px`
                                }}
                            />
                            <span>{c.city}</span>
                        </div>
                        <span>{c.percentage}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CountryDistribution;