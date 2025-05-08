import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/useGlobalContext'
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP'
import { FaCaretRight } from "react-icons/fa";
import { LuDelete } from "react-icons/lu";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import emptyCart from '../assets/cartEmpty.png'
import ConfirmBox from './ConfirmBox'
import toast from 'react-hot-toast'
import { FaMinus } from 'react-icons/fa6'


const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty, deleteCartItems } = useGlobalContext()
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const handleClearCart = () => {
        deleteCartItems()
        setOpenDeleteConfirmBox(false)
        close()
    }

    const handleRedictToCheckoutPage = () => {
        if (user?._id) {
            navigate('/checkout')
            if (close) {
                close()
            }
            return
        }

        toast("Please Login")
    }

    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 left-0 right-0 bg-opacity-70 z-50'>
            <div className='bg-secundary space-y-2 p-1.5 w-full max-w-sm min-h-screen max-h-screen ml-auto rounded-lg overflow-auto'>

                <div className="flex items-center justify-between p-3 rounded-md shadow-md bg-white">
                    <h1 className="font-semibold uppercase italic">Carrito</h1>
                    <Link to={"/"} onClick={close} className="sm:hidden block">
                        <IoClose size={30} />
                    </Link>
                    <button onClick={close} className="w-fit ml-auto hover:text-red-600 hidden sm:block">
                        <IoClose size={30} />
                    </button>
                </div>

                <div className='h-full max-h-[calc(100vh-120px)] bg-blue-50 p-2 flex flex-col gap-3 rounded-lg'>
                    {/** display items  */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between text-sm px-4 py-1.5 bg-blue-100 text-blue-500 gap-2 rounded-full'>
                                    <p>Tu ahorro total</p>
                                    <p className='font-bold'>{DisplayPriceDOP(notDiscountTotalPrice - totalPrice)}</p>
                                </div>
                                <div className='bg-white rounded-lg p-2 grid gap-5 overflow-y-auto scrollbarCustom'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                const images = item?.productData?.image ? JSON.parse(JSON.parse(item?.productData?.image)) : [];
                                                return (
                                                    <div key={item._id + "cartItemDisplay" + index} className='flex w-full gap-4'>
                                                        <div className='w-16 h-16 min-h-16 min-w-16 border rounded-lg'>
                                                            <img
                                                                src={images[0]}
                                                                className='object-scale-down w-full h-full p-[2px]'
                                                            />
                                                        </div>
                                                        <div className='w-full max-w-sm text-sm'>
                                                            <p className='text-sm text-ellipsis line-clamp-2'>
                                                                {item?.productData?.name}
                                                            </p>
                                                            <div className='flex flex-col gap-1 '>
                                                                <p className='text-neutral-400 text-xs'>{item?.productData?.unit}</p>
                                                                <div className='flex-col'>
                                                                    <p className='text-xs text-red-500 font-semibold'>
                                                                        Descuento -{item?.productData?.discount}%
                                                                    </p>
                                                                    <p className='font-semibold text-blue-500 text-xs'>{DisplayPriceDOP(pricewithDiscount(item?.productData?.price, item?.productData?.discount))}</p>
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <div className='w-32'>
                                                            <AddToCartButton data={item?.productData} />
                                                        </div>

                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>
                                <div className='bg-white p-2 rounded-lg flex flex-col gap-1.5 border text-sm'>
                                    <div className="flex justify-between items-center relative group">
                                        <h3 className="font-semibold">Detalles de la factura</h3>

                                        {/* Botón con Tooltip */}
                                        <button onClick={() => setOpenDeleteConfirmBox(true)} className="text-lg sm:text-2xl relative flex gap-1 justify-center items-center text-red-500 bg-white hover:bg-red-500 hover:text-white border rounded-full px-2">
                                            <LuDelete /> <span className='text-sm font-semibold '>Vaciar carrito</span>

                                            {/* Tooltip */}
                                            <span className="absolute hidden lg:block -top-8 right-0 translate-x-1 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 whitespace-nowrap">
                                                Vaciar carrito
                                            </span>
                                        </button>
                                    </div>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>SubTotal </p>
                                        <p className='flex items-center gap-2 font-medium'>{DisplayPriceDOP(notDiscountTotalPrice)}</p>
                                    </div>

                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Descuento total</p>
                                        <p className='flex items-center font-medium line-through text-neutral-400'><span className='font-bold text-lg text-neutral-400'><FaMinus /></span>{DisplayPriceDOP(notDiscountTotalPrice - totalPrice)}</p>
                                    </div>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Cantidad total </p>
                                        <p className='text-neutral-600 font-medium'>{totalQty} Produto</p>
                                    </div>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Gastos de envío</p>
                                        <p className='font-medium text-neutral-600'>Gratis</p>
                                    </div>
                                    <div className='flex font-semibold justify-between items-center gap-4'>
                                        <p>Total</p>
                                        <p className='text-blue-500'>{DisplayPriceDOP(totalPrice)}</p>
                                    </div>
                                </div>

                            </>
                        ) : (
                            <div className='bg-white flex flex-col justify-center items-center rounded-lg '>
                                <img
                                    src={emptyCart}
                                    className='w-full h-full object-scale-down'
                                />

                                <Link onClick={close} to={"/"} className='bg-green-500 px-2 py-1 rounded-md'>
                                    Shop Now
                                </Link>
                            </div>
                        )
                    }

                </div>

                {
                    cartItem[0] && (
                        <div className='px-2 bg-white rounded-lg py-2'>
                            <div className='text-blue-500 border px-4 py-1 font-bold text-base lg:text-lg static bottom-3 rounded-md flex items-center gap-4 justify-between'>
                                <div>
                                    Pay  {DisplayPriceDOP(totalPrice)}
                                </div>

                                <button onClick={handleRedictToCheckoutPage} className='flex items-center gap-1 bg-green-700 px-2 rounded-lg text-white'>
                                    Proceed
                                    <span>
                                        <FaCaretRight />
                                    </span>
                                </button>
                            </div>
                        </div>
                    )
                }

            </div>

            {
                openDeleteConfirmBox && (
                    <ConfirmBox
                        cancel={() => setOpenDeleteConfirmBox(false)}
                        close={() => setOpenDeleteConfirmBox(false)}
                        confirm={handleClearCart}
                    />
                )
            }
        </section>
    )
}

export default DisplayCartItem