import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me, refresh, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidators, registerValidators } from "../validators/authValidators.js";

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false, message: { message: "Too many login attempts. Please try again later." } });

router.post("/register", registerValidators, validateRequest, register);
router.post("/login", loginLimiter, loginValidators, validateRequest, login);
router.post("/refresh-token", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
