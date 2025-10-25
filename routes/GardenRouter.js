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
module.exports = router

