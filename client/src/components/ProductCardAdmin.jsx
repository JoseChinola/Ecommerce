import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import ConfirmBox from './ConfirmBox';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import toast from 'react-hot-toast';
import moment from '../utils/configMoment';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';

const ProductCardAdmin = ({ data, fetchData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const images = data?.image ? JSON.parse(data.image) : [];

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id }
      });
      const { data: resData } = response;
      if (resData.success) {
        toast.success(resData.message);
        fetchData?.();
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="group flex flex-col bg-white border p-2 sm:p-2 rounded-xl shadow select-none transition-all w-full max-w-[220px] relative">
      {/* Imagen */}
      <div className="rounded flex items-center justify-center overflow-hidden">
        {images[0] ? (
          <img
            src={images[0]}
            alt={data.name}
            className="w-full h-full object-contain aspect-square"
          />
        ) : (
          <div className="text-gray-400 text-center text-sm">Sin imagen</div>
        )}
      </div>

      {/* Nombre del producto */}
      <h2 className="line-clamp-2 font-semibold text-gray-800 break-words text-center">
        {data.name}
      </h2>

      {/* Botones de acción (solo aparecen al hacer hover) */}
      <div className="px-5 items-center justify-between w-full absolute bottom-2 left-0 right-0 flex gap-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        <button
          onClick={() => setEditOpen(true)}
          className="bg-blue-100 transition-all duration-300 ease-in-out py-1.5 border rounded-md px-4 hover:scale-105 text-neutral-700 font-semibold hover:text-white hover:bg-green-500"
        >
          <AiOutlineEdit />
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="bg-red-200 transition-all duration-300 ease-in-out hover:scale-105 text-neutral-700 border rounded-md py-1.5 px-4 hover:text-white font-semibold hover:bg-red-500"
        >
          <RiDeleteBinLine />
        </button>
      </div>

      {/* Fechas */}
      <div className="px-2 py-2 flex flex-col justify-between flex-1 gap-1 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold">Creado:</span>
          <span>{moment(data.createdAt).format('DD/MM/YYYY')}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold">Actualizado:</span>
          <span>{moment(data.updatedAt).format('DD/MM/YYYY')}</span>
        </div>
      </div>

      {/* Modales */}
      {editOpen && (
        <EditProductAdmin data={data} fetchData={fetchData} close={() => setEditOpen(false)} />
      )}
      {openDelete && (
        <ConfirmBox
          close={() => setOpenDelete(false)}
          cancel={() => setOpenDelete(false)}
          confirm={handleDelete}
        />
      )}
    </section>

  );
};

export default ProductCardAdmin;
