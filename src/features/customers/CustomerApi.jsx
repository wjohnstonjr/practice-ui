import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        // A simple query without inputs
        getCustomers: builder.query({
            query: () => 'customers', // Returns the URL path string
        }),
    }),
})

// Export the auto-generated hook
export const { useGetCustomersQuery } = customerApi