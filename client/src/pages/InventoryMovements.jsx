import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ViewImage from '../components/ViewImage';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const InventoryMovements = () => {
    const inventorymovementsList = useSelector(state => state.inventoryMovements.inventoryMovementsList);
    const [filteredMovements, setFilteredMovements] = useState([]);
    const [ImageURL, setImageURL] = useState("")
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);


    useEffect(() => {
        const filtered = inventorymovementsList.filter(item =>
            item.productData?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredMovements(filtered);
        setCurrentPage(1); // Reset page when search changes
    }, [search, inventorymovementsList]);

    return (
        <section className="p-5 bg-white rounded-xl shadow-md">
            <div className='bg-secundary rounded-lg flex items-center justify-between mb-8 flex-col sm:flex-row gap-3 p-4'>
                <h2 className="text-xl font-extrabold text-primary-Green">Movimientos de Inventario</h2>
                <div className='h-10 w-full max-w-xs bg-white px-3 flex items-center gap-2 rounded-md border focus-within:border-green-500'>
                    <IoSearchOutline size={20} />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full outline-none bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className='rounded-lg shadow-sm p-1 bg-secundary '>
                <div className="overflow-x-auto bg-white p-2 rounded-lg">
                    <table className="min-w-full text-sm text-left border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border">#</th>
                                <th className="py-2 px-4 border">Producto</th>
                                <th className="py-2 px-4 border">Image</th>
                                <th className="py-2 px-4 border">Tipo</th>
                                <th className="py-2 px-4 border">Almacen</th>
                                <th className="py-2 px-4 border">Cantidad</th>
                                <th className="py-2 px-4 border">Fecha</th>
                                <th className="py-2 px-4 border">Usuario</th>
                                <th className="py-2 px-4 border">Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{indexOfFirstItem + index + 1}</td>
                                        <td className="py-2 px-4 border">
                                            {item.productData?.name || `Producto #${item.productId}`}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <div className='flex items-center justify-center'>
                                                <img
                                                    src={item.productData?.image || 'default-image.png'}
                                                    alt={item.productData?.name || `Producto #${item.productId}`}
                                                    className="w-8 h-8 object-cover rounded"
                                                    onClick={() => setImageURL(item.productData?.image)}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {item.type === 'entrada' ? (
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <FaArrowDown /> Entrada
                                                </span>
                                            ) : (
                                                <span className="text-red-600 flex items-center gap-1">
                                                    <FaArrowUp /> Salida
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {item?.warehouseData?.name || `Almacen #${item.warehouseData?._id}`}
                                        </td>
                                        <td className="py-2 px-4 border">{item.quantity}</td>
                                        <td className="py-2 px-4 border">
                                            {moment(item.date).format('DD/MM/YYYY')}
                                        </td>
                                        <td className="py-2 px-4 border">{item.user?.name}</td>
                                        <td className="py-2 px-4 border text-sm">{item.description || '-'}</td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="5" className='text-center p-4 text-gray-500 italic'>No hay movimientos registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredMovements.length > itemsPerPage && (
                    /* Pagination */
                    <div className="flex justify-between items-center gap-4 mt-3 px-4 py-2 bg-white rounded-lg">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='px-2 py-2 border rounded-full disabled:opacity-50 text-primary-Green hover:text-white hover:bg-primary-Green'
                        >
                            <IoIosArrowBack />
                        </button>
                        <span className='italic'>Página {currentPage} de {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='px-2 py-2 border rounded-full disabled:opacity-50 text-primary-Green hover:text-white hover:bg-primary-Green'
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                )}
            </div>

            {ImageURL && (
                <ViewImage url={ImageURL} close={() => setImageURL(false)} />
            )}
        </section>
    );
};

export default InventoryMovements;