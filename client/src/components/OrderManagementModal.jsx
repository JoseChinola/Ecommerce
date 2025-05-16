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
  onAddNote
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [ImageURL, setImageURL] = useState("");

  if (!isOpen || !order || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-secundary rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 relative space-y-3 scrollbarCustom">

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

          <div className="flex flex-wrap gap-4 max-h-72 overflow-y-auto scrollbarCustom px-2">
            {order.items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex w-full sm:w-[48%] md:w-[40%] lg:w-[40%] xl:w-[48%]
                   flex-col sm:flex-row items-center justify-center gap-4
                   p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Imagen */}
                <img
                  src={item.image[0]}
                  onClick={() => setImageURL(item.image[0])}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover"
                />

                {/* Detalles */}
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Precio: {DisplayPriceDOP(item.unit_price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Descuento: {item.unit_discount}
                  </p>
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
              <span className="font-medium">Nombre:</span> {user?.fullName}
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
        <section className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8 bg-white rounded-lg px-4 py-4 shadow-sm">
          {/* Bloque: Totales */}
          <div className="w-full md:w-1/2 space-y-1 text-center md:text-left">
            <p className="text-gray-700">
              <span className="font-semibold">Subtotal:</span> {DisplayPriceDOP(order.subTotalAmt)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Descuento:</span> {DisplayPriceDOP(order.discount)}
            </p>
            <p className="font-bold text-gray-900">
              Total: {DisplayPriceDOP(order.totalAmt)}
            </p>
          </div>

          {/* Bloque: Estado y Pago */}
          <div className="w-full md:w-1/2 space-y-1 text-center md:text-right">
            <p className="text-base text-gray-700">
              <span className="font-semibold">Pago:</span>{' '}
              {order.paymentStatus === 'Paid'
                ? 'Pagado'
                : order.paymentStatus === 'CASH ON DELIVERY'
                  ? 'Pago contra entrega'
                  : 'Pendiente'}
            </p>
            <p className="text-base text-gray-700">
              <span className="font-semibold">Estado:</span> {order.orderStatus}
            </p>
          </div>
        </section>


        {/* Controles */}
        <section className="space-y-6 bg-white rounded-lg px-5 py-4 shadow-sm">
          {/* Estado */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <label className="font-semibold whitespace-nowrap md:w-36">Estado del pedido:</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Procesando">Procesando</option>
              <option value="Completado">Completado</option>              
            </select>

            <button
              onClick={() => {
                onUpdateStatus(order.orderId, newStatus);
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg shadow-md"
            >
              Actualizar
            </button>
          </div>

          {/* Reembolso y cancelación */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onRefund(order.orderId)}
              className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg shadow-md flex-grow md:flex-grow-0"
            >
              Reembolso
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