const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Corresponds to 'sub'
    email: { type: String, required: true, unique: true },
    name: String,
    givenName: String,
    familyName: String,
    picture: String,
    emailVerified: Boolean,
    authSource: {
        enum: ["self", "google"],
        default: "self",
    },
    createdAt: { type: Date, default: Date.now },
});

// Virtual field to populate threads associated with the user
userSchema.virtual("threads", {
    ref: "Thread",
    localField: "_id",
    foreignField: "user",
});

// Ensure virtual fields are serialized
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
