const { Garden } = require("./models")

const createGarden = async (req, res) => {
  try{
    const userId = res.locals.payload.id
    const existing = await Garden.findOne({ owner: userId })
    if (existing) {
      return res.json({ message: "Garden already exists!", garden: existing })
    }
    const garden = await Garden.create({
      name: "My Garden",
      owner: userId,
      plants: [],
      description: ""
    })
    res.json({ message: "Garden created!", garden})
  }catch(err){
    res.status(500).json({message: "Error creating garden"})
  }
}
module.exports = { createGarden }
