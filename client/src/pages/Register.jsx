import React, { useState } from 'react'
import logomv from '../assets/logo.png'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';



const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)


    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be same");
            return;
        }

        try {
            const res = await Axios({
                ...SummaryApi.register,
                data: data
            });

            if (res.data.error) {
                toast.error(res.data.message);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/verifyEmail-register");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const redirectToHomePage = () => {
        navigate("/")
    }

    return (
        <section className='w-full container mx-auto px-4'>
            <div className='bg-white w-full max-w-lg mx-auto rounded p-4'>

                <div onClick={redirectToHomePage} className='flex justify-center items-center flex-row cursor-pointer'>
                    <h2 to={"/"} className="flex flex-col items-center gap-1 justify-center focus:ring-blue-500 font-semibold text-gray-900 w-full">
                        <img className="w-20 h-20" src={logomv} alt="logo" />
                        <span className="text-gray-500 font-bold text-sm md:text-xl flex items-center flex-col gap-2">
                            Bienvenido <Link to={"/"} className="text-primary-Green font-bold text-sm md:text-xl">D’RAF SERVICES</Link>
                        </span>
                    </h2>
                </div>

                <form action="" className='flex flex-col gap-3' onSubmit={handleSubmit}>


                    {/* name input */}
                    <div className='grid gap-1'>
                        <label htmlFor="name" className='font-semibold'>Nombre: </label>
                        <div className="relative">
                            <input
                                type="text"
                                dir='name'
                                autoFocus
                                className="bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                                name='name'
                                value={data.name}
                                onChange={handleChange}
                                placeholder='introduce tu nombre'
                            />
                            <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                    </div>

                    {/* email input */}
                    <div className='grid gap-1'>
                        <label htmlFor="email" className='font-semibold'>Correo: </label>
                        <div className="relative">
                            <input
                                type="email"
                                dir='email'
                                autoFocus
                                className="bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='Introduce tu correo'
                            />
                            <MdOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                        </div>

                    </div>
                    <div className='grid grid-cols-2 gap-5'>
                        {/* password input */}
                        <div className='grid gap-1'>
                            <label htmlFor="password" className='font-semibold'>Contraseña: </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    dir='password'
                                    autoFocus
                                    className="bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='Introduce tu contraseña'
                                />
                                <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                    {
                                        showPassword ? (
                                            <FaRegEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                        ) : (
                                            <FaRegEyeSlash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                        )
                                    }
                                </div>

                            </div>
                        </div>

                        {/* Confirm Password input */}
                        <div className='grid gap-1'>
                            <label htmlFor="confirmPassword" className='font-semibold'>Confirmar Contraseña: </label>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    id='confirmPassword'
                                    autoFocus
                                    className="bg-blue-50 p-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder='confirma tu contraseña'
                                />
                                <RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                <div onClick={() => setShowPasswordConfirm(preve => !preve)} className='cursor-pointer'>
                                    {
                                        showPasswordConfirm ? (
                                            <FaRegEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                        ) : (
                                            <FaRegEyeSlash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />
                                        )
                                    }
                                </div>
                            </div>

                        </div>

                    </div>
                    <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"}  text-white py-1 rounded font-semibold mt-1 tracking-wide w-full`}>
                        Registrar
                    </button>
                </form>

                <p className="text-sm font-medium tracking-wide text-black mt-1">
                    ¿Ya tienes cuenta? <Link to={"/login"} className="font-semibold italic text-base hover:underline hover:text-blue-600 text-blue-800">Login</Link>
                </p>
            </div>
        </section>

    )
}

export default Register