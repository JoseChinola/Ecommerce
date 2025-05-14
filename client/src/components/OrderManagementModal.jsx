import React, { useState, useEffect } from 'react';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import moment from 'moment';

const OrderManagementModal = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onAssignTracking,
  onRefund,
  onCancel,
  onAddNote
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (order) {
      setNewStatus(order.shippingStatus);
      setTrackingNumber(order.trackingNumber || '');
      setNoteText('');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-auto max-h-full p-6">
        <h2 className="text-xl font-semibold mb-4">Pedido #{order._id}</h2>

        {/* Productos */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Productos</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center space-x-4 mb-2">
              <img src={item.image[0]} alt={item.name} className="w-12 h-12 rounded" />
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                <p className="text-sm text-gray-500">
                  Precio: {DisplayPriceDOP(item.unit_price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info del pedido */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Cliente:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Fecha:</strong> {moment(order.createdAt).format('DD/MM/YYYY hh:mm A')}</p>
          </div>
          <div>
            <p><strong>Total:</strong> {DisplayPriceDOP(order.totalAmt)}</p>
            <p><strong>Pago:</strong> {order.paymentStatus}</p>
            <p><strong>Envío:</strong> {order.shippingStatus}</p>
          </div>
        </div>

        {/* Controles */}
        <div className="space-y-4 mb-4">
          {/* Estado */}
          <div className="flex items-center space-x-2">
            <label className="font-semibold">Estado de envío:</label>
            <select
              className="border px-2 py-1 rounded"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pendiente</option>
              <option value="Processing">En proceso</option>
              <option value="Shipped">Enviado</option>
              <option value="Delivered">Entregado</option>
            </select>
            <button
              onClick={() => onUpdateStatus(order._id, newStatus)}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Actualizar
            </button>
          </div>

          {/* Tracking */}
          <div className="flex items-center space-x-2">
            <label className="font-semibold">Tracking #:</label>
            <input
              type="text"
              className="border px-2 py-1 rounded flex-grow"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              placeholder="Número de guía"
            />
            <button
              onClick={() => onAssignTracking(order._id, trackingNumber)}
              className="px-3 py-1 bg-purple-600 text-white rounded"
            >
              Asignar
            </button>
          </div>

          {/* Reembolso y cancelación */}
          <div className="flex space-x-2">
            <button
              onClick={() => onRefund(order._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Reembolso
            </button>
            <button
              onClick={() => onCancel(order._id)}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              Cancelar
            </button>
          </div>

          {/* Nota interna */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Nota interna:</label>
            <textarea
              className="border px-2 py-1 rounded mb-2"
              rows="3"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Comentario interno..."
            />
            <button
              onClick={() => { onAddNote(order._id, noteText); setNoteText(''); }}
              className="self-end px-3 py-1 bg-blue-800 text-white rounded"
            >
              Guardar nota
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default OrderManagementModal;