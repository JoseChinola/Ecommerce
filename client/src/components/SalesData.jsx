import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Componente Skeleton para mostrar durante la carga
const Skeleton = () => (
    <div className="bg-gray-200 rounded-2xl p-6 shadow-md h-full animate-pulse">
        <div className="w-1/3 h-6 bg-gray-300 mb-4"></div>
        <div className="w-full h-40 bg-gray-300"></div>
    </div>
);

const SalesData = ({ data }) => {
    // Si no hay datos o están en proceso de carga, mostramos el skeleton
    if (!data || !data.labels || !data.sales || data.labels.length !== data.sales.length) {
        return <Skeleton />;
    }

    // Transformar data recibida
    const ventasData = data.labels.map((label, idx) => ({
        name: `${label}`, // Cambiar a "Semana" en lugar de "Week"
        ventas: parseFloat(data.sales[idx]),
    }));

    return (
        <div className="bg-blue-50 rounded-2xl p-6 shadow-md h-full">
            <h2 className="text-xl font-semibold text-[#13bd24] mb-4">Ventas Semanales</h2>
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={ventasData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#13bd24" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesData;