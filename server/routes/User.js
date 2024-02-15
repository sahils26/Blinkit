const express = require("express")
const router = express.Router();

const {
  login,
  signup,
  sendOTP,
  changePassword,
  uploadUserImage
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth");



router.post("/login", login)

router.post("/signup", signup)

router.post("/sendotp", sendOTP)

router.post("/changepassword", auth, changePassword)

router.post("/reset-password-token", resetPasswordToken)

router.post("/reset-password", resetPassword)

router.post("/uploadUserImage",uploadUserImage)


module.exports = router;

