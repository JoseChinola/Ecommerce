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


    // Agrupar órdenes por orderId
    const groupedOrders = orders?.reduce((acc, item) => {
        const key = item.orderId;
        if (!acc[key]) {
            acc[key] = {
                orderId: item.orderId,
                paymentStatus: item.paymentStatus,
                totalAmt: 0,
                products: [],
                user: item.user,
                deliveryAddress: item.address
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
            // limpia corchetes y comillas
            const cleaned = imageString
                .replace(/^\[|\]$/g, '')
                .replace(/\\"/g, '"')
                .replace(/"/g, '');
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
        <div className="p-6 bg-white h-full rounded-lg">
            <h1 className="text-3xl font-bold text-primary-Green rounded-lg py-2 px-2 mb-6 bg-secundary">
                Mis Pedidos
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedOrdersArray.map((order, idx) => (
                    <div
                        key={order.orderId + idx}
                        className="bg-secundary rounded-2xl shadow-md hover:shadow-lg transition-all py-2 px-3 flex flex-col"
                    >
                        {/* Resumen del pedido */}
                        <div className="bg-white rounded-lg px-4 py-3 mb-3">
                            <dl className="grid grid-cols-2 gap-2 text-gray-700">
                                <div>
                                    <dt className="font-semibold">Pedido ID:</dt>
                                    <dd className="text-sm">{order.orderId}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold">Estado de pago:</dt>
                                    <dd className="text-sm">{order.paymentStatus}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold">Productos:</dt>
                                    <dd className="text-sm">{order.products.length}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold">Total:</dt>
                                    <dd className="text-sm">{DisplayPriceDOP(order.totalAmt)}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold">Fecha del pedido:</dt>
                                    <dd className="text-sm">{moment(order.date).format('DD/MM/YYYY, HH:MM A')}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Miniaturas de productos */}
                        <div className="bg-white rounded-lg px-2 py-2 mb-3">
                            {order.products.map((product, i) => {
                                const images = parseImage(product.product_details?.image || '[]');
                                const thumb = images[0] || '';
                                return (
                                    <div key={i} className="flex items-center gap-4 mb-3">
                                        {thumb && (
                                            <img
                                                src={thumb}
                                                alt={product.product_details?.name}
                                                className="w-12 h-12 rounded object-contain"
                                            />
                                        )}
                                        <div>
                                            <p className="text-gray-800 font-semibold text-sm">
                                                {product.product_details?.name}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Cantidad: {product.quantity || 1}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Precio unidad: {DisplayPriceDOP(product.product_details?.unit_price || 0)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Botón ver detalles */}
                        <button
                            onClick={() => openModal(order)}
                            className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Ver detalles
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de detalles */}
            <DetailsOrder
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
            />
        </div>
    );
};

export default MyOrders;