const { Schema } = require("mongoose")

const plantSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    cost: { type: Number, required: true },
    reward: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = plantSchema
