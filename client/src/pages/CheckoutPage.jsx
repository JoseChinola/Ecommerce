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
import { Navigate, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'


const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchMovements } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const cartItemsList = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)
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
                if (fetchMovements) {
                    fetchMovements()
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
            toast.loading("Cargando...")
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

    if (!user || !user._id) {
        return <Navigate to="/" />;
    }


    return (
        <section className="bg-blue-50 rounded-md">
            <div className="container w-full mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between">

                {/* Section Address */}
                <div className="w-full lg:w-2/3 bg-[#aeddd2] p-4 rounded-xl border">
                    <div className="flex justify-between items-center w-full mb-6 flex-col md:flex-row gap-2">
                        <h3 className="md:text-2xl font-bold px-2 text-primary-Green capitalize">Elige tu dirección</h3>
                        <button
                            onClick={() => setOpenAddress(true)}
                            className="flex items-center text-sm md:text-base gap-2 bg-white rounded-lg border-2 border-dashed border-primary-Green text-primary-Green hover:text-white p-2 hover:bg-primary-Green  transition-colors cursor-pointer"
                        >
                            <FaPlus className="" />
                            <span className="font-medium capitalize">Agregar dirección</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 items-center">
                        {addressList.map((address, index) => (
                            <label htmlFor={"address" + index} key={index} className={`w-full h-full ${!address.status && "hidden"}`} >
                                <div
                                    className={` border rounded-xl shadow-md py-3 px-5 hover:shadow-xl 
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
                                            className="accent-primary-Green "
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-center">
                                        <FaHome size={18} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`${Number(selectAddress) === index ? 'font-semibold' : 'text-gray-500'} line-clamp-2 capitalize text-xs xl:text-sm`}>{address.address_line}</p>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2 border-t pt-1">
                                        <FaCity size={18} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-xs xl:text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.city}, {address.state}</p>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 pt-2">
                                        <FaMapMarkedAlt size={18} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-xs xl:text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.country} - {address.pincode}</p>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <FaPhoneAlt size={18} className={`${Number(selectAddress) === index ? 'text-primary-Green' : 'text-gray-500'}`} />
                                        <p className={`text-xs xl:text-sm  font-bold ${Number(selectAddress) === index ? 'text-green-500' : 'text-gray-500'}`}>{address.mobile}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="w-full md:max-w-sm h-full py-4 px-3 rounded-xl border bg-[#aeddd2]">
                    <h3 className="text-lg font-semibold mb-2 text-primary-Green">Resumen</h3>
                    <div className="p-3 rounded-lg flex flex-col gap-1.5 border bg-white">
                        <div className="flex justify-between items-center relative group">
                            <h3 className="font-semibold text-sm md:text-base">Detalles de la factura</h3>
                        </div>

                        <div className="flex text-sm md:text-base px-2 gap-2 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Total artículos</p>
                            <p className="flex items-center gap-2 font-medium">
                                <span className="line-through text-neutral-400">{DisplayPriceDOP(notDiscountTotalPrice)}</span>
                                <span>{DisplayPriceDOP(totalPrice)}</span>
                            </p>
                        </div>

                        <div className="flex text-sm md:text-base px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Cantidad total</p>
                            <p className="text-neutral-600 font-medium">{totalQty} item</p>
                        </div>

                        <div className="flex text-sm md:text-base px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1">
                            <p>Cargo de entrega</p>
                            <p className="font-medium text-neutral-600">Gratis</p>
                        </div>

                        <div className="flex font-semibold justify-between items-center gap-4 text-sm md:text-base">
                            <p>Total</p>
                            <p className="text-blue-500">{DisplayPriceDOP(totalPrice)}</p>
                        </div>
                    </div>

                    <div className="w-full text-sm md:text-base flex flex-col sm:justify-between items-center gap-3 my-2 p-3 rounded-lg bg-white">
                        <button
                            onClick={handleOnlinePayment}
                            disabled={cartItemsList.length === 0 || addressList.length === 0}
                            className={`py-2 px-4 w-full bg-primary-Green hover:bg-green-600 text-white font-semibold rounded-md 
    ${cartItemsList.length === 0 || addressList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
  `}
                        >
                            Pago Online
                        </button>

                        <button
                            onClick={handleCashOndelivery}
                            disabled={cartItemsList.length === 0 || addressList.length === 0}
                            className={`py-2 px-4 w-full border-2 capitalize border-primary-Green hover:bg-green-600 text-green-500 font-semibold rounded-md hover:text-white 
    ${cartItemsList.length === 0 || addressList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
  `}
                        >
                            Pago contra entrega
                        </button>
                    </div>
                </div>
            </div>

            {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        </section >
    )
}

export default CheckoutPage
