import React, { useEffect, useState } from 'react'
import logomv from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { FaArrowLeft } from "react-icons/fa";
import { useRef } from 'react';

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [])


    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })
            

            if (res.data.error) {
                toast.error(res.data.message)
            }

            if (res.data.success) {
                toast.success(res.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: res.data,
                        email: location?.state?.email
                    }
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
        <section className="w-full container mx-auto px-4 mb-10 mt-0">
            <div className="flex flex-col items-center justify-center mx-auto">
                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className='p-0 m-0'>
                            <button onClick={redirectToHomePage} className='flex bg-neutral-400  text-neutral-300 p-1 rounded hover:text-white hover:bg-blue-700'>
                                <FaArrowLeft size={18} />
                                <span className='pl-1 text-xs lg:text-sm'>
                                    Back home
                                </span>
                            </button>
                        </div>
                        <h2 className="flex flex-col items-center justify-center focus:ring-blue-500 text-2xl font-semibold text-gray-900 w-full">
                            <img className="w-24 h-16" src={logomv} alt="logo" />
                            <span className="text-gray-500 font-bold pl-1 text-2xl">
                                Welcome to <span className="text-primary-green font-bold pl-1 text-2xl">Verify OTP</span>
                            </span>
                        </h2>


                        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                            <div className=' relative flex flex-col'>
                                <label htmlFor="otp"
                                    className="block mb-1 text-base font-semibold">
                                    Enter Your OTP:
                                </label>


                                {/* Contenedor con Grid para los inputs OTP */}
                                <div className="grid grid-cols-6 gap-2 mt-3">
                                    {data.map((element, index) => (
                                        <input
                                            key={"otp" + index}
                                            type="text"
                                            id="otp"
                                            ref={(ref) => {
                                                inputRef.current[index] = ref
                                                return ref
                                            }}
                                            value={data[index]}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if (value && index < 5) {
                                                    inputRef.current[index + 1].focus()
                                                }
                                            }}

                                            className="bg-blue-50 p-2 text-center border border-gray-300 outline-none rounded-md w-full max-w-16 text-lg font-bold focus:ring-2 focus:ring-blue-500"
                                            maxLength={1}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"} w-full text-white py-2 rounded font-semibold mt-2 tracking-wide`}>
                                Verify OTP
                            </button>
                        </form>

                        <p className="text-sm font-medium tracking-wide text-black mt-1">
                            Already have account? <Link to={"/login"} className="font-semibold italic text-base hover:underline hover:text-blue-600 text-blue-800">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OtpVerification