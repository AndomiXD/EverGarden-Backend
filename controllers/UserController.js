const { User } = require("../models")


const getMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const user = await User.findById(userId).select("-passwordDigest")
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json(user)
  } catch (error) {
    console.error("getMyProfile error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
}


const updateMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    const { username, avatarUrl } = req.body

    const updates = {}
    if (username != null) updates.username = username
    if (avatarUrl != null) updates.avatarUrl = avatarUrl

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-passwordDigest")

    res.json(updatedUser)
  } catch (error) {
    console.error("updateMyProfile error:", error)
    res.status(500).json({ error: "Failed to update profile" })
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
}
