import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    AddItem: (state, action) => {
      const exist = state.find(item => item.id === action.payload.id);
      if (exist) exist.qty += 1;
      else state.push(action.payload);
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
    clearCart: () => []
  }
});

export const { AddItem, RemoveItem, IncreamentQty, DecreamentQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
