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
        plantRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plant",
          required: true,
        },
        position: {
          type: Number, // 0–15 for 4x4 grid
          required: true,
        },
        whenPlanted: { type: Date, default: Date.now },
        expectHarvest: { type: Date },
        timeLeft: { type: Number, default: 0 }, // milliseconds left if user leaves
      },
    ],

    description: {
      type: String,
      required: true,
      default: "A beautiful garden waiting to bloom",
    },
  },
  { timestamps: true }
)

module.exports = gardenSchema
