import { useEffect, useState } from "react";
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


const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const cartItem = useSelector((state) => state?.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async () => {

        try {
            const response = await Axios({
                ...SummaryApi.getCartItem

            })

            const { data: resData } = response
            if (resData.success) {
                dispatch(handleAddItemCart(resData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const updateCartItem = async (id, qty) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateCartItemQty,
                data: {
                    _id: id,
                    qty: qty
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                fetchCartItem()
                fetchInventario()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const deleteCartItem = async (id) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartItem,
                data: {
                    _id: id
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItem()
                fetchInventario()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    const deleteCartItems = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCartItems
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCartItem();
                fetchInventario();
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        const qty = cartItem.reduce((preve, curr) => {
            return preve + curr.quantity
        }, 0)

        setTotalQty(qty)

        const tPrice = cartItem.reduce((preve, curr) => {
            return preve + (pricewithDiscount(curr.productData.price, curr.productData.discount) * curr.quantity)
        }, 0)

        setTotalPrice(tPrice)

        const notDiscountPrice = cartItem.reduce((preve, curr) => {
            return preve + (curr.productData.price * curr.quantity)
        }, 0)

        setNotDiscountTotalPrice(notDiscountPrice)

    }, [cartItem])


    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        dispatch(handleAddItemCart([]))
    }

    const fetchAddress = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getAddress
            })
            const { data: responseData } = response

            if (responseData.success) {
                dispatch(handleAddAddress(responseData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchInventario = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getInventory
            });

            const { data: resData } = response;
            if (resData.success) {
                dispatch(handleInventory(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const fetchMovements = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getInventoryMovement
            });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(handleInventoryMovements(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };


    const fetchOrderItems = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getOrderItems
            });
            const { data: resData } = response;
            if (resData.success) {
                dispatch(setOrder(resData.data));
            }
        } catch (error) {
            AxiosToastError(error);
        }
    }


    useEffect(() => {
        if (user?._id) {
            fetchCartItem()
            fetchAddress()
            handleLogout()
            fetchInventario()
            fetchMovements()
            fetchOrderItems()
        }

    }, [user])


    return (
        <GlobalContext.Provider value={{
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
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider