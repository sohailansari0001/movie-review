// models
const Movie = require("../models/movieModel");
const Review = require("../models/reviewModel");

// imports
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

// helper function
const {
  uploadTrailerCloud,
  uploadPosterCloud,
  formatActor,
  averageRatingPipeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
} = require("../utils/helper");

exports.uploadTrailer = async (req, res) => {
  try {
    const { file } = req;

    // checking file present or not
    if (!file) {
      return res.status(401).json({
        success: false,
        message: "Video file is missing",
      });
    }

    // uploading image to cloud
    const { secure_url: url, public_id } = await uploadTrailerCloud(file);

    return res.status(201).json({
      success: true,
      message: "Trailer uploaded successfully",
      response: {
        url,
        public_id,
      },
    });
  } catch (error) {
    console.log("Error in upload trailer controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Trailer not uploaded",
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { file, body } = req;

    const {
      title,
      storyline,
      director,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
      writers,
      trailer,
      language,
    } = body;

    // creating a new movie
    const newMovie = new Movie({
      title,
      storyline,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
      trailer,
      language,
    });

    // adding director if present
    if (director) {
      if (!isValidObjectId(director)) {
        return res.status(401).json({
          success: false,
          message: "Invalid Director id",
        });
      }

      newMovie.director = director;
    }

    // adding writers if present
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId)) {
          return res.status(401).json({
            success: false,
            message: "Invalid writer id",
          });
        }
      }
      newMovie.writers = writers;
    }

    // uploading poster
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await uploadPosterCloud(file);

    const posterObj = {
      url,
      public_id,
      reponsive: [],
    };

    // adding movie poster resolution breakpoints
    const { breakpoints } = responsive_breakpoints[0];

    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        posterObj.reponsive.push(secure_url);
      }
    }

    // adding posterObj
    newMovie.poster = posterObj;

    // saving movie
    await newMovie.save();

    return res.status(201).json({
      success: true,
      message: "Movie created Successfully",
      movie: {
        id: newMovie._id,
        title,
      },
    });
  } catch (error) {
    console.log("Error in create movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Movie not created",
    });
  }
};

exports.updateWithoutPoster = async (req, res) => {
  try {
    const { movieId } = req.params;

    // checking movie id is valid or not
    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Movie ID!",
      });
    }

    const movie = await Movie.findById(movieId);

    // checking if movie is present or not
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const {
      title,
      storyline,
      director,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
      writers,
      trailer,
      language,
    } = req.body;

    movie.title = title;
    movie.storyline = storyline;
    movie.releaseDate = releaseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.tags = tags;
    movie.cast = cast;
    movie.trailer = trailer;
    movie.language = language;

    // adding director if present
    if (director) {
      if (!isValidObjectId(director)) {
        return res.status(401).json({
          success: false,
          message: "Invalid Director ID!",
        });
      }

      movie.director = director;
    }

    // adding writer if present
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId)) {
          return res.status(401).json({
            success: false,
            message: "Invalid Writer ID!",
          });
        }
      }
      movie.writers = writers;
    }

    // saving movie
    await movie.save();

    return res.status(201).json({
      success: true,
      message: "Movie Updated Successfully",
      movie,
    });
  } catch (error) {
    console.log("Error in update without poster movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Movie not updated",
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const file = req.file;

    //checking movie id is valid or not
    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Movie ID!",
      });
    }

    const movie = await Movie.findById(movieId);
    // checking if movie is present or not
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const {
      title,
      storyline,
      director,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
      writers,
      trailer,
      language,
    } = req.body;

    movie.title = title;
    movie.storyline = storyline;
    movie.releaseDate = releaseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.tags = tags;
    movie.cast = cast;
    movie.language = language;

    // saving director if present
    if (director) {
      if (!isValidObjectId(director)) {
        return res.status(401).json({
          success: false,
          message: "Invalid Director ID!",
        });
      }

      movie.director = director;
    }

    // saving writer if present
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId)) {
          return res.status(401).json({
            success: false,
            message: "Invalid Writer ID!",
          });
        }
      }
      movie.writers = writers;
    }

    // if poster file is present
    if (file) {
      // removing poster from cloud
      const publicId = movie.poster?.public_id;

      if (publicId) {
        const { result } = await cloudinary.uploader.destroy(publicId);

        if (result !== "ok") {
          return res.status(401).json({
            success: false,
            message: "Could not update poster at the moment!",
          });
        }
      }

      // adding new poster
      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await uploadPosterCloud(req.file);

      const posterObj = {
        url,
        public_id,
        reponsive: [],
      };

      // adding movie poster resolution breakpoints
      const { breakpoints } = responsive_breakpoints[0];

      if (breakpoints.length) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          posterObj.reponsive.push(secure_url);
        }
      }

      // adding posterObj
      movie.poster = posterObj;
    }

    // saving poster
    await movie.save();

    return res.status(201).json({
      success: true,
      message: "Movie Updated Successfully! ",
      movie: {
        id: movie._id,
        title: movie.title,
        poster: movie.poster?.url,
        genres: movie.genres,
        status: movie.status,
      },
    });
  } catch (error) {
    console.log("Error in update with poster movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Movie not updated",
    });
  }
};

