const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const shareSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    garden: { type: mongoose.Schema.Types.ObjectId, ref: "Garden", required: true },
  },
  { timestamps: true }
)

module.exports = shareSchema
