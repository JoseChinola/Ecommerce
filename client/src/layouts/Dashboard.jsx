import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Timeline from '../components/Timeline';
import CountryDistribution from '../components/CountryDistribution';
import VisitorGraph from '../components/VisitorGraph';
import StatsCard from '../components/ConversionRate';

const Dashboard = () => {

    const ventasData = [
        { name: 'Lun', ventas: 300 },
        { name: 'Mar', ventas: 500 },
        { name: 'Mié', ventas: 400 },
        { name: 'Jue', ventas: 600 },
        { name: 'Vie', ventas: 800 },
        { name: 'Sáb', ventas: 300 },
        { name: 'Dom', ventas: 400 },
    ];

    return (
        <div className="p-6 space-y-6 bg-white rounded-xl">
            <div className='bg-blue-50 py-2 px-4 rounded-lg flex justify-between items-center shadow-md'>
                <h1 className="text-3xl text-[#13bd24] font-extrabold">Dashboard
                </h1>
                <span className='font-extrabold hidden md:block italic text-3xl text-[#13bd24]'>
                    D’RAF SERVICES
                </span>
            </div>

            {/* StatsCard Section */}
            <div className="">
                <StatsCard />
            </div>

            {/* VisitorGraph & Timeline Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Distribución por País (2/3 del ancho en md) */}
                <div className="md:col-span-2 rounded-2xl">
                    <VisitorGraph />
                </div>

                {/* Transacciones (1/3 del ancho en md) */}
                <div className="md:col-span-1 rounded-2xl">
                    <Timeline />
                </div>
            </div>

            {/* Ventas Semanales Graph Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Ventas Semanales */}
                <div className="md:col-span-2 rounded-2xl">
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
                </div>

                {/* Country Distribution */}
                <div className="md:col-span-1 rounded-2xl">
                    <CountryDistribution />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;