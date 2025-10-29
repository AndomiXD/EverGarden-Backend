const { User } = require("../models")
const middleware = require("../middleware")

const Register = async (req, res) => {
  try {

    const { email, password, username } = req.body

    let passwordDigest = await middleware.hashPassword(password)

    let existingUser = await User.exists({ email })
    if (existingUser) {
      return res
        .status(400)
        .send("A user with that email has already been registered!")
    } else {

      const user = await User.create({ username, email, passwordDigest })

      res.status(200).send(user)
    }
  } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )

    if (matched) {
      let payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        avatarUrl: user.avatarUrl || ""
      }

      let token = middleware.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }
    res.status(401).send({ status: "Error", msg: "Unauthorized" })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: "Error", msg: "An error has occurred logging in!" })
  }
}

const UpdatePassword = async (req, res) => {
  try {

    const { oldPassword, newPassword } = req.body

    let user = await User.findById(req.params.id)

    let matched = await middleware.comparePassword(
      oldPassword,
      user.passwordDigest
    )
    
    if (matched) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      user = await User.findByIdAndUpdate(req.params.id, {
        passwordDigest,
      })
      let payload = {
        id: user._id,
        username: user.username,
        email: user.email,
      }
      return res
        .status(200)
        .send({ status: "Password Updated!", user: payload })
    }
    res
      .status(401)
      .send({ status: "Error", msg: "Old Password did not match!" })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: "Error",
      msg: "An error has occurred updating password!",
    })
  }
}

const CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession,
}
