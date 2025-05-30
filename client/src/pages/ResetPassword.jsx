import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logomv from '../assets/logo.png'
import { FaArrowLeft } from "react-icons/fa";
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../cammon/SummaryApi';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';


const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const valideValue = Object.values(data).every(el => el)

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate("/")
        }
        if (location?.state?.email) {
            setData((preve) => {
                return {
                    ...preve,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.newPassword !== data.confirmPassword) {
            toast.error(
                "New Password and confirm password must be same"
            )

            return
        }

        try {
            const res = await Axios({
                ...SummaryApi.reset_password,
                data: data
            })


            if (res.data.error) {
                toast.error(res.data.message)
            }

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")

                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })


            }

        } catch (error) {
            AxiosToastError(error)
        }


    }


    const redirectToHomePage = () => {
        navigate("/")
    }


    return (
        <section className="w-full container mx-auto px-3">
            <div className="flex flex-col items-center justify-center mx-auto mr-">
                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-2 sm:p-8">
                        <div className='p-0 m-0'>
                            <button onClick={redirectToHomePage} className='flex bg-neutral-400  text-neutral-300 p-1 rounded hover:text-white hover:bg-blue-700'>
                                <FaArrowLeft size={18} />
                                <span className='pl-1 text-xs lg:text-sm'>
                                    Pagina Inicio
                                </span>
                            </button>
                        </div>
                        <h2 className="flex flex-col items-center justify-center focus:ring-blue-500 text-2xl font-semibold text-gray-900 w-full">
                            <img className="w-24 h-16" src={logomv} alt="logo" />
                            <span className="text-gray-500 font-bold pl-1 text-2xl text-center">
                                Restablecer contraseña
                            </span>
                        </h2>


                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {/* password */}
                            <div className='relative'>
                                <label htmlFor="newPassword"
                                    className="block mb-1 text-base font-semibold">
                                    Nueva Contraseña:
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    id="newPassword"
                                    className="bg-blue-50 p-2.5 pl-10 w-full border border-gray-300 
                                           rounded-md focus:outline-none 
                                              focus:ring-2 focus:ring-blue-500 peer"
                                    autoFocus
                                    value={data.newPassword}
                                    onChange={handleChange}
                                    placeholder="Ingresa contraseña" required="" />

                                <RiLockPasswordLine
                                    size={22}
                                    className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500"
                                />
                                {/* Icono del ojo para mostrar/ocultar contraseña */}
                                <div
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 cursor-pointer peer-focus:text-blue-500"
                                >
                                    {showPassword ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
                                </div>
                            </div>

                            {/* Confirm Password input */}
                            <div className='relative'>
                                <label htmlFor="confirmPassword"
                                    className="block mb-1 text-base font-semibold">
                                    Confirmar Contraseña:
                                </label>
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="bg-blue-50 p-2.5 pl-10 w-full border border-gray-300 
                                           rounded-md focus:outline-none 
                                              focus:ring-2 focus:ring-blue-500 peer"
                                    autoFocus
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirma contraseña" required="" />

                                <RiLockPasswordLine
                                    size={22}
                                    className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500"
                                />
                                {/* Icono del ojo para mostrar/ocultar contraseña */}
                                <div
                                    onClick={() => setShowPasswordConfirm(prev => !prev)}
                                    className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 cursor-pointer peer-focus:text-blue-500"
                                >
                                    {showPasswordConfirm ? <FaRegEyeSlash size={22} /> : <FaRegEye size={22} />}
                                </div>
                            </div>
                            <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"} w-full text-white py-2 rounded font-semibold mt-2 tracking-wide`}>
                                Cambiar la contraseña
                            </button>
                        </form>

                        <p className="text-sm font-medium tracking-wide text-black mt-1">
                            ¿Ya tienes cuenta? <Link to={"/login"} className="font-semibold italic text-base hover:underline hover:text-blue-600 text-blue-800">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword