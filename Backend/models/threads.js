const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
    threadId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Thread", threadSchema);
