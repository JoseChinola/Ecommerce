import { useEffect, useState, useCallback } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../cammon/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { GlobalContext } from './useGlobalContext'
import { handleAddAddress } from "../store/addressSlice";
import { handleInventory } from "../store/inventorySlice";
import { handleInventoryMovements } from "../store/inventoryMovements";
import { setOrder } from "../store/orderSlice";
import { setOrders } from "../store/ordersAdminSlice";
import { deleteNotification, markNotificationRead, setNotifications } from "../store/userSlice";

const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [totalPrice, setTotalPrice] = useState(0);
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const cartItem = useSelector((state) => state?.cartItem.cart);
    const user = useSelector(state => state?.user);

    // estado para controlar la llamada a notificaciones
    const [fetchedNotify, setFetchedNotify] = useState(false);

    const fetchInventario = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getInventory });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(handleInventory(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const fetchCartItem = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getCartItem });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(handleAddItemCart(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const updateCartItem = useCallback(async (id, qty) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateCartItemQty,
                data: { _id: id, qty }
            });
            const { data: responseData } = response;
            if (responseData.success) {
                fetchCartItem();
                fetchInventario();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [fetchCartItem, fetchInventario]);

    const deleteCartItem = useCallback(async (id) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartItem,
                data: { _id: id }
            });
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem();
                fetchInventario();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [fetchCartItem, fetchInventario]);

    const deleteCartItems = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.deleteCartItems });
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem();
                fetchInventario();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [fetchCartItem, fetchInventario]);

    useEffect(() => {
        const qty = cartItem.reduce((prev, curr) => prev + curr.quantity, 0);
        setTotalQty(qty);

        const tPrice = cartItem.reduce(
            (prev, curr) => prev + (pricewithDiscount(curr.productData.price, curr.productData.discount) * curr.quantity),
            0
        );
        setTotalPrice(tPrice);

        const notDiscountPrice = cartItem.reduce(
            (prev, curr) => prev + (curr.productData.price * curr.quantity),
            0
        );
        setNotDiscountTotalPrice(notDiscountPrice);
    }, [cartItem]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(handleAddItemCart([]));
    }, [dispatch]);

    const fetchAddress = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getAddress });
            const { data: responseData } = response;
            if (responseData.success) {
                dispatch(handleAddAddress(responseData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);


    const fetchMovements = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getInventoryMovement });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(handleInventoryMovements(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const fetchOrderItems = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getOrderItems });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(setOrder(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const fetchOrdersAdminItems = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getOrdersAllAdmin });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(setOrders(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const fetchUpdateOrdersItem = useCallback(async (orderId, newStatus) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateOrdersAdminStatus,
                data: { orderId, orderStatus: newStatus }
            });
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                fetchOrderItems();
                fetchOrdersAdminItems();
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [fetchOrderItems, fetchOrdersAdminItems]);

    const fetchNotifyUser = useCallback(async () => {
        try {
            const response = await Axios({ ...SummaryApi.getNotifyUser });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(setNotifications(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const markRead = useCallback(async (id) => {
        try {
            const response = await Axios({
                ...SummaryApi.markAsReadUser,
                data: { _id: id },
            });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(markNotificationRead(id));
                toast.success("Notificación marcada como leída");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    const deleteNotifyUser = useCallback(async (id) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteNotifyUser,
                data: { _id: id }
            });
            const { data: resData } = response;
            if (resData.success) {
                toast.success(resData.message);
                dispatch(deleteNotification(id));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (user?._id && !fetchedNotify) {
            fetchNotifyUser();
            setFetchedNotify(true);
        }
    }, [user?._id, fetchedNotify, fetchNotifyUser]);

    useEffect(() => {
        if (user?._id) {
            fetchCartItem();
            handleLogout();
            fetchAddress();
            fetchInventario();
            fetchMovements();
            fetchOrderItems();
            if (user?.role === "ADMIN") {
                fetchOrdersAdminItems();
            }
        }
    }, [
        user,
        fetchCartItem,
        handleLogout,
        fetchAddress,
        fetchInventario,
        fetchMovements,
        fetchOrderItems,
        fetchOrdersAdminItems,
    ]);

    return (
        <GlobalContext.Provider
            value={{
                fetchCartItem,
                updateCartItem,
                deleteCartItem,
                deleteCartItems,
                fetchAddress,
                totalPrice,
                totalQty,
                notDiscountTotalPrice,
                fetchInventario,
                fetchMovements,
                fetchOrderItems,
                fetchOrdersAdminItems,
                fetchUpdateOrdersItem,
                fetchNotifyUser,
                markRead,
                handleLogout,
                deleteNotifyUser,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
