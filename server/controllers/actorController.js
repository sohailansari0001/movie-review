// models
const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actorModel");
const { uploadActor, formatActor } = require("../utils/helper");

// imports
const cloudinary = require("cloudinary").v2;

exports.createActor = async (req, res) => {
  try {
    const { name, about, gender } = req.body;
    const { file } = req;

    // creating actor
    const newActor = new Actor({ name, about, gender });

    // uploading image
    if (file) {
      const uploadRes = await uploadActor(file);

      const { secure_url, public_id } = uploadRes;

      newActor.avatar = { url: secure_url, public_id };
    }

    // saving actor
    await newActor.save();

    return res.status(201).json({
      success: true,
      message: "Actor is created",
      actor: formatActor(newActor),
    });
  } catch (error) {
    console.log("Error in create actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Actor not created",
    });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { name, about, gender } = req.body;
    const { file } = req;
    const { actorId } = req.params;

    // checking id is valid or not
    if (!isValidObjectId(actorId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    // finding actor
    const actor = await Actor.findById(actorId);

    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request, Record Not Found!",
      });
    }

    const public_id = actor.avatar?.public_id;

    // removing image
    if (public_id && file) {
      const { result } = await cloudinary.uploader.destroy(public_id);

      if (result !== "ok") {
        return res.status(401).json({
          success: false,
          message: "Could not remove image from cloud!",
        });
      }
    }

    // uploading new image
    if (file) {
      const uploadRes = await uploadActor(file);

      const { secure_url, public_id } = uploadRes;

      actor.avatar = { url: secure_url, public_id };
    }

    // updating and saving
    actor.name = name;
    actor.about = about;
    actor.gender = gender;

    await actor.save();

    return res.status(201).json({
      success: true,
      message: "Actor is updated",
      actor: formatActor(actor),
    });
  } catch (error) {
    console.log("Error in create update actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Actor not updated",
    });
  }
};

exports.removeActor = async (req, res) => {
  try {
    const { actorId } = req.params;

    // checking id valid or not
    if (!isValidObjectId(actorId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    // finding actor
    const actor = await Actor.findById(actorId);

    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request, Record Not Found!",
      });
    }

    const public_id = actor.avatar?.public_id;

    // removing image
    if (public_id) {
      const { result } = await cloudinary.uploader.destroy(public_id);

      if (result !== "ok") {
        return res.status(401).json({
          success: false,
          message: "Could not remove image from cloud!",
        });
      }
    }

    // deleting actor
    await Actor.findByIdAndDelete(actorId);

    return res.status(201).json({
      success: true,
      message: "Record Deleted Successfully",
    });
  } catch (error) {
    console.log("Error remove actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Actor not deleted",
    });
  }
};

exports.searchActor = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    // searching actor using query
    // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    const result = await Actor.find({
      name: { $regex: name, $options: "i" },
    });

    // formating result
    const actors = result.map((actor) => formatActor(actor));

    return res.status(201).json({
      success: true,
      message: "Records Found",
      results: actors,
    });
  } catch (error) {
    console.log("Error search actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error in searching actor",
    });
  }
};

// lastest actor controller
exports.getLatestActor = async (req, res) => {
  try {
    // finding actor in descending order
    const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);

    // formating actor
    const actors = result.map((actor) => formatActor(actor));

    return res.status(201).json({
      success: true,
      message: "Records of Latest Actors Found",
      actors,
    });
  } catch (error) {
    console.log("Error latest actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error in searching latest actor",
    });
  }
};

exports.getSingleActor = async (req, res) => {
  try {
    const { id } = req.params;

    // checking id is valid or not
    if (!isValidObjectId(id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid Request!",
      });
    }

    // finding actor
    const actor = await Actor.findById(id);

    if (!actor) {
      return res.status(404).json({
        success: false,
        message: "Invalid request, Actor not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Record of Actor Found",
      actor: formatActor(actor),
    });
  } catch (error) {
    console.log("Error single actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error in searching  actor",
    });
  }
};

exports.getActors = async (req, res) => {
  try {
    const { pageNo, limit } = req.query;

    const result = await Actor.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit));

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Actors Not Found!",
      });
    }

    // formating actor
    const actors = result.map((actor) => formatActor(actor));

    return res.status(201).json({
      success: true,
      message: "Actors Found!",
      profiles: actors,
    });
  } catch (error) {
    console.log("Error get actor controller");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Error in Getting Movies!",
    });
  }
};
