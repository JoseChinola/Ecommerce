import { useState } from 'react';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import moment from 'moment';
import ViewImage from './ViewImage';
import { IoClose } from 'react-icons/io5';

const OrderManagementModal = ({
  order,
  user,
  isOpen,
  onClose,
  onUpdateStatus,
  onRefund,
  onCancel,
  onAddNote
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [ImageURL, setImageURL] = useState("");

  if (!isOpen || !order || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-secundary rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 relative space-y-3">

        <div className="flex justify-between items-center border-b bg-white rounded-lg px-3 py-2 shadow-sm">
          <h2 className="text-2xl font-bold italic text-primary-Green">
            Pedido #
            <span className='font-semibold not-italic'>{order.orderId}</span>
          </h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 transition"
            aria-label="Cerrar modal"
          >
            <IoClose size={30} />
          </button>
        </div>

        {/* Productos */}
        <section className="mb-4 bg-white rounded-lg px-2 py-2 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-700">
            Productos
          </h3>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-5 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image[0]}
                  onClick={() => setImageURL(item.image[0])}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Precio unitario: {DisplayPriceDOP(item.unit_price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Descuento unitario: {item.unit_discount}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className='text-right font-semibol text-sm text-gray-600'>SubTotal: {DisplayPriceDOP(order.subTotalAmt)}</span>
                  <span className='text-right font-semibold text-sm text-gray-600'>Descuento: {DisplayPriceDOP(order.discount)}</span>
                  <span className='text-right font-semibold text-sm text-gray-600'>Total: {DisplayPriceDOP(order.totalAmt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info del pedido y cliente */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 rounded-lg">
          {/* Cliente */}
          <div className="border rounded-lg p-5 bg-gray-50 shadow-sm">
            <h4 className="font-semibold mb-3 text-gray-800">Cliente</h4>
            <p className="mb-1">
              <span className="font-medium">Nombre:</span> {user?.name}
            </p>
            <p className="mb-1">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-sm text-gray-500">
              Pedido realizado: {moment(order.createdAt).format('DD/MM/YYYY hh:mm A')}
            </p>
          </div>

          {/* Dirección */}
          {order.address && (
            <div className="border rounded-lg p-5 bg-gray-50 shadow-sm">
              <h4 className="font-semibold mb-3 text-gray-800">Dirección de envío</h4>
              <p className="mb-1">{order.address.address_line}</p>
              <p className="mb-1">
                {order.address.city}, {order.address.state}
              </p>
              <p className="mb-1">
                {order.address.country} - {order.address.pincode}
              </p>
              <p className="mb-1">Móvil: {order.address.mobile}</p>
            </div>
          )}
        </section>

        {/* Totales y estado */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white rounded-lg px-2 py-2">
          <div className="text-lg font-semibold text-gray-800">
            Total: {DisplayPriceDOP(order.totalAmt)}
          </div>
          <div className="text-gray-700">
            <p>
              <span className="font-medium">Pago:</span> {order.paymentStatus === 'Paid'
                ? 'Pagado'
                : order.paymentStatus === 'CASH ON DELIVERY'
                  ? 'Pago contra entrega'
                  : 'Pendiente'}
            </p>
            <p>
              <span className="font-medium">Estado:</span> {order.orderStatus}
            </p>
          </div>
        </section>

        {/* Controles */}
        <section className="space-y-6 bg-white rounded-lg px-2 py-2 shadow-sm">
          {/* Estado */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="font-semibold whitespace-nowrap md:w-36">Estado del pedido:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
            </select>
            <button
              onClick={() => {
                onUpdateStatus(order.orderId, newStatus);
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-md shadow-md"
            >
              Actualizar
            </button>
          </div>

          {/* Reembolso y cancelación */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onRefund(order.orderId)}
              className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-md shadow-md flex-grow md:flex-grow-0"
            >
              Reembolso
            </button>
            <button
              onClick={() => onCancel(order.orderId)}
              className="bg-gray-700 hover:bg-gray-800 transition text-white px-6 py-2 rounded-md shadow-md flex-grow md:flex-grow-0"
            >
              Cancelar
            </button>
          </div>

          {/* Nota interna */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Nota interna:</label>
            <textarea
              className="border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="4"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Comentario interno..."
            />
            <button
              onClick={() => {
                onAddNote(order.orderId, noteText);
                setNoteText('');
              }}
              className="self-end mt-3 bg-blue-700 hover:bg-blue-800 transition text-white px-6 py-2 rounded-md shadow-md"
            >
              Guardar nota
            </button>
          </div>
        </section>
      </div >

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}
    </div >
  );
};

export default OrderManagementModal;