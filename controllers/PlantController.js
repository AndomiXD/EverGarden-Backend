const { Plant } = require("../models")

const addPlant = async (req, res) => {
  try {
    const { name, type, cost, reward } = req.body
    if (!name || !type || !cost || !reward) {
      return res.status(400).json({
        error: "All fields are required: name, type, cost, reward. ",
      })
    }
    const plant = await Plant.create({ name, type, cost, reward })
    res.status(201).json(plant)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { addPlant }
