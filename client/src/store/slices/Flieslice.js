import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.BASE_URL;

export const FileApiSlice = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["directory", "file"],

  endpoints: (builder) => ({
    getFile: builder.query({
      query: (paramId) => `/directory/${paramId || ""}`,
      transformResponse: (query) => [
        ...(query?.directories || []),
        ...(query?.files || []),
      ],
      transformErrorResponse: (error) => error,
      providesTags: (result) =>
        result
          ? [
              ...result
                .filter((item) => item.type === "directory")
                .map(({ id }) => ({ type: "directory", id })),
              ...result
                .filter((item) => item.type === "file")
                .map(({ id }) => ({ type: "file", id })),
              "directory",
              "file",
            ]
          : ["directory", "file"],
    }),

    deleteFile: builder.mutation({
      query: ({ id, type }) => ({
        url: `/${type ? "file" : "directory"}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, type }) => [
        { type: type ? "file" : "directory", id },
      ],
    }),

    renameFile: builder.mutation({
      query: ({ newName, DirId, type }) => ({
        url: `/${type ? "file" : "directory"}/${DirId}`,
        method: "PATCH",
        body: JSON.stringify({ newName }),
        headers: { "content-type": "application/json" },
      }),
      invalidatesTags: (result, error, { DirId, type }) => [
        { type: type ? "file" : "directory", id: DirId },
      ],
    }),

    createDirectory: builder.mutation({
      query: ({ folderName, parentId }) => ({
        url: `/directory/${parentId || ""}`,
        method: "POST",
        body: JSON.stringify({ folderName }),
        headers: { "content-type": "application/json" },
      }),
      invalidatesTags: ["directory"],
    }),

    openFile: builder.mutation({
      query: ({ id, type }) => ({
        url: `/${type ? "file" : "directory"}/${id}`,
        method: "GET",
      }),
    }),

    uploadFile: builder.mutation({
      queryFn: ({ paramId, file, onProgress }) => {
        return new Promise((resolve, reject) => {
          const form = new FormData();
          form.append("file", file);

          const xhr = new XMLHttpRequest();
          const url = paramId
            ? `${BASE_URL}file/${paramId}`
            : `${BASE_URL}file`;

          xhr.open("POST", url, true);
          xhr.withCredentials = true;

          xhr.upload.addEventListener("progress", (e) => {
            const totalProgress = (e.loaded / e.total) * 100;
            onProgress(totalProgress.toFixed(0));
          });

          xhr.onload = () => resolve({ data: xhr.responseText });
          xhr.onerror = () =>
            reject({ error: { status: xhr.status, data: xhr.statusText } });

          xhr.send(form);
        });
      },
      invalidatesTags: (result, error, { paramId }) => [
        { type: "directory", id: paramId || "" },
      ],
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
