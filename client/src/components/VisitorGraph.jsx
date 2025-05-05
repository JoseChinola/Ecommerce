import React from 'react';

const TopProductsTable = ({ data }) => {
    const isLoading = !data || !Array.isArray(data);

    return (
        <div className="p-4 sm:p-6 bg-blue-50 shadow rounded-2xl w-full">
            <h2 className="text-lg sm:text-2xl font-bold text-green-600 mb-4">
                Top 5 Productos Más Vendidos
            </h2>

            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full text-gray-700">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="px-4 py-2 text-left text-xs sm:text-sm font-semibold uppercase tracking-wide">
                                Producto
                            </th>
                            <th className="px-4 py-2 text-right text-xs sm:text-sm font-semibold uppercase tracking-wide">
                                Ventas
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <tr
                                    key={idx}
                                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                                >
                                    <td className="px-4 py-3">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="h-4 bg-gray-300 rounded w-1/4 ml-auto animate-pulse"></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            data.map(({ productId, productName, salesCount }, idx) => (
                                <tr
                                    key={productId}
                                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-green-600 font-semibold text-sm sm:text-base">
                                        {productName}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-blue-600 text-sm sm:text-base">
                                        {salesCount.toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopProductsTable;