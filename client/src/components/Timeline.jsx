import React from 'react';
import {
    FaCheck,
    FaRedo,
    FaPlus,
    FaExclamationTriangle,
    FaMinus
} from 'react-icons/fa';

const transactions = [
    {
        id: '#28492',
        description: 'Payment from',
        amount: 250.0,
        icon: <FaCheck />,
        color: 'bg-blue-500',
        amountColor: 'text-cyan-400',
        date: 'April 19, 2025 11:09 AM',
    },
    {
        id: '#94830',
        description: 'Refund to',
        amount: -570.0,
        icon: <FaRedo />,
        color: 'bg-red-400',
        amountColor: 'text-red-400',
        date: 'April 18, 2025 08:22 AM',
    },
    {
        id: '#5849',
        description: 'New 8 users to',
        amount: 50.0,
        icon: <FaPlus />,
        color: 'bg-emerald-400',
        amountColor: 'text-emerald-400',
        date: 'April 17, 2025 02:56 PM',
    },       
    {
        id: '#60958',
        description: 'Payment failed from',
        amount: 1450.0,
        icon: <FaExclamationTriangle />,
        color: 'bg-pink-400',
        amountColor: 'text-pink-400',
        date: 'April 16, 2025 07:54 PM',
    },    
    {
        id: '#99234',
        description: 'Removed 32 users from',
        amount: -240.0,
        icon: <FaMinus />,
        color: 'bg-red-400',
        amountColor: 'text-red-400',
        date: 'April 15, 2025 08:40 PM',
    }

];

const Timeline = () => {
    return (
        <div className="bg-blue-50 rounded-2xl shadow-md p-4 w-full h-full mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-base font-semibold text-gray-800">Transaction History</h2>
                <div className="flex space-x-2 text-gray-500">
                    <i className="pi pi-refresh cursor-pointer hover:text-gray-700" />
                    <i className="pi pi-filter cursor-pointer hover:text-gray-700" />
                </div>
            </div>

            {/* Timeline events */}
            <div className="relative">
                {transactions.map((tx, idx) => (
                    <div key={idx} className="relative flex items-start">
                        {/* Line and Marker */}
                        <div className="flex flex-col items-center">
                            {/* Top connector for all except first */}
                            {idx !== 0 && <div className="w-px h-4 bg-gray-200"></div>} {/* línea más larga arriba */}

                            {/* Marker */}
                            <div className={`w-6 h-6 rounded-full ${tx.color} flex items-center justify-center text-white shadow-md`}>
                                {tx.icon}
                            </div>

                            {/* Bottom connector for all except last */}
                            {idx !== transactions.length - 1 && <div className="h-6 w-px bg-gray-200"></div>} {/* línea más larga abajo */}
                        </div>

                        {/* Content */}
                        <div className="ml-6 flex-1 py-1">
                            <div className="flex justify-between items-center p-0 m-0">
                                <p className="text-sm font-medium text-gray-700">
                                    {tx.description} <span className="font-semibold">{tx.id}</span>
                                </p>
                                <span className={`text-sm font-bold ${tx.amountColor}`}>
                                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{tx.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t mt-4 pt-2 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-200 font-medium inline-flex items-center gap-1">
                    View all transactions <i className="pi pi-arrow-down" />
                </a>
            </div>
        </div>
    );
};

export default Timeline;