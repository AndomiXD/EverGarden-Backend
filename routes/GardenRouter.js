const router = require("express").Router()
const middleware = require("../middleware")
const controller = require("../controllers/GardenController")

//POST  create garden
router.post(
  "/create",
  middleware.stripToken,
  middleware.verifyToken,
  controller.createGarden
)

router.get(
  "/me",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getMyGarden
)

router.post(
  "/plant",
  middleware.stripToken,
  middleware.verifyToken,
  controller.plantSeed
)
router.post(
  "/remove",
  middleware.stripToken,
  middleware.verifyToken,
  controller.removeSeed
)

module.exports = router

