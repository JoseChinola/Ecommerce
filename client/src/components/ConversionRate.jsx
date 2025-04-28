import React from 'react';
import rate from '../assets/rate.svg';
import { FaDollarSign, FaShoppingCart, FaUsers, FaBoxOpen } from 'react-icons/fa';

// Mapeo de iconos
const iconMapping = {
    FaDollarSign: <FaDollarSign />,
    FaShoppingCart: <FaShoppingCart />,
    FaUsers: <FaUsers />,
    FaBoxOpen: <FaBoxOpen />
};

const StatsCard = ({ data }) => {
    // Si 'data' no es un arreglo, mostramos un esqueleto
    if (!data || !Array.isArray(data)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-50 p-4 rounded-xl animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="relative p-5 rounded-xl shadow-lg bg-gray-200 h-32"></div>
                ))}
            </div>
        );
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-50 p-4 rounded-xl">
            {data.map((stat, idx) => (
                <div key={idx} className={`relative p-5 rounded-xl shadow-lg ${stat.color}`}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                            <div className={`rounded-full p-2 bg-white`}>  {/* Icono sobre fondo blanco para mostrar color de texto */}
                                {iconMapping[stat.iconName]}
                            </div>
                            <span className="text-sm text-center font-medium text-current">{stat.title}</span>
                        </div>
                        <div className="text-3xl font-semibold text-current">{stat.value}</div>
                    </div>

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