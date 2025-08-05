const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = crypto.randomBytes(32); // Stronger key (AES-256 requires 32 bytes)
const IV = crypto.randomBytes(16); // Initialization vector for AES
const ALGORITHM = "aes-256-ctr";

// Function to encrypt text
function encryptText(text) {
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${IV.toString("hex")}:${encrypted}`; // Store IV with encrypted text
}

// Function to decrypt text
function decryptText(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// API Route to Encrypt Text
app.post("/encrypt", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    const encrypted = encryptText(text);
    res.json({ encrypted });
});

// API Route to Decrypt Text
app.post("/decrypt", (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        const decrypted = decryptText(text);
        res.json({ decrypted });
    } catch (error) {
        res.status(400).json({ error: "Decryption failed, invalid text." });
    }
});

// Test Route to Check if Server is Running
app.get("/", (req, res) => {
    res.send("🔐 Encryption API is Running!");
});

// Start the Server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
