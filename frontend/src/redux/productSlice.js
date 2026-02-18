import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        cart: {
            items:[],
            totalPrice:0
        },
    },
    reducers: {
        // actions
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        }
    }
})

export const { setProducts,setCart } = productsSlice.actions
export default productsSlice.reducer