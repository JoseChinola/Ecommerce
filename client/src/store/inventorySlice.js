import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    inventoryList: []
}


const inventorySlice = createSlice({
    name: 'inventory',
    initialState: initialValue,
    reducers: {
        handleInventory: (state, action) => {
            state.inventoryList = [...action.payload]
        }
    }
})

export const { handleInventory } = inventorySlice.actions
export default inventorySlice.reducer