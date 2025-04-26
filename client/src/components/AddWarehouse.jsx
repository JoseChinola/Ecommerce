import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import { LuWarehouse } from 'react-icons/lu';

const AddWarehouse = ({ close, fetchStore }) => {
    const { register, handleSubmit, reset, } = useForm()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        try {
            

            setLoading(true)
            const response = await Axios({
                ...SummaryApi.createStore,
                data: {
                    name: data.name,
                    description: data.description
                }
            })

            const { data: respondata } = response
            if (respondata.success) {
                toast.success(respondata.message)
                if (close) {
                    close()
                    reset()
                    fetchStore()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <section className='bg-black fixed top-0 bottom-0 left-0 right-0 z-50 bg-opacity-70 flex items-center h-screen overflow-auto sm:p-4 p-2'>
            <div className='bg-white p-4 w-full sm:max-w-2xl mx-auto rounded-md'>
                <div className='p-1 flex justify-between items-center border bg-blue-50 rounded-md px-2'>
                    <h2 className='font-semibold italic sm:text-lg'>Crear Almacen</h2>
                    <button onClick={close} className="w-fit ml-auto hover:text-red-600 hidden sm:block">
                        <IoClose size={30} />
                    </button>
                </div>

                {loading && (
                    <div className='p-8'>
                        <Loading />
                    </div>
                )}

                <form className='mt-4 flex flex-col gap-4 border p-2 rounded-lg ' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid sm:grid-cols-1 gap-4'>
                        <div className='grid gap-1 relative'>
                            <label htmlFor="name">Nombre Almacén:</label>
                            <input
                                type="text"
                                id='name'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer'
                                {...register('name', { required: true })}
                            />
                            <LuWarehouse className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>



                        <div className='grid gap-1'>
                            <label htmlFor="description" className='font-medium'>Description</label>

                            <textarea type="text"
                                id='description'
                                placeholder='Enter product description'
                                {...register('description', { required: true })}
                                className='bg-blue-50 p-2 outline-none border border-blue-200 focus-within:border-primary-Green rounded-md resize-none'
                                multiple
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className={`bg-primary-Green w-full py-2 font-semibold text-white rounded-md transition 
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    >
                        {loading ? 'Procesando...' : 'Submit'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddWarehouse