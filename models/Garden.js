const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const gardenSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
      },
    ],
    description: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = gardenSchema
