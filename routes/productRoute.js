import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
  categoryProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getProductPhotoController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  searchProductController,
  similarProductsController,
  updateProductController,
} from "../controllers/productController.js";
import ExpressFormidable from "express-formidable";

const router = express.Router();
//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

// get all product
router.get("/get-product", getProductController);

//get single product
router.get("/get-product/:slug", getSingleProductController);

//get photo of products
router.get("/product-photo/:pid", getProductPhotoController);

//delete product
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  deleteProductController
);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  updateProductController
);

//filter product
router.post("/filter-products", productFiltersController);

//get-product
router.get("/product-count", productCountController);

//product-per page
router.get("/product-list/:page", productListController);

//product search
router.get("/search-product/:keyword", searchProductController);

//similar product
router.get('/similar-products/:pid/:cid',similarProductsController);

//category wise product
router.get('/category-product/:slug',categoryProductController);

export default router;
