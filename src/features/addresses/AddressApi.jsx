import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    endpoints: (builder) => ({
        // A simple query without inputs
        getAddresses: builder.query({
            query: () => 'address', // Returns the URL path string
        }),
    }),
})

// Export the auto-generated hook
export const { useGetAddressesQuery } = addressApi