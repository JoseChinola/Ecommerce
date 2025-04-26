import React, { useState } from 'react';
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrashAlt,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

const UsersPage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    const users = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'ADMIN' },
        { id: 2, name: 'Ana Gómez', email: 'ana@example.com', role: 'USER' },
        { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'USER' },
        { id: 4, name: 'Marta Díaz', email: 'marta@example.com', role: 'ADMIN' },
        { id: 5, name: 'Luis Torres', email: 'luis@example.com', role: 'USER' },
        { id: 6, name: 'Laura Méndez', email: 'laura@example.com', role: 'USER' },
        // Agrega más usuarios si deseas probar
    ];

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    return (
        <section className='bg-white p-4 rounded-lg shadow'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-secundary py-2 px-3 rounded-lg'>
                <h1 className='text-xl font-extrabold text-primary-Green'>Mantenimiento de Usuarios</h1>
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
                <button className='flex items-center gap-2 bg-primary-Green text-white px-4 py-2 rounded-md hover:bg-green-700 transition'>
                    <FaPlus /> Añadir Usuario
                </button>
            </div>

            <div className='overflow-x-auto bg-secundary rounded-lg p-2'>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <table className='w-full table-auto text-sm text-left border'>
                        <thead className='bg-gray-100 text-gray-700'>
                            <tr>
                                <th className='px-4 py-2 border'>ID</th>
                                <th className='px-4 py-2 border'>Nombre</th>
                                <th className='px-4 py-2 border'>Correo</th>
                                <th className='px-4 py-2 border'>Rol</th>
                                <th className='px-4 py-2 border'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length ? (
                                currentUsers.map(user => (
                                    <tr key={user.id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-2 border'>{user.id}</td>
                                        <td className='px-4 py-2 border'>{user.name}</td>
                                        <td className='px-4 py-2 border'>{user.email}</td>
                                        <td className='px-4 py-2 border'>{user.role}</td>
                                        <td className='px-4 py-2 border space-x-8 sm:text-lg'>
                                            <button className='text-blue-500 hover:text-blue-700'>
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
                                    <td colSpan="5" className='text-center py-4 text-gray-500'>
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {totalPages > 1 && (
                    <div className='flex justify-between mt-4 items-center gap-4 text-sm py-3 px-2 bg-white rounded-lg'>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='flex items-center py-2 px-2 rounded-lg gap-1 text-primary-Green hover:text-white hover:bg-primary-Green disabled:opacity-50'
                        >
                            <FaChevronLeft /> Anterior
                        </button>
                        <span className='text-gray-600'>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='flex items-center py-2 px-2 rounded-lg gap-1 text-primary-Green hover:text-white hover:bg-primary-Green disabled:opacity-50'
                        >
                            Siguiente <FaChevronRight />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default UsersPage;