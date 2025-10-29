const router = require("express").Router()
const controller = require("../controllers/UserController")
const middleware = require("../middleware")

router.get(
  "/me",
  middleware.stripToken,
  middleware.verifyToken,
  controller.getMyProfile
)
router.put(
  "/me",
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateMyProfile
)

module.exports = router