exports.removeMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // checking id is valid or not
    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Movie ID!",
      });
    }

    const movie = await Movie.findById(movieId);

    // checking if movie is present or not
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // check if there is poster or not
    const posterId = movie.poster?.public_id;

    if (posterId) {
      const { result } = await cloudinary.uploader.destroy(posterId);

      if (result !== "ok") {
        return res.status(401).json({
          success: false,
          message: "Could not remove poster from cloud!",
        });
      }
    }

    // checking if trailer is present or not
    const trailerId = movie.trailer?.public_id;

    if (!trailerId) {
      return res.status(401).json({
        success: false,
        message: "could not find trailer in cloud!",
      });
    }

    const { result } = await cloudinary.uploader.destroy(trailerId, {
      resource_type: "video",
    });

    if (result !== "ok") {
      return res.status(401).json({
        success: false,
        message: "Could not remove trailer from cloud!",
      });
    }

    // deleting movie
    await Movie.findByIdAndDelete(movieId);

    return res.status(201).json({
      success: true,
      message: "Movie Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in removie movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Movie not removed",
    });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const { pageNo = 0, limit = 10 } = req.query;
    const result = await Movie.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit));

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Movies Not Found!",
      });
    }

    // formating actor
    const movies = result.map((movie) => ({
      id: movie._id,
      title: movie.title,
      poster: movie?.poster?.url,
      genres: movie.genres,
      status: movie.status,
      responsivePosters: movie?.poster?.reponsive,
    }));

    return res.status(201).json({
      success: true,
      message: "Movies Found!",
      movies: movies,
    });
  } catch (error) {
    console.log("Error in get movies controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting Movies!",
    });
  }
};

exports.getMovieForUpdate = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Id is invalid!",
      });
    }

    const movie = await Movie.findById(movieId).populate(
      "director writers cast.actor"
    );

    if (!movie) {
      return res.status(401).json({
        success: false,
        message: "Movie Not Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie Fetched for update",
      movie: {
        id: movie.id,
        title: movie.title,
        storyline: movie.storyline,
        poster: movie.poster?.url,
        releaseDate: movie.releaseDate,
        status: movie.status,
        type: movie.type,
        language: movie.language,
        genres: movie.genres,
        tags: movie.tags,
        director: formatActor(movie.director),
        writers: movie.writers?.map((w) => formatActor(w)),
        cast: movie.cast?.map((c) => {
          return {
            id: c.id,
            profile: formatActor(c.actor),
            roleAs: c.roleAs,
            leadActor: c.leadActor,
          };
        }),
      },
    });
  } catch (error) {
    console.log("Error in get movie update  controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting Movie for Update!",
    });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    const movies = await Movie.find({
      title: { $regex: title, $options: "i" },
    });

    return res.json({
      success: true,
      message: "Movie Found!",
      results: movies.map((m) => {
        return {
          id: m._id,
          title: m.title,
          poster: m.poster?.url,
          genres: m.genres,
          status: m.status,
        };
      }),
    });
  } catch (error) {
    console.log("Error in get search movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Searching Movie!",
    });
  }
};

// CONTROLLERS FOR NORMAL USERS

exports.getLatestUploads = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const results = await Movie.find({ status: "public" })
      .sort("-createdAt")
      .limit(parseInt(limit));

    const movies = results.map((m) => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        responsivePosters: m.poster.reponsive,
        trailer: m.poster?.url,
        storyline: m.storyline,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Movies fetched successfully!",
      movies,
    });
  } catch (error) {
    console.log("Error in get get latest upload movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting latest upload Movies!",
    });
  }
};

exports.getSingleMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // mongoose.Types.ObjectId(movieId);

    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Movie Id is Invalid!",
      });
    }

    const movie = await Movie.findById(movieId).populate(
      "director writers cast.actor"
    );

    const reviews = await getAverageRatings(movie._id);

    const {
      _id: id,
      title,
      storyline,
      cast,
      writers,
      director,
      releaseDate,
      genres,
      tags,
      language,
      poster,
      trailer,
      type,
    } = movie;

    return res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      movie: {
        id,
        title,
        storyline,
        releaseDate,
        genres,
        tags,
        language,
        type,
        poster: poster?.url,
        trailer: trailer?.url,
        cast: cast.map((c) => ({
          id: c._id,
          profile: {
            id: c.actor._id,
            name: c.actor.name,
            avatar: c.actor?.avatar?.url,
          },
          leadActor: c.leadActor,
          roleAs: c.roleAs,
        })),
        writers: writers.map((w) => ({
          id: w._id,
          name: w.name,
        })),
        director: {
          id: director._id,
          name: director.name,
        },
        reviews: { ...reviews },
      },
    });
  } catch (error) {
    console.log("Error in get get single movie controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting  Movie!",
    });
  }
};

exports.getRelatedMovies = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) {
      return res.status(401).json({
        success: false,
        message: "Movie Id is Invalid!",
      });
    }

    const movie = await Movie.findById(movieId);

    const movies = await Movie.aggregate(
      relatedMovieAggregation(movie.tags, movie._id)
    );

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);

      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
        reviews: { ...reviews },
      };
    };

    const relatedMovies = await Promise.all(movies.map(mapMovies));

    return res.status(200).json({
      success: true,
      message: "Related Movies fetched successfully",
      relatedMovies,
    });
  } catch (error) {
    console.log("Error in get related movies controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting Related Movie!",
    });
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const { type = "Film" } = req.query;

    const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
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
    console.log("Error in  get top rated movies controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting Top Rated Movies!",
    });
  }
};

exports.searchPublicMovies = async (req, res) => {
  try {
    const { title } = req.query;

    // checking if title is present or  not
    if (!title.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    // finding movie
    const movies = await Movie.find({
      title: { $regex: title, $options: "i" },
      status: "public",
    });

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        poster: m.poster.url,
        responsivePosters: m.poster.reponsive,
        reviews: { ...reviews },
      };
    };

    const newMovies = await Promise.all(movies.map(mapMovies));

    return res.json({
      success: true,
      message: "Movie Found!",
      results: newMovies,
    });
  } catch (error) {
    console.log("Error in  get search  movies controller");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Getting Movies!",
    });
  }
};
