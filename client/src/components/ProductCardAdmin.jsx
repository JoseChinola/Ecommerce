import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import EditProductAdmin from './EditProductAdmin';
import ConfirmBox from './ConfirmBox';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchData }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const images = data?.image ? JSON.parse(data?.image) : [];

    const handleDelete = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteProduct,
                data: {
                    _id: data._id
                }
            })

            const { data: resData } = response
            if (resData.success) {
                toast.success(resData.message)
                if (fetchData) {
                    fetchData()
                }
                setOpenDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className='border mb-1 grid gap-2 min-w-24 lg:min-w-36 rounded-lg shadow-md bg-white'>
            <div className='min-h-20 max-h-20 lg:max-h-32 rounded flex items-center justify-center overflow-hidden'>
                <img
                    src={images[0]}
                    alt={data?.name}
                    className='object-scale-down w-full h-full p-2'
                />
            </div>

            <div className='flex items-start justify-start flex-col gap-1 mx-2'>
                <p className='text-ellipsis line-clamp-1 font-medium text-sm'>
                    {data?.name}
                </p>

                <p className='text-slate-400 text-base'>
                    {data?.unit}
                </p>
                <div className='flex items-center justify-between w-full px-1 py-2'>
                    <button onClick={() => setEditOpen(true)} className='border px-3  border-primary-Green text-primary-Green hover:bg-primary-Green hover:text-white rounded-lg'>
                        <CiEdit />
                    </button>
                    <button onClick={() => setOpenDelete(true)} className='border px-3 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg'>
                        <MdDelete />
                    </button>
                </div>
            </div>
            {
                editOpen && (
                    <EditProductAdmin data={data} fetchData={fetchData} close={() => setEditOpen(false)} />
                )
            }

            {
                openDelete && (
                    <ConfirmBox close={() => setOpenDelete(false)} cancel={() => setOpenDelete(false)} confirm={handleDelete} />
                )
            }
        </div>
    )
}

export default ProductCardAdmin