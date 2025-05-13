import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let audioUrl;
    if (audio) {
      // For now, store base64 directly. For production, upload to storage and save URL.
      audioUrl = audio;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audio: audioUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      // Send notification event
      io.to(receiverSocketId).emit("notification", {
        title: "New Message",
        body: `${req.user.name || 'Someone'} sent you a message.`,
        message: newMessage,
        type: "message",
        timestamp: new Date(),
        senderId: senderId,
        senderName: req.user.name || 'Someone',
        senderAvatar: req.user.profilePic || null,
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const myId = req.user._id;
    await Message.updateMany(
      { senderId: userId, receiverId: myId, seen: { $ne: true } },
      { $set: { seen: true } }
    );
    // Notify sender that their message was seen
    const senderSocketId = getReceiverSocketId(userId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("notification", {
        title: "Message Seen",
        body: `${req.user.name || 'Someone'} has seen your message.`,
        type: "seen",
        timestamp: new Date(),
        userId: myId,
        userName: req.user.name || 'Someone',
        userAvatar: req.user.profilePic || null,
        chatId: userId,
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark messages as seen" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (String(message.senderId) !== String(userId)) {
      return res.status(403).json({ error: "Not authorized to delete this message" });
    }
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    await message.deleteOne();
    // Notify receiver that a message was deleted
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", {
        title: "Message Deleted",
        body: `${req.user.name || 'Someone'} deleted a message.`,
        type: "deleted",
        timestamp: new Date(),
        userId,
        userName: req.user.name || 'Someone',
        userAvatar: req.user.profilePic || null,
        chatId: message.receiverId,
        messageId: id,
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
