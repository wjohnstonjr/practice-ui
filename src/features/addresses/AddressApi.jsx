import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setAddresses } from './AddressSlice';

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        // A simple query without inputs
        getAddresses: builder.query({
            query: () => 'address',
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAddresses(data));
                } catch (err) {
                    console.log(err);
                }
            },
        }),
    }),
})

// Export the auto-generated hook
export const { useGetAddressesQuery } = addressApi