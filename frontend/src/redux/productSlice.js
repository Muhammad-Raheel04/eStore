import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        cart: {
            items: [],
            totalPrice: 0
        },
        addresses: [],
        selectedAddress: null, // currently chosen address
        isCartOpen: false
    },
    reducers: {
        // actions
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        setCartOpen: (state, action) => {
            state.isCartOpen = action.payload;
        },
        // Address Management
        addAddress: (state, action) => {
            if (!state.addresses) state.addresses = [];
            state.addresses.push(action.payload);
        },

        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },

        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter((_, index) => index !== action.payload);

            // Reset selectedAdddress if it was deleted
            if (state.selectedAddress === action.payload) {
                state.selectedAddress = null;
            }
        },
        clearCart: (state) => {
            state.cart = {
                items: [],
                totalPrice: 0
            };
        }
    }
})

export const { setProducts, setCart, setCartOpen, addAddress, setSelectedAddress, deleteAddress, clearCart } = productsSlice.actions;
export default productsSlice.reducer