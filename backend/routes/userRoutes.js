const express = require('express');
const { registerUser, loginUser, allusers } = require('../controllers/userController');
const { protect } = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allusers);
router.post("/login", loginUser);

module.exports = router;
