const express = require("express");

// middlewares
const { isAuth, isAdmin } = require("../middlewares/auth");

// controllers
const { getAppInfo, getMostRated } = require("../controllers/adminController");

const router = express.Router();

router.get("/app-info", isAuth, isAdmin, getAppInfo);
router.get("/most-rated", isAuth, isAdmin, getMostRated);

module.exports = router;
