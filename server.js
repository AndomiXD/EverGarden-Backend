const express = require("express")
const logger = require("morgan")
const cors = require("cors")
const path = require("path")

const AuthRouter = require("./routes/AuthRouter")
const PlantRouter = require("./routes/PlantRouter")
const GardenRouter = require("./routes/GardenRouter")
const ShareRouter = require("./routes/ShareRouter")
const UserRouter = require("./routes/UserRouter")

const PORT = process.env.PORT || 3000

const db = require("./db")

const app = express()

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static("public"))


app.use("/auth", AuthRouter)
app.use("/plants", PlantRouter)
app.use("/shares", ShareRouter)
app.use("/gardens", GardenRouter)
app.use("/users", UserRouter)

// app.use("/", (req, res) => {
//   res.send(`Connected!`)
// })

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
