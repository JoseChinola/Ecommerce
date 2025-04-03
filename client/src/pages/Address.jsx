import React from 'react'
import { useSelector } from 'react-redux'
import { FaHome, FaCity, FaMapMarkedAlt, FaPhoneAlt, FaPlus } from 'react-icons/fa'


const Address = () => {
    const addressList = useSelector(state => state.addresses.addressList)

    return (
        <div>
            {/* Section Address */}
            <div className="w-full bg-white p-4 rounded-xl border">
                <div className="flex justify-between items-center w-full mb-4">
                    <h3 className="text-2xl font-bold px-2">Choose your address</h3>
                    <div
                        className="flex items-center gap-2 bg-white rounded-lg border-2 border-dashed border-blue-300 p-2 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                        <FaPlus className="text-blue-600" />
                        <span className="text-blue-600 font-medium">Add address</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                    {addressList.map((address, index) => (
                        <div
                            className={`bg-white border rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer w-full h-full flex flex-col justify-between border-primary-Green
                                }`}
                        >
                            <div className="flex items-center gap-2">
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

        </div>
    )
}

export default Address