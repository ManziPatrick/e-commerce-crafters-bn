import express from "express";
import {
  deleteProduct,
  updateProduct,
  readProduct,
  searchProduct,
  createProduct,
  readAllProducts,
  viewProducts,
} from "../controllers/product.controller";
import { VerifyAccessToken } from "../middleware/verfiyToken";
const router = express.Router();

router.post("/create/product/:id", VerifyAccessToken, createProduct);
router.get("/readAllProducts", readAllProducts);
router.get("/vendorProducts/:id", VerifyAccessToken, viewProducts);
router.get("/readProduct/:id", readProduct);
router.get("/products/search", searchProduct);
router.get("/products/vendor/:id", VerifyAccessToken, viewProducts);
router.put("/updateProduct/:id", VerifyAccessToken, updateProduct);
router.delete("/deleteProduct/:id", VerifyAccessToken, deleteProduct);

export default router;