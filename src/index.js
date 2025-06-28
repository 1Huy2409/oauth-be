import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { errorHandler } from "./handlers/error-handler.js"
import router from "./routes/index.route.js"
import passport from "./configs/passport.config.js"
import instanceMongoDB from "./configs/db.config.js"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const session = require('express-session')
dotenv.config()
const app = express()
const port = process.env.PORT
instanceMongoDB.connect()
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize())
app.use(passport.session())
router(app)
app.use(errorHandler)
app.get('/', (req, res) => {
    res.send("Hello Guys!")
})
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${port}`)
})