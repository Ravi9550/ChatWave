const asyncHandler = require("express-async-handler");

const chat = require("../models/ChatModel");
const user = require("../models/UserModel");

// Create or fetch One to One Chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await user.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await chat.create(chatData);
      const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


//Fetch all chats for a user
const fetchChats = asyncHandler(async (req, res) => {
  try {
    chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("Admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await user.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//Create New Group Chat
const groupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupchats = await chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      Admin: req.user,
    });

    const fullGroupChat = await chat.findOne({ _id: groupchats._id })
      .populate("users", "-password")
      .populate("Admin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


// Renaming the Group
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("Admin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


// Remove user from Group

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Find the chat group
  const chatGroup = await chat.findById(chatId);
  if (!chatGroup) {
    return res.status(404).send({ message: "Chat not found" });
  }

  // Check if the user is the current admin
  const isCurrentAdmin = chatGroup.Admin.toString() === userId;

  // Remove the user from the group
  const updatedChat = await chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("Admin", "-password");

  if (!updatedChat) {
    return res.status(404).send({ message: "Chat not found" });
  }

  // Update the admin if the current admin is being removed
  if (isCurrentAdmin) {
    const remainingUsers = updatedChat.users;
    if (remainingUsers.length > 0) {
      const newAdmin = remainingUsers[0]._id; // Assign the first remaining user as the new admin
      updatedChat.Admin = newAdmin;
      await updatedChat.save();
    } else {
      updatedChat.Admin = null; // No admin if no users remain
      await updatedChat.save();
    }
  }

  

  res.status(200).json(updatedChat);
});


//Add user to Group
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("Admin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});


module.exports = {
  accessChat,
  fetchChats,
  groupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
