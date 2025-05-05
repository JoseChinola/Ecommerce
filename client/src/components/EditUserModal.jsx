import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from 'react-icons/io5';

const EditUserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.updateAdminUserDetails,
                data: formData,
            });
            const { data: resData } = response;

            if (resData.success) {
                toast.success(resData.message);
                onUpdate(formData);
                onClose();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-3 space-y-2 w-full max-w-md'>

                <div className='py-2 flex justify-between items-center border bg-secundary rounded-lg px-2'>
                    <h2 className='font-extrabold text-primary-Green italic sm:text-lg sm:uppercase'>Editar Usuario</h2>
                    <button onClick={onClose} className="w-fit ml-auto hover:text-red-600 hidden sm:block">
                        <IoClose size={30} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4 bg-secundary py-2 px-2 rounded-lg'>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Nombre'
                        className='w-full border rounded px-3 py-2'
                        required
                    />
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Correo'
                        className='w-full border rounded px-3 py-2'
                        required
                    />
                    <select
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        className='w-full border rounded px-3 py-2'
                        required
                    >
                        <option value='Admin'>Admin</option>
                        <option value='User'>User</option>
                    </select>
                    <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        className='w-full border rounded px-3 py-2'
                        required
                    >
                        <option value='Active'>Activo</option>
                        <option value='Inactive'>Inactivo</option>
                        <option value='Suspended'>Suspendido</option>
                    </select>
                    <button
                        type='submit'
                        className='px-4 py-2 bg-primary-Green text-white hover:bg-green-700 w-full rounded-lg'
                    >
                        Guardar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;