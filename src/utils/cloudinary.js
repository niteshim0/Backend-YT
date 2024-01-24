import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.ClOUDINARY_CLOUD_NAME, 
  api_key: process.env.vCLOUDINARY_API_KEY, 
  api_secret:process.env.vCLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilePath) => {
  try{
        if(!localfilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload
        (
          localfilePath,{
            resource_type : "auto"
          }
        )
        //file has been uploaded successfully
        console.log("file has been uploaded on cloudinary",
        response.url)

        return response;
  }catch(error){
        fs.unlinkSync(localfilePath)
        return null
  }
}

export {uploadOnCloudinary}