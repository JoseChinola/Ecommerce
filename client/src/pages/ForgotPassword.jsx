import React, { useState } from 'react'
import logomv from '../assets/shopmix.png'
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const navigate = useNavigate()


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
        e.preventDefault()

        try {
            const res = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })


            if (res.data.error) {
                toast.error(res.data.message)
            }

            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/verification-otp", {
                    state: data
                })

                setData({
                    email: "",
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
        <section className="w-full container mx-auto px-4 h-full min-h-[80vh] max-h-[75vh]">
            <div className="flex flex-col items-center justify-center mx-auto mr-">
                <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
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
                                Welcome to <span className="text-primary-green font-bold pl-1 text-2xl">Forgot Password</span>
                            </span>
                        </h2>


                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div className='relative'>
                                <label htmlFor="email"
                                    className="block mb-1 text-base font-semibold">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-blue-50 p-2.5 pl-10 w-full border border-gray-300 
                                               rounded-md focus:outline-none 
                                                  focus:ring-2 focus:ring-blue-500 peer"
                                    autoFocus
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com" required="" />
                                <MdOutlineMail size={22} className="absolute left-3 top-2/3 transform -translate-y-1/2 text-gray-500 peer-focus:text-blue-500" />

                            </div>

                            <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-600" : "bg-gray-500"} w-full text-white py-2 rounded font-semibold mt-2 tracking-wide`}>
                                Send OTP
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

export default ForgotPassword