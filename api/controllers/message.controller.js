import Message from "../models/message.model.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const {
      listingId,
      receiverId,
      content,
      senderId,
      senderName,
      senderEmail,
      senderContact, // <-- Accept contact info from guest
    } = req.body;
    const message = await Message.create({
      listing: listingId,
      sender: senderId || null,
      senderName: senderName || null,
      senderEmail: senderEmail || null,
      senderContact: senderContact || null, // <-- Save contact info
      receiver: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages for a listing between two users
export const getMessages = async (req, res) => {
  try {
    const { listingId, userId } = req.query;
    if (!listingId || !userId) {
      return res.status(400).json({ error: "Missing listingId or userId" });
    }

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages received by a lister (inbox) with listing info
export const getInbox = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiver: userId })
      .populate("listing", "name address") // populate listing name and address
      .sort("-createdAt");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};