import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import emptyCart from '../assets/cartEmpty.png'


const DisplayCartItem = ({ close }) => {
    const { notDiscountTotalPrice, totalPrice, totalQty, } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)


    return (
        <section className='bg-neutral-900 fixed top-0 bottom-0 left-0 right-0 bg-opacity-70 z-50'>
            <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto rounded-md'>

                <div className='flex items-center justify-between p-3 rounded-md shadow-md'>
                    <h1 className='font-semibold'>Cart </h1>
                    <Link to={"/"} className='lg:hidden'>
                        <IoClose size={30} />
                    </Link>
                    <button onClick={close} className='w-fit ml-auto hover:text-red-600 hidden lg:block'>
                        <IoClose size={30} />
                    </button>
                </div>

                <div className='min-h-[75vh] lg:min-h-[79vh] h-full max-h-[calc(100vh-120px)] bg-blue-50 p-2 flex flex-col gap-4'>
                    {/** display items  */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 gap-2 rounded-full'>
                                    <p>Your total savings</p>
                                    <p className='font-bold'>{DisplayPriceDOP(notDiscountTotalPrice - totalPrice)}</p>
                                </div>
                                <div className='bg-white rounded-lg p-3 grid gap-5 overflow-auto'>
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                const images = item?.productData?.image ? JSON.parse(JSON.parse(item?.productData?.image)) : [];
                                                return (
                                                    <div className='flex w-full gap-4'>
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
                                                            <p className='text-neutral-400'>{item?.productData?.unit}</p>
                                                            <p className='font-semibold text-blue-500'>{DisplayPriceDOP(pricewithDiscount(item?.productData?.price, item?.productData?.discount))}</p>
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
                                <div className='bg-white p-4 rounded-lg flex flex-col gap-1 border'>
                                    <h3 className='font-semibold'>Bill Details</h3>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Items total </p>
                                        <p className='flex items-center gap-2 font-medium'><span className='line-through text-neutral-400'>{DisplayPriceDOP(notDiscountTotalPrice)}</span><span>{DisplayPriceDOP(totalPrice)}</span></p>
                                    </div>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Quantity total </p>
                                        <p className='text-neutral-600 font-medium'>{totalQty} item</p>
                                    </div>
                                    <div className='flex px-2 gap-4 justify-between items-center bg-blue-100 text-blue-500 rounded-lg py-1'>
                                        <p>Delivery Charge</p>
                                        <p className='font-medium text-neutral-600'>Free</p>
                                    </div>
                                    <div className='flex font-semibold justify-between items-center gap-4'>
                                        <p>Grand Total</p>
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
                        <div className='px-2'>
                            <div className='text-blue-500 border px-4 py-1 font-bold text-base lg:text-lg static bottom-3 rounded-md flex items-center gap-4 justify-between'>
                                <div>
                                  Pay  {DisplayPriceDOP(totalPrice)}
                                </div>
                                <button className='flex items-center gap-1 bg-green-700 px-2 rounded-lg text-white'>
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
        </section>
    )
}

export default DisplayCartItem