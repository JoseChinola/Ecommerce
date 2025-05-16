import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FaBox, FaMapMarkerAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import moment from 'moment';
import ViewImage from './ViewImage';

const DetailsOrder = ({ isOpen, onClose, orderDetails }) => {
  const [ImageURL, setImageURL] = useState("");
  if (!isOpen || !orderDetails) return null;

  const generalData = orderDetails;
  const products = orderDetails.items || [];
  const delivery = orderDetails.address || {};
  const totalPago = orderDetails.totalAmt || 0;
  const subtotal = orderDetails.subTotalAmt || 0;
  const descuento = orderDetails.discount || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-secundary rounded-lg shadow-xl w-full max-w-3xl overflow-y-auto p-4 relative space-y-3">


        {/* Header */}
        <div className="flex justify-between items-center border-b bg-white rounded-lg px-3 py-2 shadow-sm">
          <h2 className="text-2xl font-bold italic text-primary-Green">Detalles del Pedido</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 transition">
            <IoClose size={30} />
          </button>
        </div>

        {/* Productos */}
        <section className="mb-4 bg-white rounded-lg px-2 py-2 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2 px-2">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaBox /> Productos
            </h3>
            <div className="flex gap-2 flex-col md:flex-row items-start">

              <div className='space-x-1'>
                <span className="font-semibold text-blue-700">Sub Total:</span>
                <span>{DisplayPriceDOP(subtotal)}</span>
              </div>

              <div className='space-x-1'>
                <span className="font-semibold text-blue-700">Descuento:</span>
                <span>{DisplayPriceDOP(descuento)}</span>
              </div>

              <div className='space-x-1'>
                <span className="font-semibold text-blue-700">Total pago:</span>
                <span>{DisplayPriceDOP(totalPago)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2 flex flex-wrap scrollbarCustom">
            {products.map((product, index) => {
              const imageFallback = "/no-image.png";

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Imagen o galería */}
                  <div className="flex justify-center items-center">
                    {product.image.length > 1 ? (
                      <div className="flex overflow-x-auto scrollbarCustom gap-2 w-36 h-32 overflow-y-hidden pr-2">
                        {product.image.map((url, i) => (
                          <img
                            key={i}
                            src={url || imageFallback}
                            onClick={() => setImageURL(url)}
                            alt={`product-${i}`}
                            className="w-28 h-28 object-cover rounded-md border cursor-pointer"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={product.image[0] || imageFallback}
                        alt="product"
                        className="w-28 h-28 object-cover rounded-md border shadow"
                      />
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">Cantidad: {product.quantity}</p>
                    <p className="text-sm text-gray-600">Precio unitario: {DisplayPriceDOP(product.unit_price)}</p>
                    <p className="text-sm text-gray-600">Descuento unitario: {product.unit_discount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

         {/* Info del pedido y cliente */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 rounded-lg">
          {/* Detalles del Pedido */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold mb-3 text-blue-700 flex items-center gap-2 border-b pb-2">
              <FaMoneyCheckAlt /> Detalles del Pedido
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Pedido ID:</span>
                <span>{generalData.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estado de Pago:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${generalData.paymentStatus === 'Paid'
                    ? 'bg-green-100 text-green-700'
                    : generalData.paymentStatus === 'CASH ON DELIVERY'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }
  `}>
                  {generalData.paymentStatus === 'Paid'
                    ? 'Pagado'
                    : generalData.paymentStatus === 'CASH ON DELIVERY'
                      ? 'Pago contra entrega'
                      : 'Pendiente'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Fecha:</span>
                <span>{moment(generalData.createdAt).format('DD/MM/YYYY, hh:mm A')}</span>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="font-semibold text-blue-700 flex items-center gap-2 mb-4 border-b pb-2">
              <FaMapMarkerAlt /> Dirección de Envío
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between"><span className="font-semibold">Dirección:</span><span>{delivery.address_line || '-'}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Ciudad:</span><span>{delivery.city || '-'}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Estado:</span><span>{delivery.state || '-'}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Código Postal:</span><span>{delivery.pincode || '-'}</span></div>
              <div className="flex justify-between"><span className="font-semibold">País:</span><span>{delivery.country || '-'}</span></div>
              <div className="flex justify-between"><span className="font-semibold">Teléfono:</span><span>{delivery.mobile || '-'}</span></div>
            </div>
          </div>
        </section>
      </div>

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}
    </div>
  );
};

export default DetailsOrder;