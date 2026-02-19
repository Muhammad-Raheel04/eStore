import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from './userSlice'
import productSlice from "./productSlice";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'eStore',
    version: 1,
    storage,
    whitelist:['user','product']
}
const rootReducer = combineReducers({
    user: userSlice,
    product:productSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store