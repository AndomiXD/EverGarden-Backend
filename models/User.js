const { Schema } = require("mongoose")

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    balance: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = userSchema
