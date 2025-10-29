const bcrypt = require("bcrypt")
const { User } = require("../models")


const getMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload?.id
    if (!userId) return res.status(401).json({ error: "Not authenticated" })

    const user = await User.findById(userId).select("-passwordDigest")
    if (!user) return res.status(404).json({ error: "User not found" })

    return res.json(user)
  } catch (error) {
    console.error("getMyProfile error:", error)
    return res.status(500).json({ error: "Failed to get user profile" })
  }
}


const updateMyProfile = async (req, res) => {
  try {
    const userId = res.locals.payload?.id
    if (!userId) return res.status(401).json({ error: "Not authenticated" })

    const { username, avatarUrl } = req.body
    const updates = {}
    if (username != null) updates.username = username
    if (avatarUrl != null) updates.avatarUrl = avatarUrl

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    }).select("-passwordDigest")

    if (!updated) return res.status(404).json({ error: "User not found" })
    return res.json(updated)
  } catch (error) {
    console.error("updateMyProfile error:", error)
    return res.status(500).json({ error: "Failed to update profile" })
  }
}


const updateMyPassword = async (req, res) => {
  try {
    const userId = res.locals.payload?.id
    const { oldPassword, newPassword } = req.body

    if (!userId) return res.status(401).json({ error: "Not authenticated" })
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new password are required" })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    const valid = await bcrypt.compare(oldPassword, user.passwordDigest)
    if (!valid) return res.status(400).json({ error: "Old password is incorrect" })

    user.passwordDigest = await bcrypt.hash(newPassword, 10)
    await user.save()

    return res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("updateMyPassword error:", error)
    return res.status(500).json({ error: "Failed to update password" })
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateMyPassword
}
