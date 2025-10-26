const { Garden, Plant } = require("../models")

const createGarden = async (req, res) => {
  try {
    const userId = res.locals.payload.id
    if (!userId) {
      return res.status(401).json({ error: "User authentication required" })
    }

    const existing = await Garden.findOne({ owner: userId })
    if (existing) {
      return res
        .status(200)
        .json({ message: "Garden already exists!", garden: existing })
    }

    const garden = await Garden.create({
      name: "My Garden",
      owner: userId,
      plants: [],
      description: "A beautiful garden waiting to bloom",
    })
    res.status(201).json({ message: "Garden created successfully!", garden })
  } catch (error) {
    console.error("Error in createGarden:", error)
    res.status(500).json({ error: error.message || "Error creating garden" })
  }
}

const getMyGarden = async (req, res) => {
  try{
    const userId = res.locals.payload.id
    const garden = awaitGarden.findOne({owner:userId
  }).populate("plants")
  if(!garden)return res.status(404).json({message:"No garden yet"})
res.json(garden)
}catch (err){
  console.error(err)
  res.status(500).json({message: "Error fetching garden"})
}
}

const plantSeed = async (req, res) => {
try {
const userId = res.locals.payload.id
const { seedId } = req. body

const garden = await Garden.findOne({ owner: userId })
if (!garden) return res.status(404).json({ message:
"Garden not found" })

const plant = await Plant.findById(seedId)
if (!plant) return res.status (404).json({ message:
"Seed not found"})

garden.plants.push(plant._id)
await garden.save()

const populated = await Garden.findById(garden. _id).populate("plants")
res. json({message: "Seed planted", garden: populated })
} catch (err) {
console.error(err)
res. status (500).json({message: "Error planting seed"})
}
}

const removeSeed = async (req, res) =>{
try {

const userId = res.locals.payload.id
const { index } = req. body

const garden = await Garden.findOne({owner: userId})
if (!garden) return res.status(404).json({ message: "Garden not found"})

if (typeof index !== "number" || index < 0 || index >= garden.plants.length){
return res.status (400).json({ message: "Invalid index" })
}
garden.plants.splice (index, 1)
await garden.save()

const populated = await Garden.findById(garden._id).populate("plants")
res. json({ message: "Seed removed", garden: populated })
} catch (err) {
console.error(err)
res.status(500).json({ message: "Error removing seed"})
}
}
module.exports = {
createGarden,
getMyGarden,
plantSeed,
removeSeed
}


