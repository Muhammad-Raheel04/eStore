import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        products: []
    },
    reducers: {
        // actions
        setProducts: (state, action) => {
            state.products = action.payload
        }
    }
})

export const { setProducts } = productsSlice.actions
export default productsSlice.reducer