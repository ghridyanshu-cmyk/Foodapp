import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        AddItem: (state, action) => {
            let exitItem = state.find(item => item.id === action.payload.id);
            if (exitItem) {
                exitItem.qty += 1;
            } else {
                state.push(action.payload);
            }
        },
        RemoveItem: (state, action) => {
            const index = state.findIndex(item => item.id === action.payload);
            if (index !== -1) state.splice(index, 1);
        },
        IncreamentQty: (state, action) => {
            const item = state.find(item => item.id === action.payload);
            if (item) item.qty += 1;
        },
        DecreamentQty: (state, action) => {
            const item = state.find(item => item.id === action.payload);
            if (item && item.qty > 1) item.qty -= 1;
        },
        setCartItems: (state, action) => action.payload,
        clearCart: () => []
    }
});

export const { AddItem, RemoveItem, IncreamentQty, DecreamentQty, setCartItems, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
