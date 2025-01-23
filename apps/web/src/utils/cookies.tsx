// utils/cookies.ts
import Cookies from "js-cookie";

export const setLoginCookie = (token: string) => {
  Cookies.set("token", token, { expires: 7 }); // Set cookie with token, expires in 7 days
};

export const removeLoginCookie = () => {
  Cookies.remove("token"); // Remove token cookie
};

export const getLoginCookie = () => {
  return Cookies.get("token"); // Get the token from the cookie
};