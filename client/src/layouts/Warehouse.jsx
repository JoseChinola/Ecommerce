import React, { useEffect, useState } from 'react';
import { PiWarehouseFill } from 'react-icons/pi';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import AddWarehouse from '../components/AddWarehouse';
import EditWarehouse from '../components/EditWarehouse';
import toast from 'react-hot-toast';
import ConfirmBox from '../components/ConfirmBox';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ITEMS_PER_PAGE = 10;

const Warehouse = () => {
    const [openAddWarehouse, setOpenAddWarehouse] = useState(false);
    const [openEditWarehouse, setOpenEditWarehouse] = useState(false);
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({});
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteWarehouse, setDeleteWarehouse] = useState({ _id: '' });

    const [currentPage, setCurrentPage] = useState(1);

    const fetchStore = async () => {
        try {
            const response = await Axios({ ...SummaryApi.getStore });
            const { data: resData } = response;
            if (resData.success) {
                setData(resData.data);
                setCurrentPage(1); // Reiniciar a página 1 cuando se actualiza
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleDisableAddress = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteStore,
                data: { _id: deleteWarehouse }
            });
            const { data: resData } = response;
            if (resData.success) {
                toast.success(resData.message);
                fetchStore();
                setOpenDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchStore();
    }, []);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <section className='bg-white p-6 rounded-lg shadow-md h-[76vh] overflow-auto'>
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3 bg-blue-50 py-1 px-3 rounded-lg'>
                    <h1 className='text-primary-Green text-2xl font-extralight italic flex items-center gap-2'>
                        Mantenimiento Almacen <PiWarehouseFill size={25} />
                    </h1>
                </div>
                <button onClick={() => setOpenAddWarehouse(true)} className='text-secundary border border-secundary px-4 py-2 rounded-lg hover:bg-[#0aa86f] hover:text-white flex items-center gap-2'>
                    <FaPlus /> Añadir Almacen
                </button>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full table-auto border'>
                    <thead className='bg-gray-100 text-gray-700'>
                        <tr>
                            <th className='px-4 py-2 border'>Almacen</th>
                            <th className='px-4 py-2 border'>Description</th>
                            <th className='px-4 py-2 border'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((store, index) => (
                                <tr key={store._id || index}>
                                    <td className='px-4 py-2 border'>{store.name || '—'}</td>
                                    <td className='px-4 py-2 border text-center'>{store.description}</td>
                                    <td className='px-4 py-2 border text-center space-x-4'>
                                        <button onClick={() => {
                                            setEditData(store);
                                            setOpenEditWarehouse(true);
                                        }} className='text-blue-500 hover:text-blue-700'>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => {
                                            setDeleteWarehouse(store._id);
                                            setOpenDelete(true);
                                        }}
                                            className='text-red-500 hover:text-red-700'>
                                            <FaTrash />
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
            {data.length > ITEMS_PER_PAGE && (
                <div className='flex justify-center items-center gap-4 mt-4'>
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        className='px-3 py-1 border rounded-md hover:bg-gray-200'
                        disabled={currentPage === 1}
                    >
                       <IoIosArrowBack />
                    </button>
                    <span className='font-medium'>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        className='px-3 py-1 border rounded-md hover:bg-gray-200'
                        disabled={currentPage === totalPages}
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            )}

            {openAddWarehouse && (
                <AddWarehouse close={() => setOpenAddWarehouse(false)} fetchStore={fetchStore} />
            )}
            {openEditWarehouse && (
                <EditWarehouse close={() => setOpenEditWarehouse(false)} data={editData} fetchStore={fetchStore} />
            )}
            {openDelete && (
                <ConfirmBox
                    close={() => setOpenDelete(false)}
                    cancel={() => setOpenDelete(false)}
                    confirm={handleDisableAddress}
                />
            )}
        </section>
    );
};

export default Warehouse;