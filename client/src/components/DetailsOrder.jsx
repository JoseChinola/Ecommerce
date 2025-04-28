import React from 'react';
import { IoClose } from "react-icons/io5";
import { FaBox, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";

const DetailsOrder = ({ isOpen, onClose, orderDetails }) => {
    if (!isOpen) return null;

    const parseImage = (imageString) => {
        try {
            const cleanedString = imageString.replace(/^\[|\]$/g, '').replace(/"/g, '');
            const imageArray = cleanedString.split(',');
            return imageArray;
        } catch (error) {
            console.error('Error parsing image data:', error);
            return [];
        }
    };

    console.log('order distail viarias imagenes ', orderDetails.products)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4 overflow-y-auto">
            <div className="bg-secundary rounded-lg shadow-xl w-full max-w-6xl p-4 space-y-6 mt-8 mb-8">
                {/* Header del modal */}
                <div className="flex justify-between items-center border-b bg-white px-4 py-3 rounded-lg">
                    <h2 className="font-semibold text-2xl text-primary-Green">Detalles del Pedido</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600">
                        <IoClose size={30} />
                    </button>
                </div>

                {/* Productos */}
                <div className="bg-white rounded-lg shadow-xl p-4">
                    <h3 className="text-lg font-semibold text-primary-Green flex items-center gap-2 mb-4 border-b pb-2">
                        <FaBox /> Productos
                    </h3>

                    <div className="flex gap-4 overflow-x-auto">
                        {orderDetails?.products?.map((product, index) => (
                            <div
                                key={index}
                                className="min-w-[250px] bg-secundary rounded-lg p-4 shadow-md flex flex-col gap-2 flex-shrink-0 hover:scale-105 transition-transform"
                            >
                                <h4 className="text-md font-semibold text-center text-gray-700 bg-white rounded-lg py-1 px-2 mb-2">
                                    {product.product_details?.name}
                                </h4>

                                <div className="flex gap-4 items-center bg-white rounded-lg p-2">
                                    {product.product_details?.image && (
                                        <div className="flex justify-center items-center p-1 relative w-24 h-20 overflow-hidden">
                                            {/* Verificación para determinar si es una cadena JSON o un arreglo */}
                                            {Array.isArray(parseImage(product.product_details.image)) && parseImage(product.product_details.image).length > 1 ? (
                                                <>
                                                    <div id={`carousel-${index}`} className="flex overflow-x-auto no-scrollbar w-28 h-28">
                                                        {parseImage(product.product_details.image).map((url, imgIndex) => (
                                                            <img
                                                                key={imgIndex}
                                                                src={url}
                                                                alt={`product-image-${imgIndex}`}
                                                                className="w-28 h-24 object-cover shadow-md border p-2 rounded-lg flex-shrink-0"
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Botón para mover hacia la derecha */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const container = document.getElementById(`carousel-${index}`);
                                                            if (container) {
                                                                // Mueve al siguiente elemento, con bucle infinito
                                                                if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
                                                                    container.scrollLeft = 0; // Regresar al inicio
                                                                } else {
                                                                    container.scrollLeft += 100; // Desplazamiento hacia la derecha
                                                                }
                                                            }
                                                        }}
                                                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 text-xs cursor-pointer shadow"
                                                    >
                                                        ➡️
                                                    </button>
                                                </>
                                            ) : (
                                                <img
                                                    src={parseImage(product.product_details.image)[0]}
                                                    alt={`product-image-0`}
                                                    className="w-28 h-24 object-cover shadow-md border p-2 rounded-lg"
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p><span className="font-semibold text-primary-Green">Cantidad:</span> {product.quantity || 1}</p>
                                        <p><span className="font-semibold text-primary-Green">Precio:</span> ${product.subTotalAmt || 0}</p>
                                        <p><span className="font-semibold text-primary-Green">Total:</span> ${product.totalAmt || 0}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Pedido y Dirección */}
                <div className="flex flex-col md:flex-row gap-4 bg-white py-2 px-2 rounded-lg">
                    {/* Detalles del Pedido */}
                    <div className="flex-1 bg-secundary rounded-lg shadow-xl px-2 py-3 hover:scale-105 transition-transform">
                        <h3 className="text-lg font-semibold text-primary-Green flex items-center justify-center gap-2 mb-5 border-b py-1 bg-white rounded-lg">
                            <FaMoneyCheckAlt /> Detalles del Pedido
                        </h3>
                        <div className="flex flex-col gap-4 text-gray-700 text-base bg-white py-1 px-1 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                                <span className="font-semibold italic">Pedido ID:</span>
                                <span>{orderDetails?.orderId}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="font-semibold italic">Estado de Pago:</span>
                                <span>{orderDetails?.paymentStatus}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="font-semibold italic">Nombre del Cliente:</span>
                                <span>{orderDetails?.user?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Dirección de Envío */}
                    <div className="flex-1 bg-secundary rounded-lg shadow-xl px-2 py-3 hover:scale-105 transition-transform">
                        <h3 className="text-lg font-semibold text-primary-Green flex items-center justify-center gap-2 mb-5 border-b py-1 bg-white rounded-lg">
                            <FaMapMarkerAlt /> Dirección de Envío
                        </h3>
                        <div className="flex flex-wrap gap-4 text-gray-700 text-base bg-white px-1 py-1 rounded-lg">
                            <div className="flex gap-1 min-w-[180px]">
                                <span className="font-semibold italic">Dirección:</span>
                                <span>{orderDetails?.deliveryAddress?.address_line}</span>
                            </div>
                            <div className="flex gap-1 min-w-[140px]">
                                <span className="font-semibold italic">Ciudad:</span>
                                <span>{orderDetails?.deliveryAddress?.city}</span>
                            </div>
                            <div className="flex gap-1 min-w-[140px]">
                                <span className="font-semibold italic">Estado:</span>
                                <span>{orderDetails?.deliveryAddress?.state}</span>
                            </div>
                            <div className="flex gap-1 min-w-[140px]">
                                <span className="font-semibold italic">País:</span>
                                <span>{orderDetails?.deliveryAddress?.country}</span>
                            </div>
                            <div className="flex gap-1 min-w-[160px]">
                                <span className="font-semibold italic">Código Postal:</span>
                                <span>{orderDetails?.deliveryAddress?.pincode}</span>
                            </div>
                            <div className="flex gap-1 min-w-[180px]">
                                <span className="font-semibold italic">Teléfono:</span>
                                <span>{orderDetails?.deliveryAddress?.mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailsOrder;