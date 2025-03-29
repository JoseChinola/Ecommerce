import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CiUser } from "react-icons/ci";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import Divider from './Divider';
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import { MdCategory, MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { PiSubtractFill } from "react-icons/pi";
import { AiFillProduct } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa6";
import isAdmin from '../utils/isAdmin';


const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const res = await Axios({
                ...SummaryApi.logout
            })

            if (res.data.success) {
                if (close) {
                    close()
                }
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

    const handleClose = () => {
        if (close) {
            close()
        }
    }

    return (
        <div>
            <div className='font-semibold select-none p-2'>
                <p className='text-base mb-2 flex gap-2 italic items-center'><CiUser size={20} /> My Accout</p>
                <h5 className='text-sm flex items-center gap-3 text-[#1b406c] italic'>
                    <span className='uppercase'>
                        {user?.name || user?.mobile}
                        <span className='capitalize text-sm text-red-500 ml-1'>
                            {user?.role === 'ADMIN' ? "(Admin)" : ""}
                        </span>
                    </span>

                    <Link onClick={handleClose} to={"/dashboard/profile"} className='font-bold text-[#13bd24] hover:text-blue-500'>
                        <HiOutlineExternalLink size={20} />
                    </Link>
                </h5>
            </div>
            <Divider />
            <div className='text-sm grid gap-3 select-none'>

                {/* Enlaces con efecto hover */
                    isAdmin(user.role) && (
                        <>
                            < Link onClick={handleClose} to={"/dashboard/category"}
                                className='flex gap-3 items-center text-[#1b406c]
                            text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'
                            > <MdCategory size={18} /> Category
                            </Link>

                            <Link onClick={handleClose} to={"/dashboard/subcategory"} className='flex gap-3 items-center text-[#1b406c] text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'>
                                <PiSubtractFill size={18} /> Sub Category
                            </Link>

                            <Link onClick={handleClose} to={"/dashboard/apload-product"} className='flex gap-3 items-center text-[#1b406c] text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'>
                                <MdOutlineProductionQuantityLimits size={18} />  Upload Product
                            </Link>

                            <Link onClick={handleClose} to={"/dashboard/product"} className='flex gap-3 items-center text-[#1b406c] text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'>
                                <AiFillProduct size={18} />  Product
                            </Link>

                        </>
                    )
                }







                <Link onClick={handleClose} to={"/dashboard/myorders"} className='flex gap-3 items-center text-[#1b406c] text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'>
                    <TbTruckDelivery size={18} />  My Orders
                </Link>
                <Link onClick={handleClose} to={"/dashboard/address"} className='flex gap-3 items-center text-[#1b406c] text-sm px-3 transition duration-300 hover:font-semibold hover:text-[#1b406c]'>
                    <FaRegAddressCard
                        size={18}
                    />  Save Address
                </Link>

                {/* Botón con animaciones en hover */}
                <button onClick={handleLogout} className='flex text-sm text-left
                    items-center gap-5 mt-2 px-3 py-1 rounded 
                    text-gray-600
                    hover:bg-orange-200
                    active:scale-95 hover:font-semibold
                    transition duration-300 ease-in-out'>
                    Log Out
                    <IoIosLogOut size={18} />
                </button>

            </div>
        </div >
    )
}

export default UserMenu