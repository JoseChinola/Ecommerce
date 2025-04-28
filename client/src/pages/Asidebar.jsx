import React from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io"
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { MdCategory, MdHome, MdInventory, MdOutlineDashboard, MdOutlineProductionQuantityLimits, MdPayments } from 'react-icons/md'
import { PiSubtractFill } from "react-icons/pi"
import { AiFillProduct } from "react-icons/ai"
import { TbTruckDelivery } from "react-icons/tb"
import { FaRegAddressCard } from "react-icons/fa6"
import isAdmin from '../utils/isAdmin'
import Divider from '../components/Divider';
import { FaRegUserCircle, FaUser, FaUsersCog, FaWarehouse } from 'react-icons/fa';
import { GiArchiveRegister } from 'react-icons/gi';

const Asidebar = ({ isOpen, closeAside }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openInventoryMenu, setOpenInventoryMenu] = React.useState(false);

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

    const getLinkClass = (isActive) => {
        return `flex items-center gap-3 text-sm px-3 py-1 transition duration-300 rounded ${isActive
            ? 'font-semibold text-primary-Green bg-gray-100'
            : 'text-[#1b406c] hover:bg-primary-Green hover:text-white hover:font-medium'
            }`
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'block' : 'hidden'}`}
                onClick={closeAside}
            ></div>

            <aside
                className={`w-[225px] h-screen bg-white shadow-md fixed top-0 left-0 z-50 transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className='flex justify-end p-2 md:hidden'>
                    <button onClick={closeAside}>
                        <IoMdClose size={24} />
                    </button>
                </div>

                <div className='h-full w-full p-4 flex flex-col'>
                    <div className='font-semibold select-none'>
                        <div className='mb-1 flex italic items-center justify-center'>
                            <div className='w-10 h-10 lg:w-14 lg:h-12 rounded-full outline-none flex justify-center items-center overflow-hidden'>
                                {user?.avatar ? (
                                    <img src={user?.avatar} alt='logo' className='object-cover w-full h-full' />
                                ) : (
                                    <FaRegUserCircle className='w-full h-full text-blue-300 ' />
                                )}
                            </div>
                        </div>
                        <h5 className='text-sm flex items-center justify-center text-[#1b406c] italic'>
                            <span className='uppercase flex flex-col justify-center items-center'>
                                {user?.name || user?.mobile}
                                {user?.role === 'ADMIN' && (
                                    <span className='capitalize text-sm text-red-500'>(Admin)</span>
                                )}
                            </span>
                        </h5>
                    </div>

                    <Divider />

                    <div className='text-sm grid gap-1 select-none px-4'>
                        {isAdmin(user.role) && (
                            <NavLink to="/dashboard" className={({ isActive }) => getLinkClass(isActive)}>
                                <MdOutlineDashboard size={18} /> Dashboard
                            </NavLink>
                        )}
                        <NavLink to="/" className={({ isActive }) => getLinkClass(isActive)}>
                            <MdHome size={18} /> Inicio
                        </NavLink>

                        {isAdmin(user.role) && (
                            <div>
                                <button
                                    onClick={() => setOpenInventoryMenu(!openInventoryMenu)}
                                    className="w-full flex items-center justify-between gap-2 text-sm px-3 py-1.5 rounded text-[#1b406c] hover:bg-primary-Green hover:text-white transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <MdInventory size={18} /> Panel Admin
                                    </span>
                                    <span>{openInventoryMenu ? "▴" : "▾"}</span>
                                </button>

                                {openInventoryMenu && (
                                    <div className="ml-4 mt-1 flex flex-col gap-1">
                                        <NavLink to="/warehouse" className={({ isActive }) => getLinkClass(isActive)}>
                                            <FaWarehouse /> Almacén
                                        </NavLink>
                                        <NavLink to="/inventory" className={({ isActive }) => getLinkClass(isActive)}>
                                            <MdInventory /> Inventario
                                        </NavLink>
                                        <NavLink to="/inventory-movements" className={({ isActive }) => getLinkClass(isActive)}>
                                            <GiArchiveRegister /> Movimientos
                                        </NavLink>
                                        <NavLink to="/category" className={({ isActive }) => getLinkClass(isActive)}>
                                            <MdCategory /> Categorías
                                        </NavLink>
                                        <NavLink to="/subcategory" className={({ isActive }) => getLinkClass(isActive)}>
                                            <PiSubtractFill /> Subcategoría
                                        </NavLink>
                                        <NavLink to="/upload-product" className={({ isActive }) => getLinkClass(isActive)}>
                                            <MdOutlineProductionQuantityLimits /> Subir Producto
                                        </NavLink>
                                        <NavLink to="/product" className={({ isActive }) => getLinkClass(isActive)}>
                                            <AiFillProduct /> Productos
                                        </NavLink>                                      
                                    </div>
                                )}
                            </div>
                        )}

                        <NavLink to="/profile" className={({ isActive }) => getLinkClass(isActive)}>
                            <FaUser size={18} /> Perfil
                        </NavLink>

                        <NavLink to="/myorders" className={({ isActive }) => getLinkClass(isActive)}>
                            <TbTruckDelivery size={18} /> Mis pedidos
                        </NavLink>

                        <NavLink to="/checkout" className={({ isActive }) => getLinkClass(isActive)}>
                            <MdPayments size={18} /> Payment
                        </NavLink>

                        <NavLink to="/address" className={({ isActive }) => getLinkClass(isActive)}>
                            <FaRegAddressCard size={18} /> Dirección
                        </NavLink>

                        <Divider />

                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-3 text-sm text-left px-3 py-1 rounded text-gray-600 hover:bg-red-100 hover:text-red-500 transition duration-300'
                        >
                            <IoIosLogOut size={18} /> Salir
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Asidebar