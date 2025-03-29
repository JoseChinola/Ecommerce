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


const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)

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
                            <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>

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
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <FaRegCircleUser size={28} /> 
                                    )
                                }
                            </button>

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

                                            <button className="relative group">
                                                {/* Carrito con icono */}
                                                <div className="relative animate-pulse">
                                                    <GiShoppingCart size={35} color='green' />
                                                    {/* Notificación del carrito */}
                                                    <span className="bg-green-600 text-white group-hover:bg-green-500 w-6 h-6 flex items-center justify-center 
                                                        text-sm font-semibold absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full 
                                                        transition-colors duration-300">
                                                        0
                                                    </span>
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
        </header>
    )
}

export default Header