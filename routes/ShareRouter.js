const router = require("express").Router()
const controller = require("../controllers/ShareController")
const middleware = require("../middleware")

// Create a new share post (requires authentication)
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

// Get user's share posts
router.get(
  "/user",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getUserShares
)

module.exports = router
