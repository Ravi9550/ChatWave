const express = require("express");
const { 
    accessChat, 
    fetchChats, 
    groupChat, 
    removeFromGroup, 
    addToGroup, 
    renameGroup,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authenticationMiddleware");

const router = express.Router();

// here protect is middleware to ensure that only logined user can do all functionality

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, groupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);


module.exports = router;
