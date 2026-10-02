import { body, param, query } from "express-validator";

export const productBodyValidators = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters."),
  body("description").trim().isLength({ min: 10, max: 1000 }).withMessage("Description must be between 10 and 1000 characters."),
  body("category").trim().isLength({ min: 2, max: 50 }).withMessage("Category must be between 2 and 50 characters."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0.").toFloat(),
  body("stock").isInt({ min: 0, max: 1000000 }).withMessage("Stock must be a whole number greater than or equal to 0.").toInt(),
  body("imageUrl").optional({ checkFalsy: true }).isURL({ protocols: ["http", "https"], require_protocol: true }).withMessage("Image URL must be a valid http/https URL."),
];

export const productIdValidator = [param("id").isMongoId().withMessage("Product id must be a valid MongoDB ObjectId.")];

export const productListValidators = [
  query("search").optional().trim().isLength({ max: 100 }).withMessage("Search text is too long."),
  query("category").optional().trim().isLength({ max: 50 }).withMessage("Category is too long."),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1.").toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50.").toInt(),
];
