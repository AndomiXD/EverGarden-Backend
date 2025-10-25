const router = require("express").Router()
const controller = require("../controllers/PlantController")

// POST /plants/add - Add a new plant
router.post("/add", controller.addPlant)

// GET /plants/all - Get all plants
router.get("/all", controller.getAllPlants)

module.exports = router
