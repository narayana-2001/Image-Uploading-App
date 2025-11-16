import fileUpload from "express-fileupload";
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
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // Allow cookies and authentication headers
};

// Use the CORS middleware
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(fileUpload());

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

app.post("/auth/firebase-to-supabase", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing Firebase ID token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Create a fake Supabase JWT
    // (This is OK ONLY if you DO NOT use Supabase Auth)
    const jwt = require("jsonwebtoken");

    const supabaseToken = jwt.sign(
      {
        sub: decoded.uid,
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET, // Find this in Supabase Project Settings → API
      { expiresIn: "1h" }
    );

    return res.json({ access_token: supabaseToken });
  } catch (err) {
    console.error("Token bridge error:", err);
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
});

// --- Upload endpoint ---
app.post("/user/upload", async (req, res) => {
  const { idToken, uid, fileName } = req.body;

  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  try {
    // Verify Firebase auth
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid) {
      return res.status(403).json({ error: "UID mismatch" });
    }

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("user-images")
      .upload(`${uid}/gallery/${fileName}`, file.data, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Upload exception:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🔥 Backend running on http://localhost:${PORT}`);
});
