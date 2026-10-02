import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authorization.slice(7).trim();
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Authentication required." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Access token is invalid or expired." });
  }
});
