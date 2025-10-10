import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        AddItem: (state, action) => {
            let existItem = state.find(item => item.id === action.payload.id);
            if (existItem) existItem.qty += 1;
            else state.push(action.payload);
        },
        RemoveItem: (state, action) => state.filter(item => item.id !== action.payload),
        IncreamentQty: (state, action) => {
            const item = state.find(i => i.id === action.payload);
            if (item) item.qty += 1;
        },
        DecreamentQty: (state, action) => {
            const item = state.find(i => i.id === action.payload);
            if (item && item.qty > 1) item.qty -= 1;
        },
        setCartItems: (state, action) => action.payload
    }
});

export const { AddItem, RemoveItem, IncreamentQty, DecreamentQty, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
