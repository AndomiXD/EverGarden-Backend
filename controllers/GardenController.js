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

const getMyGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id

    const user = await User.findById(userId)
    const garden = await Garden.findOne({ owner: userId }).populate(
      "plants.plantRef"
    )

    if (!garden) {
      return res.status(404).json({ error: "Garden not found" })
    }

    let totalReward = 0
    const now = new Date()

    const updatedPlants = []

    for (const plantSlot of garden.plants) {
      const plantData = await Plant.findById(plantSlot.plantRef)
      if (!plantData) {
        continue
      }

      const timeRemaining =
        new Date(plantSlot.expectHarvest).getTime() - now.getTime()

      if (timeRemaining <= 0) {
        totalReward = totalReward + plantData.reward
      } else {
        plantSlot.timeLeft = timeRemaining
        updatedPlants.push(plantSlot)
      }
    }

    // garden.plants.forEach(async (plantSlot) => (
    //  await Plant.findById(plantSlot.plantRef))
    // forEach did not work... why?
    // Reason: Using async/await directly with Array.forEach() in JS does not work as expected for sequential asynchronous operations.
    // While you can declare the callback function of forEach as async, the forEach method itself does not wait for the promises returned
    // by the async callbacks to resolve before moving to the next iteration or completing the loop.
    // This means that any await calls within the forEach callback will not pause the execution of the forEach loop itself.

    if (totalReward > 0) {
      user.balance += totalReward
      await user.save()
    }

    garden.plants = updatedPlants
    await garden.save()

    res.status(200).json({
      message:
        totalReward > 0
          ? `Welcome back! You earned ${totalReward} coins from harvested plants.`
          : "Welcome back! No plants harvested yet.",
      garden,
      balance: user.balance,
    })
  } catch (error) {
    console.error("Error fetching user garden:", error)
    res.status(500).json({ error: error.message || "Error fetching garden" })
  }
}

const plantSeed = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { plantId, position } = req.body

    const user = await User.findById(userId)

    const plantData = await Plant.findById(plantId)
    if (!plantData) {
      return res.status(404).json({ error: "Plant not found" })
    }

    if (user.balance < plantData.cost) {
      return res.status(400).json({ error: "Not enough balance" })
    }

    const garden = await Garden.findOne({ owner: userId })
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    const slotTaken = garden.plants.find((p) => p.position === position)
    if (slotTaken) {

      return res.status(400).json({ error: "That spot is already planted!" })
    }

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
    const garden = await Garden.findOne({ owner: userId })

    if (!garden) return res.status(404).json({ error: "Garden not found" })

    const now = new Date()
    let updatedPlants = []

    garden.plants = garden.plants.map((plant) => {
      const remaining = new Date(plant.expectHarvest).getTime() - now.getTime()

      const timeLeft = remaining > 0 ? remaining : 0

      const updated = { ...plant.toObject(), timeLeft }
      updatedPlants.push(updated)

      plant.timeLeft = timeLeft
      return plant
    })

    await garden.save()

    res.status(200).json({
      message: "All plants' time left updated successfully!",
      updatedPlants,
      garden,
    })
  } catch (error) {
    console.error("Error updating time left:", error)
    res.status(500).json({ error: error.message })
  }
}

const getGardenById = async (req, res) => {
  try {
    const { id } = req.params
    const garden = await Garden.findById(id).populate("plants.plantRef")

    if (!garden) {
      return res.status(404).json({ message: "Garden not found" })
    }

    res.status(200).json(garden)
  } catch (error) {
    console.error("Error fetching garden by ID:", error)
    res.status(500).json({ message: "Error fetching garden by ID" })
  }
}
const removeSeed = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { position } = req.body

    const garden = await Garden.findOne({ owner: userId })
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    const plantIndex = garden.plants.findIndex((p) => p.position === position)
    if (plantIndex === -1)
      return res.status(400).json({ error: "No plant found at that position" })

    const removed = garden.plants[plantIndex]

    garden.plants.splice(plantIndex, 1)
    await garden.save()

    res.status(200).json({
      message: "Plant removed successfully!",
      removedPlant: removed,
      garden,
    })
  } catch (error) {
    console.error("Error removing planted seed:", error)
    res.status(500).json({ error: error.message || "Error removing seed" })
  }
}

module.exports = {
  createGarden,
  getMyGarden,
  updateTimeLeft,
  plantSeed,
  removeSeed,
  getGardenById,
}
