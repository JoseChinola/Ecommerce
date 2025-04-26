import React from 'react'
import { useForm } from "react-hook-form"
import { FaAddressCard, FaCity } from "react-icons/fa";
import { TbMapSearch, TbMapPinCode } from "react-icons/tb";
import { SiOpenstreetmap } from "react-icons/si";
import { useGlobalContext } from '../provider/useGlobalContext'
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { CiMobile1 } from "react-icons/ci";


const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {

        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    country: data.country,
                    mobile: data.mobile
                }
            })

            const { data: respondata } = response
            if (respondata.success) {
                toast.success(respondata.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    
    return (
        <section className='bg-black fixed top-0 bottom-0 left-0 right-0 z-50 bg-opacity-70 flex items-center h-screen overflow-auto sm:p-4 p-2'>
            <div className='bg-white p-4 w-full sm:max-w-2xl mx-auto rounded-md'>
                <div className='p-1 flex justify-between items-center border bg-blue-50 rounded-md px-2'>
                    <h2 className='font-semibold italic sm:text-lg'>Address</h2>
                    <button onClick={close} className="w-fit ml-auto hover:text-red-600 hidden sm:block">
                        <IoClose size={30} />
                    </button>
                </div>

                <form className='mt-4 grid gap-4 border p-2 rounded-lg' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <div className='grid gap-1 relative'>
                            <label htmlFor="addressline">Address Line:</label>
                            <input
                                type="text"
                                id='addressline'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('addressline', { required: true })}
                            />
                            <FaAddressCard className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                id='city'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('city', { required: true })}
                            />
                            <FaCity className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="state">State:</label>
                            <input
                                type="text"
                                id='state'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('state', { required: true })}
                            />
                            <TbMapSearch className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="pincode">Pincode:</label>
                            <input
                                type="text"
                                id='pincode'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('pincode', { required: true })}
                            />
                            <TbMapPinCode className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="country">Country:</label>
                            <input
                                type="text"
                                id='country'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('country', { required: true })}
                            />
                            <SiOpenstreetmap className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                        <div className='grid gap-1 relative'>
                            <label htmlFor="mobile">Mobile No.:</label>
                            <input
                                type="text"
                                id='mobile'
                                className='bg-blue-50 p-2 pl-10 w-full border border-gray-300 
                                        rounded-md focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 peer'
                                {...register('mobile', { required: true })}
                            />
                            <CiMobile1 className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>
                    </div>
                    <button type='submit' className='bg-primary-Green w-full py-2 font-semibold hover:bg-green-600 text-white rounded-md'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress