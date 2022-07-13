const express = require("express");
const router = express.Router();
const googleAuthController = require("../controllers/googleAuthController");
const userController = require("../controllers/userController");

router.get("/google", googleAuthController.googleLogin);
router.get("/auth/google/callback", googleAuthController.googleLoginCallback);
router.get("/logout", googleAuthController.googleLogout);

router.get("/user", userController.getUser);
router.get("/user/:id", userController.fetchUser);
router.patch("/user/:id", userController.updateUser);

router.post("/follow/:id", userController.followUser);
router.post("/unfollow/:id", userController.unfollowUser);
router.get("/checkfollow/:id", userController.getFollow);

module.exports = router;
