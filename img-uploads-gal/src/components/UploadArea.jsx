import { useEffect, useState } from "react";
import UploadBox from "./UploadBox";
import ImageModal from "./ImageModal";
import "./UploadArea.css";

export default function UploadArea({ globalUser }) {
  // --------------------------------------------------------------
  // Component State
  // --------------------------------------------------------------
  const [images, setImages] = useState([]);             // Displayed gallery images
  const [loading, setLoading] = useState(false);         // Loading state for fetch/upload
  const [selectedImage, setSelectedImage] = useState(null); // Currently opened modal image

  // ======================================================================
  // FETCH IMAGES FROM BACKEND WHEN USER LOGS IN
  // ======================================================================
  useEffect(() => {
    // If no authenticated user, clear the gallery
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);

      // Firebase ID token used for backend authentication
      const token = await globalUser.getIdToken();

      // Request user's uploaded image URLs from backend
      const res = await fetch("http://localhost:4000/user/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token, uid: globalUser.uid }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error("Error fetching images:", data.error);
        return;
      }

      // Add a frontend timestamp so newest appear first
      const imagesWithDate = data.images.map((url) => ({
        url,
        uploadedAt: new Date(), // Local date; backend does not yet store timestamps
        id: url,                // Use URL as unique identifier
      }));

      // Sort newest first
      imagesWithDate.sort((a, b) => b.uploadedAt - a.uploadedAt);

      setImages(imagesWithDate);
    };

    fetchImages();
  }, [globalUser]);

  // ======================================================================
  // HANDLE IMAGE UPLOAD THROUGH BACKEND
  // ======================================================================
  const handleUpload = async (e) => {
    if (!globalUser) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    // Token is needed for the upload endpoint
    const token = await globalUser.getIdToken();

    // Upload each file one by one
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("idToken", token);
      formData.append("uid", globalUser.uid);

      const res = await fetch("http://localhost:4000/user/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload failed:", data.error);
      }
    }

    // --------------------------------------------------------------
    // After uploading, fetch the updated image list
    // --------------------------------------------------------------
    const refreshToken = await globalUser.getIdToken();

    const res = await fetch("http://localhost:4000/user/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: refreshToken, uid: globalUser.uid }),
    });

    const data = await res.json();

    // Rebuild and sort updated gallery list
    const imagesWithDate = data.images.map((url) => ({
      url,
      uploadedAt: new Date(),
      id: url,
    }));

    imagesWithDate.sort((a, b) => b.uploadedAt - a.uploadedAt);

    setImages(imagesWithDate);
    setLoading(false);
  };

  // ======================================================================
  // DELETE IMAGE LOCALLY (BACKEND DELETE TODO)
  // ======================================================================
  const handleDelete = (urlToDelete) => {
    // Immediately remove from frontend gallery
    setImages((prev) => prev.filter((img) => img.url !== urlToDelete));

    // TODO: implement image deletion on backend
  };

  // ======================================================================
  // NAVIGATE BETWEEN IMAGES INSIDE MODAL
  // ======================================================================
  const handleNavigate = (direction) => {
    if (!selectedImage) return;

    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    let newIndex = currentIndex;

    if (direction === "prev") {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    if (direction === "next") {
      newIndex = (currentIndex + 1) % images.length;
    }

    setSelectedImage(images[newIndex]);
  };

  // ======================================================================
  // RENDER
  // ======================================================================
  return (
    <div className="upload-area">
      {/* Upload input box (drag & drop or click) */}
      <UploadBox onUpload={handleUpload} />

      {/* Display loading indicator while fetching or uploading */}
      {loading && <p>Loading images...</p>}

      {/* ----------------------------------------------------------------- */}
      {/* Image Gallery Grid */}
      {/* ----------------------------------------------------------------- */}
      <div className="image-grid">
        {/* Empty state when user has no images */}
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}

        {/* Render each image tile */}
        {images.map((img) => (
          <div
            key={img.id}
            className="image-item"
            onClick={() => setSelectedImage(img)} // Open in modal
          >
            <img src={img.url} alt="Uploaded" className="gallery-image" />

            {/* Overlay with timestamp + delete button */}
            <div className="image-info">
              <span>{img.uploadedAt.toLocaleDateString()}</span>

              {/* Trash icon (stop click from opening modal) */}
              <span
                className="trash-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent tile click event
                  handleDelete(img.url);
                }}
              >
                🗑️
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Image Modal (if a gallery image is selected) */}
      {/* ----------------------------------------------------------------- */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNavigate={handleNavigate}
          hasMultiple={images.length > 1} // Show arrows only if >1 image
        />
      )}
    </div>
  );
}
