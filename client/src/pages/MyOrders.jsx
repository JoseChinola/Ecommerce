import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DetailsOrder from '../components/DetailsOrder';
import { Navigate } from 'react-router-dom';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import moment from 'moment';

const MyOrders = () => {
    const orders = useSelector((state) => state?.orders?.order);
    const user = useSelector((state) => state.user);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (!user || !user._id) {
        return <Navigate to="/" />;
    }

    const openModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">No tienes pedidos aún.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-3 bg-white min-h-[70vh] rounded-xl w-full">
            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Mis Pedidos</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {orders.map((order, idx) => (
                    <div
                        key={order.orderId + idx}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 flex flex-col"
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <div className=''>
                                <h2 className="text-sm font-semibold text-gray-800">Pedido #{order.orderId}</h2>
                                <p className="text-xs text-gray-500">Fecha: {moment(order.createdAt).format('DD/MM/YYYY')}</p>
                            </div>
                            <span
                                className={`px-2 py-2 text-xs font-medium rounded-full ${order.orderStatus === 'Completado'
                                        ? 'bg-green-100 text-green-700'
                                        : order.orderStatus === 'Procesando'
                                            ? 'bg-blue-100 text-blue-700'
                                            : order.orderStatus === 'Pendiente'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : order.orderStatus === 'Cancelado'
                                                    ? 'bg-red-100 text-red-700'
                                                    : order.orderStatus === 'Reembolsado'
                                                        ? 'bg-gray-100 text-gray-700'
                                                        : ''
                                    }`}
                            >
                                {order.orderStatus}
                            </span>
                        </div>

                        <div className="p-4 space-y-3 flex-1">
                            {order.items?.slice(0, 1).map((item, i) => {
                                const thumb = item?.image[0] || '/no-image.png';
                                return (
                                    <div key={i} className="flex items-center">
                                        <img
                                            src={thumb}
                                            alt={item?.name || 'Producto'}
                                            className="w-14 h-14 rounded-lg object-cover bg-gray-100 p-1"
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item?.name}</p>
                                            <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                                            <p className="text-xs text-gray-500">
                                                Precio: {DisplayPriceDOP(item?.unit_price || 0)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {order.items?.length > 1 && (
                                <p className="text-xs text-gray-500">
                                    + {order.items.length - 1} producto{order.items.length - 1 > 1 ? 's' : ''} más
                                </p>
                            )}
                        </div>

                        <div className="px-4 pb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">Total:</span> {DisplayPriceDOP(order.totalAmt)}
                            </p>
                            <button
                                onClick={() => openModal(order)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Ver detalles
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <DetailsOrder
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
            />
        </div>

    );
};

export default MyOrders;