const { User } = require("../models")

const getMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" })
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
    }

    return res.json(user)
  } catch (error) {
    console.error("getMyProfile error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
}

const updateMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" })
    }

    const { username, image } = req.body
    const updates = {}

    if (username) updates.username = username
    if (image) updates.image = image

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true })
    if (!updated) return res.status(404).json({ error: "User not found" })

    return res.json(updated)
  } catch (error) {
    console.error("updateMyProfile error:", error)
    return res.status(500).json({ error: "Failed to update profile" })
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
}
