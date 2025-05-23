const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./services/db");

const app = express();
const PORT = 8081;

app.use(cors());

app.use(express.json());

connectDB();

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

app.use("/user", require("./routes/user"));

// 🟢 Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
