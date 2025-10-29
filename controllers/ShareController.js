const { Share, Garden } = require("../models")

const createShare = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" })
    }

    const garden = await Garden.findOne({ owner: res.locals.payload.id })
    if (!garden) {
      return res
        .status(404)
        .json({ error: "Garden not found. Create a garden first!" })
    }

    const share = await Share.create({
      title,
      description,
      poster: res.locals.payload.id,
      garden: garden._id,
    })
    const populated = await Share.findById(share._id)
      .populate("poster", "username")
      .populate("garden", "name description")

    return res.status(201).json({ message: "Share created successfully!", share })
  } catch (error) {
    console.error("Error in createShare:", error)
    return res.status(500)
      .json({ error: error.message || "Error creating share post" })
  }
}

const getAllShares = async (req, res) => {
  try {
    const shares = await Share.find({})
      .populate("poster", "username")
      .populate("garden", "name description")
      .sort({ createdAt: -1 })
    return res.status(200).json(shares)
  } catch (error) {
    console.error("Error in getAllShares:", error)
    return res.status(500).json({ error: error.message || "Error fetching shares" })
  }
}

const getUserShares = async (req, res) => {
  try {
    const userId = res.locals.payload.id

    const shares = await Share.find({ poster: userId })
    .populate("poster", "username")
    .populate(
      "garden",
      "name description"
    )
    .sort({ createdAt: -1 })
    return res.status(200).json(shares)
  } catch (error) {
    console.error("Error in getUserShares:", error)
    return res.status(500)
      .json({ error: error.message || "Error fetching user shares" })
  }
}

const updateShare = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { id } = req.params
    const { title, description } = req.body

    const share = await Share.findById(id)
    if (!share) return res.status(404).json({ error: "Share not found" })

    if (String(share.poster) !== String(userId)) {
      return res.status(403).json({ error: "Not allowed to edit this share" })
    }

    if (title != null) share.title = title
    if (description != null) share.description = description
    await share.save()

    const populated = await Share.findById(share._id)
      .populate("poster", "username")
      .populate("garden", "name description")

    return res.status(200).json({ message: "Share updated", share: populated })
  } catch (error) {
    console.error("Error in updateShare:", error)
    return res.status(500).json({ error: error.message || "Error updating share" })
  }
}


const deleteShare = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { id } = req.params

    const share = await Share.findById(id)
    if (!share) return res.status(404).json({ error: "Share not found" })


    if (String(share.poster) !== String(userId)) {
      return res.status(403).json({ error: "Not allowed to delete this share" })
    }

    await share.deleteOne()
    return res.status(200).json({ success: true, message: "Share deleted" })
  } catch (error) {
    console.error("Error in deleteShare:", error)
    return res.status(500).json({ error: error.message || "Error deleting share" })
  }
}

module.exports = {
  createShare,
  getAllShares,
  getUserShares,
  updateShare,
  deleteShare
}
