import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    _id: "",
    name: "",
    lastName: "",
    fullName: "",
    email: "",
    avatar: "",
    mobile: "",
    verify_email: "",
    last_login_date: "",
    status: "",
    address_details: [],
    shopping_cart: [],
    orderHistory: [],
    role: "",
    notifications: []
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.lastName = action.payload?.lastName
            state.fullName = action.payload?.fullName
            state.email = action.payload?.email
            state.avatar = action.payload?.avatar
            state.mobile = action.payload?.mobile
            state.verify_email = action.payload?.verify_email
            state.last_login_date = action.payload?.last_login_date
            state.status = action.payload?.status
            state.address_details = action.payload?.address_details
            state.shopping_cart = action.payload?.shopping_cart
            state.orderHistory = action.payload?.orderHistory
            state.role = action.payload?.role
            state.notifications = action.payload?.notifications || [];
        },
        updatedAvatar: (state, action) => {
            state.avatar = action.payload
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        markNotificationRead: (state, action) => {
            const id = action.payload;
            state.notifications = state.notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            );
        },
        deleteNotification: (state, action) => {
            const id = action.payload;
            state.notifications = state.notifications.filter(n => n._id !== id);
        },
        logout: (state, action) => {
            state._id = ""
            state.name = ""
            state.lastName = ""
            state.fullName = ""
            state.email = ""
            state.avatar = ""
            state.mobile = ""
            state.verify_email = ""
            state.last_login_date = ""
            state.status = ""
            state.address_details = []
            state.shopping_cart = []
            state.orderHistory = []
            state.role = ""
            state.notifications = []

        }
    }
})

export const { setUserDetails, logout, updatedAvatar, markNotificationRead, setNotifications, deleteNotification } = userSlice.actions

export default userSlice.reducer