import React, { useEffect, useState, useCallback } from 'react';
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
import { IoSearchOutline } from 'react-icons/io5';

const ITEMS_PER_PAGE = 6;

const Warehouse = () => {
  const [openAddWarehouse, setOpenAddWarehouse] = useState(false);
  const [openEditWarehouse, setOpenEditWarehouse] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteWarehouseId, setDeleteWarehouseId] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // estado para búsqueda

  const fetchStore = useCallback(async () => {
    try {
      const response = await Axios({ ...SummaryApi.getStore });
      const { data: resData } = response;
      if (resData.success) {
        setData(resData.data);
        setCurrentPage(1);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }, []);

  const handleDisableAddress = useCallback(async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteStore,
        data: { _id: deleteWarehouseId }
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
  }, [deleteWarehouseId, fetchStore]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  // Filtrar los datos por nombre de almacen
  const filteredData = data.filter(store =>
    store.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className='bg-white p-6 rounded-lg shadow-md h-[76vh] overflow-auto'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-secundary rounded-lg px-4 py-2 mb-6'>
        <div className='flex items-center gap-3 py-1 px-3 rounded-lg'>
          <h1 className='text-primary-Green text-2xl font-extralight italic flex items-center gap-2'>
            Mantenimiento Almacen <PiWarehouseFill size={25} />
          </h1>
        </div>

        {/* Input para buscar */}
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <div className="flex items-center bg-white border rounded-md px-3 py-3 w-full focus-within:border-green-500">
            <IoSearchOutline size={20} />
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full outline-none bg-transparent ml-2"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setOpenAddWarehouse(true)}
          className="text-[#0aa86f] border border-[#0aa86f] bg-white px-4 py-2 rounded-lg hover:bg-[#0aa86f] hover:text-white flex items-center gap-2 w-full sm:w-auto"
        >
          <FaPlus /> Añadir Almacen
        </button>
      </div>

      <div className='bg-secundary rounded-lg shadow-sm p-2'>
        <div className='overflow-x-auto bg-white p-1 rounded-lg'>
          <table className='min-w-full table-auto border'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='px-4 py-2 border'>Almacen</th>
                <th className='px-4 py-2 border'>Dirección</th>
                <th className='px-4 py-2 border'>Descripción</th>
                <th className='px-4 py-2 border'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((store, index) => (
                  <tr key={store._id || index}>
                    <td className='px-4 py-2 border'>{store.name || '—'}</td>
                    <td className='px-4 py-2 border'>{store.address || '—'}</td>
                    <td className='px-4 py-2 border text-center'>{store.description}</td>
                    <td className='px-4 py-2 border text-center space-x-4'>
                      <button
                        onClick={() => {
                          setEditData(store);
                          setOpenEditWarehouse(true);
                        }}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteWarehouseId(store._id);
                          setOpenDelete(true);
                        }}
                        className='text-red-500 hover:text-red-700'
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className='text-center p-4 text-gray-500 italic'>
                    No hay registros de inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredData.length > ITEMS_PER_PAGE && (
          <div className='flex justify-between items-center gap-4 mt-2 bg-white py-2 px-2 rounded-lg'>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className='px-2 py-2 border rounded-full disabled:opacity-50 text-primary-Green hover:text-white hover:bg-primary-Green'
              disabled={currentPage === 1}
            >
              <IoIosArrowBack />
            </button>
            <span className='font-medium italic'>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className='px-2 py-2 border rounded-full disabled:opacity-50 text-primary-Green hover:text-white hover:bg-primary-Green'
              disabled={currentPage === totalPages}
            >
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>

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