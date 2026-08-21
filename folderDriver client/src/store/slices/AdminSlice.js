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

  tagTypes: [
    "User",
    "DeletedUser",
    "Profile",
    "UserFiles",
    "AdminAccess",
    "AdminCredential",
  ],

  endpoints: (builder) => ({
    // --------------------------------
    // PROFILE
    // --------------------------------

    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    // --------------------------------
    // USERS
    // --------------------------------

    getUsers: builder.query({
      query: (role) => `/admin?role=${role}`,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "User",
                id,
              })),
              "User",
            ]
          : ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, newRole }) => ({
        url: `/admin/${userId}/role`,
        method: "PATCH",
        body: { newRole },
      }),

      invalidatesTags: (result, error, { userId }) => [
        {
          type: "User",
          id: userId,
        },
      ],
    }),

    getDeletedUsers: builder.query({
      query: () => "/admin/deleted",
      providesTags: ["DeletedUser"],
    }),

    recoverUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/${userId}/recover`,
        method: "POST",
      }),

      invalidatesTags: ["DeletedUser", "User"],
    }),

    // --------------------------------
    // USER FILES
    // --------------------------------

    getUserFiles: builder.query({
      query: ({ userId, dirId }) =>
        dirId ? `/admin/${userId}/${dirId}` : `/admin/${userId}`,

      providesTags: ["UserFiles"],
    }),

    deleteUserData: builder.mutation({
      query: ({ userId, id, type }) => {
        const path = type ? "file" : "directory";

        return {
          url: `/admin/${userId}/${path}/${id}`,
          method: "DELETE",
        };
      },

      invalidatesTags: ["UserFiles"],
    }),

    renameUserData: builder.mutation({
      query: ({ userId, DirId, type, newName }) => {
        const path = type ? "file" : "directory";

        return {
          url: `/admin/${userId}/${path}/${DirId}`,
          method: "PATCH",
          body: { newName },
        };
      },

      invalidatesTags: ["UserFiles"],
    }),

    openUserData: builder.query({
      query: ({ userId, id, extension }) => {
        const path = extension ? "file" : "directory";

        return `/admin/${userId}/${path}/${id}`;
      },
    }),

    // --------------------------------
    // USER ACTIONS
    // --------------------------------

    logoutUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/${userId}/logout`,
        method: "POST",
      }),

      invalidatesTags: (result, error, userId) => [
        {
          type: "User",
          id: userId,
        },
      ],
    }),

    softDeleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/${userId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["User"],
    }),

    hardDeleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/${userId}/hard`,
        method: "DELETE",
      }),

      invalidatesTags: ["User", "DeletedUser"],
    }),

    searchUsers: builder.query({
      query: (searchTerm) =>
        `/admin/search?query=${encodeURIComponent(searchTerm)}`,

      providesTags: ["User"],
    }),

    // ========================================
    // ADMIN ACCESS
    // ========================================

    // OWNER:
    // Create admin credential + one-time access token
    createAdminAccess: builder.mutation({
      query: ({ userId, password }) => ({
        url: `/admin/access/${userId}`,
        method: "POST",
        body: {
          password,
        },
      }),

      invalidatesTags: ["AdminAccess", "AdminCredential", "User"],
    }),

    // OWNER:
    // Change an existing user's admin password
    updateAdminCredentials: builder.mutation({
      query: ({ userId, password }) => ({
        url: `/admin/access/credentials/${userId}`,
        method: "PATCH",
        body: {
          password,
        },
      }),

      invalidatesTags: ["AdminAccess", "AdminCredential"],
    }),

    // ========================================
    // ADMIN ACCESS REDEMPTION
    // ========================================

    // PUBLIC:
    // User enters the password on the access page.
    //
    // Example:
    // /admin/access/abc123/redeem
    //
    // Backend verifies:
    // token + password
    //
    // Then creates admin_access_token cookie.
    redeemAdminAccess: builder.mutation({
      query: ({ token, password }) => ({
        url: `/admin/access/${token}/redeem`,
        method: "POST",
        body: {
          password,
        },
      }),

      invalidatesTags: ["Profile", "AdminAccess", "AdminCredential"],
    }),

    // ========================================
    // ADMIN PROFILE
    // ========================================

    getAdminProfile: builder.query({
      query: () => "/admin/profile",
      providesTags: ["Profile"],
    }),

    // ========================================
    // ADMIN LOGOUT
    // ========================================

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/access/logout",
        method: "POST",
      }),

      invalidatesTags: ["Profile", "AdminAccess"],
    }),
  }),
});

export const {
  // Profile
  useGetProfileQuery,

  // Users
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetDeletedUsersQuery,
  useRecoverUserMutation,

  // Files
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,

  // User actions
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
  useSearchUsersQuery,

  // Admin access
  useCreateAdminAccessMutation,
  useUpdateAdminCredentialsMutation,
  useRedeemAdminAccessMutation,

  // Admin
  useGetAdminProfileQuery,
  useLogoutAdminMutation,
} = adminApiSlice;
