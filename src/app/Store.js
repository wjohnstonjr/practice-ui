import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { addressApi } from '../features/addresses/AddressApi';
import addressSliceReducer from '../features/addresses/AddressSlice';
import { customerApi } from '../features/customers/CustomerApi';
import customerSliceReducer from '../features/customers/CustomerSlice';

export const store = configureStore({
  reducer: {
    addresses: addressSliceReducer,
    [addressApi.reducerPath]: addressApi.reducer,
    customers: customerSliceReducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(addressApi.middleware).concat(customerApi.middleware),
})

setupListeners(store.dispatch)
export default store;