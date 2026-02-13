import { api } from "../../app/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Admin Login
    adminLogin: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data
      })
    }),

    // ✅ Admin Register (optional – tumne backend me banaya hai)
    adminRegister: builder.mutation({
      query: (data) => ({
        url: "/admin/register",
        method: "POST",
        body: data
      })
    }),
    getAdminProfile: builder.query({
  query: () => ({
    url: "/admin/profile",
    method: "GET",
  }),
  providesTags: ["AdminProfile"],
}),

updateProfile: builder.mutation({
  query: (data) => ({
    url: "/admin/profile",
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["AdminProfile"],
}),

  })
});   

export const {
  useAdminLoginMutation,
  useAdminRegisterMutation,
  useGetAdminProfileQuery,
  useUpdateProfileMutation
} = authApi;
