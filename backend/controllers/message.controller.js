import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// @desc    Get all users for the sidebar
// @route   GET /api/messages/users
// @access  Private
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req?.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Get messages between two users
// @route   GET /api/messages/:id
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { userId: userIdToChat } = req.params;
    const myId = req.user._id;

    const chatMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userIdToChat },
        { senderId: userIdToChat, receiverId: myId },
      ],
    });

    res.status(200).json(chatMessages);
  } catch (error) {
    console.log("Error in getMessages Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Send a message to a user
// @route   POST /api/messages/send/:id
// @access  Private
const sendMessage = async (req, res) => {
  try {
    // Grab text & image
    const { text, image } = req.body;
    const { userId: receiverId } = req.params;
    const senderId = req.user._id;

    let imgURL;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgURL = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imgURL,
    });

    //* DONE: Realtime functionality goes here using Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //* Only Sending the message to the receiver not everyone
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getUsersForSidebar, getMessages, sendMessage };
