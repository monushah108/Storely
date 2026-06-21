import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const FileApiSlice = createApi({
  reducerPath: "fileApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    // prepareHeaders: (headers) => {
    //   headers.set("content-type", "application/json");
    //   return headers;
    // },
  }),

  tagTypes: ["file", "directory"],

  endpoints: (builder) => ({
    getFile: builder.query({
      query: (parentId) => `/directory/${parentId ?? ""}`,

      transformResponse: ({ directories = [], files = [] }) => [
        ...directories,
        ...files,
      ],

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ type, id }) => ({
                type,
                id,
              })),
              { type: "file", id: "LIST" },
              { type: "directory", id: "LIST" },
            ]
          : [
              { type: "file", id: "LIST" },
              { type: "directory", id: "LIST" },
            ],
    }),

    deleteFile: builder.mutation({
      query: ({ id, type }) => ({
        url: `/${type ? "file" : "directory"}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["file", "directory"],
    }),

    renameFile: builder.mutation({
      query: ({ newName, DirId, ext }) => ({
        url: `/${ext ? "file" : "directory"}/${DirId}`,
        method: "PATCH",
        body: { newName },
      }),

      invalidatesTags: ["file", "directory"],
    }),

    createDirectory: builder.mutation({
      query: ({ folderName, parentId }) => ({
        url: `/directory/${parentId ?? ""}`,
        method: "POST",
        body: { folderName },
      }),

      invalidatesTags: [{ type: "directory", id: "LIST" }],
    }),

    openFile: builder.mutation({
      query: ({ id }) => ({
        url: `/file/${id}`,
        method: "GET",
      }),
    }),

    uploadFile: builder.mutation({
      query: ({ paramId, form }) => ({
        url: `/file${paramId ? `/${paramId}` : ""}`,
        method: "POST",
        body: form,
      }),

      invalidatesTags: [{ type: "file", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFileQuery,
  useDeleteFileMutation,
  useRenameFileMutation,
  useCreateDirectoryMutation,
  useUploadFileMutation,
  useOpenFileMutation,
} = FileApiSlice;

// async queryFn({ paramId, file }) {
//         return new Promise((resolve, reject) => {
//           const form = new FormData();
//           form.append("file", file);

//           const xhr = new XMLHttpRequest();

//           xhr.open(
//             "POST",
//             `${BASE_URL}/file${paramId ? `/${paramId}` : ""}`,
//             true,
//           );

//           xhr.withCredentials = true;

//           xhr.onload = () => {
//             resolve({
//               data: JSON.parse(xhr.responseText),
//             });
//           };

//           xhr.onerror = () => {
//             reject({
//               error: {
//                 status: xhr.status,
//                 data: xhr.statusText,
//               },
//             });
//           };

//           xhr.send(form);
//         });
//       }
