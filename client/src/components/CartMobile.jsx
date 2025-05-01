import React from 'react'
import { useGlobalContext } from '../provider/useGlobalContext'
import { FaCartShopping } from 'react-icons/fa6';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { Link } from 'react-router-dom';
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux';


const CartMobileLink = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector((state) => state?.user)

    if (!user?._id) {
        return null;
    }

    return (
        <>
            {
                cartItem[0] && (
                    <div className='p-2 sticky bottom-4 hidden max-[425px]:block'>
                        <div className='bg-green-600 px-2 py-1 rounded-md text-neutral-100 text-sm flex items-center justify-between '>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 bg-green-500 rounded w-fit'>
                                    <FaCartShopping />
                                </div>
                                <div className='text-xs'>
                                    <p>{totalQty} items</p>
                                    <p>{DisplayPriceDOP(totalPrice)}</p>
                                </div>
                            </div>

                            <Link to={"/cart"} className='flex items-center gap-2'>
                                <span className='text-sm'>
                                    View Cart
                                </span>
                                <FaCaretRight />
                            </Link>
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default CartMobileLink