const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 8080;

app.use(cors());

app.use(express.json());

// 🔁 Check thread on server start

app.get("/", (req, res) => {
    res.send("Server is running...\n");
});

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
