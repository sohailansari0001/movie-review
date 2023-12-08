const express = require("express");

// middlewares
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const {
  validateMovie,
  validate,
  validateTrailer,
} = require("../middlewares/validator");

// controllers
const {
  uploadTrailer,
  createMovie,
  updateMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
  searchPublicMovies,
} = require("../controllers/movieController");

// helper functions
const { parseData } = require("../utils/helper");

const router = express.Router();

// admin routes
router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);

router.get("/movies", isAuth, isAdmin, getMovies);
router.delete("/:movieId", isAuth, isAdmin, removeMovie);

router.get("/search", isAuth, isAdmin, searchMovies);

// public routes

router.get("/search-public", searchPublicMovies);
router.get("/latest-uploads", getLatestUploads);
router.get("/single/:movieId", getSingleMovie);
router.get("/related/:movieId", getRelatedMovies);
router.get("/top-rated", getTopRatedMovies);

module.exports = router;
