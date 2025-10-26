const { Share, Garden } = require("../models")

const createShare = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { title, description } = req.body

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" })
    }

    const garden = await Garden.findOne({ owner: userId })
    if (!garden) {
      return res
        .status(404)
        .json({ error: "Garden not found. Create a garden first!" })
    }

    const share = await Share.create({
      title,
      description,
      poster: userId,
      garden: garden._id,
    })

    res.status(201).json({ message: "Share created successfully!", share })
  } catch (error) {
    console.error("Error in createShare:", error)
    res
      .status(500)
      .json({ error: error.message || "Error creating share post" })
  }
}

const getAllShares = async (req, res) => {
  try {
    const shares = await Share.find({})
      .populate("poster", "username")
      .populate("garden", "name description")
    res.status(200).json(shares)
  } catch (error) {
    console.error("Error in getAllShares:", error)
    res.status(500).json({ error: error.message || "Error fetching shares" })
  }
}

const getUserShares = async (req, res) => {
  try {
    const userId = res.locals.payload.id

    const shares = await Share.find({ poster: userId }).populate(
      "garden",
      "name description"
    )
    res.status(200).json(shares)
  } catch (error) {
    console.error("Error in getUserShares:", error)
    res
      .status(500)
      .json({ error: error.message || "Error fetching user shares" })
  }
}

module.exports = {
  createShare,
  getAllShares,
  getUserShares,
}
