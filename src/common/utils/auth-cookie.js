import { env } from "../../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const setAccessToken = (res, accessToken) => {
  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", cookieOptions);

  res.clearCookie("refresh_token", cookieOptions);
};

export const authCookie = {
  setAuthCookies,
  clearAuthCookies,
  setAccessToken,
};
