import express from "express";
import {
  registerController,
  loginController,
  testController,
  protectedController,
  forgetPasswordController,
  updateProfileController,
} from "../controllers/authController.js";
import {
  isUser,
  isAdmin,
  requireSignIn,
} from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//Register || Post method
router.post("/register", registerController);

//LOGIN || Post
router.post("/login", loginController);

//TEST routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth| GET
router.get("/user-auth", requireSignIn, isUser, protectedController);

//protected route admin | GET
router.get("/admin-auth", requireSignIn, isAdmin, protectedController);

//forget-password
router.post("/forget-password", forgetPasswordController);
export default router;

//update-profile
router.put('/profile-update',requireSignIn,updateProfileController);