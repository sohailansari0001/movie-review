// models imports
const User = require("../models/userModel");
const EmailVerificationToken = require("../models/emailVerificationTokenModel");
const PasswordResetToken = require("../models/passwordResetTokenModel");

// libraries imports
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// function/methods
const {
  generateOTP,
  generateMailTransporter,
  mailSender,
} = require("../utils/mail");
const { generateRandomByte } = require("../utils/helper");

// controllers

// create user
exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "Email already in use",
      });
    }

    // hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    // creating new user
    const newUser = await User.create({ name, email, password: hashPassword });

    let OTP = generateOTP();
    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
      owner: newUser._id,
      token: OTP,
    });

    await newEmailVerificationToken.save();
    console.log("mail");

    let transport = await generateMailTransporter();

    // sending mail
    const response = await transport.sendMail({
      from: "verification@reviewapp.com",
      to: `${newUser.email}`,
      subject: "Email Verification",
      html: `
        <p>Your verifcation OTP</p>
        <h1>${OTP}</h1>
      `,
    });

    // console.log(response);

    // sending response
    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Error in create user");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not created",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, OTP } = req.body;
    // const user = await User.findOne({ id });

    // checking id valid or not
    if (!isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }

    const user = await User.findById(userId);

    // checking if user present or not
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // checking if user already verified or not
    if (user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "User is already verified",
      });
    }

    const token = await EmailVerificationToken.findOne({ owner: userId });

    // checking if token present or not
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    // comparing token
    const isMatched = await token.compareToken(OTP);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Submit a valid OTP!",
      });
    }

    // verifying user
    user.isVerified = true;
    await user.save();

    // removing token/otp
    await EmailVerificationToken.findByIdAndDelete(token._id);

    let transport = generateMailTransporter();

    // sending mail
    transport.sendMail({
      from: "verification@reviewapp.com",
      to: user.email,
      subject: "Welcome Email",
      html: `
        <h1>Welcome to our Movie review system</h1>
        <p>Thanks for choosing us </p>
      `,
    });

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    // returning response
    return res.status(200).json({
      success: true,
      message: "Email is verified",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "email not verified",
    });
  }
};

exports.resendEmailVerificationToken = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    // checking if user present or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // checking if user already verified or not
    if (user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "User is already verified",
      });
    }

    const alreadyHasToken = await EmailVerificationToken.findOne({
      owner: userId,
    });

    // checking if token present or not
    if (alreadyHasToken) {
      return res.status(401).json({
        success: false,
        message: "Only after one hour you can request for another token",
      });
    }

    // generate 6 digit otp
    let OTP = generateOTP();
    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
      owner: user._id,
      token: OTP,
    });

    await newEmailVerificationToken.save();

    // send to user
    let transport = generateMailTransporter();

    // sending mail
    transport.sendMail({
      from: "verification@reviewapp.com",
      to: user.email,
      subject: "Email Verification",
      html: `
          <p>Your verifcation OTP</p>
          <h1>${OTP}</h1>
        `,
    });

    return res.status(200).json({
      success: true,
      message: "Another OTP sent to your email",
    });
  } catch (error) {
    console.log("Error in resend Email Verification Token controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Resend Otp failed",
    });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // checking email present or not
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Email is Missing!",
      });
    }

    const user = await User.findOne({ email });

    // checking user present or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyHasToken = await PasswordResetToken.findOne({
      owner: user._id,
    });

    // checking if token is already present or not
    if (alreadyHasToken) {
      return res.status(401).json({
        success: false,
        message: "Only after one hour you can request for another token",
      });
    }

    const token = await generateRandomByte();

    const newPasswordResetToken = await PasswordResetToken({
      owner: user._id,
      token,
    });

    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:5173/auth/reset-password?token=${token}&id=${user._id}`;

    // send to user
    let transport = generateMailTransporter();

    // sending mail
    transport.sendMail({
      from: "security@reviewapp.com",
      to: user.email,
      subject: "Reset Password Link",
      html: `
             <p>Click here to reset password</p>
             <a href=${resetPasswordUrl}>Change Password</a>
           `,
    });

    // sending response
    return res.status(201).json({
      success: true,
      message: "Link sent to your email",
    });
  } catch (error) {
    console.log("Error in password reset controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Password reset email failed",
    });
  }
};

// checking password token is valid or not
exports.sendResetPasswordToken = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    valid: true,
  });
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, userId } = req.body;

    const user = await User.findById(userId);

    // checking if user is present or not
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not exist",
      });
    }

    // checking password is old one or not
    const matched = await user.comparePassword(newPassword);

    if (matched) {
      return res.status(401).json({
        success: false,
        message: "New Password must be different from old one",
      });
    }

    // hashing password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    //saving password
    user.password = hashPassword;

    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

    // send to user
    let transport = generateMailTransporter();

    // sending mail
    transport.sendMail({
      from: "security@reviewapp.com",
      to: user.email,
      subject: "Password changed Successfully",
      html: `
               <h1>Password changed successfully</h1>
               <p >Now you can use new password</p>
             `,
    });

    // sending response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.log("Error in reset password controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // finding user
    const user = await User.findOne({ email });

    // checking if user present or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not present. Please register!",
      });
    }

    // comparing password
    const matched = await user.comparePassword(password);

    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Password not matched",
      });
    }

    const { _id, name, isVerified, role } = user;

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: "User Logged In",
      user: { id: _id, name, email, token: jwtToken, isVerified, role },
    });
  } catch (error) {
    console.log("Error in signIn controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Sign In failed",
    });
  }
};
