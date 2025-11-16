import { useState, useEffect, useRef } from "react";
import "./ImageModal.css";

export default function ImageModal({ image, onClose, onNavigate, hasMultiple }) {
  // ---------------------------------------------
  // Local state
  // ---------------------------------------------
  const [transition, setTransition] = useState(false); // Enables image slide animation
  const [prevImage, setPrevImage] = useState(null);    // Used to detect image changes
  const modalRef = useRef(null);                       // Detect clicks outside the modal

  // ------------------------------------------------------
  // Detect when a NEW image is shown inside the modal.
  // If the image URL changes, trigger a short CSS animation.
  // ------------------------------------------------------
  useEffect(() => {
    // If we already had an image AND the new one is different
    if (prevImage && prevImage.url !== image.url) {
      setTransition(true); // Activate slide animation

      // Disable animation after CSS transition ends
      const timer = setTimeout(() => setTransition(false), 300);
      return () => clearTimeout(timer);
    }

    // Track the current image for comparison next render
    setPrevImage(image);
  }, [image]);

  // ------------------------------------------------------
  // Close the modal when clicking the dark overlay.
  // BUT: Only close if the click is NOT inside the modal box.
  // ------------------------------------------------------
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleOverlayClick}>
      <div className="image-modal" ref={modalRef}>
        
        {/* ------------------------- */}
        {/* Modal Header (Close btn) */}
        {/* ------------------------- */}
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* ------------------------- */}
        {/* Main Image Display Area  */}
        {/* ------------------------- */}
        <div className="modal-content">

          {/* 
            Image wrapper includes the slide animation.
            The `key` on the <img> forces React to treat each image
            as a new element, ensuring the transition triggers properly.
          */}
          <div className={`image-wrapper ${transition ? "slide" : ""}`}>
            <img
              src={image.url}
              alt={image.name}
              className="modal-image"
              key={image.url}
            />
          </div>

          {/* 
            Navigation arrows appear ONLY if there are
            multiple images in the gallery.
            They stay positioned on left/right screen edges.
          */}
          {hasMultiple && (
            <>
              <button className="nav-btn left" onClick={() => onNavigate("prev")}>
                ◀
              </button>
              <button className="nav-btn right" onClick={() => onNavigate("next")}>
                ▶
              </button>
            </>
          )}
        </div>

        {/* ------------------------- */}
        {/* Footer Action Buttons     */}
        {/* ------------------------- */}
        <div className="modal-footer">
          <button>❤️ Like</button>
          <button>🔗 Share</button>
          <button>💬 Comment</button>
        </div>

      </div>
    </div>
  );
}
