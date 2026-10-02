import { body } from "express-validator";

export const registerValidators = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be between 2 and 60 characters."),
  body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
    .matches(/[a-z]/).withMessage("Password must contain a lowercase letter.")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter.")
    .matches(/\d/).withMessage("Password must contain a number."),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match.");
    return true;
  }),
];

export const loginValidators = [
  body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required."),
];
