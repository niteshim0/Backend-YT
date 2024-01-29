import { Router } from "express";
import { logOutUser, loginUser, registerUser } from "../controllers/user.controller.js";
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

router.route("/logout").post( verifyJWT , logOutUser )
export default router;