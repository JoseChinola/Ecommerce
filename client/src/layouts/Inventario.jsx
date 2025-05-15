import React, { useEffect, useState } from 'react';
import { PiWarehouseFill } from 'react-icons/pi';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { IoSearchOutline } from 'react-icons/io5';
import AddInventory from '../components/AddInventory';
import EditInventory from '../components/EditInventory';
import { useSelector } from 'react-redux';
import ViewImage from '../components/ViewImage';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';


const Inventario = () => {
    const inventoryList = useSelector(state => state.inventory.inventoryList);
    const [openAddInventory, setOpenAddInventory] = useState(false);
    const [search, setSearch] = useState('');
    const [openEditInventory, setOpenEditInventory] = useState(false);
    const [editData, setEditData] = useState({});
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [ImageURL, setImageURL] = useState("")


    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

    useEffect(() => {
        const filtered = inventoryList.filter(item =>
            item.product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredInventory(filtered);
        setCurrentPage(1);
    }, [search, inventoryList]);


    return (
        <section className='bg-white p-6 rounded-lg shadow-md h-[76vh] overflow-auto'>
            {/* Título */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secundary rounded-lg px-4 py-2 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-primary-Green text-xl sm:text-2xl font-extrabold italic flex items-center gap-2">
                        Mantenimiento Inventario <PiWarehouseFill size={25} />
                    </h1>
                </div>

                <div className="w-full sm:w-auto flex-1 max-w-md">
                    <div className="flex items-center bg-white border rounded-md px-3 py-3 w-full focus-within:border-green-500">
                        <IoSearchOutline size={20} />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="w-full outline-none bg-transparent ml-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={() => setOpenAddInventory(true)}
                    className="text-[#0aa86f] border border-[#0aa86f] bg-white px-4 py-2 rounded-lg hover:bg-[#0aa86f] hover:text-white flex items-center gap-2 w-full sm:w-auto"
                >
                    <FaPlus /> Añadir Inventario
                </button>
            </div>

            {/* Tabla */}
            <div className='bg-secundary rounded-lg shadow-sm p-2'>
                <div className='overflow-x-auto bg-white p-1 rounded-lg'>
                    <table className='min-w-full table-auto border'>
                        <thead className='bg-gray-100 text-gray-700 '>
                            <tr>
                                <th className="py-2 px-4 border font-bold">#</th>
                                <th className='px-4 py-2 border font-bold'>Almacén</th>
                                <th className='px-4 py-2 border font-bold'>Producto</th>
                                <th className='px-4 py-2 border font-bold'>Imagen</th>
                                <th className='px-4 py-2 border font-bold'>Cantidad</th>
                                <th className='px-4 py-2 border font-bold'>Usuario</th>
                                <th className='px-4 py-2 border font-bold'>Descripción</th>
                                <th className='px-4 py-2 border font-bold'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(currentItems) && currentItems.length > 0 ? (
                                currentItems.map((inventory, index) => (
                                    <tr key={inventory._id || index}>
                                        <td className="py-2 px-4 border">{indexOfFirstItem + index + 1}</td>
                                        <td className='px-4 py-2 border'>{inventory?.warehouse?.name || '—'}</td>
                                        <td className='px-4 py-2 border text-center'>{inventory?.product?.name || '—'}</td>
                                        <td className="py-2 px-4 border">
                                            <div className='flex items-center justify-center'>
                                                <img
                                                    src={inventory.productData?.image || 'default-image.png'}
                                                    alt={inventory.productData?.name || `Producto #${inventory.productId}`}
                                                    className="w-10 h-10 object-contain rounded"
                                                    onClick={() => setImageURL(inventory.productData?.image)}
                                                />
                                            </div>
                                        </td>
                                        <td className='px-4 py-2 border text-center'>{inventory.stock || '—'}</td>
                                        <td className='px-4 py-2 border'>{inventory?.user?.name || '—'}</td>
                                        <td className='px-4 py-2 border text-center'>{inventory.description || '—'}</td>
                                        <td className='px-4 py-2 border text-center space-x-4 text-lg'>
                                            <button onClick={() => {
                                                setEditData(inventory);
                                                setOpenEditInventory(true);
                                            }} className='text-blue-500 hover:text-blue-700'>
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='text-center p-4 text-gray-500 italic'>No hay registros de inventario.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {filteredInventory.length > itemsPerPage && (
                    <div className='flex justify-between items-center gap-4 mt-2 bg-white py-2 px-2 rounded-lg'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className='px-2 py-2 border rounded-full disabled:opacity-50 text-primary-Green hover:text-white hover:bg-primary-Green'
                            disabled={currentPage === 1}
                        >
                            <IoIosArrowBack />
                        </button>
                        <span className='px-3 py-1 text-gray-700'>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className='px-2 py-2 border rounded-full disabled:opacity-90 disabled:bg-opacity-0 text-primary-Green hover:text-white hover:bg-primary-Green'
                            disabled={currentPage === totalPages}
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                )}
            </div>
            {/* Modales */}
            {openAddInventory && (
                <AddInventory close={() => setOpenAddInventory(false)} inventoryList={inventoryList}/>
            )}
            {openEditInventory && (
                <EditInventory close={() => setOpenEditInventory(false)} data={editData} inventoryList={inventoryList} />
            )}
            {ImageURL && (
                <ViewImage url={ImageURL} close={() => setImageURL(false)} />
            )}
        </section>
    );
};

export default Inventario;