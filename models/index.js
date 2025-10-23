const mongoose = require("mongoose")
const userSchema = require("./User")
const gardenSchema = require("./Garden")
const plantSchema = require("./Plant")
const shareSchema = require("./Share")

const User = mongoose.model("User", userSchema)
const Garden = mongoose.model("Garden", gardenSchema)
const Plant = mongoose.model("Plant", plantSchema)
const Share = mongoose.model("Share", shareSchema)

module.exports = {
  User,
  Garden,
  Plant,
  Share,
}
