import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  getSingleCategoryContorller,
  updateCategoryController,
} from "../controllers/categoryController.js";

//router object
const router = express.Router();

//routing
//Create-category || POST Method
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update-category || POST Method
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//delete -category || post method
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController);

// get all category || GET Method
router.get("/get-category", getCategoryController);

//get single category || GET Method
router.get("/single-category/:slug", getSingleCategoryContorller);

export default router;
