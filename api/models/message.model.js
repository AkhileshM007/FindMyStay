import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for guests
    senderName: { type: String }, // for guests
    senderEmail: { type: String }, // optional
    senderContact: { type: String }, // optional for guests
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;