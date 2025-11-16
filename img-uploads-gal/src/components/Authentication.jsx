import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../SupabaseClient"; 
import "./Authentication.css";

export default function Authentication({ onClose, onSuccess }) {
  // ----------------------------
  // Local component state
  // ----------------------------
  const [email, setEmail] = useState("");            // User email input
  const [password, setPassword] = useState("");      // User password input

  const [visible, setVisible] = useState(false);     // Controls fade-in animation
  const [mode, setMode] = useState("login");         // Either "login" or "signup"

  const [isAuthenticating, setIsAuthenticating] = useState(false); // Loading state
  const [error, setError] = useState(null);          // Error messages

  const modalRef = useRef(null);                     // Used to detect outside clicks

  // Get Firebase auth helpers from context
  const { signup, login } = useAuth();

  // -------------------------------------------
  // Fade-in animation when modal mounts
  // -------------------------------------------
  useEffect(() => {
    setVisible(true); // triggers CSS transition
  }, []);

  // -------------------------------------------
  // Close modal when clicking outside of it
  // -------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If modal exists AND click is outside the modal container, close it
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------
  // Animate closing, then call parent onClose
  // -------------------------------------------
  const handleClose = () => {
    setVisible(false);     // triggers fade-out CSS animation
    setTimeout(() => {
      if (onClose) onClose(); // notify parent after animation completes
    }, 300); // matches CSS transition duration
  };

  // -------------------------------------------
  // Main authentication handler
  // Runs for BOTH login and signup
  // -------------------------------------------
  async function handleAuthenticate(e) {
    e.preventDefault();

    // Basic client-side validation for usability
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      let firebaseUser;

      // --------------------------
      // Firebase authentication
      // --------------------------
      if (mode === "signup") {
        firebaseUser = await signup(email, password); // Firebase new user creation
        if (onSuccess) onSuccess("signup");
      } else {
        firebaseUser = await login(email, password); // Firebase login
        if (onSuccess) onSuccess("login");
      }

      // ---------------------------------------------
      // Sync user with Supabase "profiles" table
      // Ensures each Firebase user has a corresponding
      // profile row in Supabase for additional metadata
      // ---------------------------------------------
      if (firebaseUser) {
        const userId = firebaseUser.uid;             // Firebase UID used as primary key
        const displayName = email.split("@")[0];     // Simple default username

        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            display_name: displayName,
          });

        if (upsertError) {
          console.error("Error upserting user profile:", upsertError);
        }
      }

      // Close modal after successful authentication
      handleClose();

    } catch (err) {
      console.log("AUTH ERROR:", err.message);
      setError(err.message); // Display error to user
    } finally {
      setIsAuthenticating(false); // Re-enable form button
    }
  }

  // -------------------------------------------
  // Component UI
  // -------------------------------------------
  return (
    <div className={`auth-container ${visible ? "show" : "hide"}`}>
      <form
        ref={modalRef}
        className={`auth-form ${visible ? "show" : "hide"}`}
        onSubmit={handleAuthenticate}
      >
        {/* Close button */}
        <button type="button" className="close-btn" onClick={handleClose}>
          ×
        </button>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to your account!"
            : "Create a new account."}
        </p>

        {/* Error message */}
        {error && <p className="auth-error">❌ {error}</p>}

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Main submit button */}
        <button type="submit" disabled={isAuthenticating}>
          {isAuthenticating
            ? "Authenticating..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <hr />

        {/* Toggle between login/sign-up modes */}
        <div className="register-content">
          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up!" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
