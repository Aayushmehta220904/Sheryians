import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearRefreshCookie, refreshCookieName, setRefreshCookie } from "../utils/cookies.js";
import { createAccessToken, createRefreshToken, hashToken, verifyRefreshToken } from "../utils/tokens.js";
import { ensureStarterCatalog } from "../utils/starterCatalog.js";

const MAX_SESSIONS = 5;

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "An account with this email already exists.", errors: [{ field: "email", message: "Email is already registered." }] });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  return res.status(201).json({ message: "Account created. Please login to continue.", user: user.toPublicJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash +refreshTokenHashes");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const accessToken = createAccessToken(user._id.toString());
  const refreshToken = createRefreshToken(user._id.toString());
  user.refreshTokenHashes = [...user.refreshTokenHashes.slice(-(MAX_SESSIONS - 1)), hashToken(refreshToken)];
  await user.save();
  setRefreshCookie(res, refreshToken);
  await ensureStarterCatalog(user._id);
  return res.json({ message: "Login successful.", accessToken, user: user.toPublicJSON() });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies[refreshCookieName()];
  if (!rawToken) return res.status(401).json({ message: "Refresh token is missing. Please login again." });

  let payload;
  try { payload = verifyRefreshToken(rawToken); }
  catch { clearRefreshCookie(res); return res.status(401).json({ message: "Refresh token is invalid or expired. Please login again." }); }

  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({ _id: payload.sub, refreshTokenHashes: tokenHash }).select("+refreshTokenHashes");
  if (!user) {
    clearRefreshCookie(res);
    return res.status(403).json({ message: "Refresh token was revoked or reused. Please login again." });
  }

  const rotatedRefreshToken = createRefreshToken(user._id.toString());
  user.refreshTokenHashes = user.refreshTokenHashes.filter((hash) => hash !== tokenHash);
  user.refreshTokenHashes.push(hashToken(rotatedRefreshToken));
  user.refreshTokenHashes = user.refreshTokenHashes.slice(-MAX_SESSIONS);
  await user.save();
  setRefreshCookie(res, rotatedRefreshToken);
  await ensureStarterCatalog(user._id);

  return res.json({ accessToken: createAccessToken(user._id.toString()), user: user.toPublicJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies[refreshCookieName()];
  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    const user = await User.findById(req.user._id).select("+refreshTokenHashes");
    if (user) {
      user.refreshTokenHashes = user.refreshTokenHashes.filter((hash) => hash !== tokenHash);
      await user.save();
    }
  }
  clearRefreshCookie(res);
  return res.json({ message: "Logged out successfully." });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ user: req.user.toPublicJSON() });
});
