const nodemailer = require("nodemailer");

exports.generateOTP = (otp_len = 6) => {
  // generate 6 digit otp
  let OTP = "";

  for (let i = 1; i <= otp_len; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });
