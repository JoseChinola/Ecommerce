import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isAdmin from '../utils/isAdmin';
import Loading from '../components/Loading';

const AdminPermissions = ({ children }) => {
    const user = useSelector(state => state.user);

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (user?._id !== '' && user?._id !== undefined) {
            setIsLoading(false);
            if (!isAdmin(user.role)) {
                navigate('/');
            }
        }

        if (user?._id === undefined && user?._id === undefined) {
            navigate('/');
        }

    }, [user, navigate]);

    if (isLoading) {
        return <div className="flex w-full h-full justify-center items-center">
            <Loading />
        </div>;
    }

    return isAdmin(user?.role) ? children : <p className="text-red-600 bg-red-100 p-4">No tienes permisos</p>;
};

export default AdminPermissions;
