const { Garden, Plant, User } = require("../models")

const createGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { name, description } = req.body

    const existing = await Garden.findOne({ owner: userId })
    if (existing) {
      return res.status(200).json({
        message: "Garden already exists!",
        garden: existing.name,
      })
    }

    const garden = await Garden.create({
      name: name,
      owner: userId,
      description: description,
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

    const remainingPlants = []

    for (const plant of garden.plants) {
      const plantData = await Plant.findById(plant.plantRef)
      if (!plantData) {
        continue
      }
      const timeRemaining =
        new Date(plant.expectHarvest).getTime() - now.getTime()

      if (timeRemaining <= 0 && garden.autoHarvest) {
        totalReward = totalReward + plantData.reward
      } else if (timeRemaining > 0) {
        plant.timeLeft = timeRemaining
        remainingPlants.push(plant)
      } else if (!garden.autoHarvest) {
        plant.timeLeft = 0
        remainingPlants.push(plant)
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

    garden.plants = remainingPlants
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
      // Check balance
      return res.status(400).json({ error: "Not enough balance" })
    }

    const garden = await Garden.findOne({ owner: userId })

    if (!garden) return res.status(404).json({ error: "Garden not found" })

    const slotTaken = garden.plants.find((plant) => plant.position === position)
    if (slotTaken) {
      // Check if the position is already taken
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

    const populatedGarden = await Garden.findById(garden._id).populate(
      "plants.plantRef"
    )

    user.balance -= plantData.cost
    await user.save()

    res.status(200).json({
      message: `${plantData.name} planted successfully!`,
      garden: populatedGarden,
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

      // Update in the garden document
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

const harvestPlant = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { position } = req.body

    const user = await User.findById(userId)
    const garden = await Garden.findOne({ owner: userId }).populate(
      "plants.plantRef"
    )

    const plantIndex = garden.plants.findIndex(
      (plant) => plant.position === position
    )
    if (plantIndex === -1)
      return res.status(400).json({ error: "No plant found at that position" })

    const plantSlot = garden.plants[plantIndex]
    const now = new Date()

    if (now < new Date(plantSlot.expectHarvest) && plantSlot.timeLeft != 0)
      return res.status(400).json({ error: "This plant is not ready yet!" })

    const plantData = await Plant.findById(plantSlot.plantRef)
    user.balance = user.balance + plantData.reward

    garden.plants.splice(plantIndex, 1)
    await user.save()
    await garden.save()

    res.status(200).json({
      message: `You harvested ${plantData.name} and earned ${plantData.reward} coins as a reward!`,
      garden,
      balance: user.balance,
    })
  } catch (error) {
    console.error("Error harvesting plant:", error)
    res.status(500).json({ error: error.message })
  }
}

const removeSeed = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { position } = req.body // Position on the grid

    const garden = await Garden.findOne({ owner: userId })
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    // Check if position exists
    const plantIndex = garden.plants.findIndex(
      (plant) => plant.position === position
    )
    if (plantIndex === -1)
      return res.status(400).json({ error: "No plant found at that position" })

    const removedPlant = garden.plants[plantIndex]

    // Remove the plant from garden
    garden.plants.splice(plantIndex, 1)
    await garden.save()

    res.status(200).json({
      message: "Plant removed successfully!",
      removedPlant: removedPlant,
      garden,
    })
  } catch (error) {
    console.error("Error removing planted seed:", error)
    res.status(500).json({ error: error.message || "Error removing seed" })
  }
}

const getPublicGarden = async (req, res) => {
  try {
    const { userId } = req.params
    const garden = await Garden.findOne({ owner: userId }).populate(
      "plants.plantRef"
    )
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    res.status(200).json({
      owner: garden.owner,
      name: garden.name,
      description: garden.description,
      plants: garden.plants,
    })
  } catch (error) {
    console.error(`Error fetching public view of garden`, error)
    res.status(500).json({ error: error.message })
  }
}

const toggleAutoHarvest = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const garden = await Garden.findOne({ owner: userId })
    if (!garden) return res.status(404).json({ error: "Garden not found" })

    garden.autoHarvest = !garden.autoHarvest
    await garden.save()

    res
      .status(200)
      .json({ message: "AutoHarvest toggled", autoHarvest: garden.autoHarvest })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createGarden,
  getMyGarden,
  updateTimeLeft,
  plantSeed,
  removeSeed,
  harvestPlant,
  getPublicGarden,
  toggleAutoHarvest,
}
