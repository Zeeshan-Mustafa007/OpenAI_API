const mongoose = require("mongoose");
const User = require("../models/users");
const { jwtDecode } = require("jwt-decode");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);

exports.googleLogin = async (req, res) => {
    try {
        const { tokens } = await Client.getToken(req.body.code); // exchange code for tokens
        const userInfo = jwtDecode(tokens.id_token);
        // console.log(tokens);
        // console.log(userInfo);

        // Check if user already exists in the database
        let user = await User.findOne({ userId: userInfo.sub });
        // console.log("User found:", user);
        if (!user) {
            // If user does not exist, create a new user
            user = new User({
                userId: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                givenName: userInfo.given_name,
                familyName: userInfo.family_name,
                picture: userInfo.picture,
                emailVerified: userInfo.email_verified,
                google_auth: {
                    refresh_token: tokens.refresh_token,
                    access_token: tokens.access_token,
                    expiry_date: tokens.expiry_date,
                },
                authSource: "google",
            });
            await user.save();
            console.log("User saved!");
        } else {
            // Update existing user's all details
            user.email = userInfo.email;
            user.name = userInfo.name;
            user.givenName = userInfo.given_name;
            user.familyName = userInfo.family_name;
            user.picture = userInfo.picture;
            user.emailVerified = userInfo.email_verified;
            user.google_auth.refresh_token = tokens.refresh_token;
            user.google_auth.access_token = tokens.access_token;
            user.google_auth.expiry_date = tokens.expiry_date;
            await user.save();
        }

        res.status(200).json({
            message: "Login Successful",
            user: {
                id: user.userId,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        });
    } catch (err) {
        console.error("Error logging user:", err);
        res.status(500).json({ error: "Login Failed" });
    }
};

exports.autoGoogleLogin = async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "Login Successful",
            user: {
                id: user.userId,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};