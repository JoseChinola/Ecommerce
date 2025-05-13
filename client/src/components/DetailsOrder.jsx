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


  const parseImage = (imgStr) => {
    try {
      const parsed = JSON.parse(imgStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-5 space-y-2">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-bold text-blue-700">Detalles del Pedido</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 transition">
            <IoClose size={30} />
          </button>
        </div>

        {/* Productos */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
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

          <div className="flex gap-4 overflow-x-auto pb-2">
            {products.map((product, index) => {
              const images = parseImage(product.image || '[]');
              const imageFallback = "/no-image.png";
              

              return (
                <div
                  key={index}
                  className="min-w-[250px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-2xl p-4 shadow-md flex flex-col flex-shrink-0 transition-transform hover:scale-105"
                >
                  <h4 className="text-center font-semibold text-gray-800 mb-2">{product?.name}</h4>

                  <div className="flex justify-center items-center mb-3">
                    {images.length > 1 ? (
                      <div className="flex overflow-x-auto scrollbarCustom gap-2 w-36 h-32 overflow-y-hidden">
                        {images.map((url, i) => (
                          <img
                            key={i}
                            src={url || imageFallback}
                            onClick={() => setImageURL(url)}
                            alt={`product-${i}`}
                            className="w-28 h-28 object-contain rounded-lg border"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={images[0] || imageFallback}
                        alt="product"
                        className="w-28 h-28 object-contain rounded-lg border shadow"
                      />
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow p-2 text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Cantidad:</span>
                      <span>{product.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Precio:</span>
                      <span>{DisplayPriceDOP(product.unit_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Descuento:</span>
                      <span className='text-red-500'>-{product.unit_discount}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span>{DisplayPriceDOP(product.totalAmt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pedido y Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles del Pedido */}
          <div className="bg-gradient-to-tr from-blue-50 to-purple-50 rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-4 border-b pb-2">
              <FaMoneyCheckAlt /> Detalles del Pedido
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Pedido ID:</span>
                <span>{generalData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Estado de Pago:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${generalData.paymentStatus === 'Paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {generalData.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Fecha:</span>
                <span>{moment(generalData.createdAt).format('DD/MM/YYYY, hh:mm A')}</span>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="bg-gradient-to-tr from-blue-50 to-purple-50 rounded-2xl p-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-4 border-b pb-2">
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
        </div>
      </div>

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}
    </div>
  );
};

export default DetailsOrder;