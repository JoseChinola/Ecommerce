import React from 'react';
import { PiWarehouseFill } from 'react-icons/pi';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Inventario = () => {
    return (
        <section className='bg-white p-6 rounded-lg shadow-md'>
            {/* Título */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3 bg-blue-50 py-1 px-3 rounded-lg'>
                    <h1 className='text-primary-Green text-2xl font-extralight italic flex items-center gap-2'>
                        Inventory <PiWarehouseFill size={25} />
                    </h1>
                </div>
                <button className='bg-[#0bd18a] text-white px-4 py-2 rounded-lg hover:bg-[#0aa86f] flex items-center gap-2'>
                    <FaPlus /> Añadir Stock
                </button>
            </div>

            {/* Tabla de inventario */}
            <div className='overflow-x-auto'>
                <table className='min-w-full table-auto border'>
                    <thead className='bg-gray-100 text-gray-700'>
                        <tr>
                            <th className='px-4 py-2 border'>Producto</th>
                            <th className='px-4 py-2 border'>Categoría</th>
                            <th className='px-4 py-2 border'>Stock</th>
                            <th className='px-4 py-2 border'>Stock Máximo</th>
                            <th className='px-4 py-2 border'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Este es un ejemplo de fila */}
                        <tr>
                            <td className='px-4 py-2 border'>Camiseta Básica</td>
                            <td className='px-4 py-2 border'>Ropa</td>
                            <td className='px-4 py-2 border text-center'>50</td>
                            <td className='px-4 py-2 border text-center'>100</td>
                            <td className='px-4 py-2 border text-center space-x-2'>
                                <button className='text-blue-500 hover:text-blue-700'>
                                    <FaEdit />
                                </button>
                                <button className='text-red-500 hover:text-red-700'>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                        {/* Puedes mapear datos reales aquí */}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Inventario;
