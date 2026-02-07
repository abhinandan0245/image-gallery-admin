import { useState } from "react";
import { Upload, X, Tag } from "lucide-react";
import { useUploadImageMutation } from "../features/images/imageApi";

const UploadImage = () => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!selectedFile) {
    alert("Please select an image");
    return;
  }

  if (!formData.title.trim()) {
    alert("Please enter image title");
    return;
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append("image", selectedFile);
    uploadFormData.append("title", formData.title);
    
    if (formData.description) {
      uploadFormData.append("description", formData.description);
    }
    
    if (formData.tags) {
      uploadFormData.append("tags", formData.tags);
    }

    // Debug: Check FormData content
    console.log("FormData entries:");
    for (let [key, value] of uploadFormData.entries()) {
      console.log(key, value);
    }

    const response = await uploadImage(uploadFormData).unwrap();
    console.log("Upload response:", response);
    
    alert("Image uploaded successfully!");
    
    // Reset form
    setPreview(null);
    setSelectedFile(null);
    setFormData({ title: "", description: "", tags: "" });
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
    
  } catch (error) {
    console.error("Upload error details:", error);
    alert("Upload failed: " + (error.data?.message || error.error || "Something went wrong"));
  }
};
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Upload Image</h1>
        <p className="text-gray-600">Upload new images to Cloudinary</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-600 mb-2">
                        Drag & drop your image here
                      </p>
                      <p className="text-sm text-gray-500 mb-4">OR</p>
                      <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WebP, GIF up to 5MB
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image description (optional)"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Tags
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="nature, landscape, portrait (comma separated)"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !selectedFile}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading to Cloudinary...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Upload Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
            <Upload size={18} />
            Upload Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <span>Use descriptive titles for better searchability</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <span>Optimal image size: 1200x800 pixels (auto-resized)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <span>Maximum file size: 5MB per image</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <span>Allowed formats: JPG, PNG, WebP, GIF</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <span>Images are automatically optimized and stored on Cloudinary</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;