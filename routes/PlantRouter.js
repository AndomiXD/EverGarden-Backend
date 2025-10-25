const router = require("express").Router()
const { addPlant } = require("../controllers/PlantController")

// POST /plants - Add a new plant
router.post("/add", addPlant)

module.exports = router
