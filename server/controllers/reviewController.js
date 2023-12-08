const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movieModel");
const Review = require("../models/reviewModel");
const { getAverageRatings } = require("../utils/helper");

exports.addReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { content, rating } = req.body;

    const userId = req.user._id;

    // checking if user is verified or not
    if (!req.user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "User is not verified, Please verify first!",
      });
    }

    // checking is movie id valid or not
    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Movie Id is not valid",
      });
    }

    // finding movie
    const movie = await Movie.findOne({ _id: movieId, status: "public" });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found!",
      });
    }

    // checking if review is present or not
    const isAlreadyReviewd = await Review.findOne({
      owner: userId,
      parentMovie: movie._id,
    });

    if (isAlreadyReviewd) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request review is already given!",
      });
    }

    const newReview = new Review({
      owner: userId,
      parentMovie: movie._id,
      content,
      rating,
    });

    // adding review in movie
    movie.reviews.push(newReview._id);

    // saving movie and review
    await movie.save();
    await newReview.save();

    const reviews = await getAverageRatings(movie._id);

    return res.status(200).json({
      success: true,
      message: "Review is posted!",
      reviews,
    });
  } catch (error) {
    console.log("Error in add review controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Review not posted!",
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, rating } = req.body;

    const userId = req.user._id;

    // checking is movie id valid or not
    if (!isValidObjectId(reviewId)) {
      return res.status(401).json({
        success: false,
        message: "Review Id is not valid",
      });
    }

    // checking if review is present or not
    const review = await Review.findOne({ owner: userId, _id: reviewId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Reviewnot found!",
      });
    }

    // saving content and rating
    review.content = content;
    review.rating = rating;

    // saving review
    await review.save();

    return res.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.log("Error in update review controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Review not updated!",
    });
  }
};

exports.removeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const userId = req.user._id;

    if (!isValidObjectId(reviewId)) {
      return res.status(401).json({
        success: false,
        message: "Review Id is not valid",
      });
    }

    const review = await Review.findOne({ owner: userId, _id: reviewId });

    if (!review) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request, review not found!",
      });
    }

    const movie = await Movie.findById(review.parentMovie).select("reviews");

    movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

    await Review.findByIdAndDelete(reviewId);

    await movie.save();

    return res.status(200).json({
      success: true,
      message: "Review removed successfully!",
    });
  } catch (error) {
    console.log("Error in remove review controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Review not removed !",
    });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Movie Id is not valid",
      });
    }

    const movie = await Movie.findById(movieId)
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
          select: "name",
        },
      })
      .select("reviews title");

    const reviews = movie.reviews.map((r) => {
      const { owner, content, rating, _id: reviewId } = r;
      const { name, _id: ownerId } = owner;

      return {
        id: reviewId,
        owner: {
          id: ownerId,
          name,
        },
        content,
        rating,
      };
    });

    return res.json({
      success: true,
      message: "Review fetched successfully",
      movie: {
        title: movie.title,
        reviews,
      },
    });
  } catch (error) {
    console.log("Error in get review controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Review not fetched!",
    });
  }
};
