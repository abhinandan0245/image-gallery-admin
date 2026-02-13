import { api } from "../../app/api";

export const imageApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getImages: builder.query({
  query: ({ page = 1, limit = 10, sort = "newest" }) =>
    `/images?page=${page}&limit=${limit}&sort=${sort}`,
}),


    // 🔥 FIXED UPLOAD
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/images",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["Image"]
    }),
    uploadBulkImages: builder.mutation({
      query: (formData) => ({
        url: "/images/upload-multiple",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["Image"]
    }),

    updateImage: builder.mutation({
      query: ({ id, title }) => ({
        url: `/images/${id}`,
        method: "PUT",
        body: { title }
      }),
      invalidatesTags: ["Image"]
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/images/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Image"]
    })

  })
});

export const {
  useGetImagesQuery,
  useUploadImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
  useUploadBulkImagesMutation
} = imageApi;
