import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import UserProfileAvatar from '../components/UserProfileAvatar';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import { Navigate } from 'react-router-dom';
import ChangePasswordLogin from '../components/ChangePasswordLogin';


const Profile = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [openEditAvatar, setOpenEditAvatar] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [userData, setUserData] = useState({
        name: user?.name || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        mobile: user?.mobile || ''
    })

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setUserData(() => ({
            name: user?.name || '',
            email: user?.email || '',
            mobile: user?.mobile || '',
            lastName: user?.lastName || '',
        }))
    }, [user])

    const handleOnchage = (e) => {
        const { name, value } = e.target
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const res = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })
            const { data: resData } = res
            if (resData.success) {
                toast.success(resData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }


        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    if (!user || !user._id) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='flex items-center justify-center rounded w-full'>
            <div className='flex items-center justify-center border w-full max-w-lg flex-col bg-white p-6 rounded-xl shadow-lg gap-2'>

                {/** Profile upload and display img */}
                <div className='relative w-24 h-24 border flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                    {/* Imagen o icono por defecto */}
                    {
                        user?.avatar ? (
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <FaRegUserCircle className='text-blue-300 w-full h-full' />
                        )
                    }

                    {/* Botón de cámara sobre la imagen */}
                    <button onClick={() => setOpenEditAvatar(true)} className='absolute bottom-1 right-5 bg-gray-800 text-white p-1 rounded-full shadow-md 
                   hover:bg-gray-700 transition duration-300'>
                        <FaCamera size={16} />
                    </button>
                </div>

                {
                    openEditAvatar && (
                        <UserProfileAvatar close={() => setOpenEditAvatar(false)} />
                    )
                }

                {/** Name, mobile, email, change password*/}
                <form className='grid gap-1.5 w-full' onSubmit={handleSubmit}>
                    <div className='grid'>
                        <label htmlFor="name" className='text-primary-Blue font-semibold'>Nombre</label>
                        <input
                            type='text'
                            id='name'
                            placeholder='Ingresa tu nombre'
                            className='p-2 bg-blue-50 outline-none text-primary-Blue border focus-within:border-blue-500 rounded-md'
                            value={userData.name}
                            name='name'
                            onChange={handleOnchage}
                            required
                        />
                    </div>

                    <div className='grid'>
                        <label htmlFor="lastName" className='text-primary-Blue font-semibold'>Apellido</label>
                        <input
                            type='text'
                            id='lastName'
                            placeholder='Ingresa tu apellido'
                            className='p-2 bg-blue-50 outline-none text-primary-Blue border focus-within:border-blue-500 rounded-md'
                            value={userData.lastName}
                            name='lastName'
                            onChange={handleOnchage}
                            required
                        />
                    </div>

                    <div className='grid'>
                        <label htmlFor="email" className='text-primary-Blue font-semibold'>Correo</label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Ingresa tu correo'
                            className='p-2 bg-blue-50 outline-none text-primary-Blue border focus-within:border-blue-500 rounded-md'
                            value={userData.email}
                            name='email'
                            readOnly
                            onChange={handleOnchage}
                            required
                        />
                    </div>
                    <div className='grid'>
                        <label htmlFor="mobile" className='text-primary-Blue font-semibold'>No. Movil</label>
                        <input
                            type='text'
                            id='mobile'
                            placeholder='Ingresa tu No. Movil'
                            className='p-2 bg-blue-50 outline-none border text-primary-Blue focus-within:border-blue-500 rounded-md'
                            value={userData.mobile}
                            name='mobile'
                            onChange={handleOnchage}
                            required
                        />
                    </div>
                    <div className='flex items-end justify-end'>
                        <button className='rounded-xl px-2 py-1 hover:bg-secundary hover:text-primary-Green'
                            onClick={() => setOpenChangePassword(true)}
                        >
                            Cambiar Contraseña
                        </button>
                    </div>

                    <button className='border font-semibold p-2 rounded-lg hover:bg-primary-Green hover:text-white'>
                        {loading ? "Cargando..." : "Actualizar"}
                    </button>
                </form>
            </div>
            {openChangePassword && (
                <ChangePasswordLogin email={userData.email} close={() => setOpenChangePassword(false)} />
            )}
        </div>
    )
}

export default Profile