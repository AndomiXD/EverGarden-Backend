const router = require("express").Router()
const ctrl = require("../controllers/UserController")
const middleware = require("../middleware")

router.get("/me", middleware.stripToken, middleware.verifyToken, ctrl.getMyProfile)
router.put("/me", middleware.stripToken, middleware.verifyToken, ctrl.updateMyProfile)

module.exports = router

