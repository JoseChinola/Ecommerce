import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import ConfirmBox from './ConfirmBox';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import toast from 'react-hot-toast';
import moment from '../utils/configMoment';
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";


const ProductCardAdmin = ({ data, fetchData }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const images = data?.image ? JSON.parse(data?.image) : [];

    const handleDelete = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteProduct,
                data: { _id: data._id }
            });

            const { data: resData } = response;
            if (resData.success) {
                toast.success(resData.message);
                if (fetchData) {
                    fetchData();
                }
                setOpenDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

 
    return (
        <div className="flex flex-col border p-2 sm:p-4 rounded-xl shadow bg-white select-none transition-all w-full max-w-[200px] sm:max-w-[230px] md:max-w-[250px] lg:max-w-[250px]">
            {/* Imagen */}
            <div className="aspect-square rounded flex items-center justify-center overflow-hidden">
                <img
                    src={images[0]}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Nombre del producto */}
            <div className="px-1 font-semibold text-sm sm:text-base line-clamp-1 mb-1 mt-2">
                {data.name}
            </div>

            {/* Tiempo de creación */}
            <div className='flex justify-between'>
                <div className="text-xs text-gray-500 mb-2 flex flex-col">
                    <span className='font-bold'>Creado</span>
                    {moment(data.createdAt).format('DD/MM/YYYY')}
                </div>
                <div className="text-xs text-gray-500 mb-2 flex flex-col">
                    <span className='font-bold'>Actualizado</span>
                    {moment(data.updatedAt).format('DD/MM/YYYY')}
                </div>
            </div>


            {/* Botones de acción */}
            <div className="flex justify-between items-center rounded-lg w-full gap-2 text-lg">
                <button onClick={() => setEditOpen(true)} className="w-full flex items-center justify-center py-1 rounded-lg text-primary-Green hover:bg-primary-Green hover:text-white">
                    <AiOutlineEdit />
                </button>
                <button onClick={() => setOpenDelete(true)} className="w-full flex items-center justify-center py-1 rounded-lg text-red-600 hover:bg-red-600 hover:text-white">
                    <RiDeleteBinLine />
                </button>
            </div>

            {/* Editar producto */}
            {editOpen && (
                <EditProductAdmin data={data} fetchData={fetchData} close={() => setEditOpen(false)} />
            )}

            {/* Confirmación de eliminación */}
            {openDelete && (
                <ConfirmBox close={() => setOpenDelete(false)} cancel={() => setOpenDelete(false)} confirm={handleDelete} />
            )}
        </div>
    );
};

export default ProductCardAdmin;
