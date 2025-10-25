const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const gardenSchema = new Schema(
  {
    name: { type: String, required: true, default: "My Garden" },
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
    description: { type: String, required: true, default: "A beautiful garden waiting to bloom" },
  },
  { timestamps: true }
)

module.exports = gardenSchema
