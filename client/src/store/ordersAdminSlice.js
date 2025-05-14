import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    loading: false,
    error: null,
};

const ordersSlice = createSlice({
    name: 'allOrders',
    initialState,
    reducers: {
        setLoading(state) {
            state.loading = true;
            state.error = null;
        },
        setOrders(state, action) {
            state.orders = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const { setLoading, setOrders, setError } = ordersSlice.actions;

export default ordersSlice.reducer;