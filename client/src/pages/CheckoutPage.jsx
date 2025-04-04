import React, { useState } from 'react'
import { FaHome, FaCity, FaMapMarkedAlt, FaPhoneAlt, FaPlus } from 'react-icons/fa'
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP'
import { useGlobalContext } from '../provider/useGlobalContext'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../cammon/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'


const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const cartItemsList = useSelector(state => state.cartItem.cart)
    const [selectAddress, setSelectAddress] = useState(0)
    const navigate = useNavigate()

    const handleCashOndelivery = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.cashOnDeleveryOrder,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: totalPrice,
                }
            })

            const { data: resData } = response
            if (resData.success) {
                toast.success(resData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
                navigate('/success', {
                    state: {
                        text: "Order"
                    }
                })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleOnlinePayment = async () => {
        try {
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

            const stripePromise = await loadStripe(stripePublicKey)

            const response = await Axios({
                ...SummaryApi.payment_url,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: totalPrice,
                }
            })

            const { data: resData } = response
            stripePromise.redirectToCheckout({ sessionId: resData.id })
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="bg-blue-50 rounded">
            <div className="container w-full mx-auto p-6 flex flex-col lg:flex-row gap-5 justify-between">

                {/* Section Address */}
                <div className="w-full bg-white p-4 rounded-xl border">
                    <div className="flex justify-between items-center w-full mb-6">
                        <h3 className="text-2xl font-bold px-2">Choose your address</h3>
                        <div
                            onClick={() => setOpenAddress(true)}
                            className="flex items-center gap-2 bg-white rounded-lg border-2 border-dashed border-primary-Green p-2 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                            <FaPlus className="text-primary-Green" />
                            <span className="text-primary-Green font-medium">Add address</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center p-1">
                        {addressList.map((address, index) => (
                            <label htmlFor={"address" + index} key={index} className={`w-full h-full ${!address.status && "hidden"}`} >
                                <div
                                    className={` border rounded-xl shadow-md p-5 hover:shadow-xl 
                                        transition-all duration-300 cursor-pointer w-full h-full flex flex-col 
                                        justify-between ${Number(selectAddress) === index ? 'border-primary-Green bg-blue-50 text-primary-Green' : 'bg-gray-50'
                                        }`}
                                >
                                    <div>
                                        <input
                                            id={"address" + index}
                                            type="radio"
                                            value={index}
                                            name="address"
                                            onChange={(e) => setSelectAddress(e.target.value)}
                                            className="accent-primary-Green"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
                                        <FaHome size={22} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`${Number(selectAddress) === index ? 'font-semibold' : 'text-gray-500'} line-clamp-2 capitalize`}>{address.address_line}</p>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 border-t pt-1">
                                        <FaCity size={22} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.city}, {address.state}</p>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 pt-2">
                                        <FaMapMarkedAlt size={22} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.country} - {address.pincode}</p>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <FaPhoneAlt size={18} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.mobile}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-white w-full max-w-md py-4 px-3 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <div className="p-3 rounded-lg flex flex-col gap-1.5 border">
                        <div className="flex justify-between items-center relative group">
                            <h3 className="font-semibold">Bill Details</h3>
                            {/*** Aquí podrías agregar un tooltip o icono informativo si lo deseas ***/}
                        </div>
                        <div className="flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Items total</p>
                            <p className="flex items-center gap-2 font-medium">
                                <span className="line-through text-neutral-400">{DisplayPriceDOP(notDiscountTotalPrice)}</span>
                                <span>{DisplayPriceDOP(totalPrice)}</span>
                            </p>
                        </div>
                        <div className="flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Quantity total</p>
                            <p className="text-neutral-600 font-medium">{totalQty} item</p>
                        </div>
                        <div className="flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Delivery Charge</p>
                            <p className="font-medium text-neutral-600">Free</p>
                        </div>
                        <div className="flex font-semibold justify-between items-center gap-4">
                            <p>Grand Total</p>
                            <p className="text-blue-500">{DisplayPriceDOP(totalPrice)}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col sm:justify-between items-center gap-3 my-2 p-1 rounded-lg">
                        <button onClick={handleOnlinePayment} className="py-2 px-4 w-full bg-primary-Green hover:bg-green-600 text-white font-semibold rounded-md">
                            Online Payment
                        </button>

                        <button onClick={handleCashOndelivery}
                            className="py-2 px-4 w-full border-2 border-primary-Green hover:bg-green-600 text-green-500 font-semibold rounded-md hover:text-white">
                            Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>

            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        </section >
    )
}

export default CheckoutPage
