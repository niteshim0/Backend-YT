import { Router } from "express";
import { logOutUser, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//the field inside middleware and in frontend should be same
router.route("/register").post(
  upload.fields([
    {
     name : "avatar",
     maxCount : 1
    },
    {
      name : "coverImage",
      maxCount : 1
    }
  ]),
  registerUser)

router.route("/login").post(loginUser)

//secured route
//for these endpoints user must me logged in
router.route("/logout").post( verifyJWT , logOutUser )
router.route("/refresh-token").post( refreshAccessToken )
export default router;