import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["User", "DeletedUser", "Profile", "UserFiles"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    getUsers: builder.query({
      query: (role) => `/users?role=${role}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "User", id })), "User"]
          : ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, newRole }) => ({
        url: `/users/${userId}/role`,
        method: "PATCH",
        body: { newRole },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),

    getDeletedUsers: builder.query({
      query: () => `/users/deleted`,
      providesTags: ["DeletedUser"],
    }),

    recoverUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/recover`,
        method: "POST",
      }),
      invalidatesTags: ["DeletedUser"],
    }),

    getUserFiles: builder.query({
      query: ({ userId, dirId }) =>
        dirId ? `/users/${userId}/${dirId}` : `/users/${userId}`,
      providesTags: ["UserFiles"],
    }),

    deleteUserData: builder.mutation({
      query: ({ userId, id, type }) => {
        const path = type ? "file" : "directory";
        return {
          url: `/users/${userId}/${path}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["UserFiles"],
    }),

    renameUserData: builder.mutation({
      query: ({ userId, DirId, type, newName }) => {
        const path = type ? "file" : "directory";
        return {
          url: `/users/${userId}/${path}/${DirId}`,
          method: "PATCH",
          body: { newName },
        };
      },
      invalidatesTags: ["UserFiles"],
    }),

    openUserData: builder.query({
      query: ({ userId, id, extension }) => {
        const path = extension ? "file" : "directory";
        return `/users/${userId}/${path}/${id}`;
      },
    }),

    logoutUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/logout`,
        method: "POST",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
      ],
    }),

    softDeleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    hardDeleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/hard`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "DeletedUser"],
    }),

    searchUsers: builder.query({
      query: (searchTerm) => `/users/search?query=${searchTerm}`,
      providesTags: ["User"],
    }),

    searchFiles: builder.query({
      query: ({ userId, search }) => ({
        url: `users/${userId}/search?query=${encodeURIComponent(search)}`,
        method: "GET",
      }),
      providesTags: ["UserFiles"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetDeletedUsersQuery,
  useRecoverUserMutation,
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
  useSearchUsersQuery,
  useSearchFilesQuery,
  useLazySearchFilesQuery,
} = adminApiSlice;
