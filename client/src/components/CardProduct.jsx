import React from 'react';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { Link } from 'react-router-dom';
import '../utils/configMoment';
import { validaURLConvert } from '../utils/validaURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';
import moment from '../utils/configMoment';


const CardProduct = ({ data }) => {
    const url = `/product/${validaURLConvert(data.name)}-${data._id}`;
    const images = data?.image ? JSON.parse(JSON.parse(data.image)) : [];
    const stock = data?.inventories?.[0]?.stock ?? 0;

    return (
        <div className="flex flex-col border p-2 sm:p-4 rounded-xl shadow bg-white select-none transition-all w-full max-w-[200px] sm:max-w-[220px] md:max-w-[230px] lg:max-w-[250px]">
            {/* Imagen */}
            <Link to={url} className="aspect-auto rounded flex items-center justify-center overflow-hidden">
                <img
                    src={images[0]}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </Link>

            {/* Tiempo y descuento */}
            <div className="flex items-center justify-between text-xs mb-1 px-1">
                <span className="rounded-md text-green-600 bg-green-50 px-1 py-1">
                    {moment(data.createdAt).fromNow()}
                </span>
                {Boolean(data.discount) && (
                    <span className="bg-red-500 rounded-full text-white px-2 py-0.5">-{data.discount}%</span>
                )}
            </div>

            {/* Nombre del producto */}
            <div className="px-1 font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                {data.name}
            </div>

            {/* Unidad */}
            <div className="px-2 text-xs sm:text-sm text-gray-600 mb-2">
                {data.unit}
            </div>

            {/* Precio y botón */}
            <div className="flex flex-col items-center justify-between gap-2 mt-auto text-sm">
                <span className="font-semibold text-green-700">
                    {DisplayPriceDOP(pricewithDiscount(data.price, data.discount))}
                </span>
                <div className='w-full'>
                    {stock === 0 ? (
                        <p className="text-red-500 text-sm text-center">Agotado</p>
                    ) : (
                        <AddToCartButton data={data} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardProduct;