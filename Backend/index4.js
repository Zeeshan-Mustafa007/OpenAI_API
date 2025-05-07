const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {
    ensureThread,
    uploadImage,
    uploadFile,
    uploadText,
    fetchHistory,
} = require("./Helpers/helper");

const app = express();
const PORT = 5000;

const upload = multer();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// 🔁 Check thread on server start
(async () => {
    await ensureThread();
})();

// 📨 POST /upload

app.post(
    "/upload",
    upload.fields([{ name: "image" }, { name: "file" }]),
    async (req, res) => {
        const { text, webSearch } = req.body;
        const image = req.files["image"]?.[0];
        const file = req.files["file"]?.[0];

        // console.log("Received webSearch:", webSearch);
        
        try {
            // text + image
            if (image) {
                const response = await uploadImage(text, image);
                return res.json({
                    response: response,
                });
            }
            // text + file
            else if (file) {
                const response = await uploadFile(text, file);
                return res.json({
                    response: response,
                });
            }
            // text only
            else {
                const response = await uploadText(text);
                return res.json({
                    response: response,
                });
            }
        } catch (err) {
            // console.error("Assistant error:", err);
            res.status(500).json({ error: "Something went wrong." });
        }
    }
);

// 📜 GET /history - Returns full chat from OpenAI thread
app.get("/history", async (req, res) => {
    try {
        res.json({ messages: await fetchHistory() });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to retrieve chat history." });
    }
});

// 🟢 Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
