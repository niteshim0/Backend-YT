import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

//CORS_ORIGIN contanins from which URL you are accessing backend
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

//limits for how much data one can send to backend
app.use(express.json({limt:"16kb"}))

//data from urls can be in various forms
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//some data is stored on our server,for using that
app.use(express.static("public"))

//for use of cookies stored in our browser via server
app.use(cookieParser())

export {app}

