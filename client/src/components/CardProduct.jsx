import React from 'react'
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { Link } from 'react-router-dom'
import { validaURLConvert } from '../utils/validaURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';


const CardProduct = ({ data }) => {
    const url = `/product/${validaURLConvert(data.name)}-${data._id}`

    const images = data?.image ? JSON.parse(JSON.parse(data.image)) : [];


    return (
        <div className='border p-4 mb-2 grid gap-2 min-w-36 lg:min-w-48 rounded-xl shadow-lg  bg-white select-none'>
            <Link to={url} className="min-h-20 max-h-24 lg:max-h-32 cursor-pointer rounded flex items-center justify-center overflow-hidden">
                <img
                    src={images[0]}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </Link>


            <div className='flex items-center justify-between'>
                <div className='rounded-md text-xs w-fit p-[0.5px] px-2 text-green-600 bg-green-50'>
                    10 min
                </div>
                <span>
                    {
                        Boolean(data.discount) && (
                            <div className='bg-red-500 rounded-full w-fit p-[0.5px] px-1'>
                                <p className='  text-white text-xs '>-{data.discount}%</p>
                            </div>
                        )
                    }
                </span>
            </div>

            <div className='px-2 font-semibold lg:text-sm text-ellipsis line-clamp-1'>
                {data.name}
            </div>

            <div className='w-fit px-2 text-sm lg:text-base '>
                {data.unit}
            </div>


            <div className='flex items-center justify-between gap-4 text-sm lg:text-base'>
                <div className='font-semibold'>
                    {DisplayPriceDOP(pricewithDiscount(data.price, data.discount))}
                </div>

                <div className=''>
                    {
                        data.stock == 0 ? (
                            <p className='text-red-500 text-sm text-center'>Out of stock</p>
                        ) : (
                            // <button onClick={handleAddToCart} className=' bg-slate-100 text-black hover:bg-green-500 px-4     q py-1 hover:text-white rounded-full'>
                            //     <LiaCartPlusSolid size={23} />
                            // </button>

                            <AddToCartButton data={data} />
                        )
                    }

                </div>

            </div>
        </div>
    )
}

export default CardProduct