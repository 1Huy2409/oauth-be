import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { errorHandler } from "./handler/error-handler.js"
import instanceMongoDB from "./config/db.config.js"
dotenv.config()
const app = express()
const PORT = process.env.PORT
instanceMongoDB.connect()
app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send("Hello World!")
})
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${PORT}`)
})