const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authMiddleware");
router.get("/", verifyToken, messageController.getLastMessages);
router.get("/:userId", verifyToken, messageController.getMessagesByUser);
router.post("/:userId", verifyToken, messageController.sendMessage);

module.exports = router;