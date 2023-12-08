const express = require("express");

// controllers
const {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgotPassword,
  sendResetPasswordToken,
  resetPassword,
  signIn,
} = require("../controllers/userController");

// middlewares
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");
const { isValidPassResetToken } = require("../middlewares/userMiddleware");
const { isAuth } = require("../middlewares/auth");

const router = express.Router();

// routes
router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgotPassword);
router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordToken
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);
router.post("/sign-in", signInValidator, validate, signIn);
router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;

  return res.status(201).json({
    success: true,
    message: "User Found",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

module.exports = router;
