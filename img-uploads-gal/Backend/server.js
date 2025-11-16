import fileUpload from "express-fileupload";
import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { createClient } from "@supabase/supabase-js";

// --- Firebase Admin: use ENV variables instead of JSON file ---
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// --- Supabase Admin Client ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// -------------------------------------------------------------
//   ENDPOINT: List user image URLs
// -------------------------------------------------------------
app.post("/user/images", async (req, res) => {
  const { idToken, uid } = req.body;

  if (!idToken || !uid) {
    return res.status(400).json({ error: "Missing idToken or uid" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid) {
      return res.status(403).json({ error: "UID mismatch" });
    }

    const { data: files, error } = await supabase.storage
      .from("user-images")
      .list(`${uid}/gallery`);

    if (error) return res.status(500).json({ error: error.message });

    const urls = await Promise.all(
      files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("user-images")
          .createSignedUrl(`${uid}/gallery/${file.name}`, 3600);
        if (error) return null;
        return data.signedUrl;
      })
    );

    res.json({ images: urls.filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// -------------------------------------------------------------
//   ENDPOINT: Firebase → Supabase fake JWT bridge
// -------------------------------------------------------------
app.post("/auth/firebase-to-supabase", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing Firebase ID token" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    const jwt = require("jsonwebtoken");
    const supabaseToken = jwt.sign(
      {
        sub: decoded.uid,
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ access_token: supabaseToken });
  } catch (err) {
    console.error("Token bridge error:", err);
    res.status(401).json({ error: "Invalid Firebase token" });
  }
});

// -------------------------------------------------------------
//   ENDPOINT: Upload image
// -------------------------------------------------------------
app.post("/user/upload", async (req, res) => {
  const { idToken, uid, fileName } = req.body;

  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid) {
      return res.status(403).json({ error: "UID mismatch" });
    }

    const { error } = await supabase.storage
      .from("user-images")
      .upload(`${uid}/gallery/${fileName}`, file.data, {
        upsert: true,
      });

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

// -------------------------------------------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🔥 Backend running on http://localhost:${PORT}`);
});
