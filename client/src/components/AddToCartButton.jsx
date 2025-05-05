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

const AddToCartButton = ({ data, fetchProductData }) => {

    const { fetchCartItem, updateCartItem, deleteCartItem, fetchInventario } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector((state) => state?.user)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails, setCartItemDetails] = useState()


    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)


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
                if (fetchInventario) {
                    fetchInventario()
                }
                if (fetchProductData) {
                    fetchProductData()
                }

            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
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


    const increaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setLoading(true);
            // Espera a que se actualice la cantidad en el carrito
            await updateCartItem(cartItemDetails._id, qty + 1);
            toast.success("Producto agregado");

            // Ahora recarga datos donde haga falta:
            fetchCartItem?.();
            fetchInventario?.();
            fetchProductData?.();
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const decreaseQty = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setLoading(true);
            if (qty === 1) {
                // Si era 1, eliminamos el ítem
                await deleteCartItem(cartItemDetails._id);
                toast.success("Producto eliminado");
            } else {
                // Si era >1, solo bajamos en 1
                await updateCartItem(cartItemDetails._id, qty - 1);
                toast.success("Cantidad reducida");
            }

            // Y recargamos datos
            fetchCartItem?.();
            fetchInventario?.();
            fetchProductData?.();
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>
            {
                isAvailableCart && user?._id ? (
                    <div className='flex items-center justify-between gap-1 md:gap-2 bg-slate-200 lg:px-2 py-1 rounded-lg'>
                        <button onClick={decreaseQty} className='bg-green-500 text-white text-base  hover:text-red-500 hover:bg-white rounded-full'>
                            <FaMinus />
                        </button>
                        <p className='font-bold text-base'>{qty}</p>
                        <button onClick={increaseQty} className='bg-green-500 text-white text-base hover:bg-white hover:text-green-500 rounded-full'>
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className=' bg-slate-200 flex items-center cursor-pointer justify-center text-slate-500 hover:bg-green-500 px-4 py-1 hover:text-white rounded-2xl w-full'>
                        {
                            loading ? <Loading /> : <LiaCartPlusSolid size={23} />
                        }
                    </button>
                )
            }

        </div>
    )
}

export default AddToCartButton