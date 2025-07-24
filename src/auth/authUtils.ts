import Cookies from "js-cookie";

const TOKEN_KEY = "peerhub_token";


/**
 * Set token in cookies
 */
export const setToken = (token: string) => {
    Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: "Strict" });
};


/**
 * Get token from cookies
 */
export const getToken = () => {
    return Cookies.get(TOKEN_KEY);
};


/**
 * Remove token from cookies
 */
export const clearToken = () => {
    Cookies.remove(TOKEN_KEY);
};
