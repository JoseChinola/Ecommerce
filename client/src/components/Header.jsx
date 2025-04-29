import React, { useState } from 'react'
import logomv from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile'
import { GiShoppingCart } from "react-icons/gi"
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { useGlobalContext } from '../provider/useGlobalContext'
import DisplayCartItem from './DisplayCartItem';


const Header = ({ toggleAside }) => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const cartItem = useSelector((state) => state?.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)



    const isSearchPage = location.pathname === "/search"

    // Rutas en las que el header no debe mostrarse
    const isHidden = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname === "/verification-otp" || location.pathname === "/reset-password" || location.pathname === "/verify-email" || location.pathname === "/verifyEmail-register";

    const redirectToLoginPage = () => {
        navigate("/login")
    }


    if (isHidden) return <div className='xl:h-14 h-5'></div>;


    return (
        <header className='h-28 lg:h-20 lg:shadow-md flex px-2 md:items-center justify-center flex-col gap-2 bg-white rounded-lg mx-3 mt-2'>
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center justify-between'>
                        {/* Botón hamburguesa solo en móviles */}
                        <button
                            onClick={toggleAside}
                            className='md:hidden text-2xl text-gray-700'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5" />
                            </svg>
                        </button>
                        {/* logo */}
                        <div className='h-full'>
                            <Link to={"/"} className='h-full flex items-center gap-3 ml-4'>
                                <img
                                    src={logomv}
                                    width={70}
                                    height={40}
                                    alt='logo'
                                    className='hidden lg:block'
                                />

                                <img
                                    src={logomv}
                                    width={50}
                                    height={60}
                                    alt='logo'
                                    className='lg:hidden'
                                />


                                <h2 className='text-md lg:italic lg:text-lg lg:flex flex-col lg:text-left text-primary-Green text-center uppercase font-extrabold'>
                                    D’RAF SERVICES
                                    <span className='hidden lg:flex text-sm italic font-medium animate-bounce'>
                                        SERVIRTE ES NUESTRO COMPROMISO
                                    </span>
                                </h2>

                            </Link>
                        </div>

                        {/* seacrch */}
                        <div className='hidden lg:block'>
                            <Search />
                        </div>


                        {/* login and cart */}
                        <div>
                            {/* user icons display in only mobile version  */}
                            <div className='text-neutral-600 lg:hidden'>

                                {
                                    user?._id ? (
                                        <>
                                            <div className='relative'>
                                                <div className='flex select-none justify-center items-center cursor-pointer gap-1'>
                                                    {/* Contenedor de la imagen con tamaño fijo y centrado */}
                                                    <div className='w-10 h-10 lg:w-20 lg:h-20 rounded-full outline-none flex justify-center items-center overflow-hidden'>
                                                        {
                                                            user?.avatar ? (<img
                                                                src={user?.avatar}
                                                                alt='logo'
                                                                className='object-cover w-full h-full'
                                                            />) : (
                                                                <FaRegUserCircle className='w-full h-full text-blue-300 ' />
                                                            )
                                                        }
                                                    </div>

                                                    <button onClick={() => setOpenCartSection(true)} className="relative group flex max-[430px]:hidden">
                                                        {/* Carrito con icono */}
                                                        <div className={`relative ${totalQty ? "" : "animate-pulse"}`}>
                                                            <GiShoppingCart size={35} color='green' />
                                                            {/* Notificación del carrito */}
                                                            {
                                                                cartItem[0] ? (
                                                                    <span className="bg-green-600 text-white group-hover:bg-green-500 w-6 h-6 flex items-center justify-center 
                                                        text-sm font-semibold absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full 
                                                        transition-colors duration-300">
                                                                        {totalQty}
                                                                    </span>
                                                                ) : (
                                                                    <span className=''>
                                                                    </span>
                                                                )
                                                            }

                                                        </div>
                                                        <div className='flex items-end justify-center'>
                                                            {
                                                                totalPrice === 0 ? (
                                                                    <span className=''>
                                                                    </span>
                                                                ) : (
                                                                    <span className='bg-green-600 text-sm w-fit text-white p-[1px] rounded-md text-center'>
                                                                        {DisplayPriceDOP(totalPrice)}
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <FaRegCircleUser size={28} />
                                    )
                                }
                            </div>

                            {/* desktop */}
                            <div className='hidden lg:flex items-center gap-4 p-10'>
                                {
                                    user?._id ? (
                                        <>
                                            <div className='relative'>
                                                <Link to={"/profile"} className='flex select-none justify-center items-center cursor-pointer gap-1'>
                                                    {/* Contenedor de la imagen con tamaño fijo y centrado */}
                                                    <div className='w-14 h-14 rounded-full outline-none flex justify-center items-center overflow-hidden'>
                                                        {
                                                            user?.avatar ? (<img
                                                                src={user?.avatar}
                                                                alt='logo'
                                                                className='object-cover w-full h-full'
                                                            />) : (
                                                                <FaRegUserCircle className='w-full h-full text-blue-300 ' />
                                                            )
                                                        }

                                                    </div>


                                                </Link>
                                            </div>


                                            {/** Cart  */}
                                            <button onClick={() => setOpenCartSection(true)} className="relative group flex">
                                                {/* Carrito con icono */}
                                                <div className={`relative ${totalQty ? "" : "animate-pulse"}`}>
                                                    <GiShoppingCart size={35} color='green' />
                                                    {/* Notificación del carrito */}
                                                    {
                                                        cartItem[0] ? (
                                                            <span className="bg-green-600 text-white group-hover:bg-green-500 w-6 h-6 flex items-center justify-center 
                                                        text-sm font-semibold absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full 
                                                        transition-colors duration-300">
                                                                {totalQty}
                                                            </span>
                                                        ) : (
                                                            <span className=''>
                                                            </span>
                                                        )
                                                    }

                                                </div>
                                                <div className='flex items-end justify-center'>
                                                    {
                                                        totalPrice === 0 ? (
                                                            <span className=''>
                                                            </span>
                                                        ) : (
                                                            <span className='bg-green-600 text-sm w-fit text-white p-[1px] rounded-md text-center'>
                                                                {DisplayPriceDOP(totalPrice)}
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                            </button>
                                        </>

                                    ) : (
                                        <button onClick={redirectToLoginPage} className='text-lg px-2 font-medium hover:font-semibold hover:text-blue-700' >Login</button>
                                    )
                                }

                            </div>
                        </div>

                    </div>
                )
            }

            <div className='container lg:hidden w-full'>
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }

        </header >
    )
}

export default Header