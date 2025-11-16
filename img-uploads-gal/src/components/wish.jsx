/*



<img
        src={user.profilePic}
        alt="Profile"
        className="profile-pic"
        width={100}
        height={100}
        style={{ borderRadius: "50%", marginBottom: "10px" }}
      />
      <h3>{user.name}</h3>
      <a href="#" className="gallery-link">Gallery</a>




      import { useState } from "react";
import ImageModal from "./ImageModal";
import "./UploadArea.css";

export default function UploadArea() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      date: new Date().toLocaleDateString(),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => setSelectedImage(null);

  const handleNavigate = (direction) => {
    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % images.length);
    } else if (direction === "prev") {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="upload-area-wrapper">
    <div className="upload-area">
      <label htmlFor="file-upload" className="upload-box">
        Click to upload images
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>

      <div className="image-grid">
        {images.map((img, index) => (
          <div
            key={index}
            className="image-item"
            onClick={() => handleImageClick(index)}
          >
            <img src={img.url} alt={img.name} />
            <p>{img.date}</p>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <ImageModal
          image={images[selectedImage]}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
        />
      )}
    </div>
    </div>
  );
}


There's a sidebar with a 300px; width on the right, I just want is for the upload image button to disappear after the first image has been uploaded (so it can be placed in a different location).

In the contents of the page, its divided into the sidebar on the left and all the remaining space on the right, in the main space,  you can click upload and upload either 1 or multiple images from your computer,  the main space can only show 6 pictures in a single row, if a 7th is uploaded, it should go into the next row, if many pictures are uploaded, it should allow scroll, each image needs to have  an upload date right under them with a little trash bin icon right next to them, when an image is clicked, the main space should show only one row of images at the top and replace the remaining space with a new box taking up the rest of that grid, the image clicked shows up in full, there should be arrows on the right and left of the box and if the right arrow is clicked, the next image in the row should appear, same with the left, the top row should now be scrollable left and right so you can still view them.


below the new box should be options to like, share and comment. 

This is all in react so if smth is to be done in react for components, it needs another file




















import { useState, useEffect, useRef } from "react";
import "./Authentication.css";

export default function Authentication({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false); // controls fade animation
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const modalRef = useRef(null);

  // Trigger fade-in animation after mount
  useEffect(() => {
    setVisible(true);
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      console.log("Logging in:", email);
    } else {
      console.log("Signing up:", email);
    }
    console.log("Password:", password);
  };

  const handleClose = () => {
    // Start fade-out
    setVisible(false);
    // Wait for animation to finish before actually removing
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div className={`auth-container ${visible ? "show" : "hide"}`}>
      <form
        ref={modalRef}
        className={`auth-form ${visible ? "show" : "hide"}`}
        onSubmit={handleSubmit}
      >
        <button type="button" className="close-btn" onClick={handleClose}>
          ×
        </button>

        {/* Title switches based on mode }
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to your account!"
            : "Create a new account."}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>

        <hr />

        <div className="register-content">
          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          >
            {mode === "login" ? "Sign Up!" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}


Log in, log out
upload image

profile layout
user sidebar
keeping track of WHO uploaded th eimages and keeping it on their specific profile

firebase users 












I have an image uploading site I'm trying to make in react, I am using firebase auth, and supabase storage, both on free tier (cuz firebase does not give me storage) but because supabase is free,  I couldn't fix some JWT key issue so now I'm trying to use a bit of backend to change the token for supabase which doesnt accept firebase tokens.

My site is supposed to have an upload button, people can click it but then a sign up form pops forms to ask them to login/signup which they do, after authorizing, they should be able to upload images and they should stay stored, and i made a bucket for it which worked. but right now the console has an error and images are not loading onto the site:


lhhcklzckpatdknhikgx.supabase.co/storage/v1/object/user-images/TzYOLhNYJceqy6Oc4EPK26WeQ293/gallery/Digital%20Art%20Inspiration.gif:1  Failed to load resource: the server responded with a status of 400 ()
UploadArea.jsx:73 Upload error: "alg" (Algorithm) Header Parameter value not allowed


My file UploadArea.jsx:


import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "../context/AuthContext";
import UploadBox from "./UploadBox";

export default function UploadArea() {
  const { globalUser, setShowAuth } = useAuth(); // assume you have a way to open Auth modal
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user images on login
  useEffect(() => {
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("user-images")
        .list(`${globalUser.uid}/gallery`);

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      // Generate signed URLs for private access
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: signedData, error: signedError } =
            await supabase.storage
              .from("user-images")
              .createSignedUrl(`${globalUser.uid}/gallery/${file.name}`, 3600); // 1 hour expiry
          if (signedError) {
            console.error("Signed URL error:", signedError.message);
            return null;
          }
          return signedData.signedUrl;
        })
      );

      setImages(urls.filter(Boolean)); // remove nulls if any
      setLoading(false);
    };

    fetchImages();
  }, [globalUser]);

  const handleUpload = async (e) => {
    if (!globalUser) {
      setShowAuth(true); // open login/signup modal
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${globalUser.uid}/gallery/${file.name}`;

      const { error } = await supabase.storage
        .from("user-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data: signedData, error: signedError } =
        await supabase.storage
          .from("user-images")
          .createSignedUrl(filePath, 3600);

      if (signedError) {
        console.error("Signed URL error:", signedError.message);
        continue;
      }

      uploadedUrls.push(signedData.signedUrl);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setLoading(false);
  };

  return (
    <div className="upload-area">
      <UploadBox onUpload={handleUpload} />

      {loading && <p>Loading images...</p>}

      <div className="gallery">
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}

        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Uploaded ${idx}`}
            className="gallery-image"
          />
        ))}
      </div>
    </div>
  );
}

      
*/

