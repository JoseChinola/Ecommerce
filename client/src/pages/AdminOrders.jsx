import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { IoSearchOutline } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';
import OrderManagementModal from '../components/OrderManagementModal';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';

const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { orders = [], loading = false, error = null } = useSelector((state) => state.ordersAll);

    console.log('Orders', orders)

    const openModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const filteredUsersWithOrders = useMemo(() => {
        return (orders || []).filter((group) => {
            const matchesUser = searchTerm === '' ||
                group.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === '' || group.orders.some(order => order.orderStatus === statusFilter);

            return matchesUser && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const pageSize = 5;
    const pageCount = Math.ceil(filteredUsersWithOrders.length / pageSize);
    const displayedUsers = filteredUsersWithOrders.slice(page * pageSize, (page + 1) * pageSize);

    if (loading) return <p>Cargando pedidos…</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <section className="bg-white p-6 rounded-lg shadow-md h-[76vh] overflow-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secundary rounded-lg px-2 py-2 mb-6">
                <h1 className="text-primary-Green text-lg sm:text-2xl font-extrabold italic flex items-center">
                    Gestión de Pedidos
                </h1>

                <div className="w-full sm:w-auto flex-1 max-w-sm">
                    <div className="flex items-center bg-white border rounded-lg px-3 py-1.5 w-full focus-within:border-green-500">
                        <IoSearchOutline size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email"
                            className="w-full outline-none bg-transparent ml-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <select
                    className="text-[#0aa86f] border border-[#0aa86f] bg-white px-4 py-2 rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                </select>
            </div>

            {displayedUsers.map(({ user, orders }) => (
                <div key={user.email} className="mb-6 bg-secundary rounded-lg p-4 shadow">
                    <h2 className="font-bold text-lg mb-2 text-gray-800">
                        {user.name} — <span className="text-sm text-gray-500">{user.email}</span>
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr>
                                    {['ID', 'Fecha', 'Total', 'Pago', 'Estado', 'Acciones'].map((h) => (
                                        <th key={h} className="px-4 py-2 bg-gray-100 font-medium text-left">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{order.orderId}</td>
                                        <td className="px-4 py-2">{moment(order.createdAt).format('DD/MM/YYYY')}</td>
                                        <td className="px-4 py-2">{DisplayPriceDOP(order.totalAmt)}</td>
                                        <td className="px-4 py-2">{order.paymentStatus}</td>
                                        <td className="px-4 py-2">{order.orderStatus}</td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => openModal(order)}
                                                className="px-2 py-1 bg-blue-600 text-white rounded"
                                            >
                                                Detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {pageCount > 1 && (
                <div className="mt-4">
                    <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={({ selected }) => setPage(selected)}
                        containerClassName="flex space-x-2"
                        pageClassName="px-3 py-1 border rounded"
                        activeClassName="bg-blue-600 text-white"
                        previousLabel="«"
                        nextLabel="»"
                    />
                </div>
            )}

            <OrderManagementModal
                order={selectedOrder}
                isOpen={modalOpen}
                onClose={closeModal}
                onUpdateStatus={() => { }}
                onAssignTracking={() => { }}
                onRefund={() => { }}
                onCancel={() => { }}
                onAddNote={() => { }}
            />
        </section>
    );
};

export default AdminOrders;