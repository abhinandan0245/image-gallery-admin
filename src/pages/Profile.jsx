import React, { useEffect, useState } from "react";
import {
  useGetAdminProfileQuery,
  useUpdateProfileMutation,
} from "../features/auth/authApi";


const Profile = () => {
  const { data, isLoading, isError } = useGetAdminProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Populate form when data loads
  useEffect(() => {
    if (data) {
      setFormData({
        email: data.email || "",
        password: "",
      });
      setPreview(data.profileImage || null);
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("email", formData.email);

      if (formData.password) {
        form.append("password", formData.password);
      }

      if (selectedImage) {
        form.append("profileImage", selectedImage);
      }

      await updateProfile(form).unwrap();

      setIsEditing(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition-colors">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Profile
          </h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 text-sm"
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Password */}
          {isEditing && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
