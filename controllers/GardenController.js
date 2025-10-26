const { Garden, Plant, User } = require("../models")

const createGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id

    const existing = await Garden.findOne({ owner: userId })
    if (existing) {
      return res.status(200).json({
        message: "Garden already exists! Or does not!",
        garden: existing,
      })
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

const showGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const garden = await Garden.findOne({ owner: userId })

    res.status(200).send(garden)
  } catch (error) {
    console.error(error)
  }
}

const plantSeed = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { plantId, position } = req.body

    const user = await User.findById(userId)

    const plantData = await Plant.findById(plantId)
    if (!plantData) return res.status(404).json({ error: "Plant not found" })

    if (user.balance < plantData.cost)
      // Check balance
      return res.status(400).json({ error: "Not enough balance" })

    const garden = await Garden.findOne({ owner: userId }) // Find the user's garden
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    const slotTaken = garden.plants.find((p) => p.position === position)
    if (slotTaken)
      // Check if the position is already taken
      return res.status(400).json({ error: "That spot is already planted!" })

    const now = new Date()
    const growDuration = 1000 * (parseInt(plantData.reward) * 2)

    const newPlant = {
      plantRef: plantData._id,
      position,
      whenPlanted: now,
      expectHarvest: new Date(now.getTime() + growDuration),
      timeLeft: growDuration,
    }

    garden.plants.push(newPlant)
    await garden.save()

    user.balance = parseInt(user.balance) - parseInt(plantData.cost)
    await user.save()

    res.status(200).json({
      message: `${plantData.name} planted successfully!`,
      garden,
      balance: user.balance,
    })
  } catch (error) {
    console.error("Error planting seed:", error)
    res.status(500).json({ error: error.message })
  }
}

const updateTimeLeft = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { position } = req.body // which grid cell

    const garden = await Garden.findOne({ owner: userId })

    const plantSlot = garden.plants.find((p) => p.position === position)

    const now = new Date()
    const remaining = // Calculate remaining time
      new Date(plantSlot.expectHarvest).getTime() - now.getTime()
    plantSlot.timeLeft = remaining > 0 ? remaining : 0

    await garden.save()
    const allplants = garden.plants

    res.status(200).json({
      message: "Time left updated successfully!",
      timeLeft: plantSlot.timeLeft,
      allplants,
    })
  } catch (error) {
    console.error("Error updating time left:", error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { createGarden, showGarden, plantSeed, updateTimeLeft }
