import React, { useEffect, useState } from 'react';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrashAlt,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import AddUserModal from '../components/AddUserModal';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import moment from 'moment';
import EditUserModal from '../components/EditUserModal';


const UsersPage = () => {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const usersPerPage = 6;

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
    };

    const fetchUsers = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getsAllUsers,
            });

            const { data: resData } = response;

            if (resData.success) {            
                setUsers(resData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <section className='bg-white p-4 rounded-lg shadow min-h-[75vh]'>
            <div className=' bg-secundary py-2 rounded-lg px-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-5'>
                <h1 className='text-xl font-extrabold text-primary-Green text-center sm:text-left'>
                    Mantenimiento de Usuarios
                </h1>
                <div className='flex gap-2 items-center w-full max-w-md bg-gray-100 px-3 py-2 rounded-md'>
                    <FaSearch className='text-gray-500' />
                    <input
                        type='text'
                        placeholder='Buscar usuario...'
                        className='w-full bg-transparent outline-none'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 bg-primary-Green text-white px-4 py-2 rounded-md hover:bg-green-700 transition w-full sm:w-auto justify-center'
                >
                    <FaPlus /> Añadir Usuario
                </button>
            </div>

            <div className='overflow-x-auto rounded-lg shadow bg-secundary p-1'>
                <table className='min-w-full text-sm text-left border bg-white'>
                    <thead className='bg-gray-100 text-gray-700'>
                        <tr>
                            <th className='px-4 py-2 border'>#</th>
                            <th className='px-4 py-2 border'>Nombre</th>
                            <th className='px-4 py-2 border'>Correo</th>
                            <th className='px-4 py-2 border'>Verificación</th>
                            <th className='px-4 py-2 border'>Rol</th>
                            <th className='px-4 py-2 border'>Estatus</th>
                            <th className='px-4 py-2 border'>Creado</th>
                            <th className='px-4 py-2 border'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length ? (
                            currentUsers.map((user, index) => (
                                <tr key={user._id || index} className='hover:bg-gray-50'>
                                    <td className='px-4 py-2 border'>{startIndex + index + 1}</td>
                                    <td className='px-4 py-2 border'>{user.name}</td>
                                    <td className='px-4 py-2 border'>{user.email}</td>
                                    <td className='px-4 py-2 border'><span>{user.verify_email ? 'Sí' : 'No'}</span></td>
                                    <td className='px-4 py-2 border'>{user.role}</td>
                                    <td className='px-4 py-2 border'>
                                        {user.status === 'Active' ? (
                                            <span className='text-white bg-green-500 rounded-lg px-2 py-1 font-bold'>Activo</span>
                                        ) : user.status === 'Inactive' ? (
                                            <span className='text-white bg-yellow-600 rounded-lg px-2 py-1 font-bold'>Inactivo</span>
                                        ) : (
                                            <span className='text-white bg-red-600rounded-lg px-2 py-1 font-bold'>Suspendido</span>
                                        )}
                                    </td>
                                    <td className='px-4 py-2 border'>{moment(user.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='px-4 py-2 border space-x-4 sm:space-x-2 text-lg'>
                                        <button className='text-blue-500 hover:text-blue-700' onClick={() => {
                                            setSelectedUser(user);
                                            setShowEditModal(true);
                                        }}>
                                            <FaEdit />
                                        </button>
                                        <button className='text-red-500 hover:text-red-700'>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='7' className='text-center py-4 text-gray-500'>
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className='flex flex-col sm:flex-row justify-between mt-4 items-center gap-4 text-sm bg-white rounded-lg p-2'>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className='flex items-center py-2 px-4 rounded-lg gap-1 text-primary-Green hover:text-white hover:bg-primary-Green disabled:opacity-50'
                    >
                        <FaChevronLeft /> Anterior
                    </button>
                    <span className='text-gray-600'>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className='flex items-center py-2 px-4 rounded-lg gap-1 text-primary-Green hover:text-white hover:bg-primary-Green disabled:opacity-50'
                    >
                        Siguiente <FaChevronRight />
                    </button>
                </div>
            )}

            {showModal && (
                <AddUserModal
                    onClose={() => setShowModal(false)}
                    onAdd={handleAddUser}
                />
            )}

            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={(updatedData) => {
                        setUsers(users.map(u =>
                            u._id === selectedUser._id ? { ...u, ...updatedData } : u
                        ));
                    }}
                />
            )}
        </section>
    );
};

export default UsersPage;