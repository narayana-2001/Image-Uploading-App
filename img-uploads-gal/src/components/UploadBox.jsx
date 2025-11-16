import "./UploadBox.css";

export default function UploadBox({ onUpload, small }) {
  return (
    <>
      {/* --------------------------------------------------------------------
          Upload Trigger (Styled Label)
          --------------------------------------------------------------------
          - Acts as the visible "upload button"
          - Clicking this label triggers the hidden <input type="file">
          - If `small` is true, uses compact styling for navbar use
        -------------------------------------------------------------------- */}
      <label
        htmlFor={small ? "navbar-file-upload" : "file-upload"}
        className={`upload-box ${small ? "small" : ""}`}
      >
        {small ? "Upload" : "Click to upload images"}
      </label>

      {/* --------------------------------------------------------------------
          Hidden File Input
          --------------------------------------------------------------------
          - Accepts image files only (image/*)
          - Allows multiple file selection
          - Calls parent-provided `onUpload` handler on file selection
          - Remains hidden because styling native file inputs is limited
        -------------------------------------------------------------------- */}
      <input
        id={small ? "navbar-file-upload" : "file-upload"}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        hidden
      />
    </>
  );
}
