import React from 'react';
import { IoClose } from "react-icons/io5";
import { FaBox, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';

const DetailsOrder = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  const parseImage = (imageString) => {
    try {
      const cleanedString = imageString.replace(/^\[|\]$/g, '').replace(/"/g, '');
      return cleanedString.split(',');
    } catch (error) {
      console.error('Error parsing image data:', error);
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto">
      <div className="bg-secundary rounded-lg shadow-xl w-full max-w-6xl p-4 space-y-3 mt-4 mb-4">

        {/* Header del modal */}
        <div className="flex justify-between items-center border-b bg-white px-4 py-3 rounded-lg">
          <h2 className="font-semibold text-2xl text-primary-Green">Detalles del Pedido</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
            <IoClose size={30} />
          </button>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow-xl p-4">
          <div className='flex items-center justify-between mb-4 border-b pb-2'>
            <h3 className="text-lg font-semibold text-primary-Green flex items-center gap-2">
              <FaBox /> Productos
            </h3>
            <div className='flex gap-2'>
              <dt className="font-semibold text-primary-Green">Total pago:</dt>
              <dd>{DisplayPriceDOP(orderDetails?.totalAmt || 0)}</dd>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto">
            {orderDetails?.products?.map((product, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-secundary rounded-lg p-2 shadow-md flex flex-col flex-shrink-0 transition-transform"
              >
                <h4 className="text-md font-semibold text-center text-gray-700 bg-white rounded-lg py-1 px-2 mb-2">
                  {product.product_details?.name}
                </h4>

                <div className="flex flex-col gap-2 items-center bg-white rounded-lg p-1.5">
                  {product.product_details?.image && (
                    <div className="flex justify-center items-center p-1 relative w-full md:w-44 md:h-28 overflow-hidden">
                      {parseImage(product.product_details.image).length > 1 ? (
                        <>
                          <div id={`carousel-${index}`} className="flex no-scrollbar w-36 h-36 overflow-x-hidden">
                            {parseImage(product.product_details.image).map((url, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={url}
                                alt={`product-image-${imgIndex}`}
                                className="w-36 h-32 object-contain rounded-lg flex-shrink-0"
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const container = document.getElementById(`carousel-${index}`);
                              if (container) {
                                if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
                                  container.scrollLeft = 0;
                                } else {
                                  container.scrollLeft += 200;
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
                          alt="product-image-0"
                          className="w-28 h-24 object-cover shadow-md border p-2 rounded-lg"
                        />
                      )}
                    </div>
                  )}

                  <div className="p-2 rounded-lg shadow w-full">
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                      <dt className="font-semibold text-primary-Green">Cantidad:</dt>
                      <dd>{product.quantity || 1}</dd>
                      <dt className="font-semibold text-primary-Green">Precio:</dt>
                      <dd>{DisplayPriceDOP(product.subTotalAmt || 0)}</dd>
                      <dt className="font-semibold text-primary-Green">Descuento:</dt>
                      <dd>-{DisplayPriceDOP(product.discount || 0)}</dd>
                      <dt className="font-semibold text-primary-Green">Total:</dt>
                      <dd>{DisplayPriceDOP(orderDetails?.totalAmt || 0)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedido y Dirección */}
        <div className="flex flex-col md:flex-row gap-2 bg-white py-1.5 px-1.5 rounded-lg">
          {/* Detalles del Pedido */}
          <div className="flex-1 bg-secundary rounded-lg shadow-xl px-2 py-3 transition-transform">
            <h3 className="text-lg font-semibold text-primary-Green flex items-center justify-center gap-2 mb-4 border-b py-1 bg-white rounded-lg">
              <FaMoneyCheckAlt /> Detalles del Pedido
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-base bg-white py-1 px-1 rounded-lg">
              <div>
                <dt className="font-semibold italic">Pedido ID:</dt>
                <dd>{orderDetails?.orderId}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Estado de Pago:</dt>
                <dd>{orderDetails?.paymentStatus}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Nombre del Cliente:</dt>
                <dd>{orderDetails?.user?.name}</dd>
              </div>
            </dl>
          </div>

          {/* Dirección de Envío */}
          <div className="flex-1 bg-secundary rounded-lg shadow-xl px-2 py-3 transition-transform">
            <h3 className="text-lg font-semibold text-primary-Green flex items-center justify-center gap-2 mb-4 border-b py-1 bg-white rounded-lg">
              <FaMapMarkerAlt /> Dirección de Envío
            </h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-base bg-white px-1 py-1 rounded-lg">
              <div>
                <dt className="font-semibold italic">Dirección:</dt>
                <dd>{orderDetails?.deliveryAddress?.address_line}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Ciudad:</dt>
                <dd>{orderDetails?.deliveryAddress?.city}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Estado:</dt>
                <dd>{orderDetails?.deliveryAddress?.state}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Código Postal:</dt>
                <dd>{orderDetails?.deliveryAddress?.pincode}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">País:</dt>
                <dd>{orderDetails?.deliveryAddress?.country}</dd>
              </div>
              <div>
                <dt className="font-semibold italic">Teléfono:</dt>
                <dd>{orderDetails?.deliveryAddress?.mobile}</dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailsOrder;