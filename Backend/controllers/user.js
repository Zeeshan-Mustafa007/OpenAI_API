const { jwtDecode } = require("jwt-decode");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

exports.googleLogin = async (req, res) => {
    try {
        const { response } = req.body;
        
        const userData = jwtDecode(response.credential);
        console.log(userData);

        res.json({ data: userData });
    } catch (err) {
        console.error("Error logging user:", err);
        res.status(500).json({ error: "Login Failed" });
    }
};
