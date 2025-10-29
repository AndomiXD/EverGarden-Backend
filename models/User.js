const { Schema } = require("mongoose")

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    image: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/736x/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg",
    },
    balance: { type: Number, default: 20, required: true },
  },
  { timestamps: true }
)

module.exports = userSchema
