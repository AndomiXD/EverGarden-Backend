const router = require("express").Router()
const controller = require("../controllers/ShareController")
const middleware = require("../middleware")

router.post(
  "/create",
  middleware.stripToken,
  middleware.verifyToken,
  controller.createShare
)

router.get(
  "/all",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getAllShares
)

router.get(
  "/user",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getUserShares
)

router.put(
  "/:id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateShare
)

// Delete a share (only the owner can delete)
router.delete(
  "/:id",
  middleware.stripToken,
  middleware.verifyToken,
  controller.deleteShare
)

module.exports = router
