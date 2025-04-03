import React, { useState } from 'react'
import logomv from '../assets/shopmix.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import useMobile from '../hooks/useMobile'
import { GiShoppingCart } from "react-icons/gi"
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import UserMenu from './UserMenu';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { useGlobalContext } from '../provider/useGlobalContext'
import DisplayCartItem from './DisplayCartItem';


const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector((state) => state?.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)
    


    const isSearchPage = location.pathname === "/search"

    // Rutas en las que el header no debe mostrarse
    const isHidden = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password" || location.pathname === "/verification-otp" || location.pathname === "/reset-password";

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }
    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }


        navigate("/user")
    }

    if (isHidden) return <div className='xl:h-20 h-5'></div>;


    return (
        <header className='h-28 lg:h-20 lg:shadow-md w-full sticky z-40 top-0 flex items-center flex-col justify-center lg:gap-10 bg-white'>
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center  px-2 justify-between'>

                        {/* logo */}
                        <div className='h-full'>
                            <Link to={"/"} className='h-full flex items-center'>
                                <img
                                    src={logomv}
                                    width={110}
                                    height={40}
                                    alt='logo'
                                    className='hidden lg:block'
                                />

                                <img
                                    src={logomv}
                                    width={85}
                                    height={60}
                                    alt='logo'
                                    className='lg:hidden'
                                />


                                <h2 className='text-2xl lg:italic lg:text-lg lg:flex flex-col lg:text-left text-primary-Green text-center uppercase font-extrabold'>
                                    ShopMix
                                    <span className='hidden lg:flex text-sm italic font-medium animate-bounce'>
                                        Your world, in one place
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
                            <div className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>

                                {
                                    user?._id ? (
                                        <>
                                            <div className='relative'>
                                                <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none justify-center items-center cursor-pointer gap-1'>
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
                                                <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none justify-center items-center cursor-pointer gap-1'>
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
                                                    {/* Íconos */}
                                                    {
                                                        openUserMenu ? (
                                                            <GoTriangleUp size={23} />
                                                        ) : (
                                                            <GoTriangleDown size={23} />
                                                        )
                                                    }


                                                </div>
                                                {openUserMenu && (
                                                    <div className='absolute right-0 top-16'>
                                                        <div className={`bg-white border rounded-tl-3xl  rounded-br-3xl rounded p-4  ${openUserMenu ? "min-w-60" : "min-w-52"} lg:shadow-lg`}>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )}

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

            <div className='container mx-auto px-2 lg:hidden'>
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