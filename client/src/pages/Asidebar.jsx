import React from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux'
import { CiUser } from "react-icons/ci"
import { HiOutlineExternalLink } from "react-icons/hi"
import { NavLink, useNavigate } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io"
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { MdCategory, MdHome, MdInventory, MdOutlineDashboard, MdOutlineProductionQuantityLimits } from 'react-icons/md'
import { PiSubtractFill } from "react-icons/pi"
import { AiFillProduct } from "react-icons/ai"
import { TbTruckDelivery } from "react-icons/tb"
import { FaRegAddressCard } from "react-icons/fa6"
import isAdmin from '../utils/isAdmin'
import Divider from '../components/Divider';
import { FaRegUserCircle, FaUser } from 'react-icons/fa';

const Asidebar = ({ isOpen, closeAside }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const res = await Axios({ ...SummaryApi.logout })

            if (res.data.success) {
                dispatch(logout())
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                toast.success(res.data.message)
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const linkClass = 'flex items-center gap-3 text-sm px-3 py-1.5 transition duration-300 rounded hover:bg-gray-100'
    const activeClass = 'font-semibold text-[#13bd24] bg-gray-200'

    return (
        <>
            {/* Fondo oscuro en móvil */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'block' : 'hidden'}`}
                onClick={closeAside}
            ></div>

            <aside
                className={`w-[225px] h-screen bg-white shadow-md fixed top-0 left-0 z-50 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                {/* Botón cerrar solo en móvil */}
                <div className='flex justify-end p-2 md:hidden'>
                    <button onClick={closeAside}>
                        <IoMdClose size={24} />
                    </button>
                </div>

                <div className='h-full w-full p-4 flex flex-col'>
                    <div className='font-semibold select-none md:mb-2'>
                        <p className='mb-2 flex italic items-center justify-center'>
                            <div className='w-10 h-10 lg:w-14 lg:h-12 rounded-full outline-none flex justify-center items-center overflow-hidden'>
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
                        </p>
                        <h5 className='text-sm flex items-center justify-center text-[#1b406c] italic'>
                            <span className='uppercase flex flex-col justify-center items-center'>
                                {user?.name || user?.mobile}
                                {user?.role === 'ADMIN' && (
                                    <span className='capitalize text-sm text-red-500 ml-1'>(Admin)</span>
                                )}
                            </span>
                        </h5>
                    </div>

                    <Divider />

                    <div className='text-sm grid gap-2 select-none md:mt-1 px-4'>
                        {isAdmin(user.role) && (
                            <NavLink to="/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                <MdOutlineDashboard size={18} /> Dashboard
                            </NavLink>
                        )}
                        <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                            <MdHome size={18} /> Home
                        </NavLink>

                        {isAdmin(user.role) && (
                            <>
                                <NavLink to="/inventory" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                    <MdInventory size={18} /> Inventory
                                </NavLink>
                                <NavLink to="/category" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                    <MdCategory size={18} /> Category
                                </NavLink>

                                <NavLink to="/subcategory" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                    <PiSubtractFill size={18} /> Sub Category
                                </NavLink>

                                <NavLink to="/upload-product" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                    <MdOutlineProductionQuantityLimits size={18} /> Upload Product
                                </NavLink>

                                <NavLink to="/product" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                                    <AiFillProduct size={18} /> Product
                                </NavLink>
                            </>
                        )}

                        <NavLink to={"/profile"} className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                            <FaUser size={18} /> Profile
                        </NavLink>

                        <NavLink to="/myorders" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                            <TbTruckDelivery size={18} /> My Orders
                        </NavLink>

                        <NavLink to="/address" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : 'text-[#1b406c]'}`}>
                            <FaRegAddressCard size={18} /> Save Address
                        </NavLink>

                        <Divider />

                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-3 text-sm text-left px-3 py-2 rounded text-gray-600 hover:bg-red-100 hover:text-red-500 transition duration-300'
                        >
                            <IoIosLogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Asidebar
