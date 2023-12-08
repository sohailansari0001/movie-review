const cloudinary = require("cloudinary");

const cloudinaryConnect = () => {
  try {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
      secure: true,
    });
    console.log("cloudinary connected");
  } catch (error) {
    console.log("Error in connecting clodinary");
    console.log(error);
  }
};

module.exports = cloudinaryConnect;
