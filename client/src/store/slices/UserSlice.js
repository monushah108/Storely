import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const UserApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/user",
    credentials: "include",
  }),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    FetchUser: builder.query({
      query: () => `/profile`,
      transformErrorResponse: (error) => [error],
      providesTags: ["profile"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),

      invalidatesTags: ["profile"],
    }),

    register: builder.mutation({
      query: (userContent) => ({
        url: "/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userContent),
      }),
      invalidatesTags: ["profile"],
    }),

    login: builder.mutation({
      query: (userContent) => ({
        url: "/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userContent),
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useFetchUserQuery,
  useLogoutMutation,
  useRegisterMutation,
  useLoginMutation,
} = UserApiSlice;
