import React, { useState } from 'react';
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../cammon/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const AddUserModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('ADMIN');
    const [showPassword, setShowPassword] = useState(false); // 👈 para alternar visibilidad

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name, email, password, role };

        try {
            const res = await Axios({
                ...SummaryApi.register,
                data: data
            });

            if (res.data.error) {
                toast.error(res.data.message);
            }

            if (res.data.success) {
                toast.success(res.data.message);
                onClose();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg space-y-2">
                <div className='p-1 flex justify-between items-center border bg-secundary rounded-md px-2'>
                    <h2 className="text-xl font-bold text-primary-Green">Añadir Usuario</h2>
                    <button onClick={onClose} className="hover:text-red-600">
                        <IoClose size={30} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-secundary py-4 px-4 rounded-lg">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? <IoEyeOff /> : <IoEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? <IoEyeOff /> : <IoEye />}
                        </button>
                    </div>

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2 w-full rounded-lg bg-green-500 text-white hover:bg-green-600"
                    >
                        Añadir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;