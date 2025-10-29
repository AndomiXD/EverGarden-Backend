const router = require("express").Router()
const middleware = require("../middleware")
const controller = require("../controllers/GardenController")

//POST  create garden
router.get("/:id", controller.getGardenById)

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

router.delete(
  "/remove",
  middleware.stripToken,
  middleware.verifyToken,
  controller.removeSeed
)

module.exports = router
