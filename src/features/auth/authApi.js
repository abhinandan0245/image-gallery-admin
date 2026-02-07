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
    })
  })
});

export const {
  useAdminLoginMutation,
  useAdminRegisterMutation
} = authApi;
