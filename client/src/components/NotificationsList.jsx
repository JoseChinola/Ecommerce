import { useSelector } from "react-redux";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";


const NotificationsList = ({ markRead, deleteNotify }) => {
    const notifications = useSelector(state => state.user.notifications);
    const userRole = useSelector(state => state.user.role);
    const navigate = useNavigate();

    return (
        <div className="px-3 py-2 max-w-sm mx-auto">
            {notifications.length === 0 ? (
                <p className="text-center text-gray-400 italic text-sm">No tienes notificaciones</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((notif) => (
                        <li
                            key={notif._id}
                            className={`flex flex-col px-3 py-2 rounded-md shadow-sm transition-shadow duration-150 ${notif.read ? "bg-blue-100/60 hover:shadow-md" : "bg-green-50 border-l-4 border-green-600"
                                }`}
                            role="listitem"
                            aria-live="polite"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{notif.title}</h4>
                                <div className="flex gap-1 items-center">
                                    {!notif.read && (
                                        <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full select-none">
                                            Nuevo
                                        </span>
                                    )}
                                    <button
                                        onClick={() => deleteNotify(notif._id)}
                                        className="ml-2 text-xs text-red-700  hover:text-red-500"
                                        title="Eliminar notificación"
                                    >
                                        <RiDeleteBin5Line size={16} />
                                    </button>
                                </div>
                            </div>
                            <p
                                className="mt-0.5 text-gray-700 text-xs leading-tight notification-message"
                                aria-label={notif.message}
                            >
                                {notif.message}
                            </p>
                            {!notif.read && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markRead(notif._id);
                                        if (userRole === 'ADMIN') {
                                            navigate('/myorders');
                                        }
                                    }}
                                    className={`self-start inline-flex items-center px-2.5 py-1 text-xs font-medium text-white rounded
                                    ${userRole === 'admin' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}
                                    focus:outline-none focus:ring-2 focus:ring-offset-1 transition`}
                                    aria-label={
                                        userRole === 'ADMIN'
                                            ? `Ir a mis órdenes y marcar la notificación ${notif.title} como leída`
                                            : `Marcar la notificación ${notif.title} como leída`
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {userRole === 'ADMIN' ? 'Ver órdenes' : 'Marcar'}
                                </button>
                            )}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsList;
