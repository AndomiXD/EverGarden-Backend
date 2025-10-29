const router = require("express").Router()
const controller = require("../controllers/ShareController")
const middleware = require("../middleware")

// Create a new share post
router.post(
  "/create",
  middleware.stripToken,
  middleware.verifyToken,
  controller.createShare
)

// Get all share posts (could be used for public if we remove striptoken and verifytoken)
router.get(
  "/all",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getAllShares
)

// Get logged-in user share posts
router.get(
  "/user",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getUserShares
)

// router.put(
//   "/:id",
//   middleware.stripToken,
//   middleware.verifyToken,
//   controller.updateShare
// )

// // Delete a share (only the owner can delete)
// router.delete(
//   "/:id",
//   middleware.stripToken,
//   middleware.verifyToken,
//   controller.deleteShare
// )

module.exports = router
