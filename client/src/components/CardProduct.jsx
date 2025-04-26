import React from 'react';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { Link } from 'react-router-dom';
import { validaURLConvert } from '../utils/validaURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ data }) => {
    const url = `/product/${validaURLConvert(data.name)}-${data._id}`;
    const images = data?.image ? JSON.parse(JSON.parse(data.image)) : [];
    const stock = data?.inventories?.[0]?.stock ?? 0;

    return (
        <div className="border p-2 sm:p-4 mb-3 grid gap-3 w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px] rounded-xl shadow bg-white select-none transition-all">
            {/* Imagen */}
            <Link to={url} className="aspect-square rounded flex items-center justify-center overflow-hidden">
                <img
                    src={images[0]}
                    alt="Product"
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
            </Link>

            {/* Tiempo y descuento */}
            <div className="flex items-center justify-between text-xs">
                <span className="rounded-md px-2 py-[2px] text-green-600 bg-green-50">
                    10 min
                </span>
                {Boolean(data.discount) && (
                    <span className="bg-red-500 rounded-full px-2 py-[1px] text-white">
                        -{data.discount}%
                    </span>
                )}
            </div>

            {/* Nombre del producto */}
            <div className="px-2 font-semibold text-sm sm:text-base line-clamp-1">
                {data.name}
            </div>

            {/* Unidad */}
            <div className="px-2 text-xs sm:text-sm text-gray-600">
                {data.unit}
            </div>

            {/* Precio y botón */}
            <div className="flex items-center justify-between px-2 gap-2 text-sm">
                <span className="font-semibold text-green-700">
                    {DisplayPriceDOP(pricewithDiscount(data.price, data.discount))}
                </span>
                <div>
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
