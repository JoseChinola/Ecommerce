import React, { useState } from 'react'
import { FaCamera } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../cammon/SummaryApi';
import UploadImage from '../utils/UploadImage';
import toast from 'react-hot-toast';


const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false)

    const handleOnchage = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const res = await Axios({
                ...SummaryApi.addCategory,
                data: data
            })

            const { data: resData } = res
            if (resData.success) {
                toast.success(resData.message)
                fetchData();

                if (close) {
                    close()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)

        }


    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const response = await UploadImage(file)
        const { data: ImageResponse } = response
        setData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })

    }


    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-2 rounded z-50 bg-neutral-800 bg-opacity-70 flex items-center justify-center'>
            <div className='bg-white rounded-md max-w-xl w-full p-6 space-y-2'>

                <div className='flex items-center justify-between bg-blue-50 p-2 rounded-md'>
                    <h1 className='font-semibold uppercase'>Categoria </h1>
                    <button onClick={close} className='w-fit block ml-auto hover:text-red-600'>
                        <IoClose size={30} />
                    </button>
                </div>

                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName' htmlFor="">
                            Nombre
                        </label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Ingresa nombre de categoria'
                            value={data.name}
                            name='name'
                            onChange={handleOnchage}
                            className='bg-blue-50 p-2 outline-none border border-blue-100
                             focus-within:border-blue-300 rounded'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 rounded w-full h-36 lg:w-36 flex
                            items-center justify-center'>
                                {
                                    data.image ? (
                                        <img
                                            alt='category'
                                            src={data.image}
                                            className='w-full h-full object-cover rounded'

                                        />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>

                                    )
                                }
                            </div>

                            <label htmlFor="uploadCategoryImage">
                                <div className={`
                                   ${!data.name ? "bg-gray-400 text-white " : "cursor-pointer border border-green-600 hover:bg-primary-Green hover:text-white"}
                                flex items-center justify-center gap-2 text-gray-500  rounded-md px-4 py-2 select-none 
                                `}>
                                    <FaCamera size={20} /> Subir
                                </div>
                                <input
                                    disabled={!data.name}
                                    onChange={handleUploadCategoryImage}
                                    type='file'
                                    id='uploadCategoryImage'
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>

                    <button className={`
                        ${data.name && data.image ? "bg-blue-600 hover:bg-blue-500 hover:text-white" : "bg-gray-300"} 
                        py-2 font-semibold rounded 
                        `}
                    >
                        {loading ? "Loading..." : "Añadir categoria"}
                    </button>
                </form>
            </div >
        </section >
    )
}

export default UploadCategoryModel