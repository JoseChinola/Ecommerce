import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts';
import { FaTshirt, FaUmbrella, FaCouch, FaPaintBrush } from 'react-icons/fa';

// 1) Skeleton de carga
const Skeleton = () => (
    <div className="bg-gray-200 rounded-2xl p-6 shadow-md h-full animate-pulse">
        <div className="w-1/3 h-6 bg-gray-300 mb-4" />
        <div className="w-full h-40 bg-gray-300" />
    </div>
);

// 2) Mapeo de iconos por categoría
const categoryIcons = {
    textiles: <FaTshirt />,
    carpa: <FaUmbrella />,
    mobiliario: <FaCouch />,
    decoracion: <FaPaintBrush />
};

// 3) Tooltip personalizado
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white p-2 rounded shadow text-sm">
            <p className="font-semibold mb-2">{label}</p>
            {payload.map((entry) => {
                const iconKey = entry.payload.icons?.[entry.name];
                const Icon = categoryIcons[iconKey?.toLowerCase()];

                return (
                    <div key={entry.name} className="flex items-center mb-1">
                        {Icon && (
                            <span className="mr-2">
                                {React.cloneElement(Icon, {
                                    style: { fontSize: '20px', color: entry.color || '#000' },
                                })}
                            </span>
                        )}
                        <span className='capitalize text-[#8884d8] mr-2'>{entry.name}</span>
                        <span className='capitalize text-[#8884d8]'>{`${entry.value}`}</span>
                    </div>
                );
            })}
        </div>
    );
};

// 4) Definición de TriangleBar
const getPath = (x, y, width, height) =>
    `M${x},${y + height}
   C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2},${y}
   C${x + width / 2},${y + height / 3}
    ${x + (2 * width) / 3},${y + height} ${x + width},${y + height}
   Z`;

const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

// 5) Mapeo de iconos por semana
const getIconForWeek = (weekNumber) => {
    const icons = [<FaTshirt />, <FaUmbrella />, <FaCouch />, <FaPaintBrush />];
    return icons[weekNumber % icons.length];
};

// 6) Tick personalizado en eje X
const CustomizedAxisTick = ({ x, y, payload }) => {
    const weekNumber = parseInt(payload.value.split(' ')[1], 10);
    const Icon = getIconForWeek(weekNumber);

    return (
        <g transform={`translate(${x + -16},${y + 1})`}>
            {React.cloneElement(Icon, {
                style: { fontSize: '40px', color: '#8884d8' }
            })}

            {/* <text
                x={-40}
                y={20}  // posición debajo del ícono (ajusta según tu diseño)
                textAnchor="middle"
                fill="#333"
                fontSize="12"
            >
                {payload.value}
            </text> */}
        </g>
    );
};

// Componente principal
const SalesData = ({ data }) => {
    if (!data || data.length === 0 || !data[0]) {
        return <Skeleton />;
    }

    const categories = Object.keys(data[0]).filter(
        (k) => k !== 'name' && k !== 'icons'
    );

    const fills = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0'];

    return (
        <div className="bg-blue-50 rounded-2xl p-6 shadow-md h-full">
            <h2 className="text-xl font-semibold text-[#13bd24] mb-4">
                Ventas Semanales por Categoría
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value, entry) => {
                            const iconKey = entry.value.toLowerCase();
                            const Icon = categoryIcons[iconKey];

                            return (
                                <span className="flex items-center mt-2">
                                    {Icon && <span className="mr-1 text-[25px]">{Icon}</span>}
                                    <span>{value}</span>
                                </span>
                            );
                        }}
                    />
                    {categories.map((cat, idx) => (
                        <Bar
                            key={cat}
                            dataKey={cat}
                            stackId="a"
                            name={cat}
                            shape={<TriangleBar />}
                            fill={fills[idx % fills.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesData;