import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true,//for enabling the searching and optimization
    },
    email: {
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
    },
    fullName: {
      type: String,
      required: true,
      trim : true,
      index : true,
    },
    avatar: {
      type : String, // cloudinaryURL
      required:true
    },
    coverImage : {
      type : String //cloudinaryURL
    },
    watchHistory : [
      {
        type : Schema.Types.ObjectId,
        ref : "Video"
      },
    ],
    password:{
      type : String,
      required:[true,"Password is must"]
    },
    refreshToken:{
      type: String,
    }
  },
  {timestamps:true}
)

//encrypting the password using bcrypt
//pre is middleware in mongoose which just executes before saving the data in Database
//here pure function is written because pure function have context as well as it should be async(cryptography takes time)
userSchema.pre("save",async function(next){

  if(!this.isModified("password")) return next()

  this.password = bcrypt.hash(this.password,10)
  
  next()
})

//custom method of mongoose for checking whether you password entered is correct or not
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}


//generating access token and refresh token

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
    _id : this._id,
    email : this.email,
    username : this.username,
    fullName : this.fullName
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   }
   )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
    _id : this._id,
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
   )
}

export const User = mongoose.model("User",userSchema);