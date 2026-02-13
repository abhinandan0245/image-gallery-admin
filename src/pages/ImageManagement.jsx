import { useState, useMemo } from "react";
import { DataTable } from "mantine-datatable";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
  useUpdateImageMutation
} from "../features/images/imageApi";
import Swal from "sweetalert2";

const PAGE_SIZE = 10;

const ImageManagement = () => {
   /* ---------------- State ---------------- */
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "title",
    direction: "asc"
  });

  /* ---------------- API ---------------- */
  const { data, isLoading } = useGetImagesQuery({
    page,
    limit: PAGE_SIZE,
  });

  const [deleteImage] = useDeleteImageMutation();
  const [updateImage] = useUpdateImageMutation();

  /* ---------------- Derived Data ---------------- */
  const images = data?.images ?? [];
  const total = data?.total ?? 0;

  /* ---------------- Sorted Records ---------------- */
  const records = useMemo(() => {
  if (!sortStatus.columnAccessor) return images;

  const sorted = [...images].sort((a, b) => {
    const aValue = a[sortStatus.columnAccessor];
    const bValue = b[sortStatus.columnAccessor];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    return String(aValue).localeCompare(String(bValue), undefined, {
      numeric: true,
      sensitivity: "base"
    });
  });

  return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
}, [images, sortStatus]);


  /* ---------------- Delete ---------------- */
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

    if (!result.isConfirmed) return;

    try {
      await deleteImage(id).unwrap();
      Swal.fire({
        title: "Deleted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete image.",
        icon: "error"
      });
    }
  };

  /* ---------------- Edit / Update ---------------- */
  const handleEdit = (image) => {
    setEditingId(image._id);
    setEditTitle(image.title);
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) return;

    try {
      await updateImage({ id, title: editTitle }).unwrap();
      setEditingId(null);
      setEditTitle("");
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to update image title.",
        icon: "error"
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Image Management</h1>

      <DataTable
        idAccessor="_id"
        records={records}
        fetching={isLoading}

        withTableBorder
        withColumnBorders
        striped
        highlightOnHover

        page={page}
        onPageChange={setPage}
        recordsPerPage={PAGE_SIZE}
        totalRecords={total}

        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}

        noRecordsText="No images found"

        columns={[
          {
            accessor: "imageUrl",
            title: "Image",
            sortable: false,
            render: (image) => (
              <img
                src={image.imageUrl}
                alt={image.title}
                className="h-16 w-24 object-cover rounded"
              />
            )
          },
          {
            accessor: "title",
            title: "Title",
            sortable: true,
            render: (image) =>
              editingId === image._id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
              ) : (
                image.title
              )
          },
          {
            accessor: "uploadedBy",
            title: "Uploaded By",
            sortable: true
          },
          {
            accessor: "actions",
            title: "Actions",
            sortable: false,
            textAlign: "center",
            render: (image) =>
              editingId === image._id ? (
                <div className="flex justify-center gap-2">
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
                </div>
              ) : (
                <div className="flex justify-center gap-2">
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
                </div>
              )
          }
        ]}
      />
    </>
  );
};

export default ImageManagement;
