import { Router } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { productBodyValidators, productIdValidator, productListValidators } from "../validators/productValidators.js";

const router = Router();

router.post("/", authenticate, productBodyValidators, validateRequest, createProduct);
router.get("/", productListValidators, validateRequest, listProducts);
router.get("/:id", productIdValidator, validateRequest, getProduct);
router.put("/:id", authenticate, productIdValidator, productBodyValidators, validateRequest, updateProduct);
router.delete("/:id", authenticate, productIdValidator, validateRequest, deleteProduct);

export default router;
