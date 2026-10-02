import crypto from "crypto";
import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
  return jwt.sign({ sub: userId, type: "access" }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
}

export function createRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: "refresh", jti: crypto.randomUUID() }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (payload.type !== "access") throw new Error("Invalid access token type");
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  if (payload.type !== "refresh") throw new Error("Invalid refresh token type");
  return payload;
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
