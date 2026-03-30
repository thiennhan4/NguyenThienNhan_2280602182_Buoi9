const mongoose = require("mongoose");
const Message = require("../models/Message");
exports.getMessagesByUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.params;
    const { text, fileUrl } = req.body;

    let contentMessage = {};

    if (fileUrl) {
      contentMessage = {
        type: "file",
        content: fileUrl,
      };
    } else {
      contentMessage = {
        type: "text",
        content: text,
      };
    }

    const newMessage = new Message({
      from: currentUserId,
      to: userId,
      contentMessage,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLastMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: new mongoose.Types.ObjectId(currentUserId) },
            { to: new mongoose.Types.ObjectId(currentUserId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          from: 1,
          to: 1,
          contentMessage: 1,
          createdAt: 1,
          userPair: {
            $cond: [
              { $gt: ["$from", "$to"] },
              { $concat: [{ $toString: "$to" }, "_", { $toString: "$from" }] },
              { $concat: [{ $toString: "$from" }, "_", { $toString: "$to" }] },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$userPair",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};