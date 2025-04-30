import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DetailsOrder from '../components/DetailsOrder';
import { Navigate } from 'react-router-dom';

const MyOrders = () => {
    const orders = useSelector((state) => state?.orders?.order);
    const user = useSelector(state => state.user);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (!user || !user._id) {
        return <Navigate to="/" />;
    }


    // Agrupar las órdenes por orderId
    const groupedOrders = orders?.reduce((acc, item) => {
        const key = item.orderId;
        if (!acc[key]) {
            acc[key] = {
                orderId: item.orderId,
                paymentStatus: item.paymentStatus,
                totalAmt: 0,
                products: [],
                user: item.user, // Información del usuario
                deliveryAddress: item.address // Dirección de entrega
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
            // Limpiar los escapes extras y las comillas que rodean la cadena
            const cleanedString = imageString.replace(/\\"/g, '"').replace(/^\"|\"$/g, '');
            return JSON.parse(cleanedString); // Parseamos la cadena JSON
        } catch (error) {
            console.error("Error parsing image data:", error);
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
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Pedidos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedOrdersArray.map((order, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">Pedido ID:</span>
                            <span className="text-sm font-semibold text-gray-700">{order.orderId}</span>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            <p className="text-gray-700">
                                <span className="font-semibold">Estado de pago:</span> {order.paymentStatus}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Productos:</span> {order.products.length}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Total:</span> ${order.totalAmt.toFixed(2)}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            {order.products.map((product, idx) => {
                                let productData = product.product_details;
                                let imageUrl = '';
                                let imagesArray = [];

                                if (productData?.image) {
                                    imagesArray = parseImage(productData.image); // Parseamos la cadena de imágenes
                                }

                                if (imagesArray.length > 0) {
                                    imageUrl = imagesArray[0]; // Solo tomamos la primera imagen
                                }

                                return (
                                    <div key={idx} className="flex items-center gap-4 mb-3">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={productData?.name}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-gray-800 font-semibold text-sm">{productData?.name}</p>
                                            <p className="text-gray-500 text-xs">
                                                Cantidad: {product.quantity || 1}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => openModal(order)} // Pasamos el pedido completo al modal
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto mt-4"
                        >
                            Ver detalles
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <DetailsOrder
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
            />
        </div>

    );
};

export default MyOrders;
