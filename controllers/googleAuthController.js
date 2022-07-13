require("dotenv").config();
require("../auth");
const passport = require("passport");

exports.googleLogin = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleLoginCallback = passport.authenticate("google", {
  successRedirect: "http://localhost:3000",
  failureRedirect: "http://localhost:3000",
});

exports.googleLogout = async (req, res) => {
  req.logout();
  await req.session.destroy();
  res.status(200).json({
    message: "Logged out successfully",
  });
};
