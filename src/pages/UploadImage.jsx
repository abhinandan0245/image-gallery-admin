import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useUploadImageMutation, useUploadBulkImagesMutation } from "../features/images/imageApi";
import toast from "react-hot-toast";

const UploadImage = () => {
  const [uploadImage] = useUploadImageMutation();
  const [uploadBulkImages] = useUploadBulkImagesMutation();

  const [singlePreview, setSinglePreview] = useState(null);
  const [bulkPreviews, setBulkPreviews] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle single file selection
  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSinglePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple files selection
  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Previews
    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve({ file, preview: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setBulkPreviews);
  };

  // Submit single image
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return toast.error("Select image & add title");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title);

      const response = await uploadImage(formData).unwrap();
      toast.success(response.message || "Image uploaded!");
      // Reset
      setSinglePreview(null);
      setSelectedFile(null);
      setTitle("");
    } catch (err) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  // Submit multiple images
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return toast.error("Select images");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const response = await uploadBulkImages(formData).unwrap();
      toast.success(response.message || "Images uploaded!");
      // Reset
      setSelectedFiles([]);
      setBulkPreviews([]);
    } catch (err) {
      toast.error(err.data?.message || "Bulk upload failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Images</h1>

      {/* Single Image Upload */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Single Image Upload</h2>
        <form onSubmit={handleSingleSubmit} className="grid lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              {singlePreview ? (
                <div className="relative">
                  <img src={singlePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSinglePreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-block text-blue-600 hover:text-blue-800">
                  <Upload className="mx-auto mb-2" size={36} />
                  Browse Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleSingleFileChange} />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Image Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Image
            </button>
          </div>
        </form>
      </div>

      {/* Multiple Images Upload */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Multiple Images Upload</h2>
        <form onSubmit={handleBulkSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            {bulkPreviews.length ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {bulkPreviews.map((p, idx) => (
                  <div key={idx} className="relative">
                    <img src={p.preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = bulkPreviews.filter((_, i) => i !== idx);
                        setBulkPreviews(updated);
                        setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <label className="cursor-pointer inline-block text-blue-600 hover:text-blue-800">
                <Upload className="mx-auto mb-2" size={36} />
                Select Images
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFilesChange} />
              </label>
            )}
          </div>
          {bulkPreviews.length > 0 && (
            <button
              type="submit"
              className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Upload {bulkPreviews.length} Images
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadImage;
