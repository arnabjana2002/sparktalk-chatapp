/*
Messages:
    senderId: user._id
    receiverId: user._id
    text: string
    image: string (Cloudinary URL)
*/

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: String,
    image: String,
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
