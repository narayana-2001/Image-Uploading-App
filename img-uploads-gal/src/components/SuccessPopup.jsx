import "./SuccessPopup.css";

export default function SuccessPopup({ message, onClose }) {
  return (
    /* ------------------------------------------------------------
       Fullscreen overlay that darkens the background.
       Clicking *does not* close the popup—only the OK button does.
       This ensures the user acknowledges the message.
    ------------------------------------------------------------ */
    <div className="success-popup">
      
      {/* ------------------------------------------------------------
          Centered popup box containing:
          - The success message passed from the parent component
          - A confirmation button to close the popup
        ------------------------------------------------------------ */}
      <div className="success-box">
        
        {/* Display success text (e.g., "Upload complete!") */}
        <p>{message}</p>

        {/* 
          OK button:
          - Explicit close action
          - Calls parent-provided onClose handler
        */}
        <button onClick={onClose}>OK</button>
      </div>

    </div>
  );
}
