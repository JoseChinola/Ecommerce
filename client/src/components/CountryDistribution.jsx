import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, DoughnutController } from 'chart.js'; // Importa los elementos necesarios

// Registra el controlador de Doughnut y los demás componentes necesarios
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, DoughnutController);

const CountryDistribution = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current;
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['USA', 'China', 'Japan', 'Australia', 'India', 'Russia', 'Others'],
                datasets: [{
                    data: [25, 20, 17, 15, 10, 8, 5],
                    backgroundColor: [
                        '#00d0de', '#873efe', '#fc6161',
                        '#eee500', '#ec4dbc', '#0f8bfd', '#9ca3af'
                    ],
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
                        labels: {
                            boxWidth: 15, // Reduce el tamaño del cuadro en la leyenda
                            padding: 12 // Reduce el padding entre los elementos de la leyenda
                        }
                    },
                },
            }
        });

        return () => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        };
    }, []);

    const countries = [
        { name: 'United States of America', color: '#00d0de', value: '25%' },
        { name: 'China', color: '#873efe', value: '20%' },
        { name: 'Japan', color: '#fc6161', value: '17%' },
        { name: 'Australia', color: '#eee500', value: '15%' },
        { name: 'India', color: '#ec4dbc', value: '10%' },
        { name: 'Russian Federation', color: '#0f8bfd', value: '8%' },
        { name: 'Others', color: '#9ca3af', value: '5%' }
    ];

    return (
        <div className="bg-blue-50 rounded-xl shadow-md p-4">
            <div className="font-semibold text-lg mb-4">Country Distributions</div>
            <div className="flex justify-center mb-4">
                {/* Ajusta el tamaño del contenedor del gráfico */}
                <div className="w-full h-full">
                    <canvas ref={chartRef} width="150" height="150" />
                </div>
            </div>
            <ul className="px-2 py-1 space-y-1">
                {countries.map((c, idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 border-b border-gray-200 text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: c.color, boxShadow: `${c.color}4D 0px 0px 10px` }}></div>
                            <span>{c.name}</span>
                        </div>
                        <span>{c.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CountryDistribution;
