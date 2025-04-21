import React from 'react';
import rate from '../assets/rate.svg';
import { FaDollarSign, FaShoppingCart, FaUsers, FaBoxOpen } from 'react-icons/fa';

const stats = [
    { title: 'Ventas Totales', value: '$10,200', icon: <FaDollarSign />, color: 'bg-green-100 text-green-600' },
    { title: 'Pedidos', value: '240', icon: <FaShoppingCart />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Clientes', value: '180', icon: <FaUsers />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Productos', value: '320', icon: <FaBoxOpen />, color: 'bg-yellow-100 text-yellow-600' },
];

const StatsCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-50 p-4 rounded-xl">
            {stats.map((stat, idx) => (
                <div key={idx} className={`relative p-5 rounded-xl shadow-lg ${stat.color}`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                            <div className={`rounded-full ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-sm text-center font-medium">{stat.title}</span>
                        </div>
                        <div className="text-3xl font-semibold">{stat.value}</div>
                    </div>
                    {/* Aquí puedes agregar algún contenido adicional si lo deseas */}
                    <img
                        className="absolute bottom-4 right-4 opacity-20"
                        src={rate}
                        alt="Rate"
                    />
                </div>
            ))}
        </div>
    );
};

export default StatsCard;