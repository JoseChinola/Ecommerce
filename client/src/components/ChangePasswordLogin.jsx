import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { RiLockPasswordLine } from 'react-icons/ri'
import logomv from '../assets/logo.png'
import { IoClose } from 'react-icons/io5'

const ChangePasswordLogin = ({ email, close }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })


    useEffect(() => {
        if (email) {
            setData({
                email: email || '',
                newPassword: '',
                confirmPassword: '',
            });
        }

    }, [email])

    const valideValue = Object.values(data).every(el => el)


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
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
                if (close) {
                    close()
                }


            }

        } catch (error) {
            AxiosToastError(error)
        }


    }

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
            <div className="flex flex-col items-center justify-center mx-auto w-full">
                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                    <div className="p-5 space-y-4 md:space-y-3">
                        <div className='p-0 m-0 flex justify-end'>
                            <button onClick={close} className='flex bg-neutral-400  text-white p-1 rounded-xl hover:text-white hover:bg-red-500'>
                                <IoClose size={20} />
                            </button>
                        </div>
                        <h2 className="flex flex-col items-center justify-center focus:ring-blue-500 text-2xl font-semibold text-gray-900 w-full">
                            <img className="w-20 h-16" src={logomv} alt="logo" />
                            <span className="text-gray-500 font-bold pl-1 text-2xl">Cambiar Contraseña</span>
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
                                                   rounded-lg focus:outline-none 
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
                                    {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
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
                                                   rounded-lg focus:outline-none 
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
                                    {showPasswordConfirm ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
                                </div>
                            </div>
                            <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"} w-full text-white py-2 rounded-lg font-semibold mt-2 tracking-wide`}>
                                Cambiar la contraseña
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChangePasswordLogin