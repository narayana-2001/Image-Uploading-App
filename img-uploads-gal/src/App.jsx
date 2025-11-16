// =============================================================================
// App.jsx
// =============================================================================
// Root component of the application. Manages global UI state such as
// authentication modal visibility, success popups, and integrates
// the main components: Navbar, Sidebar, UploadArea, and SuccessPopup.
// =============================================================================

import { useState } from "react";
import Authentication from "./components/Authentication.jsx";
import SuccessPopup from "./components/SuccessPopup.jsx";
import Sidebar from "./components/Sidebar.jsx";
import UploadArea from "./components/UploadArea.jsx";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function App() {
  // ---------------------------
  // Local UI state
  // ---------------------------
  const [showAuth, setShowAuth] = useState(false); // Controls authentication modal
  const [successMessage, setSuccessMessage] = useState(""); // Shows success popup messages

  // ---------------------------
  // Global auth state from context
  // ---------------------------
  const { globalUser, logout } = useAuth();

  // ---------------------------
  // Callback invoked by Authentication.jsx after successful login/signup
  // ---------------------------
  function handleLoginSuccess(mode) {
    // Close the authentication modal
    setShowAuth(false);

    // Show appropriate success message based on action
    if (mode === "login") {
      setSuccessMessage("Successfully logged in!");
    } else if (mode === "signup") {
      setSuccessMessage("Account created successfully!");
    }
  }

  return (
    <div className="app-container">
      {/* =========================
          Navbar
          ========================= */}
      <nav className="navbar">
        {/* Left side of navbar */}
        <div className="navbar-left">Image-Uploader</div>

        {/* Center title with aurora animation */}
        <div className="navbar-center">
          <h1 className="aurora-title">
            Welcome!
            <div className="aurora">
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
              <div className="aurora__item"></div>
            </div>
          </h1>
        </div>

        {/* Right side of navbar: authentication buttons */}
        <div className="navbar-right">
          {/* If NOT logged in → show "Sign up / Login" button */}
          {!globalUser && (
            <button
              className="button-64"
              role="button"
              onClick={() => setShowAuth(true)}
            >
              <span className="text">Sign up / Login</span>
            </button>
          )}

          {/* If LOGGED IN → show Logout button */}
          {globalUser && (
            <button
              className="button-64 red-button"
              role="button"
              onClick={logout}
            >
              <span className="text">Logout</span>
            </button>
          )}

          {/* Authentication modal */}
          {showAuth && (
            <Authentication
              onClose={() => setShowAuth(false)}
              onSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </nav>

      {/* =========================
          Main Layout
          ========================= */}
      <div className="app-layout">
        {/* Sidebar with profile info */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="main-content">
          <UploadArea
            globalUser={globalUser}     // Pass current logged-in user
            openAuth={() => setShowAuth(true)} // Allow UploadArea to open login modal if needed
          />
        </main>
      </div>

      {/* =========================
          Success popup (shown after login/signup)
          ========================= */}
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")} // Clear message to hide popup
        />
      )}
    </div>
  );
}

export default App;
