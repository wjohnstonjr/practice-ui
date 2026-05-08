import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCustomers } from './CustomerSlice';

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        // A simple query without inputs
        getCustomers: builder.query({
            query: () => 'customers',
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCustomers(data));
                } catch (err) {
                    console.log(err);
                }
            },
        }),
    }),
})

// Export the auto-generated hook
export const { useGetCustomersQuery } = customerApi