const sevenDays = 7 * 24 * 60 * 60 * 1000;

export function refreshCookieName() {
  return process.env.COOKIE_NAME || "stockpilot_refresh";
}

export function refreshCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    maxAge: sevenDays,
    path: "/api/auth",
  };
}

export function setRefreshCookie(res, token) {
  res.cookie(refreshCookieName(), token, refreshCookieOptions());
}

export function clearRefreshCookie(res) {
  const options = refreshCookieOptions();
  delete options.maxAge;
  res.clearCookie(refreshCookieName(), options);
}
