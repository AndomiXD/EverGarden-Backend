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
  "/myGarden",
  middleware.stripToken,
  middleware.verifyToken,
  controller.showGarden
)
// Plant a seed into the user's garden
router.post(
  "/plant",
  middleware.stripToken,
  middleware.verifyToken,
  controller.plantSeed
)

router.put(
  "/updateTime",
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateTimeLeft
)

module.exports = router
