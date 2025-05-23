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
        // console.log(userInfo);

        res.json(tokens);
    } catch (err) {
        console.error("Error logging user:", err);
        res.status(500).json({ error: "Login Failed" });
    }
};
