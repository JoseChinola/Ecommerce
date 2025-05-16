import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { IoSearchOutline } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';
import OrderManagementModal from '../components/OrderManagementModal';
import { DisplayPriceDOP } from '../utils/DisplayPriceDOP';
import { useGlobalContext } from '../provider/useGlobalContext';
import OrderSkeleton from '../components/OrderSkeleton';
import CancelOrderModal from '../components/CancelOrderModal';

const AdminOrders = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const { fetchUpdateOrdersItem, fetchCancelOrder } = useGlobalContext()
    const [modalCancelOpen, setModalCancelOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);


    const { orders = [], loading = false, error = null } = useSelector((state) => state.ordersAll);

    const openModal = (order, user) => {
        setSelectedOrder(order);
        setSelectedUser(user)
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const openCancelModal = (order) => {
        setOrderToCancel(order);
        setModalCancelOpen(true);
    };

    const closeCancelModal = () => {
        setOrderToCancel(null);
        setModalCancelOpen(false);
    };

    const confirmCancelOrder = () => {
        if (!orderToCancel) return;
        fetchCancelOrder(orderToCancel.orderId);
        closeCancelModal();
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

    if (loading) return (
        <section className="space-y-6 p-5 rounded-lg">
            {[...Array(2)].map((_, i) => (
                <OrderSkeleton key={i} />
            ))}
        </section>
    );

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <section className="bg-white w-full p-5 rounded-lg shadow-md overflow-auto">
            <div className='space-y-3'>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secundary rounded-lg px-2 py-2">
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
                        <option value="Reembolsado">Reembolsado</option>
                        <option value="Completado">Completado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>

                {displayedUsers.length === 0 && (
                    <div className="bg-secundary px-1 py-1 rounded-lg shadow-md">
                        <div className='text-center font-bold text-lg bg-gray-50 p-8 rounded-lg shadow text-secundary'>
                            {searchTerm || statusFilter
                                ? `No se encontraron pedidos con los filtros (${statusFilter}) aplicados.`
                                : 'No se encontraron pedidos.'}
                        </div>
                    </div>
                )}

                {displayedUsers.map(({ user, orders }) => (
                    <div key={user.email} className="bg-secundary rounded-lg px-2 py-2 shadow-md">
                        <h2 className="font-bold text-lg mb-2 bg-white py-1.5 px-2 rounded-lg text-primary-Green w-fit">
                            Cliente: {user.fullName} — <span className="text-sm font-bold text-primary-Green">{user.email}</span>
                        </h2>

                        <div className="overflow-x-auto">
                            <div className="overflow-x-auto bg-white p-2 rounded-lg">
                                <table className="min-w-full rounded-lg shadow">
                                    <thead>
                                        <tr>
                                            {['ID Orden', 'Fecha', 'Total', 'Pago', 'Estado', 'Acciones'].map((h) => (
                                                <th key={h} className="px-2 py-2 bg-gray-100 text-left font-bold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.orderId} className="border-t hover:bg-gray-50">
                                                <td className="px-2 py-2">{order.orderId}</td>
                                                <td className="px-2 py-2">{moment(order.createdAt).format('DD/MM/YYYY')}</td>
                                                <td className="px-2 py-2">{DisplayPriceDOP(order.totalAmt)}</td>
                                                <td className="px-2 py-2">{order.paymentStatus === 'Paid'
                                                    ? 'Pagado'
                                                    : order.paymentStatus === 'CASH ON DELIVERY'
                                                        ? 'Pago contra entrega'
                                                        : 'Pendiente'}
                                                </td>
                                                <td className="px-2 py-2" >
                                                    <span className={`py-1.5 px-1 font-medium rounded-lg ${order.orderStatus === 'Completado'
                                                        ? 'bg-green-500 text-white'
                                                        : order.orderStatus === 'Procesando'
                                                            ? 'bg-blue-400 text-white'
                                                            : order.orderStatus === 'Pendiente'
                                                                ? 'bg-yellow-500 text-white'
                                                                : order.orderStatus === 'Cancelada'
                                                                    ? 'bg-red-500 text-white'
                                                                    : order.orderStatus === 'Reembolsado'
                                                                        ? 'bg-gray-100'
                                                                        : ''
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>

                                                </td>
                                                <td className="py-2 space-x-2">
                                                    <button
                                                        onClick={() => openModal(order, user)}
                                                        className="px-1 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-500"
                                                    >
                                                        Detalles
                                                    </button>
                                                    {order.orderStatus !== 'Cancelada' && order.orderStatus !== 'Completado' && (
                                                        <button
                                                            onClick={() => openCancelModal(order)}
                                                            className="px-1 py-1 bg-red-800 text-white rounded-lg hover:bg-red-500"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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

                <CancelOrderModal
                    isOpen={modalCancelOpen}
                    onClose={closeCancelModal}
                    onConfirm={confirmCancelOrder}
                />

                <OrderManagementModal
                    order={selectedOrder}
                    user={selectedUser}
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onUpdateStatus={(orderId, newStatus) => fetchUpdateOrdersItem(orderId, newStatus)}
                    onAssignTracking={() => { }}
                    onRefund={() => { }}
                    onCancel={() => { }}
                    onAddNote={() => { }}
                />
            </div>
        </section>
    );
};

export default AdminOrders;