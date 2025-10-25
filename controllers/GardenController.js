const { Garden } = require("../models")

const createGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" })
    }

    const existing = await Garden.findOne({ owner: userId })
    if (existing) {
      return res
        .status(200)
        .json({ message: "Garden already exists!", garden: existing })
    }

    const garden = await Garden.create({
      name: "My Garden",
      owner: userId,
      plants: [],
      description: "A beautiful garden waiting to bloom",
    })
    res.status(201).json({ message: "Garden created successfully!", garden })
  } catch (error) {
    console.error("Error in createGarden:", error)
    res.status(500).json({ error: error.message || "Error creating garden" })
  }
}
module.exports = { createGarden }
