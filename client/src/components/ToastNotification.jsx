import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../store/notificationSlice';


const ToastNotification = () => {
    const dispatch = useDispatch();
    const { message, type, visible } = useSelector((state) => state.notification);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, dispatch]);

    if (!visible) return null;

    const typeColors = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <div className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 ${typeColors[type]}`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default ToastNotification;