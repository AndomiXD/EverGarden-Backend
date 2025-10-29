const { Schema } = require("mongoose")

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    image: { type: String, default: "" }, 
    balance: { type: Number, default: 10, required: true }
  },
  { timestamps: true }
)

module.exports = userSchema
