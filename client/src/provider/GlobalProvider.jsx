import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../cammon/SummaryApi";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)



const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const cartItem = useSelector((state) => state?.cartItem.cart)

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
            console.log(error)
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
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }


    useEffect(() => {
        fetchCartItem()
    }, [])

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


    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            totalPrice,
            totalQty,
            notDiscountTotalPrice
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider