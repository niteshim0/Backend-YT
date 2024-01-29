import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => {
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken,refreshToken}

  }catch(error){
    throw new ApiError(500,"Something went wrong while generating access token and refresh token");
  }

}

const registerUser = asyncHandler( async (req,res)=> {
  //req.body almost send each data we required
  const {fullName,email,username,password} = req.body
  console.log("email" , email)

  if(
    [fullName,email,username,password].some((field)=> field?.trim() === "")
  ){
    throw new ApiError(400,"All fields are required")
  }
  
  const existedUser = await User.findOne({
    $or : [ { username } , { email }]
  })

  if(existedUser){
    throw new ApiError(409, "user with this email or username already exists")
  }

  //req.files for files
  //uploaded image on local server through multer
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }
  
  //uploaded images from local server to third-party service
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  //checking for error uploading on cloudinary
  if(!avatar){
    throw new ApiError(400,"Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Internal Servor Erorr in registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User created Successfully")
  )

})

const loginUser = asyncHandler( async(req,res)=> {
    
   const {username,email,password} = req.body

   if(!username || !email){
    throw new ApiError(400, "username or email is required")
   }

   const user = await User.findOne({
    $or:[{ username },{ email }]
   })

   if(!user){
    throw new ApiError(404,"user doesn't exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials");
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

   const loggedInUser = await User.findById(user._id)
   .select("-password -refreshToken")

   const options = {
     httpOnly : true,
     secure : true
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
      200,
      {
        user : loggedInUser,accessToken,refreshToken
      },
      "User logged in successfully"
    )
   )
  


  





})

const logOutUser = asyncHandler ( async (req,res) => {
  
})

export { registerUser};