/*


I have an image uploading site I'm trying to make in react, I am using firebase auth, and supabase storage, both on free tier (cuz firebase does not give me storage) but because supabase is free,  I couldn't fix some JWT key issue so now I'm trying to use a bit of backend to change the token for supabase which doesnt accept firebase tokens.



My site is supposed to have an upload button, people can click it but then a sign up form pops forms to ask them to login/signup which they do, after authorizing, they should be able to upload images and they should stay stored, and i made a bucket for it which worked. but right now the console has an error and images are not loading onto the site despite trying a lot to fix the backend and firebase/supabase:




Failed to load resource: the server responded with a status of 404 (Not Found)
AuthContext.jsx:106 AuthContext error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
(anonymous) @ AuthContext.jsx:106
lhhcklzckpatdknhikgx.supabase.co/storage/v1/object/list/user-images:1  Failed to load resource: the server responded with a status of 400 ()
UploadArea.jsx:25 Error fetching images: Invalid Compact JWS
fetchImages @ UploadArea.jsx:25
:4000/auth/firebase-to-supabase:1  Failed to load resource: the server responded with a status of 404 (Not Found)
AuthContext.jsx:106 AuthContext error: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
(anonymous) @ AuthContext.jsx:106
lhhcklzckpatdknhikgx.supabase.co/storage/v1/object/list/user-images:1  Failed to load resource: the server responded with a status of 400 ()
UploadArea.jsx:25 Error fetching images: Invalid Compact JWS
fetchImages @ UploadArea.jsx:25
lhhcklzckpatdknhikgx.supabase.co/storage/v1/object/user-images/TzYOLhNYJceqy6Oc4EPK26WeQ293/gallery/IMG_20250908_140029.jpg:1  Failed to load resource: the server responded with a status of 400 ()
UploadArea.jsx:67 Upload error: Invalid Compact JWS


My files:

Backend server.js:


import 'dotenv/config';
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// --- Load Firebase service account JSON safely ---
const serviceAccountPath = path.resolve("./firebase-service-account.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

const app = express();
app.use(cors());
app.use(express.json());

// --- Firebase Admin ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// --- Supabase Admin Client (service role key) ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// --- Endpoint: Verify Firebase token and list signed URLs for user images ---
app.post("/user/images", async (req, res) => {
  const { idToken, uid } = req.body;

  if (!idToken || !uid) {
    return res.status(400).json({ error: "Missing idToken or uid" });
  }

  try {
    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid) {
      return res.status(403).json({ error: "UID mismatch" });
    }

    // List files
    const { data: files, error } = await supabase.storage
      .from("user-images")
      .list(`${uid}/gallery`);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Generate signed URLs (1 hour)
    const urls = await Promise.all(
      files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("user-images")
          .createSignedUrl(`${uid}/gallery/${file.name}`, 3600);
        if (error) {
          console.error("Signed URL error:", error.message);
          return null;
        }
        return data.signedUrl;
      })
    );

    res.json({ images: urls.filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🔥 Backend running on http://localhost:${PORT}`);
});

Authentication.jsx:


import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./Authentication.css";

export default function Authentication({ onClose, onSuccess }) {  // <-- CHANGE #1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("login");

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);

  const { signup, login } = useAuth();

  // Fade in on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  async function handleAuthenticate(e) {
    e.preventDefault();

    // basic checks
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

      // LOGIN OR SIGNUP
      if (mode === "signup") {
        await signup(email, password);

        // <-- CHANGE #2: trigger success callback
        if (onSuccess) onSuccess("signup");

      } else {
        await login(email, password);

        // <-- CHANGE #2: trigger success callback
        if (onSuccess) onSuccess("login");
      }

      handleClose();  // close modal after success

    } catch (err) {
      console.log("AUTH ERROR:", err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className={`auth-container ${visible ? "show" : "hide"}`}>
      <form
        ref={modalRef}
        className={`auth-form ${visible ? "show" : "hide"}`}
        onSubmit={handleAuthenticate}
      >
        <button type="button" className="close-btn" onClick={handleClose}>
          ×
        </button>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to your account!"
            : "Create a new account."}
        </p>

        {error && <p className="auth-error">❌ {error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isAuthenticating}>
          {isAuthenticating
            ? "Authenticating..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <hr />

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


ImageModal.jsx:
import { useState, useEffect, useRef } from "react";
import "./ImageModal.css";



export default function ImageModal({ image, onClose, onNavigate, hasMultiple }) {
  const [transition, setTransition] = useState(false);
  const [prevImage, setPrevImage] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {      
    if (prevImage && prevImage.url !== image.url) {
      setTransition(true);
      const timer = setTimeout(() => setTransition(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevImage(image);
  }, [image]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleOverlayClick}>
      <div className="image-modal" ref={modalRef}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-content">
  {/* Image stays in its own wrapper }
  <div className={`image-wrapper ${transition ? "slide" : ""}`}>
    <img src={image.url} alt={image.name} className="modal-image" key={image.url} />
  </div>

  {/* Navigation buttons outside of sliding wrapper }
  {hasMultiple && (
    <>
      <button className="nav-btn left" onClick={() => onNavigate("prev")}>◀</button>
      <button className="nav-btn right" onClick={() => onNavigate("next")}>▶</button>
    </>
  )}
</div>

        <div className="modal-footer">
          <button>❤️ Like</button>
          <button>🔗 Share</button>
          <button>💬 Comment</button>
        </div>
      </div>
    </div>
  );
}

UploadArea.jsx:

import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "../context/AuthContext";
import UploadBox from "./UploadBox";

export default function UploadArea() {
  const { globalUser } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);

      const { data: files, error } = await supabase.storage
        .from("user-images")
        .list(`${globalUser.uid}/gallery`);

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      const urls = await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from("user-images")
            .createSignedUrl(`${globalUser.uid}/gallery/${file.name}`, 3600);

          if (error) {
            console.error("Signed URL error:", error.message);
            return null;
          }
          return data.signedUrl;
        })
      );

      setImages(urls.filter(Boolean));
      setLoading(false);
    };

    fetchImages();
  }, [globalUser]);

  const handleUpload = async (e) => {
    if (!globalUser) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    for (let file of files) {
      const filePath = `${globalUser.uid}/gallery/${file.name}`;

      const { error } = await supabase.storage
        .from("user-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data, error: signedError } = await supabase.storage
        .from("user-images")
        .createSignedUrl(filePath, 3600);

      if (signedError) console.error("Signed URL error:", signedError.message);
      else setImages((prev) => [...prev, data.signedUrl]);
    }

    setLoading(false);
  };

  return (
    <div className="upload-area">
      <UploadBox onUpload={handleUpload} />
      {loading && <p>Loading images...</p>}
      <div className="gallery">
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Uploaded ${idx}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
}


UploadBox.jsx (the button):

import "./UploadBox.css";

export default function UploadBox({ onUpload }) {
  return (
    <label htmlFor="file-upload" className="upload-box">
      Click to upload images
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
      />
    </label>
  );
}


AuthContext.jsx:
// AuthContext.jsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Auth functions ---
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData(null);

    // Remove both tokens
    localStorage.removeItem("sb_firebase_token");
    localStorage.removeItem("sb_supabase_token");

    // Clear Supabase headers
    supabase.headers = {
      ...supabase.headers,
      Authorization: "",
    };

    return signOut(auth);
  }

  // --- Track Firebase user + create Supabase session ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      if (!user) {
        setGlobalData(null);
        localStorage.removeItem("sb_firebase_token");
        localStorage.removeItem("sb_supabase_token");
        return;
      }

      try {
        setIsLoading(true);

        // 1️⃣ Get Firebase token
        const firebaseToken = await user.getIdToken();

        // Store Firebase token (optional)
        localStorage.setItem("sb_firebase_token", firebaseToken);

        // 2️⃣ Send firebaseToken to backend to get Supabase token
        const res = await fetch("http://localhost:4000/auth/firebase-to-supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: firebaseToken }),
        });

        const data = await res.json();

        if (data.access_token) {
          // 3️⃣ Save Supabase token
          localStorage.setItem("sb_supabase_token", data.access_token);

          // 4️⃣ Inject into Supabase client
          supabase.headers = {
            ...supabase.headers,
            Authorization: `Bearer ${data.access_token}`,
          };

          console.log("🔥 Supabase session installed.");
        } else {
          console.error("❌ Failed to obtain Supabase token:", data);
        }

        // 5️⃣ Load Firestore user data
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        setGlobalData(docSnap.exists() ? docSnap.data() : {});
      } catch (err) {
        console.error("AuthContext error:", err.message);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


App.jsx:

import { useState } from "react";
import Authentication from "./components/Authentication.jsx";
import SuccessPopup from "./components/SuccessPopup.jsx";
import Sidebar from "./components/Sidebar.jsx";
import UploadArea from "./components/UploadArea.jsx";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { globalUser, logout } = useAuth();

  // Called by Authentication.jsx after login/signup
  function handleLoginSuccess(mode) {
    setShowAuth(false);

    if (mode === "login") {
      setSuccessMessage("Successfully logged in!");
    } else if (mode === "signup") {
      setSuccessMessage("Account created successfully!");
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">Image-Uploader</div>
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

        <div className="navbar-right">

          {/* If NOT logged in → show "Sign up / Login" button }
          {!globalUser && (
            <button className="button-64" role="button" onClick={() => setShowAuth(true)}>
              <span className="text">Sign up / Login</span>
            </button>
          )}

          {/* If LOGGED IN → show Logout }
          {globalUser && (
            <button
              className="button-64 red-button"
              role="button"
              onClick={logout}
            >
              <span className="text">Logout</span>
            </button>
          )}

          {/* Authentication modal }
          {showAuth && (
            <Authentication
              onClose={() => setShowAuth(false)}
              onSuccess={handleLoginSuccess}
            />
          )}

        </div>
      </nav>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <UploadArea
  globalUser={globalUser}
  openAuth={() => setShowAuth(true)}
/>

        </main>
      </div>

      {/* Success popup }
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
}

export default App;



and Supabaseclient.js:

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sb_supabase_token") || ""}`,
      },
    },
  }
);


I have an image uploading site I'm trying to make in react, I am using firebase auth, and supabase storage, both on free tier (cuz firebase does not give me storage) but because supabase is free,  I couldn't fix some JWT key issue so now I'm trying to use a bit of backend to change the token for supabase which doesnt accept firebase tokens.



My site is supposed to have an upload button, people can click it but then a sign up form pops forms to ask them to login/signup which they do, after authorizing, they should be able to upload images and they should stay stored, there's also a modal to view the images bigger and i made a bucket for it which works. but right now the issue is, I have a sidebar.jsx and a user box, I need to make it such that a user makes account -> its added to the list in the sidebar, the gallery link allows us to view their pics (if we are logged in too), but I think this means we need to add a Display name feature in Auth? i made 2 accs for the site and the images uploaded are staying seperated in each acc but how do I allow it to be 'linked' in the sidebar for anyone else with an acc to view them?

please keep this as simple as possible, I'm new to react and web dev in general



Sidebar.jsx:
export default function Sidebar() {
  const user = {
    name: "John Doe",
    profilePic: "/default.jpeg", // served from public/default.jpeg
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src={user.profilePic}
          alt="Profile"
          className="profile-pic"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/100";
          }}
        />
        
          <p className="profile-name">
            <a href="#" className="profile-link">
              {user.name}
            </a>
          </p>
       
      </div>
    </div>
  );
}






My file UploadArea.jsx:


import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "../context/AuthContext";
import UploadBox from "./UploadBox";

export default function UploadArea() {
  const { globalUser, setShowAuth } = useAuth(); // assume you have a way to open Auth modal
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user images on login
  useEffect(() => {
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("user-images")
        .list(`${globalUser.uid}/gallery`);

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      // Generate signed URLs for private access
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: signedData, error: signedError } =
            await supabase.storage
              .from("user-images")
              .createSignedUrl(`${globalUser.uid}/gallery/${file.name}`, 3600); // 1 hour expiry
          if (signedError) {
            console.error("Signed URL error:", signedError.message);
            return null;
          }
          return signedData.signedUrl;
        })
      );

      setImages(urls.filter(Boolean)); // remove nulls if any
      setLoading(false);
    };

    fetchImages();
  }, [globalUser]);

  const handleUpload = async (e) => {
    if (!globalUser) {
      setShowAuth(true); // open login/signup modal
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${globalUser.uid}/gallery/${file.name}`;

      const { error } = await supabase.storage
        .from("user-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data: signedData, error: signedError } =
        await supabase.storage
          .from("user-images")
          .createSignedUrl(filePath, 3600);

      if (signedError) {
        console.error("Signed URL error:", signedError.message);
        continue;
      }

      uploadedUrls.push(signedData.signedUrl);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setLoading(false);
  };

  return (
    <div className="upload-area">
      <UploadBox onUpload={handleUpload} />

      {loading && <p>Loading images...</p>}

      <div className="gallery">
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}

        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Uploaded ${idx}`}
            className="gallery-image"
          />
        ))}
      </div>
    </div>
  );
}

      


Authentication.jsx:


import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./Authentication.css";

export default function Authentication({ onClose, onSuccess }) {  // <-- CHANGE #1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("login");

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useRef(null);

  const { signup, login } = useAuth();

  // Fade in on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  async function handleAuthenticate(e) {
    e.preventDefault();

    // basic checks
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

      // LOGIN OR SIGNUP
      if (mode === "signup") {
        await signup(email, password);

        // <-- CHANGE #2: trigger success callback
        if (onSuccess) onSuccess("signup");

      } else {
        await login(email, password);

        // <-- CHANGE #2: trigger success callback
        if (onSuccess) onSuccess("login");
      }

      handleClose();  // close modal after success

    } catch (err) {
      console.log("AUTH ERROR:", err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <div className={`auth-container ${visible ? "show" : "hide"}`}>
      <form
        ref={modalRef}
        className={`auth-form ${visible ? "show" : "hide"}`}
        onSubmit={handleAuthenticate}
      >
        <button type="button" className="close-btn" onClick={handleClose}>
          ×
        </button>

        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to your account!"
            : "Create a new account."}
        </p>

        {error && <p className="auth-error">❌ {error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isAuthenticating}>
          {isAuthenticating
            ? "Authenticating..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <hr />

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


ImageModal.jsx:
import { useState, useEffect, useRef } from "react";
import "./ImageModal.css";



export default function ImageModal({ image, onClose, onNavigate, hasMultiple }) {
  const [transition, setTransition] = useState(false);
  const [prevImage, setPrevImage] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {      
    if (prevImage && prevImage.url !== image.url) {
      setTransition(true);
      const timer = setTimeout(() => setTransition(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevImage(image);
  }, [image]);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleOverlayClick}>
      <div className="image-modal" ref={modalRef}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-content">
  {/* Image stays in its own wrapper }
  <div className={`image-wrapper ${transition ? "slide" : ""}`}>
    <img src={image.url} alt={image.name} className="modal-image" key={image.url} />
  </div>

  {/* Navigation buttons outside of sliding wrapper }
  {hasMultiple && (
    <>
      <button className="nav-btn left" onClick={() => onNavigate("prev")}>◀</button>
      <button className="nav-btn right" onClick={() => onNavigate("next")}>▶</button>
    </>
  )}
</div>

        <div className="modal-footer">
          <button>❤️ Like</button>
          <button>🔗 Share</button>
          <button>💬 Comment</button>
        </div>
      </div>
    </div>
  );
}

UploadArea.jsx:

import { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import { useAuth } from "../context/AuthContext";
import UploadBox from "./UploadBox";

export default function UploadArea() {
  const { globalUser } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);

      const { data: files, error } = await supabase.storage
        .from("user-images")
        .list(`${globalUser.uid}/gallery`);

      if (error) {
        console.error("Error fetching images:", error.message);
        setLoading(false);
        return;
      }

      const urls = await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from("user-images")
            .createSignedUrl(`${globalUser.uid}/gallery/${file.name}`, 3600);

          if (error) {
            console.error("Signed URL error:", error.message);
            return null;
          }
          return data.signedUrl;
        })
      );

      setImages(urls.filter(Boolean));
      setLoading(false);
    };

    fetchImages();
  }, [globalUser]);

  const handleUpload = async (e) => {
    if (!globalUser) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    for (let file of files) {
      const filePath = `${globalUser.uid}/gallery/${file.name}`;

      const { error } = await supabase.storage
        .from("user-images")
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data, error: signedError } = await supabase.storage
        .from("user-images")
        .createSignedUrl(filePath, 3600);

      if (signedError) console.error("Signed URL error:", signedError.message);
      else setImages((prev) => [...prev, data.signedUrl]);
    }

    setLoading(false);
  };

  return (
    <div className="upload-area">
      <UploadBox onUpload={handleUpload} />
      {loading && <p>Loading images...</p>}
      <div className="gallery">
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Uploaded ${idx}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
}


UploadBox.jsx (the button):

import "./UploadBox.css";

export default function UploadBox({ onUpload }) {
  return (
    <label htmlFor="file-upload" className="upload-box">
      Click to upload images
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
      />
    </label>
  );
}


AuthContext.jsx:
// AuthContext.jsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../SupabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Auth functions ---
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData(null);

    // Remove both tokens
    localStorage.removeItem("sb_firebase_token");
    localStorage.removeItem("sb_supabase_token");

    // Clear Supabase headers
    supabase.headers = {
      ...supabase.headers,
      Authorization: "",
    };

    return signOut(auth);
  }

  // --- Track Firebase user + create Supabase session ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      if (!user) {
        setGlobalData(null);
        localStorage.removeItem("sb_firebase_token");
        localStorage.removeItem("sb_supabase_token");
        return;
      }

      try {
        setIsLoading(true);

        // 1️⃣ Get Firebase token
        const firebaseToken = await user.getIdToken();

        // Store Firebase token (optional)
        localStorage.setItem("sb_firebase_token", firebaseToken);

        // 2️⃣ Send firebaseToken to backend to get Supabase token
        const res = await fetch("http://localhost:4000/auth/firebase-to-supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: firebaseToken }),
        });

        const data = await res.json();

        if (data.access_token) {
          // 3️⃣ Save Supabase token
          localStorage.setItem("sb_supabase_token", data.access_token);

          // 4️⃣ Inject into Supabase client
          supabase.headers = {
            ...supabase.headers,
            Authorization: `Bearer ${data.access_token}`,
          };

          console.log("🔥 Supabase session installed.");
        } else {
          console.error("❌ Failed to obtain Supabase token:", data);
        }

        // 5️⃣ Load Firestore user data
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        setGlobalData(docSnap.exists() ? docSnap.data() : {});
      } catch (err) {
        console.error("AuthContext error:", err.message);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


App.jsx:

import { useState } from "react";
import Authentication from "./components/Authentication.jsx";
import SuccessPopup from "./components/SuccessPopup.jsx";
import Sidebar from "./components/Sidebar.jsx";
import UploadArea from "./components/UploadArea.jsx";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { globalUser, logout } = useAuth();

  // Called by Authentication.jsx after login/signup
  function handleLoginSuccess(mode) {
    setShowAuth(false);

    if (mode === "login") {
      setSuccessMessage("Successfully logged in!");
    } else if (mode === "signup") {
      setSuccessMessage("Account created successfully!");
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">Image-Uploader</div>
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

        <div className="navbar-right">

          {/* If NOT logged in → show "Sign up / Login" button }
          {!globalUser && (
            <button className="button-64" role="button" onClick={() => setShowAuth(true)}>
              <span className="text">Sign up / Login</span>
            </button>
          )}

          {/* If LOGGED IN → show Logout }
          {globalUser && (
            <button
              className="button-64 red-button"
              role="button"
              onClick={logout}
            >
              <span className="text">Logout</span>
            </button>
          )}

          {/* Authentication modal }
          {showAuth && (
            <Authentication
              onClose={() => setShowAuth(false)}
              onSuccess={handleLoginSuccess}
            />
          )}

        </div>
      </nav>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <UploadArea
  globalUser={globalUser}
  openAuth={() => setShowAuth(true)}
/>

        </main>
      </div>

      {/* Success popup }
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
}

export default App;



and Supabaseclient.js:

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sb_supabase_token") || ""}`,
      },
    },
  }
);



*/



/*
never doing that again

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UploadBox from "./UploadBox";
import ImageModal from "./ImageModal";
import "./UploadArea.css";

export default function UploadArea() {
  const { globalUser } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----- Fetch images from backend -----
  useEffect(() => {
    if (!globalUser) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoading(true);

      const token = await globalUser.getIdToken();

      const res = await fetch("http://localhost:4000/user/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token, uid: globalUser.uid }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching images:", data.error);
        setLoading(false);
        return;
      }

      setImages(data.images);
      setLoading(false);
    };

    fetchImages();
  }, [globalUser]);

  // ----- Upload images through backend -----
  const handleUpload = async (e) => {
    if (!globalUser) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    const token = await globalUser.getIdToken();

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

    // refresh gallery
    const refreshToken = await globalUser.getIdToken();
    const res = await fetch("http://localhost:4000/user/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: refreshToken, uid: globalUser.uid }),
    });

    const data = await res.json();
    setImages(data.images || []);

    setLoading(false);
  };

  return (
    <div className="upload-area">
      <UploadBox onUpload={handleUpload} />
      {loading && <p>Loading images...</p>}

      <div className="gallery">
        {images.length === 0 && !loading && <p>No images uploaded yet.</p>}
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Uploaded ${idx}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
}








import { useState } from "react";
import Authentication from "./components/Authentication.jsx";
import SuccessPopup from "./components/SuccessPopup.jsx";
import Sidebar from "./components/Sidebar.jsx";
import UploadArea from "./components/UploadArea.jsx";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { globalUser, logout } = useAuth();

  // Called by Authentication.jsx after login/signup
  function handleLoginSuccess(mode) {
    setShowAuth(false);

    if (mode === "login") {
      setSuccessMessage("Successfully logged in!");
    } else if (mode === "signup") {
      setSuccessMessage("Account created successfully!");
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-left">Image-Uploader</div>
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

        <div className="navbar-right">

          {/* If NOT logged in → show "Sign up / Login" button }
          {!globalUser && (
            <button className="button-64" role="button" onClick={() => setShowAuth(true)}>
              <span className="text">Sign up / Login</span>
            </button>
          )}

          {/* If LOGGED IN → show Logout }
          {globalUser && (
            <button
              className="button-64 red-button"
              role="button"
              onClick={logout}
            >
              <span className="text">Logout</span>
            </button>
          )}

          {/* Authentication modal }
          {showAuth && (
            <Authentication
              onClose={() => setShowAuth(false)}
              onSuccess={handleLoginSuccess}
            />
          )}

        </div>
      </nav>

      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <UploadArea
  globalUser={globalUser}
  openAuth={() => setShowAuth(true)}
/>

        </main>
      </div>

      {/* Success popup }
      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
}

export default App;


*/