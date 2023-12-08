const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const hashPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashPassword;
//   }

//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
