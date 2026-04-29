import { configureStore } from '@reduxjs/toolkit'
import addressSliceReducer from '../components/AddressSlice'

const store = configureStore({
  reducer: {
    address: addressSliceReducer,
  },
})

export default store;