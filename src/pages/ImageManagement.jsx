import { useState } from "react";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
  useUpdateImageMutation
} from "../features/images/imageApi";
import Swal from "sweetalert2";

const ImageManagement = () => {
  const { data: images = [], isLoading } = useGetImagesQuery();
  const [deleteImage] = useDeleteImageMutation();
  const [updateImage] = useUpdateImageMutation();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This image will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel"
  });

  if (result.isConfirmed) {
    try {
      await deleteImage(id).unwrap();

      Swal.fire({
        title: "Deleted!",
        text: "Image has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete image.",
        icon: "error"
      });
    }
  }
};


  const handleEdit = (image) => {
    setEditingId(image._id);
    setEditTitle(image.title);
  };

  const handleUpdate = async (id) => {
    await updateImage({ id, title: editTitle });
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Image Management</h1>

      {isLoading ? (
        <p>Loading images...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Uploaded By
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {images.map((image) => (
                <tr key={image._id} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>

                  <td className="px-4 py-3">
                    {editingId === image._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span>{image.title}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {image.uploadedBy}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    {editingId === image._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(image._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(image)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {images.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No images found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ImageManagement;
