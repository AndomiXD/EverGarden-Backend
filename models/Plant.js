const { Schema } = require("mongoose")

const plantSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    cost: { type: Number, required: true },
    reward: { type: Number, required: true },
    // whenPlanted: { type: Date, required: true, default: 0 },
    // expectHarvest: { type: Number, required: true, default: 0 },
    // timeLeft: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

module.exports = plantSchema
