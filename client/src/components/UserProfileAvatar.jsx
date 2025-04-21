import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowUpFromBracket } from "react-icons/fa6";
import Axios from "../utils/Axios"
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";
import { FaRegUserCircle } from 'react-icons/fa';

const UserProfileAvatar = ({ close }) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.aploadAvatar,
                data: formData
            })
            const { data: respondeData } = res

            dispatch(updatedAvatar(respondeData.data.avatar))
        } catch (error) {
            AxiosToastError(error)
        } finally {

            setLoading(false)
        }

    }


    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 
        bg-opacity-65 p-4 flex items-center justify-center z-50'>
            <div className='bg-white max-w-sm border w-full rounded-lg p-4 flex flex-col items-center justify-center'>

                <button onClick={close} className='text-neutral-800 w-fit block ml-auto hover:text-red-700 hover:font-semibold '>
                    <IoClose size={30} />
                </button>
                <div className='w-24 h-24 border flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                    {/* Imagen o icono por defecto */}
                    {
                        user.avatar ? (
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaRegUserCircle size={80} className='text-blue-300 w-full h-full' />
                        )
                    }
                </div>

                <form onSubmit={handleSubmit} className='mt-3'>
                    <label htmlFor="uploadProfile" className='cursor-pointer'>
                        <div
                            type='button'
                            className={`${loading ? "p-1 w-24 text-center" : "p-3"} text-lg bg-gray-800 text-white rounded-full shadow-md 
                       hover:bg-gray-700 transition duration-300`}>
                            {loading ? "Loading..." : <FaArrowUpFromBracket />}
                        </div>

                        <input onChange={handleFileChange}
                            type='file'
                            id='uploadProfile'
                            className='hidden'
                            accept="image/*"
                        />
                    </label>
                </form>



            </div>
        </section>
    )
}

export default UserProfileAvatar    