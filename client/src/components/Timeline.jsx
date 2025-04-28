import React from 'react';
import {
    FaCheck,
    FaRedo,
    FaPlus,
    FaExclamationTriangle,
    FaMinus
} from 'react-icons/fa';
import moment from 'moment'; // Asegúrate de instalarlo: npm install moment

const iconMapping = {
    'FaCheck': <FaCheck />,
    'FaRedo': <FaRedo />,
    'FaPlus': <FaPlus />,
    'FaExclamationTriangle': <FaExclamationTriangle />,
    'FaMinus': <FaMinus />,
};

// Mapeo de estados de pago a iconos, colores, descripciones, etc.
const paymentStatusMapping = {
    Paid: {
        iconName: 'FaCheck',
        color: 'bg-blue-500',
        amountColor: 'text-cyan-400',
        description: 'Payment from',
    },
    Failed: {
        iconName: 'FaExclamationTriangle',
        color: 'bg-pink-400',
        amountColor: 'text-pink-400',
        description: 'Payment failed from',
    },
    Pending: {
        iconName: 'FaRedo',
        color: 'bg-yellow-400',
        amountColor: 'text-yellow-400',
        description: 'Pending payment for',
    },
    Refunded: {
        iconName: 'FaRedo',
        color: 'bg-red-400',
        amountColor: 'text-red-400',
        description: 'Refund to',
    }
};

// Siempre devuelve un array, aunque `transactions` sea undefined
const transformTransactions = (transactions = []) => {
    return transactions.map((item) => {
        const status = paymentStatusMapping[item.paymentStatus] || paymentStatusMapping['Paid'];
        return {
            id: item.orderId,
            description: status.description,
            amount: item.totalAmt,
            iconName: status.iconName,
            color: status.color,
            amountColor: status.amountColor,
            date: moment(item.createdAt).format('MMMM D, YYYY hh:mm A'),
        };
    });
};

const Timeline = ({ data }) => {
    // Si no hay datos, mostramos skeleton
    if (!data || !Array.isArray(data)) {
        return (
            <div className="bg-blue-50 rounded-2xl shadow-md p-4 w-full h-full mx-auto">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const transformedTransactions = transformTransactions(data);

    return (
        <div className="bg-blue-50 rounded-2xl shadow-md p-4 w-full h-full mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-base font-semibold text-gray-800">Historial de transacciones</h2>
                <div className="flex space-x-2 text-gray-500">
                    <i className="pi pi-refresh cursor-pointer hover:text-gray-700" />
                    <i className="pi pi-filter cursor-pointer hover:text-gray-700" />
                </div>
            </div>

            {/* Timeline events */}
            <div className="relative">
                {transformedTransactions.map((tx, idx) => (
                    <div key={idx} className="relative flex items-start">
                        {/* Línea y marcador */}
                        <div className="flex flex-col items-center">
                            {idx !== 0 && <div className="w-px h-4 bg-gray-200"></div>}
                            <div className={`w-full h-full sm:p-1 rounded-full ${tx.color} flex items-center justify-center text-white shadow-md`}>
                                {iconMapping[tx.iconName] || <FaCheck />}
                            </div>
                            {idx !== transformedTransactions.length - 1 && <div className="h-6 w-px bg-gray-200"></div>}
                        </div>

                        {/* Contenido */}
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
                    Ver todas las transacciones <i className="pi pi-arrow-down" />
                </a>
            </div>
        </div>
    );
};

export default Timeline;