import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import {
  addProduct,
  // updateProductDetails,
  // removeProduct,
  // fetchProducts,
  // fetchProductById,
  // fetchAllProducts,
  // addProductReview,
  // fetchTopProducts,
  // fetchNewProducts,
  // filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
//   .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

export default router;