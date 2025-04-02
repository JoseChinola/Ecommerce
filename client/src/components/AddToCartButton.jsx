import React, { useEffect, useState } from 'react'
import SummaryApi from '../cammon/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { LiaCartPlusSolid } from 'react-icons/lia'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useGlobalContext } from '../provider/useGlobalContext'

const AddToCartButton = ({ data }) => {
    console.log("button ",data)
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loanding, setLoanding] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState()


    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoanding(true)

            const response = await Axios({
                ...SummaryApi.addToCart,
                data: {
                    productId: data?._id
                }
            })

            const { data: respondeData } = response
            if (respondeData.success) {
                toast.success(respondeData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoanding(false)
        }
    }

    //checking this item in cart or not 
    useEffect(() => {
        const checkingitem = cartItem.some(item => item?.productId === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item?.productId === data?._id)
        setQty(product?.quantity)
        setCartItemDetails(product)
    }, [data, cartItem])


    const increaseQty = (e) => {
        console.log(cartItemDetails)
        e.preventDefault()
        e.stopPropagation()
        toast.success("Add product")
        updateCartItem(cartItemDetails?._id, qty + 1)
    }

    const decreaseQty = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (qty === 1) {
            deleteCartItem(cartItemDetails?._id)
        } else {
            toast.success("Product remove")
            updateCartItem(cartItemDetails?._id, qty - 1)

        }

    }
    return (
        <div className='w-full'>
            {
                isAvailableCart ? (
                    <div className='flex items-center justify-between gap-1 md:gap-2 bg-slate-200 lg:px-2 py-[0.7px] rounded-lg'>
                        <button onClick={decreaseQty} className='bg-green-500 text-white  hover:text-red-500 hover:bg-white rounded-full'>
                            <FaMinus />
                        </button>
                        <p className='font-semibold'>{qty}</p>
                        <button onClick={increaseQty} className='bg-green-500 text-white hover:bg-white hover:text-green-500 rounded-full'>
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className=' bg-slate-200 text-slate-500 hover:bg-green-500 px-4 py-1 hover:text-white rounded-full'>
                        {
                            loanding ? <Loading /> : <LiaCartPlusSolid size={23} />
                        }
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton