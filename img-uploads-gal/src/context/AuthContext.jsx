// =============================================================================
// AuthContext.jsx
// =============================================================================
// Provides a React Context to manage Firebase authentication and Supabase
// integration across the app. Handles signup, login, logout, password reset,
// token synchronization with Supabase, and global user data.
//
// Dependencies:
// - Firebase Auth + Firestore
// - Supabase client (for Storage or database access)
// =============================================================================

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase"; // Firebase Auth & Firestore instance
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../SupabaseClient";

// ---------------------------
// Create context & hook
// ---------------------------
const AuthContext = createContext();

// Custom hook to access auth context easily
export function useAuth() {
  return useContext(AuthContext);
}

// ---------------------------
// AuthProvider component
// ---------------------------
export function AuthProvider({ children }) {
  // Global state for authenticated Firebase user
  const [globalUser, setGlobalUser] = useState(null);

  // Global state for user-specific data from Firestore
  const [globalData, setGlobalData] = useState(null);

  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);

  // =============================================================================
  // AUTH FUNCTIONS
  // =============================================================================

  // Sign up a new user using Firebase Auth
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Log in an existing user using Firebase Auth
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Send password reset email
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Logout user, clear local state and Supabase token
  function logout() {
    setGlobalUser(null);
    setGlobalData(null);

    // Remove stored Firebase token
    window.localStorage.removeItem("sb_firebase_token");

    // Clear Supabase auth header
    supabase.headers = {
      ...supabase.headers,
      Authorization: "",
    };

    // Sign out from Firebase
    return signOut(auth);
  }

  // =============================================================================
  // TRACK AUTH STATE CHANGES
  // =============================================================================
  useEffect(() => {
    // Subscribe to Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setGlobalUser(user);

      // If user logs out
      if (!user) {
        setGlobalData(null);
        window.localStorage.removeItem("sb_firebase_token");
        return;
      }

      try {
        setIsLoading(true);

        // Get Firebase ID token for current user
        const token = await user.getIdToken();

        // Log the token (partial) for debugging
        console.log("🔥 Firebase token:", token.slice(0, 20) + "...");

        // Store token locally for Supabase usage
        window.localStorage.setItem("sb_firebase_token", token);

        // Update Supabase auth header so Storage requests are authorized
        supabase.headers = {
          ...supabase.headers,
          Authorization: `Bearer ${token}`,
        };

        // Fetch user-specific data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGlobalData(docSnap.data());
        } else {
          // If user document does not exist, initialize empty object
          setGlobalData({});
        }
      } catch (err) {
        console.error("AuthContext error:", err.message);
      } finally {
        setIsLoading(false);
      }
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  const value = {
    globalUser,    // Firebase user object
    globalData,    // Firestore user data
    setGlobalData, // Function to manually update globalData
    isLoading,     // Loading state for async operations
    signup,        // Signup function
    login,         // Login function
    logout,        // Logout function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
