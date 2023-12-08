const Movie = require("../models/movieModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const {
  topRatedMoviesPipeline,
  getAverageRatings,
} = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  try {
    const movieCount = await Movie.countDocuments();
    const reviewCount = await Review.countDocuments();
    const userCount = await User.countDocuments();

    return res.status(200).json({
      success: true,
      message: "User Info Found!",
      appInfo: {
        movieCount,
        reviewCount,
        userCount,
      },
    });
  } catch (error) {
    console.log("Error in get app info controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getting app info!",
    });
  }
};

exports.getMostRated = async (req, res) => {
  try {
    const movies = await Movie.aggregate(topRatedMoviesPipeline());

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        reviews: { ...reviews },
      };
    };

    const topRatedMovies = await Promise.all(movies.map(mapMovies));

    return res.status(200).json({
      success: true,
      message: "Top Rated movies fetched successfully!",
      topRatedMovies,
    });
  } catch (error) {
    console.log("Error in get most ratrd controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getting most rated movies!",
    });
  }
};
