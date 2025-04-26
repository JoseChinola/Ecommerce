import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
    inventoryMovementsList: []
}

const inventoryMovementsSlice = createSlice({
    name: 'inventorymovements',
    initialState: initialValue,
    reducers: {
        handleInventoryMovements: (state, action) => {
            state.inventoryMovementsList = [...action.payload]
        }
    }
})

export const { handleInventoryMovements } = inventoryMovementsSlice.actions
export default inventoryMovementsSlice.reducer