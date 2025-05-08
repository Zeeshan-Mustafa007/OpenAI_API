const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

// 🔁 Check thread on server start

const upload = multer();
app.use(
    "/chat",
    upload.fields([{ name: "image" }, { name: "file" }]),
    require("./routes/chat")
);

// 🟢 Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
