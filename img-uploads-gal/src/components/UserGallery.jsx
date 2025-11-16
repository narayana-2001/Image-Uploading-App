import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "../context/AuthContext";

export default function GallerySidebar() {
  const { user } = useAuth();        // Currently authenticated Firebase user
  const [images, setImages] = useState([]); // Images pulled from Supabase

  // =============================================================================
  // LOAD ALL IMAGES FROM SUPABASE (global gallery view)
  // =============================================================================
  useEffect(() => {
    async function loadImages() {
      // Fetches rows from "images" table:
      // - id: image record id
      // - user_id: uploader's Firebase UID
      // - url: public URL of uploaded image
      // - email: uploader’s email (stored when uploading)
      const { data, error } = await supabase
        .from("images")
        .select("id, user_id, url, email")
        .order("created_at", { ascending: false }); // newest first

      // If fetch succeeds, place data in state
      if (!error) setImages(data);
    }

    loadImages();
  }, []);

  // =============================================================================
  // CLICK HANDLER FOR SIDEBAR IMAGES
  // =============================================================================
  function handleClick(img) {
    if (!user) {
      // Backend data is visible but viewing full user galleries requires login
      alert("Please log in to view images!");
      return;
    }

    console.log("Viewing images for user:", img.email);

    // TODO:
    // Open a modal showing *all images uploaded by this user*
    // This component currently only displays previews.
  }

  // =============================================================================
  // RENDER SIDEBAR UI
  // =============================================================================
  return (
    <div className="gallery-sidebar" style={{ padding: "12px" }}>
      <h3>Uploaded Images</h3>

      {/* 
        Display one small avatar-style preview per image.
        Each block shows:
          - A tiny thumbnail
          - The uploader’s username (email prefix)
        Clicking invokes handleClick().
      */}
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            display: "inline-block",
            margin: "4px",
            cursor: "pointer",
          }}
          onClick={() => handleClick(img)}
        >
          {/* Thumbnail preview */}
          <img
            src={img.url}
            alt={`Uploaded by ${img.email}`}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />

          {/* Uploader label (email prefix) */}
          <div
            style={{
              fontSize: "10px",
              textAlign: "center",
              color: "#333",
            }}
          >
            {img.email.split("@")[0]}
          </div>
        </div>
      ))}
    </div>
  );
}
