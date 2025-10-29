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
router.put(
  "/update-time",
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateTimeLeft
)
router.put(
  "/harvest",
  middleware.stripToken,
  middleware.verifyToken,
  controller.harvestPlant
)
router.delete(
  "/remove",
  middleware.stripToken,
  middleware.verifyToken,
  controller.removeSeed
)
router.get("/share/:userId", controller.getPublicGarden)

module.exports = router
