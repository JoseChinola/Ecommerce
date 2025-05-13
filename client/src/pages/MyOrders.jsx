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
        <div className="p-6 bg-gradient-to-r from-secundary to-blue-200 min-h-[77vh] rounded-xl">
            <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Mis Pedidos</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {orders.map((order, idx) => (
                    <div
                        key={order.orderId + idx}
                        className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold text-gray-800">Pedido #{order.orderId}</h2>
                            <span
                                className={`px-2 py-1 text-xs rounded-full text-center ${order.paymentStatus === 'Paid'
                                    ? 'bg-green-100 text-green-700'
                                    : order.paymentStatus === 'CASH ON DELIVERY'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                            >
                                {order.paymentStatus === 'Paid'
                                    ? 'Pagado'
                                    : order.paymentStatus === 'CASH ON DELIVERY'
                                        ? 'Pago contra entrega'
                                        : 'Pendiente'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {order.items?.slice(0, 1).map((item, i) => {
                                const thumb = item?.image[0] || '/no-image.png';

                                return (
                                    <div key={i} className="flex items-center">
                                        <img
                                            src={thumb}
                                            alt={item?.name || 'Producto'}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 p-1"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium line-clamp-1">{item?.name}</p>
                                            <p className="text-xs text-gray-500">Cantidad: {item.quantity || 1}</p>
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

                        <div className="text-sm text-gray-500 mb-4">
                            <p>
                                <span className="font-semibold">Fecha:</span>{' '}
                                {moment(order.createdAt).format('DD/MM/YYYY, hh:mm A')}
                            </p>
                            <p>
                                <span className="font-semibold">Total:</span>{' '}
                                {DisplayPriceDOP(order.totalAmt)}
                            </p>
                        </div>

                        <button
                            onClick={() => openModal(order)}
                            className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Ver detalles
                        </button>
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