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
    <div className="flex flex-col border p-2 sm:p-2 rounded-xl shadow bg-white select-none transition-all w-full max-w-[220px] sm:max-w-[220px] md:max-w-[230px] lg:max-w-[250px]">
      {/* Imagen */}
      <div className="aspect-auto rounded flex items-center justify-center overflow-hidden">
        {images[0] ? (
          <img src={images[0]} alt={data.name} className="w-full h-full object-contain aspect-square" />
        ) : (
          <div className="text-gray-400 text-center text-sm">Sin imagen</div>
        )}
      </div>

      {/* Contenido */}
      <div className="px-2 py-1 flex flex-col justify-between flex-1">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 break-words">
          {data.name}
        </h2>

        <div className="flex items-center  justify-between gap-2 ">
          <div>
            <span className="font-bold">Creado:</span>{' '}
            {moment(data.createdAt).format('DD/MM/YYYY')}
          </div>
          <div>
            <span className="font-bold">Actualizado:</span>{' '}
            {moment(data.updatedAt).format('DD/MM/YYYY')}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-4 flex flex-col md:flex-row gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="w-full md:w-auto flex-1 flex items-center justify-center py-2 border-green-500 rounded-lg text-green-500 hover:bg-green-500 hover:text-white transition-colors text-lg"
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="w-full md:w-auto flex-1 flex items-center justify-center py-2 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors text-lg"
          >
            <RiDeleteBinLine />
          </button>
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
    </div>
  );
};

export default ProductCardAdmin;
