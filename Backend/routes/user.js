const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/googleLogin", userController.googleLogin);
router.post("/autoGoogleLogin", userController.autoGoogleLogin);

module.exports = router;