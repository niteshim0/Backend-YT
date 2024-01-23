import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path:'./env'
}) //need to include experimental feature flag for it

const app = express();


connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Server is running at :  ${process.env.PORT}`)
  })
}).catch((err)=>{
  console.log("MONGODB connection FAILED !!!",err);
})



























//Approach I to connect to Database
//Everything in index file (not so professional)
//Database is always in another continent so make sure to use try and catch block alongwith async and await while connecting to database
// const app = express();
// //IFFI
// ;(async()=>{
//   try{
//     mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error",(error)=>{
//       console.log("ERROR: ",error);
//       throw error;
//     })

//     app.listen(process.env.PORT,()=>{
//       console.log(`App is listening on 
//       ${process.env.PORT}`)
//     })
//   }catch(error){
//     console.error("ERROR: ",error)
//     throw error;
//   }

// })()