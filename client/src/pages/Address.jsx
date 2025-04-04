import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaHome, FaCity, FaMapMarkedAlt, FaPhoneAlt, FaPlus } from 'react-icons/fa'
import { MdDelete, MdModeEdit } from "react-icons/md";
import AddAddress from '../components/AddAddress'
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/useGlobalContext';
import ConfirmBox from '../components/ConfirmBox';


const Address = () => {
    const addressList = useSelector(state => state.addresses.addressList)
    const [openAddress, setOpenAddress] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [editData, setEditData] = useState({})
    const [deleteAddress, setDeleteAddress] = useState({ _id: '' });
    const { fetchAddress } = useGlobalContext()
    console.log("deleteAddress", deleteAddress)

    const handleDisableAddress = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.disableAddress,
                data: {
                    _id: deleteAddress
                }
            })
            const { data: resData } = response
            if (resData.success) {
                toast.success(resData.message)
                if (fetchAddress) {
                    fetchAddress()
                }
                setOpenDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className='grid gap-4 p-3'>
            <div className='bg-white shadow-lg px-4 my-2 py-3  rounded-lg'>
                <h2 className='font-semibold'>Address</h2>
            </div>
            {/* Section Address */}
            <div className="w-full bg-blue-50 p-4 rounded-xl border">
                <div className="flex justify-between items-center w-full mb-4">
                    <h3 className="text-2xl font-bold px-2 capitalize">Your addresses</h3>
                    <div
                        onClick={() => setOpenAddress(true)}
                        className="flex items-center gap-2 bg-white rounded-lg border-2 border-dashed border-blue-300 p-2 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                        <FaPlus className="text-blue-600" />
                        <span className="text-blue-600 font-medium">Add address</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                    {addressList.map((address, index) => (

                        <div
                            key={index}
                            className={`bg-white border rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 cursor-pointer w-full h-full flex flex-col justify-between hover:border-primary-Green
                               ${!address.status && 'hidden'}
                                }`}
                        >
                            <div className='flex items-center justify-between'>
                                <button onClick={() => {
                                    setOpenEdit(true)
                                    setEditData(address)
                                }}
                                    className='border border-green-500 text-green-500 p-1 rounded-full hover:text-white hover:bg-green-500'>
                                    <MdModeEdit />
                                </button>

                                <button onClick={() => {
                                    setDeleteAddress(address._id)
                                    setOpenDelete(true)
                                }} className='border border-red-500 text-red-500 p-1 rounded-full hover:text-white hover:bg-red-500'>
                                    <MdDelete />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <FaHome className="text-xl text-gray-600" />
                                <p className="text-xl font-semibold">{address.address_line}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <FaCity className="text-gray-500" />
                                <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2 border-t pt-2">
                                <FaMapMarkedAlt className="text-gray-500" />
                                <p className="text-sm text-gray-500">{address.country} - {address.pincode}</p>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <FaPhoneAlt className="text-gray-500" />
                                <p className="text-sm text-gray-500 font-bold">{address.mobile}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
            {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
            {openDelete && (
                <ConfirmBox
                    close={() => setOpenDelete(false)}
                    cancel={() => setOpenDelete(false)}
                    confirm={handleDisableAddress}
                />
            )}

        </div>
    )
}

export default Address