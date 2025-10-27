const { Plant } = require("../models")

const addPlant = async (req, res) => {
  try {
    const { name, type, cost, reward } = req.body
    if (!name || !type || !cost || !reward) {
      return res.status(400).json({
        error: "All fields are required: name, type, cost, reward. ",
      })
    }
    const plantExists = await Plant.findOne({ name: req.body.name })
    if (plantExists) {
      return res.status(400).json({
        error: "Plant of the same name already exists",
      })
    } else {
      const plant = await Plant.create({ name, type, cost, reward })
      res.status(201).json(plant)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find({})
    res.status(200).json(plants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { addPlant, getAllPlants }
