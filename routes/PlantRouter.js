const router = require("express").Router()
const { addPlant, getAllPlants } = require("../controllers/PlantController")

// POST /plants/add - Add a new plant
router.post("/add", addPlant)

// GET /plants/all - Get all plants
router.get("/all", getAllPlants)

module.exports = router
