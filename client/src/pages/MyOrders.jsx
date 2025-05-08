import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DetailsOrder from '../components/DetailsOrder';
import { Navigate } from 'react-router-dom';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import moment from 'moment';

const MyOrders = () => {
    const orders = useSelector((state) => state?.orders?.order);
    const user = useSelector(state => state.user);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (!user || !user._id) {
        return <Navigate to="/" />;
    }

    const groupedOrders = orders?.reduce((acc, item) => {
        const key = item.orderId;
        if (!acc[key]) {
            acc[key] = {
                orderId: item.orderId,
                paymentStatus: item.paymentStatus,
                totalAmt: 0,
                products: [],
                user: item.user,
                deliveryAddress: item.address,
                date: item.date
            };
        }
        acc[key].products.push(item);
        acc[key].totalAmt += Number(item.totalAmt) || 0;
        return acc;
    }, {});

    const groupedOrdersArray = Object.values(groupedOrders || {});

    const openModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const parseImage = (imageString) => {
        try {
            const cleaned = imageString.replace(/^\[|\]$/g, '').replace(/\\"/g, '"').replace(/"/g, '');
            return cleaned.split(',');
        } catch {
            return [];
        }
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
            <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Mis Pedidos</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedOrdersArray.map((order, idx) => (
                    <div
                        key={order.orderId + idx}
                        className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold text-gray-800">Pedido #{order.orderId}</h2>
                            <span
                                className={`px-2 py-1 text-xs rounded-full text-center ${
                                    order.paymentStatus === 'Paid'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {order.paymentStatus}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            {order.products.slice(0, 2).map((product, i) => {
                                const images = parseImage(product.product_details?.image || '[]');
                                const thumb = images[0] || '';
                                return (
                                    <div key={i} className="flex items-center">
                                        <img
                                            src={thumb}
                                            alt={product.product_details?.name}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 p-1"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">{product.product_details?.name}</p>
                                            <p className="text-xs text-gray-500">Cantidad: {product.quantity || 1}</p>
                                            <p className="text-xs text-gray-500">
                                                Precio: {DisplayPriceDOP(product.product_details?.unit_price || 0)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {order.products.length > 2 && (
                                <p className="text-xs text-gray-500">+ {order.products.length - 2} productos más</p>
                            )}
                        </div>

                        <div className="text-sm text-gray-500 mb-4">
                            <p>
                                <span className="font-semibold">Fecha:</span>{' '}
                                {moment(order.date).format('DD/MM/YYYY, hh:mm A')}
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